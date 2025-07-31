import mockBeds from "@/services/mockData/beds.json"

let beds = [...mockBeds]

const bedService = {
  // Get all beds
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...beds])
      }, 100)
    })
  },

  // Get bed by ID
  getById: async (id) => {
    if (typeof id !== 'number') {
      throw new Error('Bed ID must be a number')
    }
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bed = beds.find(b => b.Id === id)
        if (bed) {
          resolve({ ...bed })
        } else {
          reject(new Error('Bed not found'))
        }
      }, 100)
    })
  },

  // Get beds by department
  getByDepartment: async (department) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const departmentBeds = beds.filter(bed => bed.department === department)
        resolve([...departmentBeds])
      }, 100)
    })
  },

  // Get beds by status
  getByStatus: async (status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const statusBeds = beds.filter(bed => bed.status === status)
        resolve([...statusBeds])
      }, 100)
    })
  },

  // Update bed status
  updateBedStatus: async (id, status) => {
    if (typeof id !== 'number') {
      throw new Error('Bed ID must be a number')
    }

    const validStatuses = ['available', 'occupied_stable', 'occupied_critical', 'maintenance', 'out_of_service']
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid bed status')
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bedIndex = beds.findIndex(b => b.Id === id)
        if (bedIndex !== -1) {
          beds[bedIndex] = { ...beds[bedIndex], status }
          resolve({ ...beds[bedIndex] })
        } else {
          reject(new Error('Bed not found'))
        }
      }, 100)
    })
  },

  // Assign patient to bed
  assignPatient: async (bedId, patientData) => {
    if (typeof bedId !== 'number') {
      throw new Error('Bed ID must be a number')
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bedIndex = beds.findIndex(b => b.Id === bedId)
        if (bedIndex !== -1) {
          if (beds[bedIndex].status !== 'available') {
            reject(new Error('Bed is not available'))
            return
          }

          beds[bedIndex] = {
            ...beds[bedIndex],
            status: patientData.isCritical ? 'occupied_critical' : 'occupied_stable',
            patientId: patientData.patientId,
            patientName: patientData.patientName,
            admissionDate: patientData.admissionDate || new Date().toISOString(),
            attendingDoctor: patientData.attendingDoctor
          }
          resolve({ ...beds[bedIndex] })
        } else {
          reject(new Error('Bed not found'))
        }
      }, 100)
    })
  },

  // Discharge patient from bed
  dischargePatient: async (bedId) => {
    if (typeof bedId !== 'number') {
      throw new Error('Bed ID must be a number')
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bedIndex = beds.findIndex(b => b.Id === bedId)
        if (bedIndex !== -1) {
          beds[bedIndex] = {
            ...beds[bedIndex],
            status: 'available',
            patientId: null,
            patientName: null,
            admissionDate: null,
            attendingDoctor: null
          }
          resolve({ ...beds[bedIndex] })
        } else {
          reject(new Error('Bed not found'))
        }
      }, 100)
    })
  },

  // Get bed statistics
getStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Enhanced null safety for bed status filtering with comprehensive validation
        const validBeds = beds.filter(bed => 
          bed && 
          typeof bed === 'object' && 
          bed.hasOwnProperty('bedNumber') && 
          bed.hasOwnProperty('status')
        );
        
        const stats = {
          total: validBeds.length,
          available: validBeds.filter(b => {
            const status = b.status?.toString?.() || '';
            return status === 'available';
          }).length,
          occupied: validBeds.filter(b => {
            const status = b.status?.toString?.() || '';
            return status && typeof status === 'string' && status.startsWith('occupied');
          }).length,
          critical: validBeds.filter(b => {
            const status = b.status?.toString?.() || '';
            return status === 'occupied_critical';
          }).length,
          maintenance: validBeds.filter(b => {
            const status = b.status?.toString?.() || '';
            return status === 'maintenance';
          }).length,
          outOfService: validBeds.filter(b => {
            const status = b.status?.toString?.() || '';
            return status === 'out_of_service';
          }).length
        }
        stats.occupancyRate = stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0;
        resolve(stats);
      }, 100)
    })
  },

  // Create new bed
  create: async (bedData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBed = {
          Id: Math.max(...beds.map(b => b.Id)) + 1,
          bedNumber: bedData.bedNumber,
          department: bedData.department,
          status: 'available',
          patientId: null,
          patientName: null,
          admissionDate: null,
          attendingDoctor: null,
          roomType: bedData.roomType || 'standard',
          floor: bedData.floor || 1
        }
        beds.push(newBed)
        resolve({ ...newBed })
      }, 100)
    })
  },

  // Update bed information
  update: async (id, bedData) => {
    if (typeof id !== 'number') {
      throw new Error('Bed ID must be a number')
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bedIndex = beds.findIndex(b => b.Id === id)
        if (bedIndex !== -1) {
          beds[bedIndex] = { ...beds[bedIndex], ...bedData, Id: id }
          resolve({ ...beds[bedIndex] })
        } else {
          reject(new Error('Bed not found'))
        }
      }, 100)
    })
  },

  // Delete bed
  delete: async (id) => {
    if (typeof id !== 'number') {
      throw new Error('Bed ID must be a number')
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bedIndex = beds.findIndex(b => b.Id === id)
        if (bedIndex !== -1) {
          const deletedBed = beds.splice(bedIndex, 1)[0]
          resolve({ ...deletedBed })
        } else {
          reject(new Error('Bed not found'))
        }
      }, 100)
})
  },

  // Get admission queue
  getAdmissionQueue: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // This would typically come from a separate queue service
        // For now, we'll simulate queue data from the beds.json file
        import("@/services/mockData/beds.json").then(data => {
          const queueData = data.default.filter(item => item.firstName && item.condition)
          resolve([...queueData])
        })
      }, 100)
    })
  },

  // Assign bed from admission queue
  assignBedFromQueue: async (queueItemId, bedId) => {
    if (typeof bedId !== 'number') {
      throw new Error('Bed ID must be a number')
    }

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          // Get queue item
          const queueData = await import("@/services/mockData/beds.json")
          const queueItem = queueData.default.find(item => item.Id === queueItemId)
          
          if (!queueItem) {
            reject(new Error('Queue item not found'))
            return
          }

          // Find and assign bed
          const bedIndex = beds.findIndex(b => b.Id === bedId)
          if (bedIndex === -1) {
            reject(new Error('Bed not found'))
            return
          }

          if (beds[bedIndex].status !== 'available') {
            reject(new Error('Bed is not available'))
            return
          }

          // Assign patient to bed
          const isCritical = queueItem.condition === 'critical'
          beds[bedIndex] = {
            ...beds[bedIndex],
            status: isCritical ? 'occupied_critical' : 'occupied_stable',
            patientId: queueItem.Id,
            patientName: `${queueItem.firstName} ${queueItem.lastName}`,
            admissionDate: new Date().toISOString(),
            attendingDoctor: "Dr. " + (isCritical ? "Emergency Physician" : "General Physician")
          }

          resolve({ ...beds[bedIndex] })
        } catch (error) {
          reject(error)
        }
      }, 200)
    })
  },

  // Update queue priority (for future use)
  updateQueuePriority: async (queueItemId, newPriority) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // This would update priority in queue management system
        resolve({ success: true, queueItemId, newPriority })
      }, 100)
    })
  }
}

export default bedService