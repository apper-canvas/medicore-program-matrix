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
    status: 'pending',
    insuranceVerified: false,
    tpaProcessed: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
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
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
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
    status: 'paid',
    insuranceVerified: true,
    tpaProcessed: false,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-17')
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
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
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
}

export default new BillingService()