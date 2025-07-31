class MedicationService {
  constructor() {
    this.medications = [
      {
        Id: 1,
        patientId: 1,
        drugName: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        route: "Oral",
        startDate: "2024-01-15",
        endDate: null,
        prescribingDoctor: "Dr. Johnson",
        instructions: "Take with food in the morning",
        indication: "Hypertension"
      },
      {
        Id: 2,
        patientId: 1,
        drugName: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        route: "Oral",
        startDate: "2024-02-01",
        endDate: null,
        prescribingDoctor: "Dr. Smith",
        instructions: "Take with meals",
        indication: "Type 2 Diabetes"
      },
      {
        Id: 3,
        patientId: 2,
        drugName: "Aspirin",
        dosage: "81mg",
        frequency: "Once daily",
        route: "Oral",
        startDate: "2024-01-20",
        endDate: null,
        prescribingDoctor: "Dr. Brown",
        instructions: "Take with food to reduce stomach irritation",
        indication: "Cardiovascular protection"
      }
    ]

    this.drugInteractions = [
      {
        drug1: "Warfarin",
        drug2: "Aspirin",
        severity: "Major",
        description: "Increased risk of bleeding when used together"
      },
      {
        drug1: "Lisinopril",
        drug2: "Potassium",
        severity: "Moderate",
        description: "May cause hyperkalemia (high potassium levels)"
      },
      {
        drug1: "Metformin",
        drug2: "Alcohol",
        severity: "Major",
        description: "Increased risk of lactic acidosis"
      }
    ]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.medications]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const medication = this.medications.find(med => med.Id === parseInt(id))
    if (!medication) {
      throw new Error("Medication not found")
    }
    return { ...medication }
  }

  async getByPatientId(patientId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.medications.filter(med => med.patientId === parseInt(patientId)).map(med => ({ ...med }))
  }

  async create(medicationData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const maxId = Math.max(...this.medications.map(med => med.Id), 0)
    const newMedication = {
      ...medicationData,
      Id: maxId + 1,
      patientId: parseInt(medicationData.patientId)
    }
    
    this.medications.push(newMedication)
    return { ...newMedication }
  }

  async update(id, medicationData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.medications.findIndex(med => med.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Medication not found")
    }
    
    this.medications[index] = {
      ...this.medications[index],
      ...medicationData,
      Id: parseInt(id),
      patientId: parseInt(medicationData.patientId)
    }
    
    return { ...this.medications[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.medications.findIndex(med => med.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Medication not found")
    }
    
    const deletedMedication = this.medications.splice(index, 1)[0]
    return { ...deletedMedication }
  }

  async checkInteractions(patientId, newDrug) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const patientMedications = this.medications.filter(med => med.patientId === parseInt(patientId))
    const interactions = []
    
    for (const medication of patientMedications) {
      const interaction = this.drugInteractions.find(interaction => 
        (interaction.drug1.toLowerCase() === newDrug.toLowerCase() && 
         interaction.drug2.toLowerCase() === medication.drugName.toLowerCase()) ||
        (interaction.drug2.toLowerCase() === newDrug.toLowerCase() && 
         interaction.drug1.toLowerCase() === medication.drugName.toLowerCase())
      )
      
      if (interaction) {
        interactions.push({
          ...interaction,
          existingMedication: medication.drugName
        })
      }
    }
    
    return interactions
  }

  async getActiveCount(patientId) {
    await new Promise(resolve => setTimeout(resolve, 100))
    const activeMedications = this.medications.filter(med => 
      med.patientId === parseInt(patientId) && 
      (!med.endDate || new Date(med.endDate) > new Date())
    )
    return activeMedications.length
  }
}

export default new MedicationService()