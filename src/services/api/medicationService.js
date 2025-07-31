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

  async getInventory() {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const mockInventory = [
      {
        Id: 1,
        drugName: "Lisinopril",
        ndc: "12345-0001-01",
        manufacturer: "Generic Pharma",
        dosageForm: "Tablet",
        strength: "10mg",
        currentStock: 5,
        reorderPoint: 20,
        maxStock: 100,
        unit: "bottles",
        expiryDate: "2024-06-15",
        location: "Shelf A-1",
        lotNumber: "LOT123456",
        costPerUnit: 15.50
      },
      {
        Id: 2,
        drugName: "Metformin",
        ndc: "12345-0002-01",
        manufacturer: "Diabetes Care Inc",
        dosageForm: "Tablet",
        strength: "500mg",
        currentStock: 45,
        reorderPoint: 30,
        maxStock: 200,
        unit: "bottles",
        expiryDate: "2025-01-20",
        location: "Shelf B-2",
        lotNumber: "LOT789012",
        costPerUnit: 12.75
      },
      {
        Id: 3,
        drugName: "Amoxicillin",
        ndc: "12345-0003-01",
        manufacturer: "Antibiotic Labs",
        dosageForm: "Capsule",
        strength: "250mg",
        currentStock: 0,
        reorderPoint: 15,
        maxStock: 75,
        unit: "bottles",
        expiryDate: "2024-03-10",
        location: "Shelf C-1",
        lotNumber: "LOT345678",
        costPerUnit: 18.25
      },
      {
        Id: 4,
        drugName: "Simvastatin",
        ndc: "12345-0004-01",
        manufacturer: "Cardio Meds",
        dosageForm: "Tablet",
        strength: "20mg",
        currentStock: 25,
        reorderPoint: 10,
        maxStock: 60,
        unit: "bottles",
        expiryDate: "2024-04-30",
        location: "Shelf A-3",
        lotNumber: "LOT901234",
        costPerUnit: 22.00
      },
      {
        Id: 5,
        drugName: "Hydrochlorothiazide",
        ndc: "12345-0005-01",
        manufacturer: "Diuretic Corp",
        dosageForm: "Tablet",
        strength: "25mg",
        currentStock: 8,
        reorderPoint: 12,
        maxStock: 50,
        unit: "bottles",
        expiryDate: "2024-05-15",
        location: "Shelf B-1",
        lotNumber: "LOT567890",
        costPerUnit: 9.75
      }
    ]
    
    return mockInventory
  }

  async getInventoryStats() {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const inventory = await this.getInventory()
    const now = new Date()
    
    const stats = {
      totalItems: inventory.length,
      lowStock: inventory.filter(item => item.currentStock <= item.reorderPoint).length,
      outOfStock: inventory.filter(item => item.currentStock === 0).length,
      expiringSoon: inventory.filter(item => {
        const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - now) / (1000 * 60 * 60 * 24))
        return daysUntilExpiry <= 90 && daysUntilExpiry > 0
      }).length,
      totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0)
    }
    
    return stats
  }

  async updateStock(drugId, newStock) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!drugId || newStock < 0) {
      throw new Error("Invalid drug ID or stock quantity")
    }
    
    return {
      success: true,
      message: "Stock updated successfully"
    }
  }

  async setReorderPoint(drugId, reorderPoint) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!drugId || reorderPoint < 0) {
      throw new Error("Invalid drug ID or reorder point")
    }
    
    return {
      success: true,
      message: "Reorder point updated successfully"
    }
  }

  async checkLowStock() {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const inventory = await this.getInventory()
    return inventory.filter(item => item.currentStock <= item.reorderPoint)
  }

  async getExpiringDrugs(days = 90) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const inventory = await this.getInventory()
    const now = new Date()
    
    return inventory.filter(item => {
      const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - now) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry <= days && daysUntilExpiry > 0
    })
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
  
  async searchDrugs(query) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Mock drug database for search
    const drugDatabase = [
      { name: "Lisinopril", genericName: "Lisinopril", commonDosage: "10mg", category: "ACE Inhibitor" },
      { name: "Metformin", genericName: "Metformin", commonDosage: "500mg", category: "Antidiabetic" },
      { name: "Aspirin", genericName: "Acetylsalicylic Acid", commonDosage: "81mg", category: "NSAID" },
      { name: "Atorvastatin", genericName: "Atorvastatin", commonDosage: "20mg", category: "Statin" },
      { name: "Amlodipine", genericName: "Amlodipine", commonDosage: "5mg", category: "Calcium Channel Blocker" },
      { name: "Omeprazole", genericName: "Omeprazole", commonDosage: "20mg", category: "PPI" },
      { name: "Levothyroxine", genericName: "Levothyroxine", commonDosage: "50mcg", category: "Thyroid Hormone" },
      { name: "Albuterol", genericName: "Albuterol", commonDosage: "90mcg", category: "Bronchodilator" },
      { name: "Warfarin", genericName: "Warfarin", commonDosage: "5mg", category: "Anticoagulant" },
      { name: "Prednisone", genericName: "Prednisone", commonDosage: "10mg", category: "Corticosteroid" },
      { name: "Amoxicillin", genericName: "Amoxicillin", commonDosage: "500mg", category: "Antibiotic" },
      { name: "Ibuprofen", genericName: "Ibuprofen", commonDosage: "400mg", category: "NSAID" },
      { name: "Acetaminophen", genericName: "Acetaminophen", commonDosage: "500mg", category: "Analgesic" },
      { name: "Hydrochlorothiazide", genericName: "Hydrochlorothiazide", commonDosage: "25mg", category: "Diuretic" },
      { name: "Furosemide", genericName: "Furosemide", commonDosage: "40mg", category: "Loop Diuretic" }
    ]

    return drugDatabase.filter(drug => 
      drug.name.toLowerCase().includes(query.toLowerCase()) ||
      drug.genericName.toLowerCase().includes(query.toLowerCase()) ||
      drug.category.toLowerCase().includes(query.toLowerCase())
    )
  }

  async calculateDosage(drugName, patientWeight, patientAge) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Simplified dosage calculation logic
    const calculations = {
      "ibuprofen": {
        adult: "400-600mg every 6-8 hours",
        pediatric: "10mg/kg every 6-8 hours"
      },
      "acetaminophen": {
        adult: "500-1000mg every 4-6 hours",
        pediatric: "10-15mg/kg every 4-6 hours"
      },
      "amoxicillin": {
        adult: "500mg every 8 hours",
        pediatric: "25-45mg/kg/day divided every 8 hours"
      }
    }

    const drugKey = drugName.toLowerCase()
    const ageGroup = patientAge < 18 ? 'pediatric' : 'adult'
    
    return calculations[drugKey]?.[ageGroup] || "Consult prescribing information"
  }
}

export default new MedicationService()