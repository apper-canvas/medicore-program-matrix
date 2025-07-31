// Mock outcome tracking data
const mockOutcomes = [
  {
    Id: 1,
    patientId: 1,
    medicalHistoryId: 1,
    diagnosisCode: "E11.9",
    diagnosisName: "Type 2 diabetes mellitus without complications",
    treatmentProtocol: "Metformin therapy with lifestyle modification",
    startDate: "2024-01-15T10:30:00Z",
    followUpDate: "2024-04-15T10:30:00Z",
    outcomeStatus: "Improved",
    outcomeMetrics: {
      hba1c: { baseline: 8.2, current: 7.1, target: 7.0 },
      weight: { baseline: 185, current: 175, target: 170 },
      bloodPressure: { baseline: "140/90", current: "130/85", target: "130/80" }
    },
    treatmentAdherence: 85,
    qualityOfLife: 8,
    complications: [],
    notes: "Patient showing excellent response to treatment. HbA1c reduced significantly. Continue current protocol.",
    nextReviewDate: "2024-07-15T10:30:00Z",
    attendingPhysician: "Dr. Sarah Mitchell"
  },
  {
    Id: 2,
    patientId: 2,
    medicalHistoryId: 3,
    diagnosisCode: "I10",
    diagnosisName: "Essential hypertension",
    treatmentProtocol: "ACE inhibitor therapy with dietary modification",
    startDate: "2024-01-20T14:15:00Z",
    followUpDate: "2024-02-20T14:15:00Z",
    outcomeStatus: "Stable",
    outcomeMetrics: {
      bloodPressure: { baseline: "150/95", current: "140/88", target: "130/80" },
      weight: { baseline: 195, current: 190, target: 180 },
      sodiumIntake: { baseline: 3500, current: 2800, target: 2300 }
    },
    treatmentAdherence: 70,
    qualityOfLife: 6,
    complications: [],
    notes: "Partial response to treatment. Blood pressure moderately improved. Consider lifestyle counseling.",
    nextReviewDate: "2024-05-20T14:15:00Z",
    attendingPhysician: "Dr. Michael Johnson"
  },
  {
    Id: 3,
    patientId: 4,
    medicalHistoryId: 5,
    diagnosisCode: "I25.10",
    diagnosisName: "Atherosclerotic heart disease of native coronary artery without angina pectoris",
    treatmentProtocol: "Dual antiplatelet therapy with statin optimization",
    startDate: "2024-01-10T08:30:00Z",
    followUpDate: "2024-02-10T08:30:00Z",
    outcomeStatus: "Improved",
    outcomeMetrics: {
      ldlCholesterol: { baseline: 165, current: 95, target: 70 },
      exerciseTolerance: { baseline: 3, current: 6, target: 8 },
      chestPainFrequency: { baseline: 5, current: 1, target: 0 }
    },
    treatmentAdherence: 90,
    qualityOfLife: 7,
    complications: [],
    notes: "Good response to therapy. LDL significantly reduced. Exercise tolerance improving. Continue current regimen.",
    nextReviewDate: "2024-05-10T08:30:00Z",
    attendingPhysician: "Dr. Robert Thompson"
  }
]

const mockProtocolEffectiveness = [
  {
    diagnosisCode: "E11.9",
    diagnosisName: "Type 2 diabetes mellitus",
    protocols: [
      {
        name: "Metformin therapy with lifestyle modification",
        totalPatients: 45,
        improvedOutcomes: 38,
        stableOutcomes: 5,
        worsenedOutcomes: 2,
        successRate: 84.4,
        averageAdherence: 82,
        averageQualityOfLife: 7.8
      },
      {
        name: "Insulin therapy with monitoring",
        totalPatients: 23,
        improvedOutcomes: 18,
        stableOutcomes: 4,
        worsenedOutcomes: 1,
        successRate: 78.3,
        averageAdherence: 75,
        averageQualityOfLife: 7.2
      }
    ]
  },
  {
    diagnosisCode: "I10",
    diagnosisName: "Essential hypertension",
    protocols: [
      {
        name: "ACE inhibitor therapy with dietary modification",
        totalPatients: 67,
        improvedOutcomes: 52,
        stableOutcomes: 12,
        worsenedOutcomes: 3,
        successRate: 77.6,
        averageAdherence: 71,
        averageQualityOfLife: 6.9
      },
      {
        name: "Combination therapy (ACE + Diuretic)",
        totalPatients: 34,
        improvedOutcomes: 29,
        stableOutcomes: 4,
        worsenedOutcomes: 1,
        successRate: 85.3,
        averageAdherence: 78,
        averageQualityOfLife: 7.4
      }
    ]
  }
]

class OutcomeTrackingService {
  constructor() {
    this.outcomes = [...mockOutcomes]
    this.protocolEffectiveness = [...mockProtocolEffectiveness]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.outcomes]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const outcome = this.outcomes.find(outcome => outcome.Id === parseInt(id))
    if (!outcome) {
      throw new Error("Outcome record not found")
    }
    return { ...outcome }
  }

  async getByPatientId(patientId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const outcomes = this.outcomes
      .filter(outcome => outcome.patientId === parseInt(patientId))
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    return outcomes.map(outcome => ({ ...outcome }))
  }

  async getByDiagnosis(diagnosisCode) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const outcomes = this.outcomes
      .filter(outcome => outcome.diagnosisCode === diagnosisCode)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    return outcomes.map(outcome => ({ ...outcome }))
  }

  async create(outcomeData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const maxId = Math.max(...this.outcomes.map(outcome => outcome.Id), 0)
    const newOutcome = {
      ...outcomeData,
      Id: maxId + 1
    }
    
    this.outcomes.push(newOutcome)
    return { ...newOutcome }
  }

  async update(id, outcomeData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.outcomes.findIndex(outcome => outcome.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Outcome record not found")
    }
    
    this.outcomes[index] = {
      ...this.outcomes[index],
      ...outcomeData,
      Id: parseInt(id)
    }
    
    return { ...this.outcomes[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.outcomes.findIndex(outcome => outcome.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Outcome record not found")
    }
    
    const deletedOutcome = this.outcomes.splice(index, 1)[0]
    return { ...deletedOutcome }
  }

  async getOutcomesByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const outcomes = this.outcomes
      .filter(outcome => outcome.outcomeStatus === status)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    return outcomes.map(outcome => ({ ...outcome }))
  }

  async getProtocolEffectiveness() {
    await new Promise(resolve => setTimeout(resolve, 400))
    return [...this.protocolEffectiveness]
  }

  async getOutcomeAnalytics() {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const totalOutcomes = this.outcomes.length
    const improvedCount = this.outcomes.filter(o => o.outcomeStatus === 'Improved').length
    const stableCount = this.outcomes.filter(o => o.outcomeStatus === 'Stable').length
    const worsenedCount = this.outcomes.filter(o => o.outcomeStatus === 'Worsened').length
    
    const avgAdherence = this.outcomes.reduce((sum, o) => sum + o.treatmentAdherence, 0) / totalOutcomes
    const avgQualityOfLife = this.outcomes.reduce((sum, o) => sum + o.qualityOfLife, 0) / totalOutcomes
    
    return {
      totalOutcomes,
      outcomes: {
        improved: improvedCount,
        stable: stableCount,
        worsened: worsenedCount,
        improvedPercentage: ((improvedCount / totalOutcomes) * 100).toFixed(1),
        stablePercentage: ((stableCount / totalOutcomes) * 100).toFixed(1),
        worsenedPercentage: ((worsenedCount / totalOutcomes) * 100).toFixed(1)
      },
      averageAdherence: Math.round(avgAdherence),
      averageQualityOfLife: avgQualityOfLife.toFixed(1),
      upcomingReviews: this.outcomes.filter(o => {
        const reviewDate = new Date(o.nextReviewDate)
        const today = new Date()
        const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000))
        return reviewDate >= today && reviewDate <= thirtyDaysFromNow
      }).length
    }
  }
}

export default new OutcomeTrackingService()