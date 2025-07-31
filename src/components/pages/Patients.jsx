import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import PatientTable from "@/components/organisms/PatientTable"
import PatientRegistrationModal from "@/components/organisms/PatientRegistrationModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import patientService from "@/services/api/patientService"

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  
  const loadPatients = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await patientService.getAll()
      setPatients(data)
      setFilteredPatients(data)
    } catch (err) {
      setError("Failed to load patients. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadPatients()
  }, [])
  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPatients(patients)
    } else {
      const filtered = patients.filter(patient => {
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
        const searchLower = searchTerm.toLowerCase()
        
        return (
          fullName.includes(searchLower) ||
          patient.Id.toString().includes(searchLower) ||
          patient.phone.includes(searchTerm) ||
          patient.email.toLowerCase().includes(searchLower)
        )
      })
      setFilteredPatients(filtered)
    }
  }, [searchTerm, patients])
  
  const handleAddPatient = () => {
    setEditingPatient(null)
    setIsModalOpen(true)
  }
  
  const handleEditPatient = (patient) => {
    setEditingPatient(patient)
    setIsModalOpen(true)
  }
  
  const handleViewPatient = (patient) => {
    toast.info(`Viewing details for ${patient.firstName} ${patient.lastName}`)
  }
  
  const handleSubmitPatient = async (patientData) => {
    try {
      if (editingPatient) {
        const updatedPatient = await patientService.update(editingPatient.Id, patientData)
        setPatients(prev => prev.map(p => p.Id === editingPatient.Id ? updatedPatient : p))
        toast.success("Patient updated successfully!")
      } else {
        const newPatient = await patientService.create(patientData)
        setPatients(prev => [...prev, newPatient])
        toast.success(`Patient registered successfully! Patient ID: #${newPatient.Id.toString().padStart(4, "0")}`)
      }
      setIsModalOpen(false)
      setEditingPatient(null)
    } catch (err) {
      toast.error("Failed to save patient. Please try again.")
    }
  }
  
  if (loading) {
    return <Loading />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadPatients} />
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600 mt-1">Manage patient records and registrations</p>
        </div>
        <Button onClick={handleAddPatient} variant="primary">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>
      
      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar
          placeholder="Search by name, ID, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-96"
        />
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Total: {patients.length}</span>
          <span>•</span>
          <span>Showing: {filteredPatients.length}</span>
        </div>
      </div>
      
      {/* Patient Table */}
      {filteredPatients.length === 0 && patients.length === 0 ? (
        <Empty
          title="No patients registered"
          description="Start by registering your first patient to manage medical records"
          actionLabel="Register Patient"
          onAction={handleAddPatient}
          icon="Users"
        />
      ) : (
        <PatientTable
          patients={filteredPatients}
          onEdit={handleEditPatient}
          onView={handleViewPatient}
        />
      )}
      
      {/* Registration Modal */}
      <PatientRegistrationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingPatient(null)
        }}
        onSubmit={handleSubmitPatient}
        patient={editingPatient}
      />
    </div>
  )
}

export default Patients