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
import patientService from "@/services/api/patientService"
import medicalHistoryService from "@/services/api/medicalHistoryService"
import icd10Service from "@/services/api/icd10Service"
import { cn } from "@/utils/cn"

const PatientProfile = () => {
  const { patientId } = useParams()
  const navigate = useNavigate()
  
  // State management
  const [patient, setPatient] = useState(null)
  const [medicalHistory, setMedicalHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("medical-history")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
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

  const tabs = [
    { id: "medical-history", label: "Medical History", icon: "FileText" },
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
      const [patientData, historyData] = await Promise.all([
        patientService.getById(patientId),
        medicalHistoryService.getByPatientId(patientId)
      ])
      setPatient(patientData)
      setMedicalHistory(historyData)
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
    </div>
  )
}

export default PatientProfile