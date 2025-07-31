import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import radiologyService from "@/services/api/radiologyService";
import patientService from "@/services/api/patientService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Badge from "@/components/atoms/Badge";
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
// DICOM Viewer state
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [windowLevel, setWindowLevel] = useState({ window: 400, level: 40 });
  const [measurements, setMeasurements] = useState([]);
  const [activeTool, setActiveTool] = useState('pan');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentMeasurement, setCurrentMeasurement] = useState(null);

  // Comparison Mode State
  const [comparisonMode, setComparisonMode] = useState(false);
  const [priorStudy, setPriorStudy] = useState(null);
  const [currentStudyImage, setCurrentStudyImage] = useState(0);
  const [priorStudyImage, setPriorStudyImage] = useState(0);
  const [availableStudies, setAvailableStudies] = useState([]);
  const [syncViewers, setSyncViewers] = useState(true);
  const [priorCanvasRef] = useState(useRef(null));
  const [priorZoomLevel, setPriorZoomLevel] = useState(1);
  const [priorPanOffset, setPriorPanOffset] = useState({ x: 0, y: 0 });
  const [priorWindowLevel, setPriorWindowLevel] = useState({ window: 400, level: 40 });
  const [showStudySelector, setShowStudySelector] = useState(false);

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

  // DICOM Viewer Functions - All hooks must be called before any early returns
const openViewer = useCallback(async (orderId) => {
    try {
      const study = await radiologyService.getDicomStudy(orderId);
      setSelectedStudy(study);
      setCurrentImage(0);
      setCurrentStudyImage(0);
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
      setWindowLevel({ window: 400, level: 40 });
      setMeasurements([]);
      setActiveTool('pan');
      setComparisonMode(false);
      setPriorStudy(null);
      setViewerOpen(true);
      
      // Load available studies for comparison
      const patientStudies = await radiologyService.getStudiesByPatient(study.patientId);
      setAvailableStudies(patientStudies.filter(s => s.Id !== study.Id));
      
      // Load first image
      setTimeout(() => {
        if (study.images && study.images.length > 0) {
          loadDicomImage(study.images[0]);
        }
      }, 100);
    } catch (error) {
      toast.error('Failed to load DICOM study');
    }
  }, []);

  const startComparison = useCallback(async (priorStudyId) => {
    try {
      const prior = await radiologyService.getDicomStudy(priorStudyId);
      setPriorStudy(prior);
      setPriorStudyImage(0);
      setPriorZoomLevel(1);
      setPriorPanOffset({ x: 0, y: 0 });
      setPriorWindowLevel({ window: 400, level: 40 });
      setComparisonMode(true);
      setShowStudySelector(false);
      
      // Load first image of prior study
      setTimeout(() => {
        if (prior.images && prior.images.length > 0) {
          loadDicomImage(prior.images[0], true);
        }
      }, 100);
      
      toast.success('Comparison mode activated');
    } catch (error) {
      toast.error('Failed to load prior study');
    }
  }, []);

  const exitComparison = useCallback(() => {
    setComparisonMode(false);
    setPriorStudy(null);
    setPriorStudyImage(0);
    setPriorZoomLevel(1);
    setPriorPanOffset({ x: 0, y: 0 });
    setPriorWindowLevel({ window: 400, level: 40 });
    toast.success('Comparison mode deactivated');
  }, []);

const loadDicomImage = useCallback((imageData, isPrior = false) => {
    const canvas = isPrior ? priorCanvasRef.current : canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    const zoom = isPrior ? priorZoomLevel : zoomLevel;
    const pan = isPrior ? priorPanOffset : panOffset;
    const winLevel = isPrior ? priorWindowLevel : windowLevel;
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply window/level adjustments
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Apply zoom and pan
      ctx.scale(zoom, zoom);
      ctx.translate(pan.x / zoom, pan.y / zoom);
      
      // Apply window/level filter
      ctx.filter = `contrast(${winLevel.window / 200}%) brightness(${winLevel.level + 50}%)`;
      ctx.drawImage(img, 0, 0);
      
      ctx.restore();
      
      // Draw measurements (only on current study)
      if (!isPrior) {
        drawMeasurements(ctx);
      }
    };
    
    img.src = imageData.url;
  }, [zoomLevel, panOffset, windowLevel, measurements, priorZoomLevel, priorPanOffset, priorWindowLevel]);

  const drawMeasurements = useCallback((ctx) => {
    ctx.save();
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.font = '14px Arial';
    ctx.fillStyle = '#00ff00';

    measurements.forEach((measurement) => {
      if (measurement.type === 'distance') {
        ctx.beginPath();
        ctx.moveTo(measurement.start.x, measurement.start.y);
        ctx.lineTo(measurement.end.x, measurement.end.y);
        ctx.stroke();
        
        // Draw measurement text
        const distance = Math.sqrt(
          Math.pow(measurement.end.x - measurement.start.x, 2) + 
          Math.pow(measurement.end.y - measurement.start.y, 2)
        ) * 0.1; // Convert pixels to mm (approximate)
        
        ctx.fillText(
          `${distance.toFixed(1)} mm`,
          (measurement.start.x + measurement.end.x) / 2,
          (measurement.start.y + measurement.end.y) / 2 - 10
        );
      } else if (measurement.type === 'angle') {
        // Draw angle measurement
        const { center, point1, point2 } = measurement;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(point1.x, point1.y);
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.stroke();
        
        // Calculate angle
        const angle1 = Math.atan2(point1.y - center.y, point1.x - center.x);
        const angle2 = Math.atan2(point2.y - center.y, point2.x - center.x);
        const angle = Math.abs(angle1 - angle2) * (180 / Math.PI);
        
        ctx.fillText(`${angle.toFixed(1)}°`, center.x + 10, center.y - 10);
      }
    });
    
    ctx.restore();
  }, [measurements]);

const handleCanvasMouseDown = useCallback((e, isPrior = false) => {
    const canvas = isPrior ? priorCanvasRef.current : canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const currentPanOffset = isPrior ? priorPanOffset : panOffset;

    if (activeTool === 'pan') {
      setIsDragging(true);
      setDragStart({ x: x - currentPanOffset.x, y: y - currentPanOffset.y, isPrior });
    } else if (activeTool === 'distance' && !isPrior) {
      setIsDrawing(true);
      setCurrentMeasurement({ type: 'distance', start: { x, y }, end: { x, y } });
    }
  }, [activeTool, panOffset, priorPanOffset]);

const handleCanvasMouseMove = useCallback((e, isPrior = false) => {
    const canvas = isPrior ? priorCanvasRef.current : canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging && activeTool === 'pan') {
      const newOffset = { x: x - dragStart.x, y: y - dragStart.y };
      
      if (dragStart.isPrior) {
        setPriorPanOffset(newOffset);
        if (syncViewers) setPanOffset(newOffset);
      } else {
        setPanOffset(newOffset);
        if (syncViewers) setPriorPanOffset(newOffset);
      }
    } else if (isDrawing && activeTool === 'distance' && currentMeasurement && !isPrior) {
      setCurrentMeasurement({ ...currentMeasurement, end: { x, y } });
    }
  }, [isDragging, isDrawing, activeTool, dragStart, currentMeasurement, syncViewers]);

  const handleCanvasMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
    if (isDrawing && currentMeasurement) {
      setMeasurements(prev => [...prev, currentMeasurement]);
      setCurrentMeasurement(null);
      setIsDrawing(false);
    }
  }, [isDragging, isDrawing, currentMeasurement]);

const handleZoom = useCallback((delta, clientX, clientY, isPrior = false) => {
    const canvas = isPrior ? priorCanvasRef.current : canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    
    const currentZoom = isPrior ? priorZoomLevel : zoomLevel;
    const currentPan = isPrior ? priorPanOffset : panOffset;
    
    const newZoom = Math.max(0.1, Math.min(5, currentZoom + delta));
    const zoomRatio = newZoom / currentZoom;

    const newPanOffset = {
      x: mouseX - (mouseX - currentPan.x) * zoomRatio,
      y: mouseY - (mouseY - currentPan.y) * zoomRatio
    };

    if (isPrior) {
      setPriorZoomLevel(newZoom);
      setPriorPanOffset(newPanOffset);
      if (syncViewers) {
        setZoomLevel(newZoom);
        setPanOffset(newPanOffset);
      }
    } else {
      setZoomLevel(newZoom);
      setPanOffset(newPanOffset);
      if (syncViewers) {
        setPriorZoomLevel(newZoom);
        setPriorPanOffset(newPanOffset);
      }
    }
  }, [zoomLevel, priorZoomLevel, panOffset, priorPanOffset, syncViewers]);

const handleWheel = useCallback((e, isPrior = false) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    handleZoom(delta, e.clientX, e.clientY, isPrior);
  }, [handleZoom]);

const resetView = useCallback((isPrior = false) => {
    if (isPrior) {
      setPriorZoomLevel(1);
      setPriorPanOffset({ x: 0, y: 0 });
      setPriorWindowLevel({ window: 400, level: 40 });
    } else {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
      setWindowLevel({ window: 400, level: 40 });
    }
    
    if (syncViewers && comparisonMode) {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
      setWindowLevel({ window: 400, level: 40 });
      setPriorZoomLevel(1);
      setPriorPanOffset({ x: 0, y: 0 });
      setPriorWindowLevel({ window: 400, level: 40 });
    }
  }, [syncViewers, comparisonMode]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const exportMeasurements = useCallback(() => {
    const data = {
      studyId: selectedStudy?.Id,
      patientId: selectedStudy?.patientId,
      measurements: measurements,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `measurements_${selectedStudy?.Id}_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Measurements exported successfully');
  }, [selectedStudy, measurements]);

  // Update canvas when image changes
useEffect(() => {
    if (selectedStudy && selectedStudy.images && selectedStudy.images[currentStudyImage]) {
      loadDicomImage(selectedStudy.images[currentStudyImage]);
    }
  }, [selectedStudy, currentStudyImage, loadDicomImage]);

  useEffect(() => {
    if (priorStudy && priorStudy.images && priorStudy.images[priorStudyImage]) {
      loadDicomImage(priorStudy.images[priorStudyImage], true);
    }
  }, [priorStudy, priorStudyImage, loadDicomImage]);

  // Early return for loading state - placed after all hooks
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
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {order.status === 'completed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openViewer(order.Id)}
                                className="mr-2"
                              >
                                <ApperIcon name="Eye" size={16} className="mr-1" />
                                View Images
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateWorkflowStatus(order.Id, 'in-progress')}
                            >
                              <ApperIcon name="Play" size={16} className="mr-1" />
                              Start
                            </Button>
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
      {/* DICOM Viewer Modal */}
      {viewerOpen && selectedStudy && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div ref={containerRef} className="w-full h-full flex flex-col">
            <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold">
                  {selectedStudy.patientName} - {selectedStudy.studyDescription}
                </h3>
                <Badge variant="info">
                  Image {currentImage + 1} of {selectedStudy.images?.length || 0}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-gray-700"
                >
                  <ApperIcon name={isFullscreen ? "Minimize2" : "Maximize2"} size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewerOpen(false)}
                  className="text-white hover:bg-gray-700"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Tool Panel */}
<div className="bg-gray-800 text-white p-4 w-64 space-y-4">
                {/* Comparison Controls */}
                <div>
                  <h4 className="font-medium mb-2">Study Comparison</h4>
                  <div className="space-y-2">
                    {!comparisonMode ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowStudySelector(true)}
                        className="w-full"
                        disabled={availableStudies.length === 0}
                      >
                        <ApperIcon name="Copy" size={16} className="mr-1" />
                        Compare Studies
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={exitComparison}
                          className="w-full"
                        >
                          <ApperIcon name="X" size={16} className="mr-1" />
                          Exit Comparison
                        </Button>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="syncViewers"
                            checked={syncViewers}
                            onChange={(e) => setSyncViewers(e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label htmlFor="syncViewers" className="text-xs">Sync Viewers</label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Tools</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={activeTool === 'pan' ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTool('pan')}
                      className="w-full"
                    >
                      <ApperIcon name="Move" size={16} className="mr-1" />
                      Pan
                    </Button>
                    <Button
                      variant={activeTool === 'zoom' ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTool('zoom')}
                      className="w-full"
                    >
                      <ApperIcon name="ZoomIn" size={16} className="mr-1" />
                      Zoom
                    </Button>
                    <Button
                      variant={activeTool === 'distance' ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTool('distance')}
                      className="w-full"
                    >
                      <ApperIcon name="Ruler" size={16} className="mr-1" />
                      Distance
                    </Button>
                    <Button
                      variant={activeTool === 'angle' ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTool('angle')}
                      className="w-full"
                    >
                      <ApperIcon name="Triangle" size={16} className="mr-1" />
                      Angle
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Window/Level</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm">Window: {windowLevel.window}</label>
                      <input
                        type="range"
                        min="50"
                        max="2000"
                        value={windowLevel.window}
                        onChange={(e) => setWindowLevel(prev => ({ ...prev, window: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Level: {windowLevel.level}</label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={windowLevel.level}
                        onChange={(e) => setWindowLevel(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

<div>
                  <h4 className="font-medium mb-2">Zoom: {(zoomLevel * 100).toFixed(0)}%</h4>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleZoom(-0.2, 0, 0)}
                      className="flex-1"
                    >
                      <ApperIcon name="ZoomOut" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleZoom(0.2, 0, 0)}
                      className="flex-1"
                    >
                      <ApperIcon name="ZoomIn" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => resetView()}
                      className="flex-1"
                    >
                      <ApperIcon name="RotateCcw" size={16} />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Measurements ({measurements.length})</h4>
                  <div className="space-y-2">
                    {measurements.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={exportMeasurements}
                        className="w-full"
                      >
                        <ApperIcon name="Download" size={16} className="mr-1" />
                        Export
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMeasurements([])}
                      className="w-full"
                    >
                      <ApperIcon name="Trash2" size={16} className="mr-1" />
                      Clear All
                    </Button>
                  </div>
                </div>
              </div>

{/* Image Viewer */}
              <div className={`flex-1 bg-black flex ${comparisonMode ? 'flex-col' : 'items-center justify-center'} overflow-hidden`}>
                {comparisonMode ? (
                  <>
                    {/* Current Study */}
                    <div className="flex-1 flex flex-col border-b border-gray-600">
                      <div className="bg-gray-700 text-white text-xs p-2 text-center">
                        Current: {selectedStudy.studyDescription} ({selectedStudy.studyDate})
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <canvas
                          ref={canvasRef}
                          onMouseDown={(e) => handleCanvasMouseDown(e, false)}
                          onMouseMove={(e) => handleCanvasMouseMove(e, false)}
                          onMouseUp={handleCanvasMouseUp}
                          onWheel={(e) => handleWheel(e, false)}
                          className="max-w-full max-h-full cursor-crosshair"
                          style={{
                            cursor: activeTool === 'pan' ? 'grab' : activeTool === 'zoom' ? 'zoom-in' : 'crosshair'
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Prior Study */}
                    <div className="flex-1 flex flex-col">
                      <div className="bg-gray-700 text-white text-xs p-2 text-center">
                        Prior: {priorStudy?.studyDescription} ({priorStudy?.studyDate})
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <canvas
                          ref={priorCanvasRef}
                          onMouseDown={(e) => handleCanvasMouseDown(e, true)}
                          onMouseMove={(e) => handleCanvasMouseMove(e, true)}
                          onMouseUp={handleCanvasMouseUp}
                          onWheel={(e) => handleWheel(e, true)}
                          className="max-w-full max-h-full cursor-crosshair"
                          style={{
                            cursor: activeTool === 'pan' ? 'grab' : activeTool === 'zoom' ? 'zoom-in' : 'crosshair'
                          }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <canvas
                    ref={canvasRef}
                    onMouseDown={(e) => handleCanvasMouseDown(e, false)}
                    onMouseMove={(e) => handleCanvasMouseMove(e, false)}
                    onMouseUp={handleCanvasMouseUp}
                    onWheel={(e) => handleWheel(e, false)}
                    className="max-w-full max-h-full cursor-crosshair"
                    style={{
                      cursor: activeTool === 'pan' ? 'grab' : activeTool === 'zoom' ? 'zoom-in' : 'crosshair'
                    }}
                  />
                )}
              </div>

{/* Image Navigation */}
              {selectedStudy.images && selectedStudy.images.length > 1 && (
                <div className="bg-gray-800 text-white p-4 w-48">
                  <h4 className="font-medium mb-2">Current Study Images</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedStudy.images.map((image, index) => (
                      <div
                        key={index}
                        onClick={() => setCurrentStudyImage(index)}
                        className={`p-2 rounded cursor-pointer transition-colors ${
                          currentStudyImage === index ? 'bg-primary-600' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <div className="text-sm font-medium">Image {index + 1}</div>
                        <div className="text-xs text-gray-300">{image.seriesDescription}</div>
                      </div>
                    ))}
                  </div>
                  
                  {comparisonMode && priorStudy && priorStudy.images && priorStudy.images.length > 1 && (
                    <>
                      <h4 className="font-medium mb-2 mt-4">Prior Study Images</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {priorStudy.images.map((image, index) => (
                          <div
                            key={index}
                            onClick={() => setPriorStudyImage(index)}
                            className={`p-2 rounded cursor-pointer transition-colors ${
                              priorStudyImage === index ? 'bg-orange-600' : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                          >
                            <div className="text-sm font-medium">Prior {index + 1}</div>
                            <div className="text-xs text-gray-300">{image.seriesDescription}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  Study Date: {selectedStudy.studyDate}
                </div>
                <div className="text-sm">
                  Modality: {selectedStudy.modality}
                </div>
              </div>
              
<div className="flex items-center space-x-2">
                {selectedStudy.images && selectedStudy.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStudyImage(Math.max(0, currentStudyImage - 1))}
                      disabled={currentStudyImage === 0}
                      className="text-white hover:bg-gray-700"
                    >
                      <ApperIcon name="ChevronLeft" size={16} />
                    </Button>
                    <span className="text-sm text-gray-300">
                      {currentStudyImage + 1} / {selectedStudy.images.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStudyImage(Math.min(selectedStudy.images.length - 1, currentStudyImage + 1))}
                      disabled={currentStudyImage === selectedStudy.images.length - 1}
                      className="text-white hover:bg-gray-700"
                    >
                      <ApperIcon name="ChevronRight" size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
)}

      {/* Study Selector Modal */}
      {showStudySelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Select Prior Study for Comparison</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStudySelector(false)}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              <p className="text-gray-600 mt-1">
                Current Study: {selectedStudy.studyDescription} ({selectedStudy.studyDate})
              </p>
            </div>

            <div className="p-6">
              {availableStudies.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Calendar" size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No prior studies available for this patient</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableStudies
                    .sort((a, b) => new Date(b.studyDate) - new Date(a.studyDate))
                    .map((study) => (
                      <div
                        key={study.Id}
                        onClick={() => startComparison(study.Id)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{study.studyDescription}</h3>
                            <p className="text-sm text-gray-500">{study.modality} - {study.studyDate}</p>
                            <p className="text-xs text-gray-400">{study.images?.length || 0} images</p>
                          </div>
                          <div className="flex items-center text-primary-600">
                            <ApperIcon name="Eye" size={16} className="mr-1" />
                            <span className="text-sm">Compare</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Radiology;