import { toast } from 'react-toastify'
import billingService from './billingService'

// Mock insurance plans data
let insurancePlans = [
  {
    Id: 1,
    name: 'Blue Cross Blue Shield',
    type: 'PPO',
    coveragePercentage: 80,
    deductible: 1000,
    copay: 25,
    active: true,
    payerId: 'BCBS001',
    eligibilityUrl: 'https://api.bcbs.com/eligibility',
    claimsUrl: 'https://api.bcbs.com/claims',
    preAuthRequired: true,
    networkProviders: ['PROV001', 'PROV002', 'PROV003'],
    feeSchedule: 'BCBS_2024',
    processingTime: '3-5 business days',
    contactInfo: {
      phone: '1-800-BCBS-123',
      email: 'provider@bcbs.com',
      website: 'https://www.bcbs.com'
    }
  },
  {
    Id: 2,
    name: 'Aetna Health',
    type: 'HMO',
    coveragePercentage: 90,
    deductible: 500,
    copay: 15,
    active: true,
    payerId: 'AETNA001',
    eligibilityUrl: 'https://api.aetna.com/eligibility',
    claimsUrl: 'https://api.aetna.com/claims',
    preAuthRequired: false,
    networkProviders: ['PROV001', 'PROV004', 'PROV005'],
    feeSchedule: 'AETNA_2024',
    processingTime: '2-3 business days',
    contactInfo: {
      phone: '1-800-AETNA-23',
      email: 'provider@aetna.com',
      website: 'https://www.aetna.com'
    }
  },
  {
    Id: 3,
    name: 'United Healthcare',
    type: 'PPO',
    coveragePercentage: 85,
    deductible: 750,
    copay: 20,
    active: true,
    payerId: 'UHC001',
    eligibilityUrl: 'https://api.uhc.com/eligibility',
    claimsUrl: 'https://api.uhc.com/claims',
    preAuthRequired: true,
    networkProviders: ['PROV001', 'PROV002', 'PROV006'],
    feeSchedule: 'UHC_2024',
    processingTime: '4-6 business days',
    contactInfo: {
      phone: '1-800-UHC-4567',
      email: 'provider@uhc.com',
      website: 'https://www.uhc.com'
    }
  },
  {
    Id: 4,
    name: 'Cigna Health',
    type: 'EPO',
    coveragePercentage: 75,
    deductible: 1200,
    copay: 30,
    active: true,
    payerId: 'CIGNA001',
    eligibilityUrl: 'https://api.cigna.com/eligibility',
    claimsUrl: 'https://api.cigna.com/claims',
    preAuthRequired: true,
    networkProviders: ['PROV003', 'PROV005', 'PROV007'],
    feeSchedule: 'CIGNA_2024',
    processingTime: '3-4 business days',
    contactInfo: {
      phone: '1-800-CIGNA-24',
      email: 'provider@cigna.com',
      website: 'https://www.cigna.com'
    }
  }
]

// Mock eligibility verification history
let eligibilityHistory = [
  {
    Id: 1,
    chargeId: 1,
    patientId: 'P001',
    insuranceId: 1,
    verificationDate: new Date('2024-01-15'),
    status: 'verified',
    eligible: true,
    coverageDetails: {
      deductibleMet: 200,
      deductibleRemaining: 800,
      benefitsRemaining: 5000,
      preAuthRequired: false
    },
    verifiedBy: 'system'
  },
  {
    Id: 2,
    chargeId: 2,
    patientId: 'P002',
    insuranceId: 2,
    verificationDate: new Date('2024-01-16'),
    status: 'verified',
    eligible: true,
    coverageDetails: {
      deductibleMet: 500,
      deductibleRemaining: 0,
      benefitsRemaining: 8000,
      preAuthRequired: false
    },
    verifiedBy: 'user123'
  }
]

// Mock pre-authorization tracking
let preAuthorizations = [
  {
    Id: 1,
    chargeId: 3,
    patientId: 'P003',
    insuranceId: 1,
    serviceCode: 'RAD001',
    authNumber: 'AUTH123456',
    status: 'approved',
    requestDate: new Date('2024-01-13'),
    approvalDate: new Date('2024-01-14'),
    expiryDate: new Date('2024-04-14'),
    approvedAmount: 150.00,
    notes: 'Approved for chest X-ray due to pneumonia symptoms'
  },
  {
    Id: 2,
    chargeId: 4,
    patientId: 'P004',
    insuranceId: 3,
    serviceCode: 'ER001',
    authNumber: 'AUTH789012',
    status: 'pending',
    requestDate: new Date('2024-01-17'),
    approvalDate: null,
    expiryDate: null,
    approvedAmount: null,
    notes: 'Emergency consultation authorization pending'
  }
]

let nextEligibilityId = 3
let nextPreAuthId = 3

class InsuranceService {
  constructor() {
    this.plans = insurancePlans
    this.eligibilityHistory = eligibilityHistory
    this.preAuthorizations = preAuthorizations
  }

  // Get all insurance plans
  getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.plans])
      }, 300)
    })
  }

  // Get insurance plan by ID
  getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const plan = this.plans.find(p => p.Id === parseInt(id))
        if (plan) {
          resolve({...plan})
        } else {
          reject(new Error('Insurance plan not found'))
        }
      }, 200)
    })
  }

  // Verify eligibility for a charge
  verifyEligibility(chargeId) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const charge = await billingService.getById(chargeId)
          const insurancePlan = this.plans.find(p => p.Id === charge.insuranceId)
          
          if (!insurancePlan) {
            resolve({
              eligible: false,
              reason: 'No insurance plan found',
              status: 'error'
            })
            return
          }

          // Simulate eligibility check
          const isEligible = Math.random() > 0.1 // 90% success rate
          
          const verificationResult = {
            eligible: isEligible,
            status: isEligible ? 'verified' : 'denied',
            reason: isEligible ? 'Active coverage verified' : 'Coverage expired or invalid',
            coverageDetails: isEligible ? {
              deductibleMet: Math.floor(Math.random() * insurancePlan.deductible),
              deductibleRemaining: Math.floor(Math.random() * insurancePlan.deductible),
              benefitsRemaining: Math.floor(Math.random() * 10000) + 1000,
              preAuthRequired: insurancePlan.preAuthRequired
            } : null
          }

          // Record eligibility verification
          const eligibilityRecord = {
            Id: nextEligibilityId++,
            chargeId: parseInt(chargeId),
            patientId: charge.patientId,
            insuranceId: charge.insuranceId,
            verificationDate: new Date(),
            status: verificationResult.status,
            eligible: verificationResult.eligible,
            coverageDetails: verificationResult.coverageDetails,
            verifiedBy: 'system'
          }
          
          this.eligibilityHistory.push(eligibilityRecord)

          // Update the charge with verification status
          await billingService.processInsuranceVerification(chargeId, {
            verified: verificationResult.eligible,
            status: verificationResult.status,
            coverageAmount: verificationResult.coverageDetails?.benefitsRemaining || 0
          })

          resolve(verificationResult)
        } catch (error) {
          resolve({
            eligible: false,
            reason: 'Verification failed: ' + error.message,
            status: 'error'
          })
        }
      }, 1000) // Simulate API call delay
    })
  }

  // Get eligibility history
  getEligibilityHistory(patientId = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let history = [...this.eligibilityHistory]
        
        if (patientId) {
          history = history.filter(h => h.patientId === patientId)
        }
        
        resolve(history.sort((a, b) => new Date(b.verificationDate) - new Date(a.verificationDate)))
      }, 300)
    })
  }

  // Request pre-authorization
  requestPreAuthorization(authData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const preAuth = {
          Id: nextPreAuthId++,
          ...authData,
          authNumber: 'AUTH' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          status: 'pending',
          requestDate: new Date(),
          approvalDate: null,
          expiryDate: null,
          approvedAmount: null,
          notes: 'Pre-authorization request submitted'
        }
        
        this.preAuthorizations.push(preAuth)
        resolve({...preAuth})
      }, 500)
    })
  }

  // Get pre-authorization status
  getPreAuthStatus(authId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const preAuth = this.preAuthorizations.find(p => p.Id === parseInt(authId))
        if (preAuth) {
          resolve({...preAuth})
        } else {
          reject(new Error('Pre-authorization not found'))
        }
      }, 200)
    })
  }

  // Get all pre-authorizations
  getAllPreAuthorizations(filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let preAuths = [...this.preAuthorizations]
        
        if (filters.status) {
          preAuths = preAuths.filter(p => p.status === filters.status)
        }
        
        if (filters.patientId) {
          preAuths = preAuths.filter(p => p.patientId === filters.patientId)
        }
        
        resolve(preAuths.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)))
      }, 300)
    })
  }

  // Process pre-authorization response
  processPreAuthResponse(authId, response) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.preAuthorizations.findIndex(p => p.Id === parseInt(authId))
        if (index !== -1) {
          this.preAuthorizations[index] = {
            ...this.preAuthorizations[index],
            status: response.status,
            approvalDate: response.status === 'approved' ? new Date() : null,
            expiryDate: response.status === 'approved' ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : null, // 90 days
            approvedAmount: response.approvedAmount || null,
            notes: response.notes || this.preAuthorizations[index].notes
          }
          resolve({...this.preAuthorizations[index]})
        } else {
          reject(new Error('Pre-authorization not found'))
        }
      }, 300)
    })
  }

  // Get coverage details for a patient
  getCoverageDetails(patientId, insuranceId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plan = this.plans.find(p => p.Id === parseInt(insuranceId))
        if (!plan) {
          resolve(null)
          return
        }

        // Simulate getting patient-specific coverage details
        const coverageDetails = {
          planName: plan.name,
          type: plan.type,
          coveragePercentage: plan.coveragePercentage,
          deductible: plan.deductible,
          copay: plan.copay,
          deductibleMet: Math.floor(Math.random() * plan.deductible),
          benefitsUsed: Math.floor(Math.random() * 5000),
          benefitsRemaining: Math.floor(Math.random() * 10000) + 1000,
          networkStatus: 'in-network', // Assume in-network for simplicity
          effectiveDate: new Date('2024-01-01'),
          expiryDate: new Date('2024-12-31')
        }

        resolve(coverageDetails)
      }, 400)
    })
  }

  // Batch eligibility verification
  batchVerifyEligibility(chargeIds) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const results = []
        
        for (const chargeId of chargeIds) {
          try {
            const result = await this.verifyEligibility(chargeId)
            results.push({
              chargeId,
              ...result
            })
          } catch (error) {
            results.push({
              chargeId,
              eligible: false,
              reason: error.message,
              status: 'error'
            })
          }
        }
        
        resolve(results)
      }, 2000)
    })
  }

  // Get payer-specific fee schedule
  getFeeSchedule(insuranceId, serviceCode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plan = this.plans.find(p => p.Id === parseInt(insuranceId))
        if (!plan) {
          resolve(null)
          return
        }

        // Mock fee schedule lookup
        const baseFees = {
          'LAB001': 85.00,
          'MED001': 25.50,
          'RAD001': 150.00,
          'ER001': 350.00,
          'CARD001': 125.00
        }

        const baseFee = baseFees[serviceCode] || 100.00
        const adjustedFee = baseFee * (plan.coveragePercentage / 100)

        resolve({
          serviceCode,
          baseFee,
          adjustedFee,
          feeSchedule: plan.feeSchedule,
          effectiveDate: new Date('2024-01-01')
        })
      }, 300)
    })
  }

  // Generate insurance report
  generateInsuranceReport(dateFrom, dateTo) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let verifications = [...this.eligibilityHistory]
        let preAuths = [...this.preAuthorizations]
        
        // Filter by date range
        if (dateFrom) {
          verifications = verifications.filter(v => 
            new Date(v.verificationDate) >= new Date(dateFrom)
          )
          preAuths = preAuths.filter(p => 
            new Date(p.requestDate) >= new Date(dateFrom)
          )
        }
        
        if (dateTo) {
          verifications = verifications.filter(v => 
            new Date(v.verificationDate) <= new Date(dateTo)
          )
          preAuths = preAuths.filter(p => 
            new Date(p.requestDate) <= new Date(dateTo)
          )
        }

        const report = {
          verifications: {
            total: verifications.length,
            successful: verifications.filter(v => v.eligible).length,
            failed: verifications.filter(v => !v.eligible).length,
            byPlan: {}
          },
          preAuthorizations: {
            total: preAuths.length,
            approved: preAuths.filter(p => p.status === 'approved').length,
            pending: preAuths.filter(p => p.status === 'pending').length,
            denied: preAuths.filter(p => p.status === 'denied').length
          }
        }

        // Group verifications by insurance plan
        this.plans.forEach(plan => {
          const planVerifications = verifications.filter(v => v.insuranceId === plan.Id)
          report.verifications.byPlan[plan.name] = {
            total: planVerifications.length,
            successful: planVerifications.filter(v => v.eligible).length,
            failed: planVerifications.filter(v => !v.eligible).length
          }
        })

        resolve(report)
      }, 600)
    })
  }
}

export default new InsuranceService()