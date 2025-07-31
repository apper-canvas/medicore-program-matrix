// Mock medical history data
const mockMedicalHistory = [
  {
    Id: 1,
    patientId: 1,
    date: "2024-01-15T10:30:00Z",
    diagnosisCode: "E11.9",
    diagnosisName: "Type 2 diabetes mellitus without complications",
    treatmentNotes: "Patient presents with elevated glucose levels. Prescribed Metformin 500mg twice daily. Dietary counseling provided. Follow-up in 3 months for glucose monitoring.",
    attendingPhysician: "Dr. Sarah Mitchell",
    followUpRequired: true,
    followUpDate: "2024-04-15T10:30:00Z"
  },
  {
    Id: 2,
    patientId: 1,
    date: "2023-11-20T14:15:00Z",
    diagnosisCode: "Z87.891",
    diagnosisName: "Personal history of nicotine dependence",
    treatmentNotes: "Patient successfully completed smoking cessation program. Discussed strategies for maintaining smoke-free lifestyle. Lung function has improved significantly.",
    attendingPhysician: "Dr. Sarah Mitchell",
    followUpRequired: false,
    followUpDate: null
  },
  {
    Id: 3,
    patientId: 2,
    date: "2024-01-20T14:15:00Z",
    diagnosisCode: "I10",
    diagnosisName: "Essential hypertension",
    treatmentNotes: "Blood pressure reading 150/95. Increased Lisinopril to 10mg daily. Patient advised on low-sodium diet and regular exercise. Weight loss of 10 pounds recommended.",
    attendingPhysician: "Dr. Michael Johnson",
    followUpRequired: true,
    followUpDate: "2024-02-20T14:15:00Z"
  },
  {
    Id: 4,
    patientId: 3,
    date: "2024-01-18T16:45:00Z",
    diagnosisCode: "Z00.00",
    diagnosisName: "Encounter for general adult medical examination without abnormal findings",
    treatmentNotes: "Annual wellness visit. All vital signs within normal limits. Immunizations up to date. Mammography and colonoscopy screening discussed and scheduled.",
    attendingPhysician: "Dr. Emily Davis",
    followUpRequired: true,
    followUpDate: "2025-01-18T16:45:00Z"
  },
  {
    Id: 5,
    patientId: 4,
    date: "2024-01-10T08:30:00Z",
    diagnosisCode: "I25.10",
    diagnosisName: "Atherosclerotic heart disease of native coronary artery without angina pectoris",
    treatmentNotes: "Patient experiencing chest discomfort. EKG shows no acute changes. Stress test scheduled. Increased Atorvastatin to 40mg daily. Continue Carvedilol 12.5mg twice daily.",
    attendingPhysician: "Dr. Robert Thompson",
    followUpRequired: true,
    followUpDate: "2024-02-10T08:30:00Z"
  }
]

class MedicalHistoryService {
  constructor() {
    this.medicalHistory = [...mockMedicalHistory]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.medicalHistory]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const entry = this.medicalHistory.find(entry => entry.Id === parseInt(id))
    if (!entry) {
      throw new Error("Medical history entry not found")
    }
    return { ...entry }
  }

  async getByPatientId(patientId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const entries = this.medicalHistory
      .filter(entry => entry.patientId === parseInt(patientId))
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
    return entries.map(entry => ({ ...entry }))
  }

  async create(entryData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Generate new ID
    const maxId = Math.max(...this.medicalHistory.map(entry => entry.Id), 0)
    const newEntry = {
      ...entryData,
      Id: maxId + 1
    }
    
    this.medicalHistory.push(newEntry)
    return { ...newEntry }
  }

  async update(id, entryData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.medicalHistory.findIndex(entry => entry.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Medical history entry not found")
    }
    
    this.medicalHistory[index] = {
      ...this.medicalHistory[index],
      ...entryData,
      Id: parseInt(id) // Ensure ID doesn't change
    }
    
    return { ...this.medicalHistory[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.medicalHistory.findIndex(entry => entry.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Medical history entry not found")
    }
    
    const deletedEntry = this.medicalHistory.splice(index, 1)[0]
    return { ...deletedEntry }
}

  async getOutcomesByPatientId(patientId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    // This would integrate with outcome tracking service
    // For now, return empty array as outcomes are handled by separate service
    return []
  }

  async createOutcomeRecord(patientId, medicalHistoryId, outcomeData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    // This would create an outcome record linked to medical history
    // For now, just return the data
    return { ...outcomeData, patientId, medicalHistoryId }
  }
}

export default new MedicalHistoryService()