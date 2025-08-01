import patientData from "@/services/mockData/patients.json"

class PatientService {
  constructor() {
    this.patients = [...patientData]
  }
  
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.patients]
  }
  
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const patient = this.patients.find(p => p.Id === parseInt(id))
    if (!patient) {
      throw new Error("Patient not found")
    }
    return { ...patient }
  }
  
  async create(patientData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Generate new ID
    const maxId = Math.max(...this.patients.map(p => p.Id), 0)
    const newPatient = {
      ...patientData,
      Id: maxId + 1,
      lastVisit: null,
      status: "Active",
      registeredDate: new Date().toISOString()
    }
    
    this.patients.push(newPatient)
    return { ...newPatient }
  }
  
  async update(id, patientData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.patients.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Patient not found")
    }
    
    this.patients[index] = {
      ...this.patients[index],
      ...patientData,
      Id: parseInt(id) // Ensure ID doesn't change
    }
    
    return { ...this.patients[index] }
  }
  
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.patients.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Patient not found")
    }
    
const deletedPatient = this.patients.splice(index, 1)[0]
    return { ...deletedPatient }
  }

async getMedicalHistory(patientId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    // This would typically call the medical history service
    // For now, return empty array as medical history is handled by separate service
    return []
  }

  async updateMedicalHistory(patientId, medicalHistoryData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    // This would typically update medical history through separate service
    // For now, just return the data
    return medicalHistoryData
  }

  async getOutcomeTracking(patientId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    // This would integrate with outcome tracking service
    // For now, return empty array as outcomes are handled by separate service
    return []
  }

  async getMedications(patientId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    // This would typically call the medication service
    return []
  }

  async getAllergies(patientId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    // This would typically call the allergy service
    return []
  }
async getLabOrders(patientId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    // This would typically call the laboratory service
    const laboratoryService = await import('./laboratoryService.js')
    return laboratoryService.default.getOrdersByPatient(patientId)
  }

  async createLabOrder(patientId, orderData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    // This would typically create lab order through laboratory service
    const laboratoryService = await import('./laboratoryService.js')
    return laboratoryService.default.createOrder({
      ...orderData,
      patientId: parseInt(patientId)
    })
  }

  async getRadiologyOrders(patientId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    // This would typically call the radiology service
    const radiologyService = await import('./radiologyService.js')
    return radiologyService.default.getByPatient(patientId)
  }

  async createRadiologyOrder(patientId, orderData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    // This would typically create radiology order through radiology service
    const radiologyService = await import('./radiologyService.js')
    return radiologyService.default.create({
      ...orderData,
      patientId: parseInt(patientId)
    })
  }
}

export default new PatientService()