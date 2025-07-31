import { toast } from 'react-toastify'

// Mock billing data store
let billingCharges = [
  {
    Id: 1,
    patientId: 'P001',
    patientName: 'John Smith',
    department: 'Laboratory',
    serviceCode: 'LAB001',
    description: 'Complete Blood Count',
    amount: 85.00,
    icd10Code: 'Z00.00',
    cptCode: '85025',
insuranceId: 1,
    tpaId: null,
    status: 'paid',
    insuranceVerified: true,
    tpaProcessed: false,
    claimSubmitted: true,
    claimId: 'CLM001',
    claimStatus: 'paid',
    claimStatusMessage: 'Payment processed successfully',
    claimStatusUpdatedAt: new Date('2024-01-20'),
    claimSubmittedAt: new Date('2024-01-16'),
    paidAmount: 85.00,
    paidAt: new Date('2024-01-20'),
    followUpScheduled: false,
    followUpDate: null,
    automatedPayment: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    Id: 2,
    patientId: 'P002',
    patientName: 'Sarah Johnson',
    department: 'Pharmacy',
    serviceCode: 'MED001',
    description: 'Metformin 500mg x30',
    amount: 25.50,
    icd10Code: 'E11.9',
    cptCode: null,
    insuranceId: 2,
    tpaId: 1,
status: 'pending',
    insuranceVerified: true,
    tpaProcessed: false,
    claimSubmitted: true,
    claimId: 'CLM002',
    claimStatus: 'processing',
    claimStatusMessage: 'Under review by insurance provider',
    claimStatusUpdatedAt: new Date('2024-01-18'),
    claimSubmittedAt: new Date('2024-01-17'),
    followUpScheduled: true,
    followUpDate: new Date('2024-01-23'),
    automatedPayment: false,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-18')
  },
  {
    Id: 3,
    patientId: 'P003',
    patientName: 'Michael Brown',
    department: 'Radiology',
    serviceCode: 'RAD001',
    description: 'Chest X-Ray',
    amount: 150.00,
    icd10Code: 'J18.9',
    cptCode: '71020',
    insuranceId: 1,
    tpaId: null,
status: 'denied',
    insuranceVerified: true,
    tpaProcessed: false,
    claimSubmitted: true,
    claimId: 'CLM003',
    claimStatus: 'denied',
    claimStatusMessage: 'Claim denied - insufficient documentation',
    claimStatusUpdatedAt: new Date('2024-01-19'),
    claimSubmittedAt: new Date('2024-01-15'),
    denialReason: 'D001',
    denialReasonText: 'Insufficient documentation provided',
    denialCategory: 'Documentation',
    canResubmit: true,
    resubmissionCount: 0,
    maxResubmissions: 2,
    recommendedAction: 'Provide additional medical records and physician notes',
    followUpScheduled: true,
    followUpDate: new Date('2024-01-22'),
    automatedPayment: false,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-19')
  },
  {
    Id: 4,
    patientId: 'P004',
    patientName: 'Emily Davis',
    department: 'Emergency',
    serviceCode: 'ER001',
    description: 'Emergency Consultation',
    amount: 350.00,
    icd10Code: 'R06.9',
    cptCode: '99284',
    insuranceId: 3,
    tpaId: 2,
    status: 'pending',
    insuranceVerified: true,
    tpaProcessed: true,
    claimSubmitted: true,
    claimId: 'CLM004',
    claimStatus: 'submitted',
    claimStatusMessage: 'Claim submitted to clearinghouse',
    claimStatusUpdatedAt: new Date('2024-01-18'),
    claimSubmittedAt: new Date('2024-01-18'),
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-18')
  },
  {
    Id: 5,
    patientId: 'P005',
    patientName: 'Robert Wilson',
    department: 'Cardiology',
    serviceCode: 'CARD001',
    description: 'ECG',
    amount: 125.00,
    icd10Code: 'I25.10',
    cptCode: '93000',
    insuranceId: 2,
    tpaId: null,
    status: 'pending',
    insuranceVerified: false,
    tpaProcessed: false,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    Id: 6,
    patientId: 'P006',
    patientName: 'Lisa Anderson',
    department: 'Laboratory',
    serviceCode: 'LAB002',
    description: 'Lipid Panel',
    amount: 95.00,
    icd10Code: 'Z00.01',
    cptCode: '80061',
    insuranceId: 1,
    tpaId: null,
status: 'denied',
    insuranceVerified: true,
    tpaProcessed: false,
    claimSubmitted: true,
    claimId: 'CLM005',
    claimStatus: 'denied',
    claimStatusMessage: 'Claim denied - medical necessity not established',
    claimStatusUpdatedAt: new Date('2024-01-20'),
    claimSubmittedAt: new Date('2024-01-17'),
    denialReason: 'D002',
    denialReasonText: 'Medical necessity not established',
    denialCategory: 'Medical Necessity',
    canResubmit: true,
    resubmissionCount: 1,
    maxResubmissions: 2,
    recommendedAction: 'Provide clinical justification and supporting lab values',
    appealStatus: 'pending',
    appealSubmittedAt: new Date('2024-01-21'),
    appealLevel: 1,
    followUpScheduled: true,
    followUpDate: new Date('2024-01-26'),
    automatedPayment: false,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-21')
  }
]

let nextId = 6

class BillingService {
  constructor() {
    this.charges = billingCharges
  }

  // Get all billing charges
  getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.charges])
      }, 500)
    })
  }

  // Get charge by ID
  getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const charge = this.charges.find(c => c.Id === parseInt(id))
        if (charge) {
          resolve({...charge})
        } else {
          reject(new Error('Charge not found'))
        }
      }, 300)
    })
  }

  // Create new charge
  create(chargeData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCharge = {
          Id: nextId++,
          ...chargeData,
          amount: parseFloat(chargeData.amount),
          status: 'pending',
          insuranceVerified: false,
          tpaProcessed: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        this.charges.unshift(newCharge)
        resolve({...newCharge})
      }, 300)
    })
  }

  // Update charge
  update(id, updateData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.charges.findIndex(c => c.Id === parseInt(id))
        if (index !== -1) {
          this.charges[index] = {
            ...this.charges[index],
            ...updateData,
            updatedAt: new Date()
          }
          resolve({...this.charges[index]})
        } else {
          reject(new Error('Charge not found'))
        }
      }, 300)
    })
  }

  // Delete charge
  delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.charges.findIndex(c => c.Id === parseInt(id))
        if (index !== -1) {
          const deletedCharge = this.charges.splice(index, 1)[0]
          resolve(deletedCharge)
        } else {
          reject(new Error('Charge not found'))
        }
      }, 300)
    })
  }

  // Real-time charge capture from departments
  captureCharge(departmentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const chargeData = {
          patientId: departmentData.patientId,
          patientName: departmentData.patientName || 'Unknown Patient',
          department: departmentData.department,
          serviceCode: departmentData.serviceCode,
          description: departmentData.description,
          amount: departmentData.amount,
          icd10Code: departmentData.icd10Code || null,
          cptCode: departmentData.cptCode || null,
          insuranceId: departmentData.insuranceId || null,
          tpaId: departmentData.tpaId || null
        }
        
        const newCharge = this.create(chargeData)
        resolve(newCharge)
      }, 200)
    })
  }

  // Get charges by department
  getByDepartment(department) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const departmentCharges = this.charges.filter(c => 
          c.department.toLowerCase() === department.toLowerCase()
        )
        resolve([...departmentCharges])
      }, 300)
    })
  }

  // Get charges by patient
  getByPatient(patientId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const patientCharges = this.charges.filter(c => c.patientId === patientId)
        resolve([...patientCharges])
      }, 300)
    })
  }

  // Get charges by status
  getByStatus(status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const statusCharges = this.charges.filter(c => c.status === status)
        resolve([...statusCharges])
      }, 300)
    })
  }

  // Process insurance verification
  processInsuranceVerification(chargeId, verificationResult) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.charges.findIndex(c => c.Id === parseInt(chargeId))
        if (index !== -1) {
          this.charges[index] = {
            ...this.charges[index],
            insuranceVerified: verificationResult.verified,
            insuranceStatus: verificationResult.status,
            coverageAmount: verificationResult.coverageAmount,
            updatedAt: new Date()
          }
          resolve({...this.charges[index]})
        } else {
          reject(new Error('Charge not found'))
        }
      }, 300)
    })
  }

  // Process TPA
  processTPA(chargeId, tpaResult) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.charges.findIndex(c => c.Id === parseInt(chargeId))
        if (index !== -1) {
          this.charges[index] = {
            ...this.charges[index],
            tpaProcessed: tpaResult.processed,
            tpaStatus: tpaResult.status,
            tpaAmount: tpaResult.approvedAmount,
            updatedAt: new Date()
          }
          resolve({...this.charges[index]})
        } else {
          reject(new Error('Charge not found'))
        }
      }, 300)
    })
  }

  // Generate billing report
  generateReport(dateFrom, dateTo, filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredCharges = [...this.charges]
        
        // Filter by date range
        if (dateFrom) {
          filteredCharges = filteredCharges.filter(c => 
            new Date(c.createdAt) >= new Date(dateFrom)
          )
        }
        
        if (dateTo) {
          filteredCharges = filteredCharges.filter(c => 
            new Date(c.createdAt) <= new Date(dateTo)
          )
        }
        
        // Apply additional filters
        if (filters.department) {
          filteredCharges = filteredCharges.filter(c => 
            c.department === filters.department
          )
        }
        
        if (filters.status) {
          filteredCharges = filteredCharges.filter(c => 
            c.status === filters.status
          )
        }
        
        // Calculate summary
        const summary = {
          totalCharges: filteredCharges.length,
          totalAmount: filteredCharges.reduce((sum, c) => sum + c.amount, 0),
          pendingAmount: filteredCharges
            .filter(c => c.status === 'pending')
            .reduce((sum, c) => sum + c.amount, 0),
          paidAmount: filteredCharges
            .filter(c => c.status === 'paid')
            .reduce((sum, c) => sum + c.amount, 0),
          verifiedCharges: filteredCharges.filter(c => c.insuranceVerified).length,
          tpaProcessedCharges: filteredCharges.filter(c => c.tpaProcessed).length
        }
        
        resolve({
          charges: filteredCharges,
          summary
        })
      }, 500)
    })
  }

  // Bulk update charges
  bulkUpdate(chargeIds, updateData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedCharges = []
        
        chargeIds.forEach(id => {
          const index = this.charges.findIndex(c => c.Id === parseInt(id))
          if (index !== -1) {
            this.charges[index] = {
              ...this.charges[index],
              ...updateData,
              updatedAt: new Date()
            }
            updatedCharges.push({...this.charges[index]})
          }
        })
        
        resolve(updatedCharges)
      }, 500)
    })
  }

  // Search charges
  search(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query || query.length < 2) {
          resolve([])
          return
        }
        
        const searchTerm = query.toLowerCase()
        const results = this.charges.filter(charge =>
          charge.patientName?.toLowerCase().includes(searchTerm) ||
          charge.patientId?.toLowerCase().includes(searchTerm) ||
          charge.department?.toLowerCase().includes(searchTerm) ||
          charge.serviceCode?.toLowerCase().includes(searchTerm) ||
          charge.description?.toLowerCase().includes(searchTerm) ||
          charge.icd10Code?.toLowerCase().includes(searchTerm) ||
          charge.cptCode?.toLowerCase().includes(searchTerm)
        )
        
        resolve([...results])
}, 300)
    })
  }

  // Electronic Claims Submission
  submitClaim(chargeId, clearinghouseId = 'CH001') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.charges.findIndex(c => c.Id === parseInt(chargeId))
        if (index !== -1) {
          const charge = this.charges[index]
          
          // Validate claim requirements
          if (!charge.insuranceVerified) {
            reject(new Error('Insurance must be verified before claim submission'))
            return
          }
          
          if (!charge.icd10Code || !charge.cptCode) {
            reject(new Error('ICD-10 and CPT codes required for claim submission'))
            return
          }
          
          const claimId = `CLM${Date.now()}`
          
          this.charges[index] = {
            ...charge,
            claimSubmitted: true,
            claimStatus: 'submitted',
            claimId: claimId,
            clearinghouseId: clearinghouseId,
            claimSubmittedAt: new Date(),
            updatedAt: new Date()
          }
          
          // Simulate real-time clearinghouse processing
          this.simulateClearinghouseProcessing(claimId, chargeId)
          
          resolve({
            success: true,
            claimId: claimId,
            status: 'submitted',
            message: 'Claim submitted successfully to clearinghouse'
          })
        } else {
          reject(new Error('Charge not found'))
        }
      }, 500)
    })
  }

  // Simulate real-time clearinghouse processing
simulateClearinghouseProcessing(claimId, chargeId) {
    // Simulate processing stages with realistic timing
    setTimeout(() => {
      this.updateClaimStatus(chargeId, 'processing', 'Claim received by clearinghouse')
    }, 2000)
    
    setTimeout(() => {
      this.updateClaimStatus(chargeId, 'validated', 'Claim passed initial validation')
    }, 5000)
    
    setTimeout(() => {
      // 70% success rate simulation with various outcomes
      const outcome = Math.random()
if (outcome > 0.3) {
        this.updateClaimStatus(chargeId, 'accepted', 'Claim accepted by payer')
        
        // Simulate payment processing with automated posting
        setTimeout(() => {
          this.updateClaimStatus(chargeId, 'paid', 'Payment processed automatically')
          this.update(chargeId, { 
            status: 'paid',
            paidAmount: this.charges.find(c => c.Id === parseInt(chargeId))?.amount,
            paidAt: new Date(),
            automatedPayment: true,
            followUpScheduled: false
          })
          toast.success('Automated payment posted successfully')
        }, 10000)
      } else if (outcome > 0.15) {
        // Denial with specific reason codes and follow-up scheduling
        const denialReasons = [
          { code: 'D001', text: 'Insufficient documentation provided', category: 'Documentation', action: 'Provide additional medical records and physician notes' },
          { code: 'D002', text: 'Medical necessity not established', category: 'Medical Necessity', action: 'Provide clinical justification and supporting lab values' },
          { code: 'D003', text: 'Duplicate claim submission', category: 'Administrative', action: 'Verify claim uniqueness and resubmit if valid' },
          { code: 'D004', text: 'Incorrect coding used', category: 'Coding', action: 'Review and correct ICD-10/CPT codes' },
          { code: 'D005', text: 'Coverage limitation exceeded', category: 'Coverage', action: 'Check benefit limits and patient responsibility' }
        ]
        const denial = denialReasons[Math.floor(Math.random() * denialReasons.length)]
        
        this.updateClaimStatus(chargeId, 'denied', `Claim denied - ${denial.text}`)
        
        // Schedule follow-up for denied claim
        const followUpDate = new Date()
        followUpDate.setDate(followUpDate.getDate() + 3) // 3 days for denied claims
        
        this.update(chargeId, { 
          status: 'denied',
          denialReason: denial.code,
          denialReasonText: denial.text,
          denialCategory: denial.category,
          canResubmit: true,
          resubmissionCount: 0,
          maxResubmissions: 2,
          recommendedAction: denial.action,
          followUpScheduled: true,
          followUpDate: followUpDate
        })
        
        // Schedule automated follow-up
        this.scheduleFollowUp(chargeId, 'denied', followUpDate)
        
      } else {
        // Technical rejection with follow-up
        this.updateClaimStatus(chargeId, 'rejected', 'Claim rejected - technical error in submission')
        
        const followUpDate = new Date()
        followUpDate.setDate(followUpDate.getDate() + 1) // 1 day for technical rejections
        
        this.update(chargeId, { 
          status: 'rejected',
          canResubmit: true,
          recommendedAction: 'Fix technical issues and resubmit',
          followUpScheduled: true,
          followUpDate: followUpDate
        })
        
        // Schedule automated follow-up
        this.scheduleFollowUp(chargeId, 'rejected', followUpDate)
      }
    }, 8000)
  }

// Update claim status
  updateClaimStatus(chargeId, status, message = '') {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.charges.findIndex(c => c.Id === parseInt(chargeId))
        if (index !== -1) {
          this.charges[index] = {
            ...this.charges[index],
            claimStatus: status,
            claimStatusMessage: message,
            claimStatusUpdatedAt: new Date(),
            updatedAt: new Date()
          }
          resolve({...this.charges[index]})
        }
      }, 100)
    })
  }

  // Resubmit denied claim
  resubmitClaim(chargeId, correctionNotes = '') {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.charges.findIndex(c => c.Id === parseInt(chargeId))
        if (index !== -1) {
          const charge = this.charges[index]
          if (charge.canResubmit && charge.resubmissionCount < charge.maxResubmissions) {
            const newClaimId = `CLM${String(Date.now()).slice(-6)}`
            this.charges[index] = {
              ...charge,
              claimId: newClaimId,
              claimStatus: 'submitted',
              claimStatusMessage: 'Claim resubmitted with corrections',
              claimStatusUpdatedAt: new Date(),
              claimSubmittedAt: new Date(),
              resubmissionCount: (charge.resubmissionCount || 0) + 1,
              correctionNotes: correctionNotes,
              status: 'pending',
              updatedAt: new Date()
            }
            
            // Simulate reprocessing
            this.simulateClearinghouseProcessing(newClaimId, chargeId)
            
            resolve({
              success: true,
              claimId: newClaimId,
              message: `Claim resubmitted as ${newClaimId}`,
              charge: {...this.charges[index]}
            })
          } else {
            resolve({
              success: false,
              message: 'Claim cannot be resubmitted or maximum attempts reached'
            })
          }
        } else {
          resolve({
            success: false,
            message: 'Charge not found'
          })
        }
      }, 500)
    })
  }

  // Submit appeal for denied claim
  submitAppeal(chargeId, appealNotes = '', appealLevel = 1) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.charges.findIndex(c => c.Id === parseInt(chargeId))
        if (index !== -1) {
          const charge = this.charges[index]
          if (charge.status === 'denied' && appealLevel <= 3) {
            this.charges[index] = {
              ...charge,
              appealStatus: 'submitted',
              appealSubmittedAt: new Date(),
              appealLevel: appealLevel,
              appealNotes: appealNotes,
              updatedAt: new Date()
            }
            
            // Simulate appeal processing (30% success rate)
            setTimeout(() => {
              const appealSuccess = Math.random() > 0.7
              if (appealSuccess) {
                this.charges[index] = {
                  ...this.charges[index],
                  appealStatus: 'approved',
                  status: 'paid',
                  paidAmount: charge.amount,
                  paidAt: new Date(),
                  claimStatus: 'paid',
                  claimStatusMessage: 'Claim approved on appeal'
                }
                toast.success(`Appeal approved for claim ${charge.claimId}`)
              } else {
                this.charges[index] = {
                  ...this.charges[index],
                  appealStatus: 'denied',
                  claimStatusMessage: 'Appeal denied - original decision upheld'
                }
                toast.error(`Appeal denied for claim ${charge.claimId}`)
              }
            }, 15000)
            
            resolve({
              success: true,
              message: `Appeal submitted for claim ${charge.claimId}`,
              charge: {...this.charges[index]}
            })
          } else {
            resolve({
              success: false,
              message: 'Cannot submit appeal for this claim'
            })
          }
        }
      }, 500)
    })
  }

  // Get claims by status
  getClaimsByStatus(status) {
    return this.charges.filter(charge => charge.claimStatus === status)
  }

  // Get denial analytics
  getDenialAnalytics() {
    const deniedClaims = this.charges.filter(c => c.status === 'denied')
    const analytics = {
      totalDenials: deniedClaims.length,
      denialsByCategory: {},
      denialsByReason: {},
      resubmissionRate: 0,
      appealRate: 0
    }
    
    deniedClaims.forEach(claim => {
      if (claim.denialCategory) {
        analytics.denialsByCategory[claim.denialCategory] = 
          (analytics.denialsByCategory[claim.denialCategory] || 0) + 1
      }
      if (claim.denialReason) {
        analytics.denialsByReason[claim.denialReason] = 
          (analytics.denialsByReason[claim.denialReason] || 0) + 1
      }
    })
    
    const resubmitted = deniedClaims.filter(c => c.resubmissionCount > 0).length
    const appealed = deniedClaims.filter(c => c.appealStatus).length
    
    analytics.resubmissionRate = deniedClaims.length ? (resubmitted / deniedClaims.length * 100).toFixed(1) : 0
    analytics.appealRate = deniedClaims.length ? (appealed / deniedClaims.length * 100).toFixed(1) : 0
    
    return analytics
  }

  // Get claims by status
  getClaimsByStatus(status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const claims = this.charges.filter(c => c.claimSubmitted && c.claimStatus === status)
        resolve([...claims])
      }, 300)
    })
  }

  // Get all claims
  getAllClaims() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const claims = this.charges.filter(c => c.claimSubmitted)
        resolve([...claims])
      }, 300)
    })
  }

  // Process claim response from clearinghouse
  processClaimResponse(claimId, responseData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.charges.findIndex(c => c.claimId === claimId)
        if (index !== -1) {
          this.charges[index] = {
            ...this.charges[index],
            claimStatus: responseData.status,
            claimStatusMessage: responseData.message,
            claimResponseData: responseData,
            updatedAt: new Date()
          }
          
          // Update charge status if claim is paid
          if (responseData.status === 'paid') {
            this.charges[index].status = 'paid'
          }
          
          resolve({...this.charges[index]})
        } else {
          reject(new Error('Claim not found'))
        }
      }, 300)
    })
  }

// Schedule automated follow-up for outstanding claims
  scheduleFollowUp(chargeId, claimStatus, followUpDate) {
    setTimeout(() => {
      const charge = this.charges.find(c => c.Id === parseInt(chargeId))
      if (!charge) return

      // Check if follow-up is still needed
      if (charge.claimStatus === claimStatus && charge.followUpScheduled) {
        toast.info(`Follow-up scheduled for claim ${charge.claimId} - ${charge.claimStatusMessage}`)
        
        // For processing claims, check if they need escalation
        if (claimStatus === 'processing') {
          const daysSinceSubmission = Math.floor((new Date() - new Date(charge.claimSubmittedAt)) / (1000 * 60 * 60 * 24))
          if (daysSinceSubmission > 7) {
            toast.warning(`Claim ${charge.claimId} has been processing for ${daysSinceSubmission} days - consider escalation`)
          }
        }
      }
    }, Math.abs(followUpDate - new Date()))
  }

  // Process automated payments from insurance and patients
  processAutomatedPayments() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const eligibleCharges = this.charges.filter(c => 
          c.claimStatus === 'accepted' && !c.paidAmount && !c.automatedPayment
        )

        let processedPayments = 0
        
        eligibleCharges.forEach(charge => {
          // Simulate automated payment posting
          const paymentSuccess = Math.random() > 0.1 // 90% success rate
          
          if (paymentSuccess) {
            this.update(charge.Id, {
              status: 'paid',
              paidAmount: charge.amount,
              paidAt: new Date(),
              automatedPayment: true,
              followUpScheduled: false
            })
            
            this.updateClaimStatus(charge.Id, 'paid', 'Payment posted automatically')
            processedPayments++
          }
        })

        if (processedPayments > 0) {
          toast.success(`${processedPayments} automated payments processed successfully`)
        }

        resolve({
          processed: processedPayments,
          total: eligibleCharges.length
        })
      }, 2000)
    })
  }

  // Start automated processing for follow-ups and payments
  startAutomatedProcessing() {
    // Process automated payments every 30 seconds
    setInterval(() => {
      this.processAutomatedPayments()
    }, 30000)

    // Check for outstanding claims needing follow-up every minute
    setInterval(() => {
      const outstandingClaims = this.charges.filter(c => {
        if (!c.claimSubmitted || c.claimStatus === 'paid') return false
        
        const daysSinceSubmission = Math.floor((new Date() - new Date(c.claimSubmittedAt)) / (1000 * 60 * 60 * 24))
        const daysSinceLastUpdate = Math.floor((new Date() - new Date(c.claimStatusUpdatedAt)) / (1000 * 60 * 60 * 24))
        
        // Schedule follow-up based on claim status and time elapsed
        if (c.claimStatus === 'processing' && daysSinceSubmission > 5 && !c.followUpScheduled) {
          return true
        }
        if ((c.claimStatus === 'denied' || c.claimStatus === 'rejected') && daysSinceLastUpdate > 2 && !c.followUpScheduled) {
          return true
        }
        
        return false
      })

      outstandingClaims.forEach(claim => {
        const followUpDate = new Date()
        followUpDate.setDate(followUpDate.getDate() + 1) // Next day follow-up
        
        this.update(claim.Id, {
          followUpScheduled: true,
          followUpDate: followUpDate
        })
        
        this.scheduleFollowUp(claim.Id, claim.claimStatus, followUpDate)
      })
      
    }, 60000) // Every minute

    toast.info('Automated billing processes started - follow-ups and payment posting enabled')
  }

  // Generate claims report with automation metrics
  generateClaimsReport(dateFrom, dateTo, filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let claims = this.charges.filter(c => c.claimSubmitted)
        
        // Filter by date range
        if (dateFrom) {
          claims = claims.filter(c => 
            new Date(c.claimSubmittedAt) >= new Date(dateFrom)
          )
        }
        
        if (dateTo) {
          claims = claims.filter(c => 
            new Date(c.claimSubmittedAt) <= new Date(dateTo)
          )
        }
        
        // Apply additional filters
        if (filters.status) {
          claims = claims.filter(c => c.claimStatus === filters.status)
        }
        
        if (filters.clearinghouse) {
          claims = claims.filter(c => c.clearinghouseId === filters.clearinghouse)
        }
        
        // Calculate summary with automation metrics
        const summary = {
          totalClaims: claims.length,
          submittedClaims: claims.filter(c => c.claimStatus === 'submitted').length,
          processingClaims: claims.filter(c => c.claimStatus === 'processing').length,
          acceptedClaims: claims.filter(c => c.claimStatus === 'accepted').length,
          rejectedClaims: claims.filter(c => c.claimStatus === 'rejected').length,
          deniedClaims: claims.filter(c => c.claimStatus === 'denied').length,
          paidClaims: claims.filter(c => c.claimStatus === 'paid').length,
          totalClaimAmount: claims.reduce((sum, c) => sum + c.amount, 0),
          paidAmount: claims.filter(c => c.claimStatus === 'paid').reduce((sum, c) => sum + c.amount, 0),
          // Automation metrics
          automatedPayments: claims.filter(c => c.automatedPayment).length,
          scheduledFollowUps: claims.filter(c => c.followUpScheduled).length,
          outstandingClaims: claims.filter(c => 
            c.claimStatus === 'processing' || c.claimStatus === 'submitted'
          ).length
        }
        
        resolve({
          claims,
          summary
        })
      }, 500)
    })
  }
}

export default new BillingService()