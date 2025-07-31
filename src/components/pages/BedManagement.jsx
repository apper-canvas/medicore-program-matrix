import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import bedService from "@/services/api/bedService"
import patientService from "@/services/api/patientService"
const BedManagement = () => {
const [beds, setBeds] = useState([])
  const [admissionQueue, setAdmissionQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedBed, setSelectedBed] = useState(null)
  const [showBedModal, setShowBedModal] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(null)
  const navigate = useNavigate()

  const statusConfig = {
    available: { color: "bg-green-500", label: "Available", textColor: "text-green-700" },
    occupied_stable: { color: "bg-yellow-500", label: "Occupied - Stable", textColor: "text-yellow-700" },
    occupied_critical: { color: "bg-red-500", label: "Occupied - Critical", textColor: "text-red-700" },
    maintenance: { color: "bg-blue-500", label: "Maintenance", textColor: "text-blue-700" },
    out_of_service: { color: "bg-gray-500", label: "Out of Service", textColor: "text-gray-700" }
  }

  const departments = [
    { id: "all", name: "All Departments" },
    { id: "ICU", name: "Intensive Care Unit" },
    { id: "General Ward", name: "General Ward" },
    { id: "Private Rooms", name: "Private Rooms" },
    { id: "Emergency", name: "Emergency Department" }
  ]

useEffect(() => {
    loadBeds()
    loadAdmissionQueue()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      loadBeds()
      loadAdmissionQueue()
    }, 30000)
    
    setRefreshInterval(interval)
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [])

  const loadAdmissionQueue = async () => {
    try {
      const queue = await bedService.getAdmissionQueue()
      setAdmissionQueue(queue)
    } catch (error) {
      console.error("Failed to load admission queue:", error)
    }
  }

  const loadBeds = async () => {
    try {
      setLoading(true)
      const bedsData = await bedService.getAll()
      setBeds(bedsData)
      setError(null)
    } catch (err) {
      setError("Failed to load bed data")
      toast.error("Failed to load bed data")
    } finally {
      setLoading(false)
    }
}

  const handleBedStatusUpdate = async (bedId, newStatus) => {
    try {
      await bedService.updateBedStatus(bedId, newStatus)
      setBeds(beds.map(bed => 
        bed.Id === bedId ? { ...bed, status: newStatus } : bed
      ))
      toast.success("Bed status updated successfully")
    } catch (err) {
      toast.error("Failed to update bed status")
    }
  }

  const handleBedClick = (bed) => {
    setSelectedBed(bed)
    setShowBedModal(true)
  }

  const filteredBeds = beds.filter(bed => {
    const matchesSearch = bed.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bed.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (bed.patientName && bed.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesDepartment = selectedDepartment === "all" || bed.department === selectedDepartment
    const matchesStatus = selectedStatus === "all" || bed.status === selectedStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

const getBedStats = () => {
    const stats = {
      total: beds.length,
      available: beds.filter(b => b.status === "available").length,
      occupied: beds.filter(b => b.status.startsWith("occupied")).length,
      maintenance: beds.filter(b => b.status === "maintenance").length,
      outOfService: beds.filter(b => b.status === "out_of_service").length
    }
    stats.occupancyRate = Math.round((stats.occupied / stats.total) * 100) || 0
    return stats
  }

  const getDepartmentStats = () => {
    const departments = [...new Set(beds.map(b => b.department))]
    return departments.map(dept => {
      const deptBeds = beds.filter(b => b.department === dept)
      const occupied = deptBeds.filter(b => b.status.startsWith("occupied")).length
      const total = deptBeds.length
      const occupancyRate = Math.round((occupied / total) * 100) || 0
      
      return {
        department: dept,
        total,
        occupied,
        available: deptBeds.filter(b => b.status === "available").length,
        critical: deptBeds.filter(b => b.status === "occupied_critical").length,
        occupancyRate,
        status: occupancyRate >= 90 ? 'critical' : occupancyRate >= 70 ? 'warning' : 'normal'
      }
    })
  }

  const calculatePriority = (patient) => {
    let score = 0
    
    // Medical condition priority
    if (patient.condition === 'critical') score += 10
    else if (patient.condition === 'urgent') score += 7
    else if (patient.condition === 'moderate') score += 4
    else score += 1
    
    // Wait time priority (1 point per hour waiting)
    const waitHours = Math.floor((Date.now() - new Date(patient.requestTime).getTime()) / (1000 * 60 * 60))
    score += Math.min(waitHours, 10)
    
    // Age factor (elderly patients get priority)
    const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
    if (age >= 70) score += 3
    else if (age >= 60) score += 2
    
    return Math.min(score, 20) // Cap at 20
  }

  const assignBedFromQueue = async (queueItemId, bedId) => {
    try {
      await bedService.assignBedFromQueue(queueItemId, bedId)
      await loadBeds()
      await loadAdmissionQueue()
      toast.success("Patient assigned to bed successfully")
    } catch (error) {
      toast.error("Failed to assign bed: " + error.message)
    }
  }
  const stats = getBedStats()

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadBeds} />

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bed Management</h1>
        <p className="text-gray-600">Monitor and manage hospital bed occupancy</p>
      </div>

{/* Real-time Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Beds</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ApperIcon name="Hospital" className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
            <ApperIcon name="CheckCircle" className="h-8 w-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.occupied}</p>
            </div>
            <ApperIcon name="User" className="h-8 w-8 text-yellow-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Queue Length</p>
              <p className="text-2xl font-bold text-red-600">{admissionQueue.length}</p>
            </div>
            <ApperIcon name="Clock" className="h-8 w-8 text-red-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy</p>
              <p className="text-2xl font-bold text-primary-600">{stats.occupancyRate}%</p>
            </div>
            <ApperIcon name="TrendingUp" className="h-8 w-8 text-primary-400" />
          </div>
        </Card>
      </div>

      {/* Department Occupancy Breakdown */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Department Occupancy</h3>
          <div className="flex items-center text-sm text-gray-500">
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-1" />
            Real-time updates
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getDepartmentStats().map((dept) => (
            <div key={dept.department} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{dept.department}</h4>
                <Badge 
                  variant={dept.status === 'critical' ? 'destructive' : dept.status === 'warning' ? 'warning' : 'default'}
                  className="text-xs"
                >
                  {dept.occupancyRate}%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total: {dept.total}</span>
                  <span className="text-gray-600">Available: {dept.available}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      dept.status === 'critical' ? 'bg-red-500' : 
                      dept.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${dept.occupancyRate}%` }}
                  ></div>
                </div>
                
                {dept.critical > 0 && (
                  <div className="flex items-center text-xs text-red-600">
                    <ApperIcon name="AlertTriangle" className="h-3 w-3 mr-1" />
                    {dept.critical} critical patient{dept.critical > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Admission Queue */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Admission Queue ({admissionQueue.length} waiting)
          </h3>
          <Button
            onClick={() => {
              loadAdmissionQueue()
              toast.info("Queue refreshed")
            }}
            variant="secondary"
            size="sm"
          >
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {admissionQueue.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="CheckCircle" className="h-12 w-12 mx-auto mb-2 text-green-400" />
            <p>No patients waiting for admission</p>
          </div>
        ) : (
          <div className="space-y-3">
            {admissionQueue
              .sort((a, b) => calculatePriority(b) - calculatePriority(a))
              .map((patient) => {
                const priority = calculatePriority(patient)
                const waitTime = Math.floor((Date.now() - new Date(patient.requestTime).getTime()) / (1000 * 60 * 60))
                const availableBeds = beds.filter(b => 
                  b.status === "available" && 
                  b.department === patient.preferredDepartment
                )

                return (
                  <div key={patient.Id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          priority >= 15 ? 'bg-red-500' : 
                          priority >= 10 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Requested: {patient.preferredDepartment}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge 
                          variant={priority >= 15 ? 'destructive' : priority >= 10 ? 'warning' : 'default'}
                          className="mb-1"
                        >
                          Priority: {priority}/20
                        </Badge>
                        <p className="text-xs text-gray-500">
                          Waiting: {waitTime}h
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div>
                        <span className="text-xs text-gray-500">Condition</span>
                        <p className={`text-sm font-medium ${
                          patient.condition === 'critical' ? 'text-red-600' :
                          patient.condition === 'urgent' ? 'text-yellow-600' :
                          patient.condition === 'moderate' ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {patient.condition.charAt(0).toUpperCase() + patient.condition.slice(1)}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Age</span>
                        <p className="text-sm">
                          {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Available Beds</span>
                        <p className="text-sm font-medium">
                          {availableBeds.length} in {patient.preferredDepartment}
                        </p>
                      </div>
                    </div>

                    {availableBeds.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {availableBeds.slice(0, 3).map((bed) => (
                          <Button
                            key={bed.Id}
                            onClick={() => assignBedFromQueue(patient.Id, bed.Id)}
                            variant="primary"
                            size="sm"
                          >
                            Assign to {bed.bedNumber}
                          </Button>
                        ))}
                        {availableBeds.length > 3 && (
                          <span className="text-sm text-gray-500 py-1">
                            +{availableBeds.length - 3} more beds
                          </span>
                        )}
                      </div>
                    )}

                    {availableBeds.length === 0 && (
                      <div className="text-sm text-yellow-600">
                        <ApperIcon name="Clock" className="h-4 w-4 inline mr-1" />
                        No beds available in preferred department
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        )}
      </Card>
      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search beds, departments, or patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied_stable">Occupied - Stable</option>
            <option value="occupied_critical">Occupied - Critical</option>
            <option value="maintenance">Maintenance</option>
            <option value="out_of_service">Out of Service</option>
          </select>
        </div>
      </Card>

      {/* Hospital Floor Plan View */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Hospital Floor Plan</h2>
        
        {departments.slice(1).map(department => {
          const departmentBeds = filteredBeds.filter(bed => bed.department === department.id)
          
          if (departmentBeds.length === 0) return null
          
          return (
            <div key={department.id} className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ApperIcon name="MapPin" className="h-5 w-5 mr-2 text-gray-500" />
                {department.name}
                <Badge variant="secondary" className="ml-2">
                  {departmentBeds.length} beds
                </Badge>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {departmentBeds.map(bed => (
                  <div
                    key={bed.Id}
                    onClick={() => handleBedClick(bed)}
                    className="relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md"
                    style={{
                      borderColor: statusConfig[bed.status]?.color.replace('bg-', '').includes('green') ? '#10b981' :
                                  statusConfig[bed.status]?.color.replace('bg-', '').includes('yellow') ? '#f59e0b' :
                                  statusConfig[bed.status]?.color.replace('bg-', '').includes('red') ? '#ef4444' :
                                  statusConfig[bed.status]?.color.replace('bg-', '').includes('blue') ? '#3b82f6' : '#6b7280'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{bed.bedNumber}</span>
                      <div 
                        className={`w-3 h-3 rounded-full ${statusConfig[bed.status]?.color}`}
                      ></div>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-1">
                      {statusConfig[bed.status]?.label}
                    </div>
                    
                    {bed.patientName && (
                      <div className="text-xs font-medium text-gray-900 truncate">
                        {bed.patientName}
                      </div>
                    )}
                    
                    {bed.status.startsWith('occupied') && bed.admissionDate && (
                      <div className="text-xs text-gray-500">
                        {new Date(bed.admissionDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
</Card>

      {/* Priority & Status Legend */}
      <Card className="p-4 mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Bed Status</h4>
            <div className="flex flex-wrap gap-4">
              {Object.entries(statusConfig).map(([status, config]) => (
                <div key={status} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${config.color}`}></div>
                  <span className="text-sm text-gray-600">{config.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Priority Levels</h4>
            <div className="space-y-1">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
                <span className="text-sm text-gray-600">High Priority (15-20)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-yellow-500"></div>
                <span className="text-sm text-gray-600">Medium Priority (10-14)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                <span className="text-sm text-gray-600">Low Priority (1-9)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      {/* Bed Details Modal */}
      {showBedModal && selectedBed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Bed {selectedBed.bedNumber}</h3>
              <button
                onClick={() => setShowBedModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <p className="text-gray-900">{selectedBed.department}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${statusConfig[selectedBed.status]?.color}`}></div>
                  <span className={statusConfig[selectedBed.status]?.textColor}>
                    {statusConfig[selectedBed.status]?.label}
                  </span>
                </div>
              </div>

              {selectedBed.patientName && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                    <p className="text-gray-900">{selectedBed.patientName}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
                    <p className="text-gray-900">{new Date(selectedBed.admissionDate).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attending Doctor</label>
                    <p className="text-gray-900">{selectedBed.attendingDoctor}</p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                <select
                  value={selectedBed.status}
                  onChange={(e) => handleBedStatusUpdate(selectedBed.Id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <option key={status} value={status}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowBedModal(false)}
                variant="secondary"
                className="flex-1"
              >
                Close
              </Button>
              {selectedBed.patientName && (
                <Button
                  onClick={() => {
                    navigate(`/patients/${selectedBed.patientId}`)
                    setShowBedModal(false)
                  }}
                  className="flex-1"
                >
                  View Patient
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BedManagement