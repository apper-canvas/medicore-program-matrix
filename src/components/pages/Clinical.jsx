import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Label from "@/components/atoms/Label"
import Badge from "@/components/atoms/Badge"
import FormField from "@/components/molecules/FormField"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import patientService from "@/services/api/patientService"
import medicationService from "@/services/api/medicationService"
import allergyService from "@/services/api/allergyService"
import { cn } from "@/utils/cn"

const Clinical = () => {
  // State management
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patients, setPatients] = useState([])
  const [patientSearch, setPatientSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("prescriptions")
  const [orders, setOrders] = useState([])
  const [showOrderHistory, setShowOrderHistory] = useState(false)

  // Prescription state
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)
  const [drugSearch, setDrugSearch] = useState("")
  const [drugOptions, setDrugOptions] = useState([])
  const [prescriptionForm, setPrescriptionForm] = useState({
    drugName: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    refills: 0,
    pharmacy: "",
    quantity: ""
  })
  const [drugInteractions, setDrugInteractions] = useState([])
  const [allergyAlerts, setAllergyAlerts] = useState([])
  const [editingPrescription, setEditingPrescription] = useState(null)
  const [showPrintPreview, setShowPrintPreview] = useState(false)
  const [generatedPrescription, setGeneratedPrescription] = useState(null)

  // Lab Tests state
  const [showLabForm, setShowLabForm] = useState(false)
  const [labForm, setLabForm] = useState({
    testType: "",
    priority: "routine",
    instructions: "",
    fastingRequired: false,
    notes: ""
  })

  // Medical Imaging state
  const [showImagingForm, setShowImagingForm] = useState(false)
  const [imagingForm, setImagingForm] = useState({
    imagingType: "",
    bodyPart: "",
    priority: "routine",
    indication: "",
    contrast: false,
    instructions: ""
  })

  const tabs = [
    { id: "prescriptions", label: "E-Prescriptions", icon: "Pill" },
    { id: "lab-tests", label: "Lab Tests", icon: "TestTube" },
    { id: "imaging", label: "Medical Imaging", icon: "Scan" },
    { id: "history", label: "Order History", icon: "History" }
  ]

  const frequencies = [
    "Once daily (QD)",
    "Twice daily (BID)", 
    "Three times daily (TID)",
    "Four times daily (QID)",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed (PRN)",
    "Weekly",
    "Monthly"
  ]

  const commonDurations = [
    "3 days",
    "5 days", 
    "7 days",
    "10 days",
    "14 days",
    "30 days",
    "90 days",
    "Ongoing"
  ]

  const labTests = [
    "Complete Blood Count (CBC)",
    "Basic Metabolic Panel (BMP)",
    "Comprehensive Metabolic Panel (CMP)",
    "Lipid Panel",
    "Thyroid Function Tests",
    "Hemoglobin A1C",
    "Liver Function Tests",
    "Kidney Function Tests",
    "Urinalysis",
    "Blood Glucose",
    "Vitamin D",
    "Vitamin B12",
    "Iron Studies",
    "Inflammatory Markers (ESR, CRP)"
  ]

  const imagingTypes = [
    "X-Ray",
    "CT Scan",
    "MRI",
    "Ultrasound",
    "Mammogram",
    "DEXA Scan",
    "Nuclear Medicine",
    "PET Scan"
  ]

  // Load patients on mount
  useEffect(() => {
    loadPatients()
  }, [])

  // Search for drugs when typing
  useEffect(() => {
    if (drugSearch.length >= 2) {
      searchDrugs(drugSearch)
    } else {
      setDrugOptions([])
    }
  }, [drugSearch])

  // Check interactions and allergies when drug is selected
  useEffect(() => {
    if (selectedPatient && prescriptionForm.drugName) {
      checkDrugSafety()
    }
  }, [selectedPatient, prescriptionForm.drugName])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const data = await patientService.getAll()
      setPatients(data)
    } catch (err) {
      setError("Failed to load patients")
      toast.error("Failed to load patients")
    } finally {
      setLoading(false)
    }
  }

  const searchDrugs = async (query) => {
    try {
      const drugs = await medicationService.searchDrugs(query)
      setDrugOptions(drugs.slice(0, 10))
    } catch (err) {
      console.error("Drug search failed:", err)
    }
  }

  const checkDrugSafety = async () => {
    if (!selectedPatient || !prescriptionForm.drugName) return

    try {
      // Check drug interactions
      const interactions = await medicationService.checkInteractions(
        selectedPatient.Id, 
        prescriptionForm.drugName
      )
      setDrugInteractions(interactions)

      // Check allergies
      const allergies = await allergyService.checkAllergyAlert(
        selectedPatient.Id, 
        prescriptionForm.drugName
      )
      setAllergyAlerts(allergies ? [allergies] : [])
    } catch (err) {
      console.error("Safety check failed:", err)
    }
  }

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    toast.success(`Selected patient: ${patient.firstName} ${patient.lastName}`)
  }

  const handleDrugSelect = (drug) => {
    setPrescriptionForm(prev => ({
      ...prev,
      drugName: drug.name,
      dosage: drug.commonDosage || ""
    }))
    setDrugSearch(drug.name)
    setDrugOptions([])
  }

  const calculateDosage = () => {
    if (!selectedPatient || !prescriptionForm.drugName) {
      toast.error("Please select a patient and drug first")
      return
    }

    // Simplified dosage calculation based on patient weight/age
    const patientAge = Math.floor((new Date() - new Date(selectedPatient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
    let recommendedDosage = ""

    // Example calculations for common drugs
    const drugName = prescriptionForm.drugName.toLowerCase()
    
    if (drugName.includes("ibuprofen")) {
      recommendedDosage = patientAge < 18 ? "200mg" : "400-600mg"
    } else if (drugName.includes("acetaminophen") || drugName.includes("tylenol")) {
      recommendedDosage = patientAge < 18 ? "160mg" : "500-1000mg"
    } else if (drugName.includes("amoxicillin")) {
      recommendedDosage = patientAge < 18 ? "250mg" : "500mg"
    } else {
      recommendedDosage = "Consult prescribing information"
    }

    setPrescriptionForm(prev => ({ ...prev, dosage: recommendedDosage }))
    toast.info(`Recommended dosage calculated: ${recommendedDosage}`)
  }

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedPatient) {
      toast.error("Please select a patient first")
      return
    }

    // Show warnings for interactions and allergies
    if (drugInteractions.length > 0) {
      const proceed = window.confirm(
        `WARNING: Drug interactions detected:\n${drugInteractions.map(i => `• ${i.description}`).join('\n')}\n\nProceed with prescription?`
      )
      if (!proceed) return
    }

    if (allergyAlerts.length > 0) {
      const proceed = window.confirm(
        `ALLERGY ALERT: Patient has allergies that may interact with this medication:\n${allergyAlerts.map(a => `• ${a.allergen} (${a.severity})`).join('\n')}\n\nProceed with prescription?`
      )
      if (!proceed) return
    }

    try {
      const prescriptionData = {
        ...prescriptionForm,
        patientId: selectedPatient.Id,
        prescribingDoctor: "Dr. Current User", // In real app, get from auth
        prescriptionDate: new Date().toISOString(),
        status: "Active",
        type: "prescription"
      }

      let result
      if (editingPrescription) {
        result = await medicationService.update(editingPrescription.Id, prescriptionData)
        toast.success("Prescription updated successfully")
      } else {
        result = await medicationService.create(prescriptionData)
        toast.success("Prescription created successfully")
      }

      setOrders(prev => editingPrescription 
        ? prev.map(order => order.Id === editingPrescription.Id ? result : order)
        : [...prev, result]
      )

      setGeneratedPrescription(result)
      setShowPrescriptionForm(false)
      setEditingPrescription(null)
      resetPrescriptionForm()
      
      // Ask if user wants to print
      const shouldPrint = window.confirm("Prescription created successfully. Would you like to view the printable version?")
      if (shouldPrint) {
        setShowPrintPreview(true)
      }
    } catch (err) {
      toast.error("Failed to create prescription")
    }
  }

  const handleLabSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedPatient) {
      toast.error("Please select a patient first")
      return
    }

    try {
      const labOrder = {
        ...labForm,
        patientId: selectedPatient.Id,
        orderingPhysician: "Dr. Current User",
        orderDate: new Date().toISOString(),
        status: "Pending",
        type: "lab"
      }

      // Simulate lab order creation
      const result = { ...labOrder, Id: Date.now() }
      setOrders(prev => [...prev, result])
      
      toast.success("Lab test ordered successfully")
      setShowLabForm(false)
      setLabForm({
        testType: "",
        priority: "routine",
        instructions: "",
        fastingRequired: false,
        notes: ""
      })
    } catch (err) {
      toast.error("Failed to create lab order")
    }
  }

  const handleImagingSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedPatient) {
      toast.error("Please select a patient first")
      return
    }

    try {
      const imagingOrder = {
        ...imagingForm,
        patientId: selectedPatient.Id,
        orderingPhysician: "Dr. Current User",
        orderDate: new Date().toISOString(),
        status: "Scheduled",
        type: "imaging"
      }

      // Simulate imaging order creation
      const result = { ...imagingOrder, Id: Date.now() }
      setOrders(prev => [...prev, result])
      
      toast.success("Imaging study ordered successfully")
      setShowImagingForm(false)
      setImagingForm({
        imagingType: "",
        bodyPart: "",
        priority: "routine",
        indication: "",
        contrast: false,
        instructions: ""
      })
    } catch (err) {
      toast.error("Failed to create imaging order")
    }
  }

  const resetPrescriptionForm = () => {
    setPrescriptionForm({
      drugName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      refills: 0,
      pharmacy: "",
      quantity: ""
    })
    setDrugSearch("")
    setDrugInteractions([])
    setAllergyAlerts([])
  }

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.Id.toString().includes(patientSearch)
  )

  const patientOrders = orders.filter(order => 
    selectedPatient ? order.patientId === selectedPatient.Id : false
  )

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadPatients} />

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clinical Order Management</h1>
          <p className="text-gray-600 mt-1">Create and manage prescriptions, lab tests, and imaging orders</p>
        </div>
        {selectedPatient && (
          <div className="flex gap-3">
            <Button onClick={() => setShowOrderHistory(!showOrderHistory)}>
              <ApperIcon name="History" className="h-4 w-4 mr-2" />
              Order History
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient Selection Panel */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Select Patient</h2>
              <ApperIcon name="Users" className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Search patients..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full"
              />

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.Id}
                    className={cn(
                      "p-3 rounded-lg border-2 cursor-pointer transition-all",
                      selectedPatient?.Id === patient.Id
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-gray-500">ID: #{patient.Id}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(patient.dateOfBirth), "MMM dd, yyyy")}
                        </p>
                      </div>
                      {patient.medicalAlerts.length > 0 && (
                        <div className="flex items-center">
                          <ApperIcon name="AlertTriangle" className="h-4 w-4 text-red-500" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedPatient && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Selected Patient</h3>
                <p className="text-sm text-blue-800">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </p>
                <p className="text-xs text-blue-600">
                  DOB: {format(new Date(selectedPatient.dateOfBirth), "MMM dd, yyyy")}
                </p>
                {selectedPatient.medicalAlerts.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {selectedPatient.medicalAlerts.map((alert, index) => (
                      <Badge key={index} variant="warning" className="text-xs mr-1">
                        {alert}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {!selectedPatient ? (
            <Card className="p-12 text-center">
              <ApperIcon name="UserSearch" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Patient</h3>
              <p className="text-gray-600">Choose a patient from the panel to create orders</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center py-2 px-1 border-b-2 font-medium text-sm",
                        activeTab === tab.id
                          ? "border-primary-500 text-primary-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      )}
                    >
                      <ApperIcon name={tab.icon} className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* E-Prescriptions Tab */}
              {activeTab === "prescriptions" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900">Electronic Prescriptions</h3>
                    <Button onClick={() => setShowPrescriptionForm(true)}>
                      <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                      New Prescription
                    </Button>
                  </div>

                  {/* Safety Alerts */}
                  {(drugInteractions.length > 0 || allergyAlerts.length > 0) && (
                    <Card className="p-4 border-red-200 bg-red-50">
                      <div className="flex items-center mb-3">
                        <ApperIcon name="AlertTriangle" className="h-5 w-5 text-red-600 mr-2" />
                        <h4 className="font-medium text-red-900">Safety Alerts</h4>
                      </div>
                      
                      {allergyAlerts.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-red-800 mb-1">Allergy Alerts:</p>
                          {allergyAlerts.map((allergy, index) => (
                            <div key={index} className="text-sm text-red-700">
                              • Patient allergic to {allergy.allergen} ({allergy.severity} severity)
                            </div>
                          ))}
                        </div>
                      )}

                      {drugInteractions.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-red-800 mb-1">Drug Interactions:</p>
                          {drugInteractions.map((interaction, index) => (
                            <div key={index} className="text-sm text-red-700">
                              • {interaction.description} ({interaction.severity} severity)
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  )}

                  {/* Recent Prescriptions */}
                  <Card className="p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Prescriptions</h4>
                    {patientOrders.filter(order => order.type === "prescription").length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ApperIcon name="Pill" className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No prescriptions for this patient</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {patientOrders
                          .filter(order => order.type === "prescription")
                          .slice(0, 5)
                          .map((prescription) => (
                          <div key={prescription.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{prescription.drugName}</p>
                              <p className="text-sm text-gray-600">
                                {prescription.dosage} • {prescription.frequency}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="success">{prescription.status}</Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingPrescription(prescription)
                                  setPrescriptionForm(prescription)
                                  setDrugSearch(prescription.drugName)
                                  setShowPrescriptionForm(true)
                                }}
                              >
                                <ApperIcon name="Edit" className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* Lab Tests Tab */}
              {activeTab === "lab-tests" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900">Laboratory Tests</h3>
                    <Button onClick={() => setShowLabForm(true)}>
                      <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                      Order Lab Test
                    </Button>
                  </div>

                  <Card className="p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Lab Orders</h4>
                    {patientOrders.filter(order => order.type === "lab").length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ApperIcon name="TestTube" className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No lab tests ordered for this patient</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {patientOrders.filter(order => order.type === "lab").map((labOrder) => (
                          <div key={labOrder.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{labOrder.testType}</p>
                              <p className="text-sm text-gray-600">
                                Priority: {labOrder.priority} • {labOrder.fastingRequired ? "Fasting required" : "No fasting"}
                              </p>
                            </div>
                            <Badge variant="info">{labOrder.status}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* Medical Imaging Tab */}
              {activeTab === "imaging" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900">Medical Imaging</h3>
                    <Button onClick={() => setShowImagingForm(true)}>
                      <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                      Order Imaging Study
                    </Button>
                  </div>

                  <Card className="p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Imaging Orders</h4>
                    {patientOrders.filter(order => order.type === "imaging").length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ApperIcon name="Scan" className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No imaging studies ordered for this patient</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {patientOrders.filter(order => order.type === "imaging").map((imagingOrder) => (
                          <div key={imagingOrder.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{imagingOrder.imagingType}</p>
                              <p className="text-sm text-gray-600">
                                {imagingOrder.bodyPart} • Priority: {imagingOrder.priority}
                              </p>
                            </div>
                            <Badge variant="warning">{imagingOrder.status}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* Order History Tab */}
              {activeTab === "history" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Complete Order History</h3>
                  
                  <Card className="p-6">
                    {patientOrders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ApperIcon name="History" className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No orders found for this patient</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {patientOrders.map((order) => (
                          <div key={order.Id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <ApperIcon 
                                  name={order.type === "prescription" ? "Pill" : order.type === "lab" ? "TestTube" : "Scan"} 
                                  className="h-5 w-5 text-gray-600" 
                                />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {order.type === "prescription" ? order.drugName : 
                                     order.type === "lab" ? order.testType : order.imagingType}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {format(new Date(order.orderDate || order.prescriptionDate), "MMM dd, yyyy HH:mm")}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={
                                order.status === "Active" || order.status === "Scheduled" ? "success" :
                                order.status === "Pending" ? "warning" : "secondary"
                              }>
                                {order.status}
                              </Badge>
                            </div>
                            {order.type === "prescription" && (
                              <p className="text-sm text-gray-600">
                                {order.dosage} • {order.frequency} • {order.duration}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Prescription Form Modal */}
      {showPrescriptionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handlePrescriptionSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">
                  {editingPrescription ? "Edit Prescription" : "New Electronic Prescription"}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowPrescriptionForm(false)
                    setEditingPrescription(null)
                    resetPrescriptionForm()
                  }}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Drug Search */}
                <div className="md:col-span-2">
                  <Label htmlFor="drugSearch">Drug Name *</Label>
                  <div className="relative">
                    <Input
                      id="drugSearch"
                      value={drugSearch}
                      onChange={(e) => setDrugSearch(e.target.value)}
                      placeholder="Search for medication..."
                      required
                    />
                    {drugOptions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {drugOptions.map((drug, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleDrugSelect(drug)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50"
                          >
                            <div className="font-medium">{drug.name}</div>
                            <div className="text-sm text-gray-600">{drug.genericName}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dosage with Calculator */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dosage">Dosage *</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={calculateDosage}
                    >
                      <ApperIcon name="Calculator" className="h-4 w-4 mr-1" />
                      Calculate
                    </Button>
                  </div>
                  <Input
                    id="dosage"
                    value={prescriptionForm.dosage}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, dosage: e.target.value }))}
                    placeholder="e.g., 500mg"
                    required
                  />
                </div>

                {/* Frequency Selector */}
                <div>
                  <Label htmlFor="frequency">Frequency *</Label>
                  <select
                    id="frequency"
                    value={prescriptionForm.frequency}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select frequency</option>
                    {frequencies.map((freq) => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>

                {/* Duration Picker */}
                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <select
                    id="duration"
                    value={prescriptionForm.duration}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select duration</option>
                    {commonDurations.map((duration) => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={prescriptionForm.quantity}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="30"
                  />
                </div>

                <div>
                  <Label htmlFor="refills">Refills</Label>
                  <Input
                    id="refills"
                    type="number"
                    min="0"
                    max="5"
                    value={prescriptionForm.refills}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, refills: parseInt(e.target.value) }))}
                  />
                </div>

                <div>
                  <Label htmlFor="pharmacy">Pharmacy</Label>
                  <select
                    id="pharmacy"
                    value={prescriptionForm.pharmacy}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, pharmacy: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select pharmacy</option>
                    <option value="CVS Pharmacy">CVS Pharmacy</option>
                    <option value="Walgreens">Walgreens</option>
                    <option value="Rite Aid">Rite Aid</option>
                    <option value="Walmart Pharmacy">Walmart Pharmacy</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <textarea
                    id="instructions"
                    value={prescriptionForm.instructions}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, instructions: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Special instructions for patient..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowPrescriptionForm(false)
                    setEditingPrescription(null)
                    resetPrescriptionForm()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPrescription ? "Update Prescription" : "Create Prescription"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lab Test Form Modal */}
      {showLabForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleLabSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Order Laboratory Test</h3>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowLabForm(false)}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="testType">Test Type *</Label>
                  <select
                    id="testType"
                    value={labForm.testType}
                    onChange={(e) => setLabForm(prev => ({ ...prev, testType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select test type</option>
                    {labTests.map((test) => (
                      <option key={test} value={test}>{test}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={labForm.priority}
                    onChange={(e) => setLabForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="stat">STAT</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="fastingRequired"
                    checked={labForm.fastingRequired}
                    onChange={(e) => setLabForm(prev => ({ ...prev, fastingRequired: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="fastingRequired">Fasting required</Label>
                </div>

                <div>
                  <Label htmlFor="labInstructions">Special Instructions</Label>
                  <textarea
                    id="labInstructions"
                    value={labForm.instructions}
                    onChange={(e) => setLabForm(prev => ({ ...prev, instructions: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Special instructions for lab..."
                  />
                </div>

                <div>
                  <Label htmlFor="labNotes">Clinical Notes</Label>
                  <textarea
                    id="labNotes"
                    value={labForm.notes}
                    onChange={(e) => setLabForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Clinical indication for test..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="ghost" onClick={() => setShowLabForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Order Lab Test</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Imaging Form Modal */}
      {showImagingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleImagingSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Order Medical Imaging</h3>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowImagingForm(false)}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="imagingType">Imaging Type *</Label>
                  <select
                    id="imagingType"
                    value={imagingForm.imagingType}
                    onChange={(e) => setImagingForm(prev => ({ ...prev, imagingType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select imaging type</option>
                    {imagingTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="bodyPart">Body Part/Region *</Label>
                  <Input
                    id="bodyPart"
                    value={imagingForm.bodyPart}
                    onChange={(e) => setImagingForm(prev => ({ ...prev, bodyPart: e.target.value }))}
                    placeholder="e.g., Chest, Abdomen, Left Knee"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="imagingPriority">Priority</Label>
                  <select
                    id="imagingPriority"
                    value={imagingForm.priority}
                    onChange={(e) => setImagingForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="stat">STAT</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="indication">Clinical Indication *</Label>
                  <Input
                    id="indication"
                    value={imagingForm.indication}
                    onChange={(e) => setImagingForm(prev => ({ ...prev, indication: e.target.value }))}
                    placeholder="Clinical reason for imaging"
                    required
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="contrast"
                    checked={imagingForm.contrast}
                    onChange={(e) => setImagingForm(prev => ({ ...prev, contrast: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="contrast">Contrast required</Label>
                </div>

                <div>
                  <Label htmlFor="imagingInstructions">Special Instructions</Label>
                  <textarea
                    id="imagingInstructions"
                    value={imagingForm.instructions}
                    onChange={(e) => setImagingForm(prev => ({ ...prev, instructions: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Special instructions for imaging..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="ghost" onClick={() => setShowImagingForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Order Imaging Study</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Preview Modal */}
      {showPrintPreview && generatedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Prescription Preview</h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      window.print()
                      toast.success("Prescription sent to printer")
                    }}
                  >
                    <ApperIcon name="Printer" size={16} className="mr-2" />
                    Print
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowPrintPreview(false)}
                  >
                    <ApperIcon name="X" size={20} />
                  </Button>
                </div>
              </div>

              {/* Prescription Layout */}
              <div className="bg-white border-2 border-gray-300 p-8 print:border-0">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Medical Center</h1>
                  <p className="text-gray-600">123 Healthcare Drive, Medical City, MC 12345</p>
                  <p className="text-gray-600">Phone: (555) 123-4567 | Fax: (555) 123-4568</p>
                </div>

                <div className="border-t border-b border-gray-300 py-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Patient Information</h3>
                      <p><strong>Name:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</p>
                      <p><strong>DOB:</strong> {format(new Date(selectedPatient.dateOfBirth), "MM/dd/yyyy")}</p>
                      <p><strong>Address:</strong> {selectedPatient.address.street}, {selectedPatient.address.city}, {selectedPatient.address.state} {selectedPatient.address.zipCode}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Prescription Details</h3>
                      <p><strong>Date:</strong> {format(new Date(), "MM/dd/yyyy")}</p>
                      <p><strong>Prescriber:</strong> Dr. Current User</p>
                      <p><strong>DEA #:</strong> BC1234567</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Prescription</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {generatedPrescription.drugName} {generatedPrescription.dosage}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Quantity:</strong> {generatedPrescription.quantity || "As prescribed"}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Directions:</strong> Take {generatedPrescription.frequency.toLowerCase()} for {generatedPrescription.duration}
                    </p>
                    {generatedPrescription.instructions && (
                      <p className="text-gray-700 mb-1">
                        <strong>Instructions:</strong> {generatedPrescription.instructions}
                      </p>
                    )}
                    <p className="text-gray-700">
                      <strong>Refills:</strong> {generatedPrescription.refills} refill(s)
                    </p>
                    {generatedPrescription.pharmacy && (
                      <p className="text-gray-700">
                        <strong>Pharmacy:</strong> {generatedPrescription.pharmacy}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-600">Generic substitution permitted unless checked</p>
                      <p className="text-sm text-gray-600 mt-2">☐ Dispense as written</p>
                    </div>
                    <div className="text-right">
                      <div className="border-b border-gray-400 w-48 mb-2"></div>
                      <p className="text-sm text-gray-600">Digital Signature</p>
                      <p className="text-sm text-gray-600">Dr. Current User, MD</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clinical