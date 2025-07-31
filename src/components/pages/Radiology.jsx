import React, { useEffect, useState } from "react";
import radiologyService from "@/services/api/radiologyService";
import { toast } from "react-toastify";
import patientService from "@/services/api/patientService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Radiology = () => {
  const [activeTab, setActiveTab] = useState("queue");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [patients, setPatients] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [preparationProtocols, setPreparationProtocols] = useState([]);
  const [workflowItems, setWorkflowItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formStep, setFormStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [showPrepModal, setShowPrepModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    patientId: "",
    examType: "",
    clinicalIndication: "",
    icd10Code: "",
    contrastRequired: false,
    contrastAgent: "",
    specialInstructions: "",
    patientPreparation: "",
    priority: "routine",
    scheduledDate: "",
    scheduledTime: "",
    equipmentId: "",
    orderingPhysician: "Dr. Sarah Johnson"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, patientsData, equipmentData, protocolsData, workflowData] = await Promise.all([
        radiologyService.getAll(),
        patientService.getAll(),
        radiologyService.getEquipment(),
        radiologyService.getPreparationProtocols(),
        radiologyService.getWorkflowItems()
      ]);
      setOrders(ordersData);
      setPatients(patientsData);
      setEquipment(equipmentData);
      setPreparationProtocols(protocolsData);
      setWorkflowItems(workflowData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const examTypes = radiologyService.getExamTypes();
  const contrastAgents = radiologyService.getContrastAgents();

  const filteredExamTypes = examTypes.filter(exam =>
    exam.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-fill patient preparation based on exam type
    if (field === "examType") {
      const preparation = radiologyService.getPatientPreparation(value);
      setFormData(prev => ({
        ...prev,
        patientPreparation: preparation
      }));
    }

    // Clear errors
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientId) newErrors.patientId = "Patient is required";
    if (!formData.examType) newErrors.examType = "Exam type is required";
    if (!formData.clinicalIndication) newErrors.clinicalIndication = "Clinical indication is required";
    if (!formData.scheduledDate) newErrors.scheduledDate = "Scheduled date is required";
    if (!formData.scheduledTime) newErrors.scheduledTime = "Scheduled time is required";

    if (formData.contrastRequired && !formData.contrastAgent) {
      newErrors.contrastAgent = "Contrast agent is required when contrast is needed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await radiologyService.create(formData);
      toast.success("Radiology order submitted successfully");
      setShowOrderForm(false);
      setFormData({
        patientId: "",
        examType: "",
        clinicalIndication: "",
        icd10Code: "",
        contrastRequired: false,
        contrastAgent: "",
        specialInstructions: "",
        patientPreparation: "",
        priority: "routine",
        scheduledDate: "",
        scheduledTime: "",
        orderingPhysician: "Dr. Sarah Johnson"
      });
      setFormStep(1);
      loadData();
    } catch (error) {
      toast.error("Failed to submit radiology order");
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.pending}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityStyles = {
      routine: "bg-gray-100 text-gray-800",
      urgent: "bg-orange-100 text-orange-800",
      stat: "bg-red-100 text-red-800"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[priority] || priorityStyles.routine}`}>
        {priority?.charAt(0).toUpperCase() + priority?.slice(1) || 'Routine'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

const updateWorkflowStatus = async (orderId, status) => {
    try {
      await radiologyService.updateStatus(orderId, status);
      toast.success(`Status updated to ${status}`);
      loadData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const completePreparation = async (orderId, completedItems) => {
    try {
      await radiologyService.updatePreparation(orderId, completedItems);
      toast.success("Preparation checklist updated");
      setShowPrepModal(false);
      loadData();
    } catch (error) {
      toast.error("Failed to update preparation");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PACS Imaging Management</h1>
          <p className="text-gray-600 mt-1">Comprehensive radiology workflow and equipment management</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowOrderForm(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "queue", label: "Order Queue", icon: "List", count: orders.filter(o => o.status === "pending").length },
            { id: "scheduling", label: "Modality Scheduling", icon: "Calendar", count: equipment.length },
            { id: "workflow", label: "Technologist Workflow", icon: "Activity", count: workflowItems.length },
            { id: "orders", label: "All Orders", icon: "FileText", count: orders.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                activeTab === tab.id ? "bg-primary-100 text-primary-800" : "bg-gray-100 text-gray-800"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">New Radiology Order</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowOrderForm(false);
                    setFormStep(1);
                  }}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              
              {/* Progress Steps */}
              <div className="mt-4 flex items-center space-x-4">
                {[
                  { step: 1, label: "Exam Details", icon: "Stethoscope" },
                  { step: 2, label: "Contrast & Instructions", icon: "FileText" },
                  { step: 3, label: "Scheduling", icon: "Calendar" }
                ].map(({ step, label, icon }) => (
                  <div key={step} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      formStep >= step ? "bg-primary-500 text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                      <ApperIcon name={icon} size={16} />
                    </div>
                    <span className={`ml-2 text-sm ${formStep >= step ? "text-primary-600 font-medium" : "text-gray-500"}`}>
                      {label}
                    </span>
                    {step < 3 && <ApperIcon name="ChevronRight" size={16} className="ml-4 text-gray-400" />}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Step 1: Exam Details */}
              {formStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Patient"
                      type="select"
                      required
                      value={formData.patientId}
                      onChange={(e) => handleInputChange("patientId", e.target.value)}
                      error={errors.patientId}
                      options={[
                        { value: "", label: "Select Patient" },
                        ...patients.map(p => ({
                          value: p.Id,
                          label: `${p.firstName} ${p.lastName} (${p.patientId || `ID: ${p.Id}`})`
                        }))
                      ]}
                    />

                    <FormField
                      label="Priority"
                      type="select"
                      value={formData.priority}
                      onChange={(e) => handleInputChange("priority", e.target.value)}
                      options={[
                        { value: "routine", label: "Routine" },
                        { value: "urgent", label: "Urgent" },
                        { value: "stat", label: "STAT" }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exam Type <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Search exam types..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-3"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                      {filteredExamTypes.map((exam) => (
                        <div
                          key={exam.value}
                          onClick={() => {
                            handleInputChange("examType", exam.value);
                            setSearchTerm("");
                          }}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.examType === exam.value
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-200 hover:border-primary-300"
                          }`}
                        >
                          <div className="font-medium text-sm">{exam.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{exam.preparation}</div>
                        </div>
                      ))}
                    </div>
                    {errors.examType && <p className="text-red-500 text-sm mt-1">{errors.examType}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Clinical Indication"
                      required
                      value={formData.clinicalIndication}
                      onChange={(e) => handleInputChange("clinicalIndication", e.target.value)}
                      error={errors.clinicalIndication}
                      placeholder="Reason for exam"
                    />

                    <FormField
                      label="ICD-10 Code"
                      value={formData.icd10Code}
                      onChange={(e) => handleInputChange("icd10Code", e.target.value)}
                      placeholder="Optional diagnosis code"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Contrast & Instructions */}
              {formStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="contrastRequired"
                      checked={formData.contrastRequired}
                      onChange={(e) => handleInputChange("contrastRequired", e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="contrastRequired" className="text-sm font-medium text-gray-700">
                      Contrast Required
                    </label>
                  </div>

                  {formData.contrastRequired && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Contrast Agent <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contrastAgents.filter(agent => agent.value !== "none").map((agent) => (
                          <div
                            key={agent.value}
                            onClick={() => handleInputChange("contrastAgent", agent.value)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              formData.contrastAgent === agent.value
                                ? "border-primary-500 bg-primary-50"
                                : "border-gray-200 hover:border-primary-300"
                            }`}
                          >
                            <div className="font-medium text-sm">{agent.label}</div>
                            {agent.contraindications.length > 0 && (
                              <div className="text-xs text-red-600 mt-2">
                                <strong>Contraindications:</strong> {agent.contraindications.join(", ")}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {errors.contrastAgent && <p className="text-red-500 text-sm mt-1">{errors.contrastAgent}</p>}
                    </div>
                  )}

                  <FormField
                    label="Special Instructions"
                    type="textarea"
                    value={formData.specialInstructions}
                    onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                    placeholder="Any special considerations or instructions"
                    rows={3}
                  />

                  <FormField
                    label="Patient Preparation"
                    type="textarea"
                    value={formData.patientPreparation}
                    onChange={(e) => handleInputChange("patientPreparation", e.target.value)}
                    placeholder="Patient preparation instructions"
                    rows={3}
                  />
                </div>
              )}

              {/* Step 3: Scheduling */}
              {formStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Scheduled Date"
                      type="date"
                      required
                      value={formData.scheduledDate}
                      onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                      error={errors.scheduledDate}
                      min={new Date().toISOString().split('T')[0]}
                    />

                    <FormField
                      label="Scheduled Time"
                      type="time"
                      required
                      value={formData.scheduledTime}
                      onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                      error={errors.scheduledTime}
                    />
                  </div>

                  <FormField
                    label="Ordering Physician"
                    value={formData.orderingPhysician}
                    onChange={(e) => handleInputChange("orderingPhysician", e.target.value)}
                    disabled
                  />

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Patient:</span> {
                          patients.find(p => p.Id === parseInt(formData.patientId))?.firstName || ""
                        } {patients.find(p => p.Id === parseInt(formData.patientId))?.lastName || ""}
                      </div>
                      <div>
                        <span className="text-gray-600">Exam:</span> {formData.examType}
                      </div>
                      <div>
                        <span className="text-gray-600">Priority:</span> {formData.priority}
                      </div>
                      <div>
                        <span className="text-gray-600">Contrast:</span> {formData.contrastRequired ? "Yes" : "No"}
                      </div>
                      <div>
                        <span className="text-gray-600">Date:</span> {formData.scheduledDate}
                      </div>
                      <div>
                        <span className="text-gray-600">Time:</span> {formData.scheduledTime}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <div>
                  {formStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormStep(formStep - 1)}
                    >
                      <ApperIcon name="ChevronLeft" size={16} className="mr-2" />
                      Previous
                    </Button>
                  )}
                </div>
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowOrderForm(false);
                      setFormStep(1);
                    }}
                  >
                    Cancel
                  </Button>
                  {formStep < 3 ? (
                    <Button
                      type="button"
                      onClick={() => setFormStep(formStep + 1)}
                      className="bg-primary-500 hover:bg-primary-600 text-white"
                    >
                      Next
                      <ApperIcon name="ChevronRight" size={16} className="ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primary-500 hover:bg-primary-600 text-white"
                    >
                      <ApperIcon name="Check" size={16} className="mr-2" />
                      Submit Order
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

{/* Order Queue Tab */}
      {activeTab === "queue" && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Radiology Order Queue</h2>
              <div className="text-sm text-gray-500">
                {orders.filter(o => o.status === "pending").length} pending examination{orders.filter(o => o.status === "pending").length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="space-y-4">
              {orders.filter(o => o.status === "pending").map((order) => {
                const patient = patients.find(p => p.Id === order.patientId);
                const protocol = preparationProtocols.find(p => p.examType === order.examType);
                return (
                  <div key={order.Id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {patient?.firstName} {patient?.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">ID: {patient?.patientId || patient?.Id}</p>
                      </div>
                      <div className="text-right">
                        {getPriorityBadge(order.priority)}
                        <p className="text-sm text-gray-500 mt-1">{order.scheduledDate} at {order.scheduledTime}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Examination</p>
                        <p className="text-sm text-gray-900">{order.examType}</p>
                        <p className="text-sm text-gray-500">{order.clinicalIndication}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Contrast</p>
                        <p className="text-sm text-gray-900">
                          {order.contrastRequired ? `Yes - ${order.contrastAgent}` : "No contrast required"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Equipment</p>
                        <p className="text-sm text-gray-900">
                          {equipment.find(e => e.Id === order.equipmentId)?.name || "Not assigned"}
                        </p>
                      </div>
                    </div>

                    {protocol && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Patient Preparation Requirements</h4>
                        <div className="space-y-1">
                          {protocol.requirements.map((req, index) => (
                            <div key={index} className="flex items-center text-sm text-blue-800">
                              <ApperIcon name="CheckCircle2" size={14} className="mr-2 text-blue-600" />
                              {req}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowPrepModal(true);
                          }}
                        >
                          <ApperIcon name="ClipboardCheck" size={14} className="mr-1" />
                          Prep Checklist
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateWorkflowStatus(order.Id, "in-progress")}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <ApperIcon name="Play" size={14} className="mr-1" />
                          Start Exam
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Ordered by {order.orderingPhysician}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Modality Scheduling Tab */}
      {activeTab === "scheduling" && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Modality Scheduling</h2>
              <div className="flex items-center space-x-3">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
                <FormField
                  type="select"
                  value={selectedEquipment}
                  onChange={(e) => setSelectedEquipment(e.target.value)}
                  options={[
                    { value: "", label: "All Equipment" },
                    ...equipment.map(e => ({ value: e.Id, label: e.name }))
                  ]}
                  className="w-auto"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {equipment
                .filter(e => !selectedEquipment || e.Id === parseInt(selectedEquipment))
                .map((equip) => {
                  const todaySchedule = orders.filter(o => 
                    o.scheduledDate === selectedDate && 
                    o.equipmentId === equip.Id
                  );
                  
                  return (
                    <div key={equip.Id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">{equip.name}</h3>
                          <p className="text-sm text-gray-500">{equip.location}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          equip.status === "available" ? "bg-green-100 text-green-800" : 
                          equip.status === "maintenance" ? "bg-red-100 text-red-800" : 
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {equip.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="text-sm">
                          <span className="text-gray-600">Capacity:</span>
                          <span className="ml-2 font-medium">{todaySchedule.length}/{equip.dailyCapacity} exams</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${(todaySchedule.length / equip.dailyCapacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Today's Schedule</h4>
                        {todaySchedule.length === 0 ? (
                          <p className="text-sm text-gray-500">No examinations scheduled</p>
                        ) : (
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {todaySchedule.map((order) => {
                              const patient = patients.find(p => p.Id === order.patientId);
                              return (
                                <div key={order.Id} className="text-xs bg-gray-50 rounded p-2">
                                  <div className="flex justify-between">
                                    <span>{order.scheduledTime}</span>
                                    <span className="font-medium">{order.examType}</span>
                                  </div>
                                  <div className="text-gray-600">
                                    {patient?.firstName} {patient?.lastName}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </Card>
      )}

      {/* Technologist Workflow Tab */}
      {activeTab === "workflow" && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Technologist Workflow</h2>
              <div className="text-sm text-gray-500">
                {workflowItems.length} active examination{workflowItems.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {workflowItems.map((item) => {
                const patient = patients.find(p => p.Id === item.patientId);
                const order = orders.find(o => o.Id === item.orderId);
                return (
                  <div key={item.Id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {patient?.firstName} {patient?.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{order?.examType}</p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Started:</span>
                        <span>{item.startTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Est. Duration:</span>
                        <span>{item.estimatedDuration} min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress:</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {item.status === "in-progress" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateWorkflowStatus(item.orderId, "paused")}
                          >
                            <ApperIcon name="Pause" size={14} className="mr-1" />
                            Pause
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateWorkflowStatus(item.orderId, "completed")}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <ApperIcon name="Check" size={14} className="mr-1" />
                            Complete
                          </Button>
                        </div>
                      )}
                      
                      {item.status === "paused" && (
                        <Button
                          size="sm"
                          onClick={() => updateWorkflowStatus(item.orderId, "in-progress")}
                          className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                        >
                          <ApperIcon name="Play" size={14} className="mr-1" />
                          Resume
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* All Orders Tab */}
      {activeTab === "orders" && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">All Orders</h2>
              <div className="text-sm text-gray-500">
                {orders.length} order{orders.length !== 1 ? 's' : ''}
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="ScanLine" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No radiology orders found</p>
                <Button
                  onClick={() => setShowOrderForm(true)}
                  className="mt-4 bg-primary-500 hover:bg-primary-600 text-white"
                >
                  Create First Order
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exam Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scheduled
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Equipment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => {
                      const patient = patients.find(p => p.Id === order.patientId);
                      const equip = equipment.find(e => e.Id === order.equipmentId);
                      return (
                        <tr key={order.Id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {patient?.firstName} {patient?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {patient?.patientId || patient?.Id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.examType}</div>
                            <div className="text-sm text-gray-500">{order.clinicalIndication}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.scheduledDate}</div>
                            <div className="text-sm text-gray-500">{order.scheduledTime}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getPriorityBadge(order.priority)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {equip?.name || "Not assigned"}
                            </div>
                            {equip && (
                              <div className="text-sm text-gray-500">{equip.location}</div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Patient Preparation Modal */}
      {showPrepModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Patient Preparation Checklist</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPrepModal(false)}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              <p className="text-gray-600 mt-1">
                {patients.find(p => p.Id === selectedOrder.patientId)?.firstName} {patients.find(p => p.Id === selectedOrder.patientId)?.lastName} - {selectedOrder.examType}
              </p>
            </div>

            <div className="p-6">
              {preparationProtocols.find(p => p.examType === selectedOrder.examType) ? (
                <div className="space-y-4">
                  {preparationProtocols.find(p => p.examType === selectedOrder.examType).requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        id={`prep-${index}`}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`prep-${index}`} className="text-sm text-gray-900 flex-1">
                        {req}
                      </label>
                    </div>
                  ))}
                  
                  {selectedOrder.contrastRequired && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-900 mb-2">Contrast Administration Protocol</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="contrast-consent"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label className="text-sm text-yellow-800">Patient consent obtained</label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="contrast-allergy"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label className="text-sm text-yellow-800">Allergy history verified</label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="contrast-kidney"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label className="text-sm text-yellow-800">Kidney function assessed</label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No specific preparation requirements</p>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowPrepModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => completePreparation(selectedOrder.Id, [])}
                  className="bg-primary-500 hover:bg-primary-600 text-white"
                >
                  Complete Preparation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Radiology;