// Mock vitals data
const mockVitals = [
  {
    Id: 1,
    patientId: 1,
    date: "2024-01-15T10:30:00.000Z",
    systolicBP: 120,
    diastolicBP: 80,
    temperature: 98.6,
    heartRate: 72,
    respiratoryRate: 16,
    weight: 150,
    height: 68,
    notes: "Normal readings",
    recordedBy: "Dr. Smith"
  },
  {
    Id: 2,
    patientId: 1,
    date: "2024-01-10T14:15:00.000Z",
    systolicBP: 125,
    diastolicBP: 82,
    temperature: 99.1,
    heartRate: 75,
    respiratoryRate: 18,
    weight: 151,
    height: 68,
    notes: "Slightly elevated temperature",
    recordedBy: "Nurse Johnson"
  },
  {
    Id: 3,
    patientId: 1,
    date: "2024-01-05T09:45:00.000Z",
    systolicBP: 118,
    diastolicBP: 78,
    temperature: 98.4,
    heartRate: 68,
    respiratoryRate: 15,
    weight: 149,
    height: 68,
    notes: "All vitals within normal range",
    recordedBy: "Dr. Wilson"
  },
  {
    Id: 4,
    patientId: 2,
    date: "2024-01-12T11:20:00.000Z",
    systolicBP: 140,
    diastolicBP: 90,
    temperature: 98.8,
    heartRate: 85,
    respiratoryRate: 20,
    weight: 180,
    height: 70,
    notes: "Elevated blood pressure",
    recordedBy: "Dr. Brown"
  }
]

// Normal ranges for vital signs
const normalRanges = {
  systolicBP: { min: 90, max: 120, critical: { min: 70, max: 180 } },
  diastolicBP: { min: 60, max: 80, critical: { min: 40, max: 110 } },
  temperature: { min: 97.0, max: 99.5, critical: { min: 95.0, max: 104.0 } },
  heartRate: { min: 60, max: 100, critical: { min: 40, max: 150 } },
  respiratoryRate: { min: 12, max: 20, critical: { min: 8, max: 30 } },
  weight: { min: 0, max: 1000, critical: { min: 0, max: 1000 } }, // No specific normal range
  height: { min: 0, max: 120, critical: { min: 0, max: 120 } } // No specific normal range
}

let nextId = mockVitals.length > 0 ? Math.max(...mockVitals.map(v => v.Id)) + 1 : 1

const vitalsService = {
  // Get all vitals for a patient
  getByPatientId: async (patientId) => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockVitals
      .filter(vital => vital.patientId === parseInt(patientId))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(vital => ({ ...vital }))
  },

  // Get single vital record
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 100))
    const vital = mockVitals.find(v => v.Id === parseInt(id))
    if (!vital) throw new Error('Vital record not found')
    return { ...vital }
  },

  // Create new vital record
  create: async (vitalData) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const newVital = {
      ...vitalData,
      Id: nextId++,
      patientId: parseInt(vitalData.patientId),
      date: new Date(vitalData.date).toISOString()
    }
    
    mockVitals.push(newVital)
    return { ...newVital }
  },

  // Update vital record
  update: async (id, vitalData) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = mockVitals.findIndex(v => v.Id === parseInt(id))
    if (index === -1) throw new Error('Vital record not found')
    
    mockVitals[index] = {
      ...mockVitals[index],
      ...vitalData,
      Id: parseInt(id),
      patientId: parseInt(vitalData.patientId),
      date: new Date(vitalData.date).toISOString()
    }
    
    return { ...mockVitals[index] }
  },

  // Delete vital record
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const index = mockVitals.findIndex(v => v.Id === parseInt(id))
    if (index === -1) throw new Error('Vital record not found')
    
    mockVitals.splice(index, 1)
    return true
  },

  // Check if vital signs are abnormal
  checkAbnormalValues: (vital) => {
    const alerts = []
    
    Object.keys(normalRanges).forEach(key => {
      if (vital[key] !== undefined && vital[key] !== null) {
        const value = parseFloat(vital[key])
        const range = normalRanges[key]
        
        if (value < range.critical.min || value > range.critical.max) {
          alerts.push({
            type: 'critical',
            field: key,
            value: value,
            message: `${key} is critically abnormal: ${value}`
          })
        } else if (value < range.min || value > range.max) {
          alerts.push({
            type: 'warning',
            field: key,
            value: value,
            message: `${key} is outside normal range: ${value}`
          })
        }
      }
    })
    
    return alerts
  },

  // Get normal ranges
  getNormalRanges: () => ({ ...normalRanges })
}

export default vitalsService