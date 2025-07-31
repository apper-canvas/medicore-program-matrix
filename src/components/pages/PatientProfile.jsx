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
import medicationService from "@/services/api/medicationService"
import allergyService from "@/services/api/allergyService"
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
  const [showMedicationForm, setShowMedicationForm] = useState(false)
  const [showAllergyForm, setShowAllergyForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [editingVital, setEditingVital] = useState(null)
  const [editingMedication, setEditingMedication] = useState(null)
  const [editingAllergy, setEditingAllergy] = useState(null)
  const [searchDiagnosis, setSearchDiagnosis] = useState("")
  const [diagnosisOptions, setDiagnosisOptions] = useState([])
  const [medications, setMedications] = useState([])
const [allergies, setAllergies] = useState([])
  const [drugInteractions, setDrugInteractions] = useState([])
  const [documents, setDocuments] = useState([])
  const [showDocumentUpload, setShowDocumentUpload] = useState(false)
  const [showDocumentPreview, setShowDocumentPreview] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [documentFilter, setDocumentFilter] = useState('all')
  const [documentSearch, setDocumentSearch] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
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
    { id: "medications", label: "Current Medications", icon: "Pill" },
    { id: "allergies", label: "Allergies & Alerts", icon: "AlertTriangle" },
    { id: "documents", label: "Documents", icon: "FolderOpen" },
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
      const [patientData, historyData, vitalsData, medicationsData, allergiesData] = await Promise.all([
        patientService.getById(patientId),
        medicalHistoryService.getByPatientId(patientId),
        vitalsService.getByPatientId(patientId),
        medicationService.getByPatientId(patientId),
        allergyService.getByPatientId(patientId)
      ])
      setPatient(patientData)
      setMedicalHistory(historyData)
      setVitals(vitalsData)
      setMedications(medicationsData)
      setAllergies(allergiesData)
      
      // Load mock documents data
      const mockDocuments = [
        {
          Id: 1,
          patientId: parseInt(patientId),
          fileName: "chest_xray_2024.jpg",
          fileType: "image/jpeg",
          fileSize: 2456789,
          documentType: "Radiology",
          uploadDate: "2024-01-15T10:30:00Z",
          description: "Chest X-ray - Annual checkup",
          uploadedBy: "Dr. Smith",
          url: "/api/documents/chest_xray_2024.jpg"
        },
        {
          Id: 2,
          patientId: parseInt(patientId),
          fileName: "blood_test_results.pdf",
          fileType: "application/pdf",
          fileSize: 892345,
          documentType: "Lab Results",
          uploadDate: "2024-01-10T14:20:00Z",
          description: "Complete Blood Count (CBC)",
          uploadedBy: "Lab Technician",
          url: "/api/documents/blood_test_results.pdf"
        },
        {
          Id: 3,
          patientId: parseInt(patientId),
          fileName: "mri_brain_scan.jpg",
          fileType: "image/jpeg",
          fileSize: 3789456,
          documentType: "Radiology",
          uploadDate: "2024-01-05T09:15:00Z",
          description: "Brain MRI - Follow-up scan",
          uploadedBy: "Dr. Johnson",
          url: "/api/documents/mri_brain_scan.jpg"
        }
      ]
      setDocuments(mockDocuments)
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

  // Medication Management Functions
  const handleAddMedication = () => {
    setEditingMedication(null)
    setShowMedicationForm(true)
  }

  const handleEditMedication = (medication) => {
    setEditingMedication(medication)
    setShowMedicationForm(true)
  }

  const handleDeleteMedication = async (medicationId) => {
    if (!window.confirm("Are you sure you want to delete this medication?")) return
    
    try {
      await medicationService.delete(medicationId)
      setMedications(prev => prev.filter(med => med.Id !== medicationId))
      toast.success("Medication deleted successfully")
    } catch (err) {
      toast.error("Failed to delete medication")
    }
  }

  const handleMedicationSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    const medicationData = {
      patientId: parseInt(patientId),
      drugName: formData.get("drugName"),
      dosage: formData.get("dosage"),
      frequency: formData.get("frequency"),
      route: formData.get("route"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate") || null,
      prescribingDoctor: formData.get("prescribingDoctor"),
      instructions: formData.get("instructions"),
      indication: formData.get("indication")
    }

    try {
      // Check for drug interactions
      const interactions = await medicationService.checkInteractions(patientId, medicationData.drugName)
      if (interactions.length > 0) {
        const proceed = window.confirm(
          `Warning: Potential drug interactions detected:\n${interactions.map(i => `- ${i.description}`).join('\n')}\n\nDo you want to continue?`
        )
        if (!proceed) return
      }

      // Check for allergies
      const allergyAlert = allergies.find(allergy => 
        allergy.allergen.toLowerCase().includes(medicationData.drugName.toLowerCase()) ||
        medicationData.drugName.toLowerCase().includes(allergy.allergen.toLowerCase())
      )
      
      if (allergyAlert) {
        const proceed = window.confirm(
          `ALLERGY ALERT: Patient has a known allergy to ${allergyAlert.allergen} (${allergyAlert.severity})\n\nDo you want to continue?`
        )
        if (!proceed) return
      }

      let result
      if (editingMedication) {
        result = await medicationService.update(editingMedication.Id, medicationData)
        setMedications(prev => prev.map(med => med.Id === editingMedication.Id ? result : med))
        toast.success("Medication updated successfully")
      } else {
        result = await medicationService.create(medicationData)
        setMedications(prev => [...prev, result])
        toast.success("Medication added successfully")
      }

      setShowMedicationForm(false)
      setEditingMedication(null)
    } catch (err) {
      toast.error("Failed to save medication")
    }
  }

  // Allergy Management Functions
  const handleAddAllergy = () => {
    setEditingAllergy(null)
    setShowAllergyForm(true)
  }

  const handleEditAllergy = (allergy) => {
    setEditingAllergy(allergy)
    setShowAllergyForm(true)
  }

  const handleDeleteAllergy = async (allergyId) => {
    if (!window.confirm("Are you sure you want to delete this allergy record?")) return
    
    try {
      await allergyService.delete(allergyId)
      setAllergies(prev => prev.filter(allergy => allergy.Id !== allergyId))
      toast.success("Allergy record deleted successfully")
    } catch (err) {
      toast.error("Failed to delete allergy record")
    }
  }

  const handleAllergySubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    const allergyData = {
      patientId: parseInt(patientId),
      allergen: formData.get("allergen"),
      reaction: formData.get("reaction"),
      severity: formData.get("severity"),
      onsetDate: formData.get("onsetDate") || null,
      notes: formData.get("notes")
    }

    try {
      let result
      if (editingAllergy) {
        result = await allergyService.update(editingAllergy.Id, allergyData)
        setAllergies(prev => prev.map(allergy => allergy.Id === editingAllergy.Id ? result : allergy))
        toast.success("Allergy record updated successfully")
      } else {
        result = await allergyService.create(allergyData)
        setAllergies(prev => [...prev, result])
        toast.success("Allergy record added successfully")
      }

      setShowAllergyForm(false)
      setEditingAllergy(null)
    } catch (err) {
      toast.error("Failed to save allergy record")
    }
  }

  const getSeverityVariant = (severity) => {
    switch (severity?.toLowerCase()) {
      case "severe": return "critical"
      case "moderate": return "warning"
      case "mild": return "info"
      default: return "secondary"
    }
}

  const getMedicationStatusVariant = (endDate) => {
    if (!endDate) return "active"
    const end = new Date(endDate)
    const now = new Date()
    return end > now ? "active" : "inactive"
  }

  // Document Management Functions
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || event.dataTransfer.files)
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`)
        return
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File type ${file.type} is not supported.`)
        return
      }
      
      // Create new document object
      const newDocument = {
        Id: Date.now() + Math.random(),
        patientId: parseInt(patientId),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        documentType: getDocumentTypeFromFile(file),
        uploadDate: new Date().toISOString(),
        description: "",
        uploadedBy: "Current User",
        url: URL.createObjectURL(file),
        file: file
      }
      
      setDocuments(prev => [newDocument, ...prev])
      toast.success(`Document ${file.name} uploaded successfully`)
    })
    
    setShowDocumentUpload(false)
    // Reset file input
    event.target.value = ''
  }

  const getDocumentTypeFromFile = (file) => {
    const fileName = file.name.toLowerCase()
    if (fileName.includes('xray') || fileName.includes('mri') || fileName.includes('ct') || fileName.includes('ultrasound')) {
      return 'Radiology'
    } else if (fileName.includes('lab') || fileName.includes('blood') || fileName.includes('urine') || fileName.includes('test')) {
      return 'Lab Results'
    } else if (fileName.includes('prescription') || fileName.includes('medication')) {
      return 'Prescriptions'
    } else if (file.type.startsWith('image/')) {
      return 'Images'
    } else {
      return 'Medical Records'
    }
  }

  const handleDocumentPreview = (document) => {
    setSelectedDocument(document)
    setShowDocumentPreview(true)
  }

  const handleDocumentDownload = (document) => {
    const link = document.createElement('a')
    link.href = document.url
    link.download = document.fileName
    link.click()
    toast.success(`Downloaded ${document.fileName}`)
  }

  const handleDocumentDelete = (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return
    
    setDocuments(prev => prev.filter(doc => doc.Id !== documentId))
    toast.success("Document deleted successfully")
  }

  const handleDocumentEdit = (document, newDescription, newType) => {
    setDocuments(prev => prev.map(doc => 
      doc.Id === document.Id 
        ? { ...doc, description: newDescription, documentType: newType }
        : doc
    ))
    toast.success("Document updated successfully")
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileUpload(e)
  }

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return 'Image'
    if (fileType === 'application/pdf') return 'FileText'
    if (fileType.includes('word')) return 'FileText'
    return 'File'
  }

  const getFileTypeVariant = (documentType) => {
    switch (documentType) {
      case 'Radiology': return 'radiology'
      case 'Lab Results': return 'lab'
      case 'Prescriptions': return 'prescription'
      case 'Images': return 'image'
      case 'Medical Records': return 'medical'
      default: return 'default'
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = documentFilter === 'all' || doc.documentType === documentFilter
    const matchesSearch = doc.fileName.toLowerCase().includes(documentSearch.toLowerCase()) ||
                         doc.description.toLowerCase().includes(documentSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const documentTypes = ['all', 'Medical Records', 'Lab Results', 'Radiology', 'Prescriptions', 'Images']
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
{/* Medications Tab */}
        {activeTab === "medications" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Current Medications</h3>
              <Button onClick={handleAddMedication} className="flex items-center gap-2">
                <ApperIcon name="Plus" size={16} />
                Add Medication
              </Button>
            </div>

            {medications.length === 0 ? (
              <Card className="text-center py-12">
                <ApperIcon name="Pill" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No medications recorded</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {medications.map((medication) => (
                  <Card key={medication.Id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{medication.drugName}</h4>
                          <Badge variant={getMedicationStatusVariant(medication.endDate)}>
                            {medication.endDate && new Date(medication.endDate) < new Date() ? "Discontinued" : "Active"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Dosage:</span>
                            <p className="text-gray-600">{medication.dosage}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Frequency:</span>
                            <p className="text-gray-600">{medication.frequency}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Start Date:</span>
                            <p className="text-gray-600">{format(new Date(medication.startDate), 'MMM dd, yyyy')}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Prescribing Doctor:</span>
                            <p className="text-gray-600">{medication.prescribingDoctor}</p>
                          </div>
                        </div>
                        {medication.instructions && (
                          <div className="mt-2">
                            <span className="font-medium text-gray-700">Instructions:</span>
                            <p className="text-gray-600">{medication.instructions}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMedication(medication)}
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMedication(medication.Id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Add/Edit Medication Modal */}
            {showMedicationForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <form onSubmit={handleMedicationSubmit} className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {editingMedication ? "Edit Medication" : "Add New Medication"}
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMedicationForm(false)}
                      >
                        <ApperIcon name="X" size={20} />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="drugName">Drug Name *</Label>
                        <Input
                          id="drugName"
                          name="drugName"
                          defaultValue={editingMedication?.drugName || ""}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="dosage">Dosage *</Label>
                        <Input
                          id="dosage"
                          name="dosage"
                          placeholder="e.g., 500mg"
                          defaultValue={editingMedication?.dosage || ""}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="frequency">Frequency *</Label>
                        <select
                          id="frequency"
                          name="frequency"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          defaultValue={editingMedication?.frequency || ""}
                          required
                        >
                          <option value="">Select frequency</option>
                          <option value="Once daily">Once daily</option>
                          <option value="Twice daily">Twice daily</option>
                          <option value="Three times daily">Three times daily</option>
                          <option value="Four times daily">Four times daily</option>
                          <option value="Every 4 hours">Every 4 hours</option>
                          <option value="Every 6 hours">Every 6 hours</option>
                          <option value="Every 8 hours">Every 8 hours</option>
                          <option value="Every 12 hours">Every 12 hours</option>
                          <option value="As needed">As needed</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="route">Route</Label>
                        <select
                          id="route"
                          name="route"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          defaultValue={editingMedication?.route || "Oral"}
                        >
                          <option value="Oral">Oral</option>
                          <option value="IV">Intravenous (IV)</option>
                          <option value="IM">Intramuscular (IM)</option>
                          <option value="SC">Subcutaneous (SC)</option>
                          <option value="Topical">Topical</option>
                          <option value="Inhalation">Inhalation</option>
                          <option value="Sublingual">Sublingual</option>
                          <option value="Rectal">Rectal</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                          id="startDate"
                          name="startDate"
                          type="date"
                          defaultValue={editingMedication?.startDate ? format(new Date(editingMedication.startDate), 'yyyy-MM-dd') : ""}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          name="endDate"
                          type="date"
                          defaultValue={editingMedication?.endDate ? format(new Date(editingMedication.endDate), 'yyyy-MM-dd') : ""}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="prescribingDoctor">Prescribing Doctor *</Label>
                        <Input
                          id="prescribingDoctor"
                          name="prescribingDoctor"
                          defaultValue={editingMedication?.prescribingDoctor || ""}
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="indication">Indication</Label>
                        <Input
                          id="indication"
                          name="indication"
                          placeholder="Reason for prescription"
                          defaultValue={editingMedication?.indication || ""}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="instructions">Instructions</Label>
                        <textarea
                          id="instructions"
                          name="instructions"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Special instructions or notes"
                          defaultValue={editingMedication?.instructions || ""}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowMedicationForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingMedication ? "Update Medication" : "Add Medication"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Allergies & Alerts Tab */}
        {activeTab === "allergies" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Allergies & Medical Alerts</h3>
              <Button onClick={handleAddAllergy} className="flex items-center gap-2">
                <ApperIcon name="Plus" size={16} />
                Add Allergy
              </Button>
            </div>

            {allergies.length === 0 ? (
              <Card className="text-center py-12">
                <ApperIcon name="AlertTriangle" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No allergies or alerts recorded</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {allergies.map((allergy) => (
                  <Card key={allergy.Id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <ApperIcon name="AlertTriangle" size={20} className="text-red-500" />
                          <h4 className="font-semibold text-gray-900">{allergy.allergen}</h4>
                          <Badge variant={getSeverityVariant(allergy.severity)}>
                            {allergy.severity} Severity
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Reaction:</span>
                            <p className="text-gray-600">{allergy.reaction}</p>
                          </div>
                          {allergy.onsetDate && (
                            <div>
                              <span className="font-medium text-gray-700">Onset Date:</span>
                              <p className="text-gray-600">{format(new Date(allergy.onsetDate), 'MMM dd, yyyy')}</p>
                            </div>
                          )}
                        </div>
                        {allergy.notes && (
                          <div className="mt-2">
                            <span className="font-medium text-gray-700">Notes:</span>
                            <p className="text-gray-600">{allergy.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAllergy(allergy)}
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAllergy(allergy.Id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Add/Edit Allergy Modal */}
            {showAllergyForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
                  <form onSubmit={handleAllergySubmit} className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {editingAllergy ? "Edit Allergy" : "Add New Allergy"}
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllergyForm(false)}
                      >
                        <ApperIcon name="X" size={20} />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="allergen">Allergen *</Label>
                        <Input
                          id="allergen"
                          name="allergen"
                          placeholder="e.g., Penicillin, Latex, Shellfish"
                          defaultValue={editingAllergy?.allergen || ""}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="reaction">Reaction *</Label>
                        <Input
                          id="reaction"
                          name="reaction"
                          placeholder="e.g., Rash, Anaphylaxis, Swelling"
                          defaultValue={editingAllergy?.reaction || ""}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="severity">Severity *</Label>
                        <select
                          id="severity"
                          name="severity"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          defaultValue={editingAllergy?.severity || ""}
                          required
                        >
                          <option value="">Select severity</option>
                          <option value="Mild">Mild</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Severe">Severe</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="onsetDate">Onset Date</Label>
                        <Input
                          id="onsetDate"
                          name="onsetDate"
                          type="date"
                          defaultValue={editingAllergy?.onsetDate ? format(new Date(editingAllergy.onsetDate), 'yyyy-MM-dd') : ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Additional notes or special considerations"
                          defaultValue={editingAllergy?.notes || ""}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowAllergyForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingAllergy ? "Update Allergy" : "Add Allergy"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
)}

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Patient Documents</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Search documents..."
                  value={documentSearch}
                  onChange={(e) => setDocumentSearch(e.target.value)}
                  className="w-full sm:w-64"
                />
                <select
                  value={documentFilter}
                  onChange={(e) => setDocumentFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {documentTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={() => setShowDocumentUpload(true)} className="flex items-center gap-2">
                <ApperIcon name="Upload" size={16} />
                Upload Document
              </Button>
            </div>
          </div>

          {/* Upload Area */}
          {showDocumentUpload && (
            <Card className="p-8">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  isDragOver ? "border-primary-500 bg-primary-50" : "border-gray-300"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <ApperIcon name="Upload" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drag and drop files here, or click to select
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports: JPG, PNG, PDF, DOC, DOCX (Max 10MB per file)
                </p>
                <div className="flex justify-center gap-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload">
                    <Button as="span" className="cursor-pointer">
                      Select Files
                    </Button>
                  </label>
                  <Button variant="ghost" onClick={() => setShowDocumentUpload(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Documents Grid */}
          {filteredDocuments.length === 0 ? (
            <Card className="text-center py-12">
              <ApperIcon name="FolderOpen" size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">
                {documents.length === 0 ? "No documents uploaded" : "No documents match your search"}
              </p>
              {documents.length === 0 && (
                <Button onClick={() => setShowDocumentUpload(true)}>
                  Upload First Document
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <Card key={document.Id} className="p-4 hover:shadow-card-hover transition-shadow">
                  <div className="space-y-3">
                    {/* Document Preview */}
                    <div 
                      className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleDocumentPreview(document)}
                    >
                      {document.fileType.startsWith('image/') ? (
                        <img
                          src={document.url}
                          alt={document.fileName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ApperIcon name={getFileIcon(document.fileType)} size={48} className="text-gray-400" />
                      )}
                    </div>

                    {/* Document Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-gray-900 text-sm truncate pr-2">
                          {document.fileName}
                        </h4>
                        <Badge variant={getFileTypeVariant(document.documentType)} className="text-xs">
                          {document.documentType}
                        </Badge>
                      </div>
                      
                      {document.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {document.description}
                        </p>
                      )}
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Size: {formatFileSize(document.fileSize)}</p>
                        <p>Uploaded: {format(new Date(document.uploadDate), 'MMM dd, yyyy')}</p>
                        <p>By: {document.uploadedBy}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDocumentPreview(document)}
                          title="Preview"
                        >
                          <ApperIcon name="Eye" size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDocumentDownload(document)}
                          title="Download"
                        >
                          <ApperIcon name="Download" size={14} />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDocumentDelete(document.Id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <ApperIcon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Document Preview Modal */}
          {showDocumentPreview && selectedDocument && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedDocument.fileName}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedDocument.documentType} • {formatFileSize(selectedDocument.fileSize)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleDocumentDownload(selectedDocument)}
                    >
                      <ApperIcon name="Download" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowDocumentPreview(false)}
                    >
                      <ApperIcon name="X" size={20} />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  {selectedDocument.fileType.startsWith('image/') ? (
                    <img
                      src={selectedDocument.url}
                      alt={selectedDocument.fileName}
                      className="w-full max-h-[70vh] object-contain rounded-lg"
                    />
                  ) : selectedDocument.fileType === 'application/pdf' ? (
                    <div className="text-center py-12">
                      <ApperIcon name="FileText" size={64} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">PDF Preview not available in demo</p>
                      <Button onClick={() => handleDocumentDownload(selectedDocument)}>
                        Download to View
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ApperIcon name="File" size={64} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                      <Button onClick={() => handleDocumentDownload(selectedDocument)}>
                        Download File
                      </Button>
                    </div>
                  )}
                  
                  {selectedDocument.description && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600">{selectedDocument.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
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