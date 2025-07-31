import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Input from "@/components/atoms/Input"
import Label from "@/components/atoms/Label"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import VitalsChart from "@/components/organisms/VitalsChart"
import patientService from "@/services/api/patientService"
import medicalHistoryService from "@/services/api/medicalHistoryService"
import vitalsService from "@/services/api/vitalsService"
import icd10Service from "@/services/api/icd10Service"
import { cn } from "@/utils/cn"

const PatientProfile = () => {
  const { patientId } = useParams()
  const navigate = useNavigate()
  
// State management
  const [patient, setPatient] = useState(null)
  const [medicalHistory, setMedicalHistory] = useState([])
  const [vitals, setVitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("medical-history")
  const [showAddForm, setShowAddForm] = useState(false)
  const [showVitalsForm, setShowVitalsForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [editingVital, setEditingVital] = useState(null)
  const [searchDiagnosis, setSearchDiagnosis] = useState("")
  const [diagnosisOptions, setDiagnosisOptions] = useState([])
  
  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    diagnosisCode: "",
    diagnosisName: "",
    treatmentNotes: "",
    attendingPhysician: "",
    followUpRequired: false,
    followUpDate: ""
  })

  // Vitals form state
  const [vitalsFormData, setVitalsFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    systolicBP: "",
    diastolicBP: "",
    temperature: "",
    heartRate: "",
    respiratoryRate: "",
    weight: "",
    height: "",
    notes: "",
    recordedBy: ""
  })

const tabs = [
    { id: "medical-history", label: "Medical History", icon: "FileText" },
    { id: "vitals", label: "Vitals", icon: "Activity" },
    { id: "demographics", label: "Demographics", icon: "User" },
    { id: "insurance", label: "Insurance", icon: "Shield" },
    { id: "emergency", label: "Emergency Contact", icon: "Phone" }
  ]

  // Load patient data and medical history
  useEffect(() => {
    loadPatientData()
  }, [patientId])

  // Search for diagnosis codes
  useEffect(() => {
    if (searchDiagnosis.length >= 2) {
      const results = icd10Service.search(searchDiagnosis)
      setDiagnosisOptions(results.slice(0, 10))
    } else {
      setDiagnosisOptions([])
    }
  }, [searchDiagnosis])

const loadPatientData = async () => {
    try {
      setLoading(true)
      const [patientData, historyData, vitalsData] = await Promise.all([
        patientService.getById(patientId),
        medicalHistoryService.getByPatientId(patientId),
        vitalsService.getByPatientId(patientId)
      ])
      setPatient(patientData)
      setMedicalHistory(historyData)
      setVitals(vitalsData)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load patient data")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate("/patients")
  }

  const handleScheduleAppointment = () => {
    toast.info(`Scheduling appointment for ${patient.firstName} ${patient.lastName}`)
  }

  const handleOrderTests = () => {
    toast.info(`Ordering tests for ${patient.firstName} ${patient.lastName}`)
  }

  const handleAddMedicalHistory = () => {
    setEditingEntry(null)
    setFormData({
      date: new Date().toISOString().split('T')[0],
      diagnosisCode: "",
      diagnosisName: "",
      treatmentNotes: "",
      attendingPhysician: "",
      followUpRequired: false,
      followUpDate: ""
    })
    setShowAddForm(true)
  }

  const handleEditMedicalHistory = (entry) => {
    setEditingEntry(entry)
    setFormData({
      date: entry.date.split('T')[0],
      diagnosisCode: entry.diagnosisCode,
      diagnosisName: entry.diagnosisName,
      treatmentNotes: entry.treatmentNotes,
      attendingPhysician: entry.attendingPhysician,
      followUpRequired: entry.followUpRequired,
      followUpDate: entry.followUpDate ? entry.followUpDate.split('T')[0] : ""
    })
    setShowAddForm(true)
  }

  const handleDeleteMedicalHistory = async (entryId) => {
    if (!window.confirm("Are you sure you want to delete this medical history entry?")) {
      return
    }

    try {
      await medicalHistoryService.delete(entryId)
      await loadPatientData()
      toast.success("Medical history entry deleted successfully")
    } catch (err) {
      toast.error("Failed to delete medical history entry")
    }
  }

  const handleDiagnosisSelect = (diagnosis) => {
    setFormData(prev => ({
      ...prev,
      diagnosisCode: diagnosis.code,
      diagnosisName: diagnosis.description
    }))
    setSearchDiagnosis(diagnosis.description)
    setDiagnosisOptions([])
  }

const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.diagnosisCode || !formData.diagnosisName || !formData.treatmentNotes) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const entryData = {
        ...formData,
        patientId: parseInt(patientId),
        date: new Date(formData.date).toISOString(),
        followUpDate: formData.followUpDate ? new Date(formData.followUpDate).toISOString() : null
      }

      if (editingEntry) {
        await medicalHistoryService.update(editingEntry.Id, entryData)
        toast.success("Medical history updated successfully")
      } else {
        await medicalHistoryService.create(entryData)
        toast.success("Medical history entry added successfully")
      }

      setShowAddForm(false)
      await loadPatientData()
    } catch (err) {
      toast.error("Failed to save medical history entry")
    }
  }

  // Vitals handlers
  const handleAddVitals = () => {
    setEditingVital(null)
    setVitalsFormData({
      date: new Date().toISOString().split('T')[0],
      systolicBP: "",
      diastolicBP: "",
      temperature: "",
      heartRate: "",
      respiratoryRate: "",
      weight: "",
      height: "",
      notes: "",
      recordedBy: ""
    })
    setShowVitalsForm(true)
  }

  const handleEditVitals = (vital) => {
    setEditingVital(vital)
    setVitalsFormData({
      date: vital.date.split('T')[0],
      systolicBP: vital.systolicBP || "",
      diastolicBP: vital.diastolicBP || "",
      temperature: vital.temperature || "",
      heartRate: vital.heartRate || "",
      respiratoryRate: vital.respiratoryRate || "",
      weight: vital.weight || "",
      height: vital.height || "",
      notes: vital.notes || "",
      recordedBy: vital.recordedBy || ""
    })
    setShowVitalsForm(true)
  }

  const handleDeleteVitals = async (vitalId) => {
    if (!window.confirm("Are you sure you want to delete this vital signs record?")) {
      return
    }

    try {
      await vitalsService.delete(vitalId)
      await loadPatientData()
      toast.success("Vital signs record deleted successfully")
    } catch (err) {
      toast.error("Failed to delete vital signs record")
    }
  }

  const handleVitalsFormSubmit = async (e) => {
    e.preventDefault()
    
    const requiredFields = ['date', 'recordedBy']
    const missingFields = requiredFields.filter(field => !vitalsFormData[field])
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields")
      return
    }

    // Check if at least one vital sign is provided
    const vitalFields = ['systolicBP', 'diastolicBP', 'temperature', 'heartRate', 'respiratoryRate', 'weight', 'height']
    const hasVitalData = vitalFields.some(field => vitalsFormData[field] !== "")
    
    if (!hasVitalData) {
      toast.error("Please provide at least one vital sign measurement")
      return
    }

    try {
      const vitalData = {
        ...vitalsFormData,
        patientId: parseInt(patientId),
        date: new Date(vitalsFormData.date).toISOString(),
        // Convert string values to numbers for vital signs
        systolicBP: vitalsFormData.systolicBP ? parseFloat(vitalsFormData.systolicBP) : null,
        diastolicBP: vitalsFormData.diastolicBP ? parseFloat(vitalsFormData.diastolicBP) : null,
        temperature: vitalsFormData.temperature ? parseFloat(vitalsFormData.temperature) : null,
        heartRate: vitalsFormData.heartRate ? parseFloat(vitalsFormData.heartRate) : null,
        respiratoryRate: vitalsFormData.respiratoryRate ? parseFloat(vitalsFormData.respiratoryRate) : null,
        weight: vitalsFormData.weight ? parseFloat(vitalsFormData.weight) : null,
        height: vitalsFormData.height ? parseFloat(vitalsFormData.height) : null
      }

      if (editingVital) {
        await vitalsService.update(editingVital.Id, vitalData)
        toast.success("Vital signs updated successfully")
      } else {
        await vitalsService.create(vitalData)
        toast.success("Vital signs recorded successfully")
      }

      setShowVitalsForm(false)
      await loadPatientData()
    } catch (err) {
      toast.error("Failed to save vital signs")
    }
  }

  const getVitalStatus = (value, field) => {
    if (!value) return { status: 'normal', color: 'text-gray-500' }
    
    const normalRanges = vitalsService.getNormalRanges()
    const range = normalRanges[field]
    
    if (!range) return { status: 'normal', color: 'text-gray-900' }
    
    if (value < range.critical.min || value > range.critical.max) {
      return { status: 'critical', color: 'text-red-600' }
    } else if (value < range.min || value > range.max) {
      return { status: 'warning', color: 'text-yellow-600' }
    }
    
    return { status: 'normal', color: 'text-green-600' }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "Active": return "success"
      case "Critical": return "error"
      case "Discharged": return "secondary"
      default: return "secondary"
    }
  }

  const getAlertVariant = (alert) => {
    if (alert.toLowerCase().includes("allergy")) return "error"
    if (alert.toLowerCase().includes("diabetes") || alert.toLowerCase().includes("heart")) return "warning"
    return "info"
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadPatientData} />
  if (!patient) return <Error message="Patient not found" />

  const patientAge = Math.floor((new Date() - new Date(patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack}>
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-gray-500">Patient ID: #{patient.Id.toString().padStart(4, "0")}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleScheduleAppointment}>
            <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
          <Button variant="secondary" onClick={handleOrderTests}>
            <ApperIcon name="Stethoscope" className="h-4 w-4 mr-2" />
            Order Tests
          </Button>
        </div>
      </div>

      {/* Patient Summary Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Demographics */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Demographics</h3>
            <div className="space-y-1">
              <p className="text-sm"><span className="font-medium">Age:</span> {patientAge} years</p>
              <p className="text-sm"><span className="font-medium">Gender:</span> {patient.gender}</p>
              <p className="text-sm"><span className="font-medium">DOB:</span> {format(new Date(patient.dateOfBirth), "MMM dd, yyyy")}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
            <div className="space-y-1">
              <p className="text-sm"><span className="font-medium">Phone:</span> {patient.phone}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {patient.email}</p>
              <p className="text-sm"><span className="font-medium">Address:</span> {patient.address.street}, {patient.address.city}, {patient.address.state}</p>
            </div>
          </div>

          {/* Insurance */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Insurance</h3>
            <div className="space-y-1">
              <p className="text-sm"><span className="font-medium">Provider:</span> {patient.insuranceProvider}</p>
              <p className="text-sm"><span className="font-medium">Policy:</span> {patient.policyNumber}</p>
              <p className="text-sm"><span className="font-medium">Coverage:</span> {patient.coverageType}</p>
            </div>
          </div>

          {/* Status & Alerts */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Status & Alerts</h3>
            <div className="space-y-2">
              <Badge variant={getStatusVariant(patient.status)}>{patient.status}</Badge>
              {patient.medicalAlerts.length > 0 && (
                <div className="space-y-1">
                  {patient.medicalAlerts.map((alert, index) => (
                    <Badge key={index} variant={getAlertVariant(alert)} className="text-xs mr-1">
                      {alert}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

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

      {/* Tab Content */}
      {activeTab === "medical-history" && (
        <div className="space-y-6">
          {/* Add Medical History Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Medical History</h2>
            <Button onClick={handleAddMedicalHistory}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Medical History Entry
            </Button>
          </div>

          {/* Medical History Timeline */}
          {medicalHistory.length > 0 ? (
            <div className="space-y-4">
              {medicalHistory.map((entry) => (
                <Card key={entry.Id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-sm font-medium text-primary-600">
                          {format(new Date(entry.date), "MMM dd, yyyy")}
                        </span>
                        <Badge variant="outline">{entry.diagnosisCode}</Badge>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {entry.diagnosisName}
                      </h3>
                      <p className="text-gray-600 mb-3">{entry.treatmentNotes}</p>
                      <div className="text-sm text-gray-500">
                        <p><span className="font-medium">Attending Physician:</span> {entry.attendingPhysician}</p>
                        {entry.followUpRequired && entry.followUpDate && (
                          <p><span className="font-medium">Follow-up:</span> {format(new Date(entry.followUpDate), "MMM dd, yyyy")}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditMedicalHistory(entry)}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMedicalHistory(entry.Id)}
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <ApperIcon name="FileText" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical History</h3>
              <p className="text-gray-500 mb-4">No medical history entries found for this patient.</p>
              <Button onClick={handleAddMedicalHistory}>
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Add First Entry
              </Button>
            </Card>
          )}
        </div>
      )}
{activeTab === "vitals" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Vital Signs</h2>
              <Button onClick={handleAddVitals}>
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Record Vitals
              </Button>
            </div>

            {/* Charts */}
            <VitalsChart vitals={vitals} />
          </Card>

          {/* Vitals Data Table */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Readings</h3>
            {vitals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Activity" className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No vital signs recorded</p>
                <p className="text-sm">Record the first vital signs to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2">Date</th>
                      <th className="text-left py-3 px-2">BP</th>
                      <th className="text-left py-3 px-2">Temp</th>
                      <th className="text-left py-3 px-2">HR</th>
                      <th className="text-left py-3 px-2">RR</th>
                      <th className="text-left py-3 px-2">Weight</th>
                      <th className="text-left py-3 px-2">Height</th>
                      <th className="text-left py-3 px-2">Recorded By</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vitals.map((vital) => (
                      <tr key={vital.Id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          {format(new Date(vital.date), "MMM dd, yyyy")}
                          <div className="text-xs text-gray-500">
                            {format(new Date(vital.date), "HH:mm")}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          {vital.systolicBP && vital.diastolicBP ? (
                            <div className={getVitalStatus(vital.systolicBP, 'systolicBP').color}>
                              {vital.systolicBP}/{vital.diastolicBP}
                              <div className="text-xs text-gray-500">mmHg</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          {vital.temperature ? (
                            <div className={getVitalStatus(vital.temperature, 'temperature').color}>
                              {vital.temperature}°F
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          {vital.heartRate ? (
                            <div className={getVitalStatus(vital.heartRate, 'heartRate').color}>
                              {vital.heartRate}
                              <div className="text-xs text-gray-500">bpm</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          {vital.respiratoryRate ? (
                            <div className={getVitalStatus(vital.respiratoryRate, 'respiratoryRate').color}>
                              {vital.respiratoryRate}
                              <div className="text-xs text-gray-500">/min</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          {vital.weight ? (
                            <div>
                              {vital.weight}
                              <div className="text-xs text-gray-500">lbs</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          {vital.height ? (
                            <div>
                              {vital.height}
                              <div className="text-xs text-gray-500">in</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-gray-600">
                          {vital.recordedBy}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditVitals(vital)}
                            >
                              <ApperIcon name="Edit" className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteVitals(vital.Id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <ApperIcon name="Trash2" className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === "demographics" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Demographics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>First Name</Label>
              <Input value={patient.firstName} readOnly />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input value={patient.lastName} readOnly />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input value={format(new Date(patient.dateOfBirth), "yyyy-MM-dd")} readOnly />
            </div>
            <div>
              <Label>Gender</Label>
              <Input value={patient.gender} readOnly />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={patient.phone} readOnly />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={patient.email} readOnly />
            </div>
            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input value={`${patient.address.street}, ${patient.address.city}, ${patient.address.state} ${patient.address.zipCode}`} readOnly />
            </div>
          </div>
        </Card>
      )}

      {activeTab === "insurance" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Insurance Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Insurance Provider</Label>
              <Input value={patient.insuranceProvider} readOnly />
            </div>
            <div>
              <Label>Policy Number</Label>
              <Input value={patient.policyNumber} readOnly />
            </div>
            <div>
              <Label>Coverage Type</Label>
              <Input value={patient.coverageType} readOnly />
            </div>
          </div>
        </Card>
      )}

      {activeTab === "emergency" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Contact Name</Label>
              <Input value={patient.emergencyContact.name} readOnly />
            </div>
            <div>
              <Label>Relationship</Label>
              <Input value={patient.emergencyContact.relationship} readOnly />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input value={patient.emergencyContact.phone} readOnly />
            </div>
          </div>
        </Card>
      )}
      {/* Add/Edit Medical History Modal */}
{showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingEntry ? "Edit Medical History Entry" : "Add Medical History Entry"}
                </h2>
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                  <ApperIcon name="X" className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="physician">Attending Physician *</Label>
                  <Input
                    id="physician"
                    value={formData.attendingPhysician}
                    onChange={(e) => setFormData(prev => ({ ...prev, attendingPhysician: e.target.value }))}
                    placeholder="Dr. Smith"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <Label htmlFor="diagnosis">Diagnosis (ICD-10) *</Label>
                <Input
                  id="diagnosis"
                  value={searchDiagnosis}
                  onChange={(e) => setSearchDiagnosis(e.target.value)}
                  placeholder="Search for diagnosis..."
                  required
                />
                {diagnosisOptions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {diagnosisOptions.map((option) => (
                      <button
                        key={option.code}
                        type="button"
                        onClick={() => handleDiagnosisSelect(option)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      >
                        <div className="font-medium">{option.code}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="treatment">Treatment Notes *</Label>
                <textarea
                  id="treatment"
                  value={formData.treatmentNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, treatmentNotes: e.target.value }))}
                  placeholder="Describe the treatment provided..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="followup"
                  checked={formData.followUpRequired}
                  onChange={(e) => setFormData(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <Label htmlFor="followup">Follow-up required</Label>
              </div>

              {formData.followUpRequired && (
                <div>
                  <Label htmlFor="followupDate">Follow-up Date</Label>
                  <Input
                    id="followupDate"
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEntry ? "Update Entry" : "Add Entry"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vitals Form Modal */}
      {showVitalsForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingVital ? "Edit Vital Signs" : "Record Vital Signs"}
                </h2>
                <Button variant="ghost" onClick={() => setShowVitalsForm(false)}>
                  <ApperIcon name="X" className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <form onSubmit={handleVitalsFormSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vitalsDate">Date & Time *</Label>
                  <Input
                    id="vitalsDate"
                    type="datetime-local"
                    value={vitalsFormData.date + 'T' + new Date().toTimeString().slice(0,5)}
                    onChange={(e) => setVitalsFormData(prev => ({ ...prev, date: e.target.value.split('T')[0] }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="recordedBy">Recorded By *</Label>
                  <Input
                    id="recordedBy"
                    value={vitalsFormData.recordedBy}
                    onChange={(e) => setVitalsFormData(prev => ({ ...prev, recordedBy: e.target.value }))}
                    placeholder="Dr. Smith / Nurse Johnson"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="systolicBP">Systolic BP (mmHg)</Label>
                  <Input
                    id="systolicBP"
                    type="number"
                    value={vitalsFormData.systolicBP}
                    onChange={(e) => setVitalsFormData(prev => ({ ...prev, systolicBP: e.target.value }))}
                    placeholder="120"
                    min="50"
                    max="300"
                  />
                  <p className="text-xs text-gray-500 mt-1">Normal: 90-120 mmHg</p>
                </div>
                <div>
                  <Label htmlFor="diastolicBP">Diastolic BP (mmHg)</Label>
                  <Input
                    id="diastolicBP"
                    type="number"
                    value={vitalsFormData.diastolicBP}
                    onChange={(e) => setVitalsFormData(prev => ({ ...prev, diastolicBP: e.target.value }))}
                    placeholder="80"
                    min="30"
                    max="200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Normal: 60-80 mmHg</p>
                </div>
                <div>
                  <Label htmlFor="temperature">Temperature (°F)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={vitalsFormData.temperature}
                    onChange={(e) => setVitalsFormData(prev => ({ ...prev, temperature: e.target.value }))}
                    placeholder="98.6"
                    min="90"
                    max="110"
                  />
                  <p className="text-xs text-gray-500 mt-1">Normal: 97.0-99.5°F</p>
                </div>
                <div>
                  <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    value={vitalsFormData.heartRate}
                    onChange={(e) => setVitalsFormData(prev => ({ ...prev, heartRate: e.target.value }))}
                    placeholder="72"
                    min="30"
                    max="200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Normal: 60-100 bpm</p>
                </div>
                <div>
                  <Label htmlFor="respiratoryRate">Respiratory Rate (/min)</Label>
                  <Input
                    id="respiratoryRate"
                    type="number"
                    value={vitalsFormData.respiratoryRate}
                    onChange={(e) => setVitalsFormData(prev => ({ ...prev, respiratoryRate: e.target.value }))}
                    placeholder="16"
                    min="5"
                    max="50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Normal: 12-20 /min</p>
                </div>
                <div>
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={vitalsFormData.weight}
                    onChange={(e) => setVitalsFormData(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="150"
                    min="1"
                    max="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (inches)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={vitalsFormData.height}
                    onChange={(e) => setVitalsFormData(prev => ({ ...prev, height: e.target.value }))}
                    placeholder="68"
                    min="12"
                    max="96"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="vitalsNotes">Notes</Label>
                <textarea
                  id="vitalsNotes"
                  value={vitalsFormData.notes}
                  onChange={(e) => setVitalsFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional observations or notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowVitalsForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingVital ? "Update Vitals" : "Record Vitals"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientProfile