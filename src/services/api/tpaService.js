import { toast } from 'react-toastify'
import billingService from './billingService'

// Mock TPA configurations
let tpaConfigurations = [
  {
    Id: 1,
    name: 'Corporate Health TPA',
    type: 'Corporate Insurance',
    code: 'CHTP001',
    feeSchedule: 'Corporate_2024',
    processingTime: '2-3 business days',
    autoProcess: true,
    active: true,
    contactInfo: {
      phone: '1-800-CORP-TPA',
      email: 'claims@corporatehealth.com',
      website: 'https://corporatehealth.com'
    },
    apiConfig: {
      baseUrl: 'https://api.corporatehealth.com',
      authToken: 'CHTP_TOKEN_123',
      endpoints: {
        eligibility: '/eligibility',
        claims: '/claims',
        preAuth: '/preauth'
      }
    },
    feeMultipliers: {
      'Laboratory': 0.95,
      'Pharmacy': 0.90,
      'Radiology': 1.00,
      'Emergency': 0.85,
      'Surgery': 1.10,
      'Cardiology': 1.05
    },
    corporateClients: [
      { clientId: 'CORP001', name: 'TechCorp Industries', employees: 2500 },
      { clientId: 'CORP002', name: 'MegaManufacturing', employees: 1800 },
      { clientId: 'CORP003', name: 'ServiceSolutions Inc', employees: 950 }
    ]
  },
  {
    Id: 2,
    name: 'Enterprise Care TPA',
    type: 'Enterprise Insurance',
    code: 'ECTP002',
    feeSchedule: 'Enterprise_2024',
    processingTime: '1-2 business days',
    autoProcess: false,
    active: true,
    contactInfo: {
      phone: '1-800-ENT-CARE',
      email: 'processing@enterprisecare.com',
      website: 'https://enterprisecare.com'
    },
    apiConfig: {
      baseUrl: 'https://api.enterprisecare.com',
      authToken: 'ECTP_TOKEN_456',
      endpoints: {
        eligibility: '/verify',
        claims: '/submit',
        preAuth: '/authorize'
      }
    },
    feeMultipliers: {
      'Laboratory': 1.00,
      'Pharmacy': 0.95,
      'Radiology': 1.05,
      'Emergency': 0.80,
      'Surgery': 1.15,
      'Cardiology': 1.10
    },
    corporateClients: [
      { clientId: 'ENT001', name: 'GlobalTech Solutions', employees: 5000 },
      { clientId: 'ENT002', name: 'Innovation Labs', employees: 750 },
      { clientId: 'ENT003', name: 'Enterprise Systems', employees: 3200 }
    ]
  },
  {
    Id: 3,
    name: 'Group Health TPA',
    type: 'Group Insurance',
    code: 'GHTP003',
    feeSchedule: 'Group_2024',
    processingTime: '3-5 business days',
    autoProcess: true,
    active: true,
    contactInfo: {
      phone: '1-800-GRP-HLTH',
      email: 'claims@grouphealth.com',
      website: 'https://grouphealth.com'
    },
    apiConfig: {
      baseUrl: 'https://api.grouphealth.com',
      authToken: 'GHTP_TOKEN_789',
      endpoints: {
        eligibility: '/check',
        claims: '/process',
        preAuth: '/request'
      }
    },
    feeMultipliers: {
      'Laboratory': 0.92,
      'Pharmacy': 0.88,
      'Radiology': 0.98,
      'Emergency': 0.82,
      'Surgery': 1.08,
      'Cardiology': 1.02
    },
    corporateClients: [
      { clientId: 'GRP001', name: 'Small Business Alliance', employees: 500 },
      { clientId: 'GRP002', name: 'Professional Services Group', employees: 1200 },
      { clientId: 'GRP003', name: 'Retail Chain Collective', employees: 2800 }
    ]
  }
]

// Mock TPA processing history
let tpaProcessingHistory = [
  {
    Id: 1,
    chargeId: 2,
    tpaId: 1,
    patientId: 'P002',
    corporateClientId: 'CORP001',
    employeeId: 'EMP001',
    processedDate: new Date('2024-01-16'),
    status: 'processed',
    originalAmount: 25.50,
    adjustedAmount: 22.95,
    approvedAmount: 22.95,
    processingNotes: 'Processed automatically via Corporate Health TPA',
    batchId: 'BATCH_20240116_001'
  },
  {
    Id: 2,
    chargeId: 4,
    tpaId: 2,
    patientId: 'P004',
    corporateClientId: 'ENT001',
    employeeId: 'EMP004',
    processedDate: new Date('2024-01-17'),
    status: 'pending_review',
    originalAmount: 350.00,
    adjustedAmount: 280.00,
    approvedAmount: null,
    processingNotes: 'Manual review required for emergency services',
    batchId: null
  }
]

let nextProcessingId = 3

class TPAService {
  constructor() {
    this.configurations = tpaConfigurations
    this.processingHistory = tpaProcessingHistory
  }

  // Get all TPA configurations
  getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.configurations])
      }, 300)
    })
  }

  // Get TPA by ID
  getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tpa = this.configurations.find(t => t.Id === parseInt(id))
        if (tpa) {
          resolve({...tpa})
        } else {
          reject(new Error('TPA configuration not found'))
        }
      }, 200)
    })
  }

  // Process charge through TPA
  processCharge(chargeId) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const charge = await billingService.getById(chargeId)
          
          if (!charge.tpaId) {
            resolve({
              success: false,
              reason: 'No TPA assigned to this charge'
            })
            return
          }

          const tpa = this.configurations.find(t => t.Id === charge.tpaId)
          
          if (!tpa || !tpa.active) {
            resolve({
              success: false,
              reason: 'TPA not found or inactive'
            })
            return
          }

          // Calculate adjusted amount based on fee multipliers
          const departmentMultiplier = tpa.feeMultipliers[charge.department] || 1.0
          const adjustedAmount = charge.amount * departmentMultiplier

          // Simulate processing success/failure
          const processingSuccess = Math.random() > 0.05 // 95% success rate

          const processingResult = {
            Id: nextProcessingId++,
            chargeId: parseInt(chargeId),
            tpaId: charge.tpaId,
            patientId: charge.patientId,
            corporateClientId: this.getCorporateClientId(charge.patientId),
            employeeId: this.getEmployeeId(charge.patientId),
            processedDate: new Date(),
            status: processingSuccess ? (tpa.autoProcess ? 'processed' : 'pending_review') : 'rejected',
            originalAmount: charge.amount,
            adjustedAmount: adjustedAmount,
            approvedAmount: processingSuccess ? adjustedAmount : null,
            processingNotes: processingSuccess 
              ? (tpa.autoProcess ? 'Processed automatically' : 'Pending manual review')
              : 'Processing failed - invalid employee information',
            batchId: processingSuccess && tpa.autoProcess ? this.generateBatchId() : null
          }

          this.processingHistory.push(processingResult)

          // Update the charge with TPA processing status
          await billingService.processTPA(chargeId, {
            processed: processingSuccess,
            status: processingResult.status,
            approvedAmount: processingResult.approvedAmount
          })

          resolve({
            success: processingSuccess,
            reason: processingSuccess ? 'TPA processing completed' : 'Processing failed',
            processingResult
          })

        } catch (error) {
          resolve({
            success: false,
            reason: 'TPA processing error: ' + error.message
          })
        }
      }, 1500) // Simulate API processing time
    })
  }

  // Batch process multiple charges
  batchProcessCharges(chargeIds, tpaId) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const results = []
        const batchId = this.generateBatchId()
        
        for (const chargeId of chargeIds) {
          try {
            // Update charge to include TPA ID
            await billingService.update(chargeId, { tpaId })
            
            const result = await this.processCharge(chargeId)
            if (result.processingResult) {
              result.processingResult.batchId = batchId
            }
            results.push({
              chargeId,
              ...result
            })
          } catch (error) {
            results.push({
              chargeId,
              success: false,
              reason: error.message
            })
          }
        }
        
        resolve({
          batchId,
          totalProcessed: results.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          results
        })
      }, 3000)
    })
  }

  // Get TPA processing history
  getProcessingHistory(filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let history = [...this.processingHistory]
        
        if (filters.tpaId) {
          history = history.filter(h => h.tpaId === parseInt(filters.tpaId))
        }
        
        if (filters.status) {
          history = history.filter(h => h.status === filters.status)
        }
        
        if (filters.patientId) {
          history = history.filter(h => h.patientId === filters.patientId)
        }
        
        if (filters.dateFrom) {
          history = history.filter(h => 
            new Date(h.processedDate) >= new Date(filters.dateFrom)
          )
        }
        
        if (filters.dateTo) {
          history = history.filter(h => 
            new Date(h.processedDate) <= new Date(filters.dateTo)
          )
        }
        
        resolve(history.sort((a, b) => new Date(b.processedDate) - new Date(a.processedDate)))
      }, 300)
    })
  }

  // Get fee schedule for TPA and department
  getFeeSchedule(tpaId, department) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tpa = this.configurations.find(t => t.Id === parseInt(tpaId))
        if (!tpa) {
          reject(new Error('TPA not found'))
          return
        }

        const multiplier = tpa.feeMultipliers[department] || 1.0
        
        resolve({
          tpaName: tpa.name,
          feeSchedule: tpa.feeSchedule,
          department,
          multiplier,
          effectiveDate: new Date('2024-01-01'),
          processingTime: tpa.processingTime
        })
      }, 200)
    })
  }

  // Verify employee eligibility
  verifyEmployeeEligibility(patientId, corporateClientId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock employee verification
        const eligibility = {
          eligible: Math.random() > 0.1, // 90% eligible
          employeeId: this.getEmployeeId(patientId),
          corporateClientId,
          employmentStatus: 'active',
          coverageStartDate: new Date('2024-01-01'),
          coverageEndDate: new Date('2024-12-31'),
          dependents: Math.floor(Math.random() * 4),
          planType: 'comprehensive'
        }
        
        resolve(eligibility)
      }, 800)
    })
  }

  // Get corporate client information
  getCorporateClients(tpaId = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (tpaId) {
          const tpa = this.configurations.find(t => t.Id === parseInt(tpaId))
          resolve(tpa ? tpa.corporateClients : [])
        } else {
          const allClients = this.configurations
            .filter(t => t.active)
            .flatMap(t => t.corporateClients.map(c => ({
              ...c,
              tpaId: t.Id,
              tpaName: t.name
            })))
          resolve(allClients)
        }
      }, 300)
    })
  }

  // Generate TPA reports
  generateTPAReport(tpaId, dateFrom, dateTo) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tpa = this.configurations.find(t => t.Id === parseInt(tpaId))
        if (!tpa) {
          resolve(null)
          return
        }

        let history = this.processingHistory.filter(h => h.tpaId === parseInt(tpaId))
        
        // Filter by date range
        if (dateFrom) {
          history = history.filter(h => 
            new Date(h.processedDate) >= new Date(dateFrom)
          )
        }
        
        if (dateTo) {
          history = history.filter(h => 
            new Date(h.processedDate) <= new Date(dateTo)
          )
        }

        const report = {
          tpaInfo: {
            name: tpa.name,
            type: tpa.type,
            code: tpa.code,
            processingTime: tpa.processingTime,
            autoProcess: tpa.autoProcess
          },
          summary: {
            totalCharges: history.length,
            processedCharges: history.filter(h => h.status === 'processed').length,
            pendingCharges: history.filter(h => h.status === 'pending_review').length,
            rejectedCharges: history.filter(h => h.status === 'rejected').length,
            totalOriginalAmount: history.reduce((sum, h) => sum + h.originalAmount, 0),
            totalAdjustedAmount: history.reduce((sum, h) => sum + h.adjustedAmount, 0),
            totalApprovedAmount: history
              .filter(h => h.approvedAmount)
              .reduce((sum, h) => sum + h.approvedAmount, 0)
          },
          byDepartment: {},
          byCorporateClient: {}
        }

        // Group by department
        const departments = ['Laboratory', 'Pharmacy', 'Radiology', 'Emergency', 'Surgery', 'Cardiology']
        departments.forEach(dept => {
          const deptHistory = history.filter(h => {
            // This would need to be enhanced to link back to charge department
            return true // Simplified for mock
          })
          report.byDepartment[dept] = {
            count: deptHistory.length,
            multiplier: tpa.feeMultipliers[dept] || 1.0
          }
        })

        // Group by corporate client
        tpa.corporateClients.forEach(client => {
          const clientHistory = history.filter(h => h.corporateClientId === client.clientId)
          report.byCorporateClient[client.name] = {
            charges: clientHistory.length,
            employees: client.employees,
            totalAmount: clientHistory.reduce((sum, h) => sum + (h.approvedAmount || 0), 0)
          }
        })

        resolve(report)
      }, 600)
    })
  }

  // Helper methods
  getCorporateClientId(patientId) {
    // Mock mapping of patient to corporate client
    const mapping = {
      'P001': 'CORP001',
      'P002': 'CORP001',
      'P003': 'ENT001',
      'P004': 'ENT001',
      'P005': 'GRP001'
    }
    return mapping[patientId] || 'CORP001'
  }

  getEmployeeId(patientId) {
    // Mock mapping of patient to employee ID
    const mapping = {
      'P001': 'EMP001',
      'P002': 'EMP002',
      'P003': 'EMP003',
      'P004': 'EMP004',
      'P005': 'EMP005'
    }
    return mapping[patientId] || 'EMP' + patientId.substr(1).padStart(3, '0')
  }

  generateBatchId() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const time = Date.now().toString().slice(-6)
    return `BATCH_${date}_${time}`
  }

  // Update TPA configuration
  updateConfiguration(id, updateData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.configurations.findIndex(t => t.Id === parseInt(id))
        if (index !== -1) {
          this.configurations[index] = {
            ...this.configurations[index],
            ...updateData
          }
          resolve({...this.configurations[index]})
        } else {
          reject(new Error('TPA configuration not found'))
        }
      }, 300)
    })
  }

  // Test TPA connectivity
  testConnection(tpaId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tpa = this.configurations.find(t => t.Id === parseInt(tpaId))
        if (!tpa) {
          resolve({
            success: false,
            message: 'TPA not found'
          })
          return
        }

        // Simulate connection test
        const success = Math.random() > 0.1 // 90% success rate
        
        resolve({
          success,
          message: success 
            ? `Successfully connected to ${tpa.name}` 
            : `Failed to connect to ${tpa.name} - check configuration`,
          responseTime: Math.floor(Math.random() * 500) + 100, // 100-600ms
          endpoint: tpa.apiConfig.baseUrl
        })
      }, 1000)
    })
  }
}

export default new TPAService()