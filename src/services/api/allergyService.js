class AllergyService {
  constructor() {
    this.allergies = [
      {
        Id: 1,
        patientId: 1,
        allergen: "Penicillin",
        reaction: "Skin rash and itching",
        severity: "Moderate",
        onsetDate: "2020-03-15",
        notes: "Developed rash after taking amoxicillin"
      },
      {
        Id: 2,
        patientId: 1,
        allergen: "Shellfish",
        reaction: "Swelling of lips and throat",
        severity: "Severe",
        onsetDate: "2018-07-22",
        notes: "Requires immediate medical attention if exposed"
      },
      {
        Id: 3,
        patientId: 2,
        allergen: "Latex",
        reaction: "Contact dermatitis",
        severity: "Mild",
        onsetDate: "2021-01-10",
        notes: "Use latex-free medical supplies"
      },
      {
        Id: 4,
        patientId: 3,
        allergen: "Aspirin",
        reaction: "Gastrointestinal bleeding",
        severity: "Severe",
        onsetDate: "2019-11-05",
        notes: "Avoid all NSAIDs"
      }
    ]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.allergies]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const allergy = this.allergies.find(allergy => allergy.Id === parseInt(id))
    if (!allergy) {
      throw new Error("Allergy record not found")
    }
    return { ...allergy }
  }

  async getByPatientId(patientId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.allergies.filter(allergy => allergy.patientId === parseInt(patientId)).map(allergy => ({ ...allergy }))
  }

  async create(allergyData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const maxId = Math.max(...this.allergies.map(allergy => allergy.Id), 0)
    const newAllergy = {
      ...allergyData,
      Id: maxId + 1,
      patientId: parseInt(allergyData.patientId)
    }
    
    this.allergies.push(newAllergy)
    return { ...newAllergy }
  }

  async update(id, allergyData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.allergies.findIndex(allergy => allergy.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Allergy record not found")
    }
    
    this.allergies[index] = {
      ...this.allergies[index],
      ...allergyData,
      Id: parseInt(id),
      patientId: parseInt(allergyData.patientId)
    }
    
    return { ...this.allergies[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.allergies.findIndex(allergy => allergy.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Allergy record not found")
    }
    
    const deletedAllergy = this.allergies.splice(index, 1)[0]
    return { ...deletedAllergy }
  }

  async checkAllergyAlert(patientId, substance) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const patientAllergies = this.allergies.filter(allergy => allergy.patientId === parseInt(patientId))
    
    return patientAllergies.find(allergy => 
      allergy.allergen.toLowerCase().includes(substance.toLowerCase()) ||
      substance.toLowerCase().includes(allergy.allergen.toLowerCase())
    )
  }

  async getCriticalAllergies(patientId) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return this.allergies.filter(allergy => 
      allergy.patientId === parseInt(patientId) && 
      allergy.severity.toLowerCase() === 'severe'
    ).map(allergy => ({ ...allergy }))
  }

  async getAllergyCount(patientId) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return this.allergies.filter(allergy => allergy.patientId === parseInt(patientId)).length
  }
async checkDrugAllergy(patientId, drugName) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const patientAllergies = this.allergies.filter(allergy => allergy.patientId === parseInt(patientId))
    
    // Check for direct drug name matches and common drug class allergies
    const drugClassMap = {
      "penicillin": ["amoxicillin", "ampicillin", "penicillin"],
      "sulfa": ["sulfamethoxazole", "trimethoprim", "sulfonamide"],
      "nsaid": ["ibuprofen", "aspirin", "naproxen", "diclofenac"],
      "ace inhibitor": ["lisinopril", "enalapril", "captopril"]
    }

    const alerts = []
    
    for (const allergy of patientAllergies) {
      const allergen = allergy.allergen.toLowerCase()
      const drug = drugName.toLowerCase()
      
      // Direct match
      if (allergen.includes(drug) || drug.includes(allergen)) {
        alerts.push(allergy)
        continue
      }
      
      // Drug class match
      for (const [drugClass, drugs] of Object.entries(drugClassMap)) {
        if (allergen.includes(drugClass) && drugs.some(d => drug.includes(d))) {
          alerts.push({...allergy, crossReactivity: true})
        }
      }
    }
    
    return alerts
  }

  async getMostCriticalAllergies(patientId) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const allergies = await this.getByPatientId(patientId)
    
    return allergies
      .filter(allergy => allergy.severity.toLowerCase() === 'severe')
      .sort((a, b) => {
        const priorityOrder = ['anaphylaxis', 'respiratory', 'cardiac', 'neurological']
        const aPriority = priorityOrder.findIndex(p => a.reaction.toLowerCase().includes(p))
        const bPriority = priorityOrder.findIndex(p => b.reaction.toLowerCase().includes(p))
        
        if (aPriority === -1 && bPriority === -1) return 0
        if (aPriority === -1) return 1
        if (bPriority === -1) return -1
        return aPriority - bPriority
      })
  }
}

export default new AllergyService()