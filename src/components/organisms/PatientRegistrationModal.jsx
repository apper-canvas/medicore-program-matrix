import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import { cn } from "@/utils/cn"

const PatientRegistrationModal = ({ isOpen, onClose, onSubmit, patient = null }) => {
  const [activeTab, setActiveTab] = useState("demographics")
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    },
    insuranceProvider: "",
    policyNumber: "",
    coverageType: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: ""
    },
    medicalAlerts: []
  })
  
  const [errors, setErrors] = useState({})
  const [alertInput, setAlertInput] = useState("")
  
  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        dateOfBirth: patient.dateOfBirth || "",
        gender: patient.gender || "",
        phone: patient.phone || "",
        email: patient.email || "",
        address: patient.address || {
          street: "",
          city: "",
          state: "",
          zipCode: ""
        },
        insuranceProvider: patient.insuranceProvider || "",
        policyNumber: patient.policyNumber || "",
        coverageType: patient.coverageType || "",
        emergencyContact: patient.emergencyContact || {
          name: "",
          relationship: "",
          phone: ""
        },
        medicalAlerts: patient.medicalAlerts || []
      })
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        email: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: ""
        },
        insuranceProvider: "",
        policyNumber: "",
        coverageType: "",
        emergencyContact: {
          name: "",
          relationship: "",
          phone: ""
        },
        medicalAlerts: []
      })
    }
    setErrors({})
    setActiveTab("demographics")
    setAlertInput("")
  }, [patient, isOpen])
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }
  
  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }))
  }
  
  const handleEmergencyContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }))
  }
  
  const handleAddAlert = () => {
    if (alertInput.trim()) {
      setFormData(prev => ({
        ...prev,
        medicalAlerts: [...prev.medicalAlerts, alertInput.trim()]
      }))
      setAlertInput("")
    }
  }
  
  const handleRemoveAlert = (index) => {
    setFormData(prev => ({
      ...prev,
      medicalAlerts: prev.medicalAlerts.filter((_, i) => i !== index)
    }))
  }
  
  const tabs = [
    { id: "demographics", label: "Demographics", icon: "User" },
    { id: "insurance", label: "Insurance", icon: "Shield" },
    { id: "emergency", label: "Emergency Contact", icon: "Phone" },
    { id: "medical", label: "Medical Alerts", icon: "AlertTriangle" }
  ]
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-elevated rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {patient ? "Edit Patient" : "Register New Patient"}
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Demographics Tab */}
            {activeTab === "demographics" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="First Name"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  error={errors.firstName}
                />
                
                <FormField
                  label="Last Name"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  error={errors.lastName}
                />
                
                <FormField
                  label="Date of Birth"
                  required
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  error={errors.dateOfBirth}
                />
                
                <FormField
                  label="Gender"
                  required
                  error={errors.gender}
                >
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </FormField>
                
                <FormField
                  label="Phone Number"
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={errors.phone}
                />
                
                <FormField
                  label="Email Address"
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={errors.email}
                />
                
                <div className="md:col-span-2">
                  <FormField
                    label="Street Address"
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange("street", e.target.value)}
                  />
                </div>
                
                <FormField
                  label="City"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                />
                
                <FormField
                  label="State"
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                />
                
                <FormField
                  label="ZIP Code"
                  value={formData.address.zipCode}
                  onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                />
              </div>
            )}
            
            {/* Insurance Tab */}
            {activeTab === "insurance" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Insurance Provider"
                  value={formData.insuranceProvider}
                  onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                />
                
                <FormField
                  label="Policy Number"
                  value={formData.policyNumber}
                  onChange={(e) => handleInputChange("policyNumber", e.target.value)}
                />
                
                <FormField
                  label="Coverage Type"
                >
                  <select
                    value={formData.coverageType}
                    onChange={(e) => handleInputChange("coverageType", e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select Coverage Type</option>
                    <option value="Individual">Individual</option>
                    <option value="Family">Family</option>
                    <option value="Group">Group</option>
                  </select>
                </FormField>
              </div>
            )}
            
            {/* Emergency Contact Tab */}
            {activeTab === "emergency" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Contact Name"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                />
                
                <FormField
                  label="Relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => handleEmergencyContactChange("relationship", e.target.value)}
                />
                
                <FormField
                  label="Phone Number"
                  type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                />
              </div>
            )}
            
            {/* Medical Alerts Tab */}
            {activeTab === "medical" && (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <FormField
                    label="Add Medical Alert"
                    placeholder="Enter allergy, condition, or medical note"
                    value={alertInput}
                    onChange={(e) => setAlertInput(e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={handleAddAlert}
                      disabled={!alertInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                {formData.medicalAlerts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Current Alerts:</h4>
                    {formData.medicalAlerts.map((alert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md">
                        <span className="text-red-800">{alert}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAlert(index)}
                        >
                          <ApperIcon name="X" className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {patient ? "Update Patient" : "Register Patient"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PatientRegistrationModal