class PrescriptionService {
  constructor() {
    this.prescriptions = [
      {
        Id: 1,
        prescriptionNumber: "RX001234",
        patientId: 1,
        patientName: "John Smith",
        doctorId: 1,
        doctorName: "Dr. Johnson",
        medications: [
          {
            drugName: "Lisinopril",
            dosage: "10mg",
            quantity: 30,
            frequency: "Once daily",
            route: "Oral",
            instructions: "Take with food in the morning",
            ndc: "0781-1506-01",
            daysSupply: 30
          }
        ],
        dateReceived: "2024-01-15T10:30:00Z",
        status: "Pending",
        priority: "Normal",
        insurance: {
          provider: "Blue Cross Blue Shield",
          policyNumber: "BC123456789",
          groupNumber: "GRP001"
        },
        prescribedDate: "2024-01-15T09:00:00Z",
        notes: "",
        interactions: [],
        allergies: [],
        dispensedBy: null,
        dispensedDate: null,
        counseledBy: null,
        counseledDate: null,
        pickupReminders: 0,
        adherenceScore: null
      },
      {
        Id: 2,
        prescriptionNumber: "RX001235",
        patientId: 2,
        patientName: "Sarah Johnson",
        doctorId: 2,
        doctorName: "Dr. Smith",
        medications: [
          {
            drugName: "Metformin",
            dosage: "500mg",
            quantity: 60,
            frequency: "Twice daily",
            route: "Oral",
            instructions: "Take with meals",
            ndc: "0093-1075-01",
            daysSupply: 30
          },
          {
            drugName: "Aspirin",
            dosage: "81mg",
            quantity: 30,
            frequency: "Once daily",
            route: "Oral",
            instructions: "Take with food",
            ndc: "0536-1010-01",
            daysSupply: 30
          }
        ],
        dateReceived: "2024-01-15T11:45:00Z",
        status: "Verified",
        priority: "High",
        insurance: {
          provider: "Aetna",
          policyNumber: "AET987654321",
          groupNumber: "GRP002"
        },
        prescribedDate: "2024-01-15T10:30:00Z",
        notes: "Patient has diabetes - monitor blood sugar",
        interactions: [],
        allergies: ["Shellfish"],
        dispensedBy: null,
        dispensedDate: null,
        counseledBy: null,
        counseledDate: null,
        pickupReminders: 1,
        adherenceScore: 85
      },
      {
        Id: 3,
        prescriptionNumber: "RX001236",
        patientId: 3,
        patientName: "Michael Brown",
        doctorId: 1,
        doctorName: "Dr. Johnson",
        medications: [
          {
            drugName: "Warfarin",
            dosage: "5mg",
            quantity: 30,
            frequency: "Once daily",
            route: "Oral",
            instructions: "Take at same time daily, monitor INR",
            ndc: "0056-0173-70",
            daysSupply: 30
          }
        ],
        dateReceived: "2024-01-15T14:20:00Z",
        status: "Dispensed",
        priority: "Critical",
        insurance: {
          provider: "Medicare",
          policyNumber: "1EG4-TE5-MK73",
          groupNumber: "MEDICARE"
        },
        prescribedDate: "2024-01-15T13:00:00Z",
        notes: "Requires regular INR monitoring",
        interactions: [
          {
            drug1: "Warfarin",
            drug2: "Aspirin",
            severity: "Major",
            description: "Increased bleeding risk"
          }
        ],
        allergies: [],
        dispensedBy: "John Pharmacist",
        dispensedDate: "2024-01-15T15:30:00Z",
        counseledBy: null,
        counseledDate: null,
        pickupReminders: 0,
        adherenceScore: 92
      }
    ]

    this.dispensingLog = [
      {
        Id: 1,
        prescriptionId: 3,
        medication: "Warfarin 5mg",
        quantityDispensed: 30,
        lotNumber: "LOT12345",
        expirationDate: "2025-12-31",
        dispensedBy: "John Pharmacist",
        dispensedDate: "2024-01-15T15:30:00Z",
        barcodeScanned: true,
        verificationSteps: [
          "Patient identity verified",
          "Prescription reviewed",
          "Drug interactions checked",
          "Allergy alerts reviewed",
          "Medication verified via barcode",
          "Quantity counted and verified"
        ]
      }
    ]

    this.counselingNotes = [
      {
        Id: 1,
        prescriptionId: 3,
        patientId: 3,
        counseledBy: "Jane Pharmacist",
        counselingDate: "2024-01-15T16:00:00Z",
        topics: [
          "Medication purpose and benefits",
          "Proper dosing schedule",
          "Food and drug interactions",
          "Side effects to monitor",
          "When to contact doctor"
        ],
        patientQuestions: [
          "Can I take this with my vitamins?",
          "What if I miss a dose?"
        ],
        responses: [
          "Discussed vitamin interactions, recommended 2-hour separation",
          "Explained importance of not doubling doses, take as soon as remembered if within 12 hours"
        ],
        adherenceDiscussion: "Patient expressed understanding of medication importance. Discussed use of pill reminder app.",
        followUpNeeded: true,
        followUpDate: "2024-01-22",
        patientUnderstood: true
      }
    ]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.prescriptions]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const prescription = this.prescriptions.find(p => p.Id === parseInt(id))
    if (!prescription) {
      throw new Error("Prescription not found")
    }
    return { ...prescription }
  }

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.prescriptions.filter(p => p.status === status).map(p => ({ ...p }))
  }

  async getByPatient(patientId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.prescriptions.filter(p => p.patientId === parseInt(patientId)).map(p => ({ ...p }))
  }

  async create(prescriptionData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const maxId = Math.max(...this.prescriptions.map(p => p.Id), 0)
    const newPrescription = {
      ...prescriptionData,
      Id: maxId + 1,
      prescriptionNumber: `RX${String(maxId + 1).padStart(6, '0')}`,
      dateReceived: new Date().toISOString(),
      status: "Pending",
      interactions: [],
      allergies: [],
      dispensedBy: null,
      dispensedDate: null,
      counseledBy: null,
      counseledDate: null,
      pickupReminders: 0,
      adherenceScore: null
    }
    
    this.prescriptions.push(newPrescription)
    return { ...newPrescription }
  }

  async update(id, prescriptionData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.prescriptions.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Prescription not found")
    }
    
    this.prescriptions[index] = {
      ...this.prescriptions[index],
      ...prescriptionData,
      Id: parseInt(id)
    }
    
    return { ...this.prescriptions[index] }
  }

  async updateStatus(id, status, userId = null) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.prescriptions.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Prescription not found")
    }

    const updates = { status }
    
    if (status === "Dispensed" && userId) {
      updates.dispensedBy = userId
      updates.dispensedDate = new Date().toISOString()
    } else if (status === "Counseled" && userId) {
      updates.counseledBy = userId
      updates.counseledDate = new Date().toISOString()
    }
    
    this.prescriptions[index] = {
      ...this.prescriptions[index],
      ...updates
    }
    
    return { ...this.prescriptions[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.prescriptions.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Prescription not found")
    }
    
    const deletedPrescription = this.prescriptions.splice(index, 1)[0]
    return { ...deletedPrescription }
  }

  async checkInteractions(prescriptionId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const prescription = await this.getById(prescriptionId)
    if (!prescription) return []

    // Import medication service for interaction checking
    const medicationService = await import('./medicationService.js')
    const interactions = []

    // Get patient's current medications
    const patientMedications = await medicationService.default.getByPatientId(prescription.patientId)

    // Check interactions between prescribed medications and current medications
    for (const prescribedMed of prescription.medications) {
      for (const currentMed of patientMedications) {
        const interaction = await medicationService.default.checkInteractions(
          prescription.patientId,
          prescribedMed.drugName
        )
        interactions.push(...interaction)
      }
    }

    // Update prescription with interactions
    await this.update(prescriptionId, { interactions })
    
    return interactions
  }

  async checkAllergies(prescriptionId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const prescription = await this.getById(prescriptionId)
    if (!prescription) return []

    // Import allergy service
    const allergyService = await import('./allergyService.js')
    const allergyAlerts = []

    // Check each prescribed medication against patient allergies
    for (const medication of prescription.medications) {
      const alerts = await allergyService.default.checkDrugAllergy(
        prescription.patientId,
        medication.drugName
      )
      allergyAlerts.push(...alerts)
    }

    // Update prescription with allergy information
    const allergyList = allergyAlerts.map(alert => alert.allergen)
    await this.update(prescriptionId, { allergies: allergyList })
    
    return allergyAlerts
  }

  async verifyPrescription(prescriptionId) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Run all verification checks
    const interactions = await this.checkInteractions(prescriptionId)
    const allergies = await this.checkAllergies(prescriptionId)
    
    // Update status to verified if no critical issues
    const hasCriticalIssues = interactions.some(i => i.severity === 'Major') ||
                             allergies.some(a => a.severity === 'Severe')
    
    const newStatus = hasCriticalIssues ? "Requires Review" : "Verified"
    return await this.updateStatus(prescriptionId, newStatus)
  }

  async scanBarcode(ndc, expectedMedication) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate barcode scanning verification
    const isMatch = ndc === expectedMedication.ndc
    
    return {
      scanned: true,
      ndc,
      verified: isMatch,
      medication: isMatch ? expectedMedication : null,
      timestamp: new Date().toISOString()
    }
  }

  async dispenseMedication(prescriptionId, dispensingData) {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const prescription = await this.getById(prescriptionId)
    if (!prescription) {
      throw new Error("Prescription not found")
    }

    // Create dispensing log entry
    const maxLogId = Math.max(...this.dispensingLog.map(log => log.Id), 0)
    const logEntry = {
      Id: maxLogId + 1,
      prescriptionId: parseInt(prescriptionId),
      medication: `${dispensingData.drugName} ${dispensingData.dosage}`,
      quantityDispensed: dispensingData.quantity,
      lotNumber: dispensingData.lotNumber,
      expirationDate: dispensingData.expirationDate,
      dispensedBy: dispensingData.dispensedBy,
      dispensedDate: new Date().toISOString(),
      barcodeScanned: dispensingData.barcodeVerified || false,
      verificationSteps: dispensingData.verificationSteps || []
    }

    this.dispensingLog.push(logEntry)

    // Update prescription status
    await this.updateStatus(prescriptionId, "Dispensed", dispensingData.dispensedBy)
    
    return logEntry
  }

  async addCounselingNotes(prescriptionId, counselingData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const maxId = Math.max(...this.counselingNotes.map(note => note.Id), 0)
    const counselingNote = {
      Id: maxId + 1,
      prescriptionId: parseInt(prescriptionId),
      patientId: counselingData.patientId,
      counseledBy: counselingData.counseledBy,
      counselingDate: new Date().toISOString(),
      topics: counselingData.topics || [],
      patientQuestions: counselingData.patientQuestions || [],
      responses: counselingData.responses || [],
      adherenceDiscussion: counselingData.adherenceDiscussion || "",
      followUpNeeded: counselingData.followUpNeeded || false,
      followUpDate: counselingData.followUpDate || null,
      patientUnderstood: counselingData.patientUnderstood || false
    }

    this.counselingNotes.push(counselingNote)

    // Update prescription status
    await this.updateStatus(prescriptionId, "Counseled", counselingData.counseledBy)
    
    return counselingNote
  }

  async getCounselingNotes(prescriptionId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.counselingNotes.filter(note => note.prescriptionId === parseInt(prescriptionId))
  }

  async getDispensingLog(prescriptionId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.dispensingLog.filter(log => log.prescriptionId === parseInt(prescriptionId))
  }

  async updateAdherenceScore(prescriptionId, score) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return await this.update(prescriptionId, { adherenceScore: score })
  }

async getAdherenceReport(patientId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const patientPrescriptions = await this.getByPatient(patientId)
    const adherenceData = patientPrescriptions
      .filter(p => p.adherenceScore !== null)
      .map(p => ({
        prescriptionNumber: p.prescriptionNumber,
        medications: p.medications.map(m => m.drugName).join(', '),
        adherenceScore: p.adherenceScore,
        status: p.status,
        lastUpdated: p.counseledDate || p.dispensedDate,
        patientName: p.patientName
      }))

    const averageAdherence = adherenceData.length > 0 
      ? adherenceData.reduce((sum, item) => sum + item.adherenceScore, 0) / adherenceData.length
      : 0

    return {
      patientId,
      averageAdherence,
      prescriptions: adherenceData,
      recommendations: this.generateAdherenceRecommendations(averageAdherence)
    }
  }

  async getAdherenceOverview() {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const allPrescriptions = await this.getAll()
    const patientsWithAdherence = allPrescriptions
      .filter(p => p.adherenceScore !== null)
      .reduce((acc, p) => {
        if (!acc[p.patientId]) {
          acc[p.patientId] = {
            patientId: p.patientId,
            patientName: p.patientName,
            prescriptions: []
          }
        }
        acc[p.patientId].prescriptions.push({
          prescriptionNumber: p.prescriptionNumber,
          adherenceScore: p.adherenceScore
        })
        return acc
      }, {})

    const adherenceStats = Object.values(patientsWithAdherence).map(patient => {
      const avgScore = patient.prescriptions.reduce((sum, p) => sum + p.adherenceScore, 0) / patient.prescriptions.length
      return {
        ...patient,
        averageAdherence: Math.round(avgScore),
        riskLevel: avgScore >= 80 ? 'Low' : avgScore >= 70 ? 'Medium' : 'High'
      }
    })

    return {
      totalPatients: adherenceStats.length,
      highRisk: adherenceStats.filter(p => p.riskLevel === 'High').length,
      mediumRisk: adherenceStats.filter(p => p.riskLevel === 'Medium').length,
      lowRisk: adherenceStats.filter(p => p.riskLevel === 'Low').length,
      patients: adherenceStats.sort((a, b) => a.averageAdherence - b.averageAdherence)
    }
  }

  generateAdherenceRecommendations(score) {
    if (score >= 90) {
      return ["Excellent adherence! Continue current routine."]
    } else if (score >= 80) {
      return [
        "Good adherence with room for improvement",
        "Consider medication reminder system",
        "Discuss any barriers with pharmacist"
      ]
    } else if (score >= 70) {
      return [
        "Moderate adherence - intervention needed",
        "Schedule medication therapy management",
        "Explore pill organizers or reminder apps",
        "Assess for side effects or cost barriers"
      ]
    } else {
      return [
        "Poor adherence - immediate intervention required",
        "Schedule urgent consultation with pharmacist",
        "Evaluate medication regimen complexity",
        "Consider alternative dosing schedules",
        "Assess for health literacy barriers"
      ]
    }
  }

  async getWorkflowStats() {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const statusCounts = this.prescriptions.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1
      return acc
    }, {})

    const priorityCounts = this.prescriptions.reduce((acc, p) => {
      acc[p.priority] = (acc[p.priority] || 0) + 1
      return acc
    }, {})

    return {
      total: this.prescriptions.length,
      statusCounts,
      priorityCounts,
      averageProcessingTime: "2.5 hours",
      dailyVolume: 15,
      monthlyVolume: 450
    }
  }
}

export default new PrescriptionService()