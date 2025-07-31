import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import doctorService from '@/services/api/doctorService'

const DoctorSchedules = () => {
  const [scheduleData, setScheduleData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [blockReason, setBlockReason] = useState('')
  const [blockType, setBlockType] = useState('break')
  const [emergencyPatientId, setEmergencyPatientId] = useState('')
  const [emergencyNotes, setEmergencyNotes] = useState('')

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const timeSlots = generateTimeSlots('08:00', '18:00', 30)

  useEffect(() => {
    loadScheduleData()
  }, [currentWeek])

  function generateTimeSlots(start, end, intervalMinutes) {
    const slots = []
    let current = start
    
    while (current <= end) {
      slots.push(current)
      const [hours, minutes] = current.split(':').map(Number)
      const totalMinutes = hours * 60 + minutes + intervalMinutes
      const newHours = Math.floor(totalMinutes / 60)
      const newMinutes = totalMinutes % 60
      current = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`
      
      if (newHours >= 18) break
    }
    
    return slots
  }

  const loadScheduleData = async () => {
    try {
      setLoading(true)
      setError(null)
      const weekStart = format(currentWeek, 'yyyy-MM-dd')
      const data = await doctorService.getWeeklySchedule(weekStart)
      setScheduleData(data)
    } catch (err) {
      setError('Failed to load schedule data')
      toast.error('Failed to load schedule data')
    } finally {
      setLoading(false)
    }
  }

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1))
  }

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1))
  }

  const handleCurrentWeek = () => {
    setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }))
  }

  const handleSlotClick = (doctorId, day, timeSlot, isBlocked, blockInfo) => {
    if (isBlocked && !blockInfo?.isEmergencySlot) {
      handleUnblockSlot(blockInfo.Id)
      return
    }

    if (isBlocked && blockInfo?.isEmergencySlot) {
      setSelectedSlot({ doctorId, day, timeSlot, blockInfo })
      setShowEmergencyModal(true)
      return
    }

    setSelectedSlot({ doctorId, day, timeSlot })
    setShowBlockModal(true)
  }

  const handleBlockSlot = async () => {
    try {
      const { doctorId, day, timeSlot } = selectedSlot
      const date = scheduleData[doctorId].days[day.toLowerCase()].date

      await doctorService.blockTimeSlot(doctorId, date, timeSlot, blockReason, blockType)
      
      toast.success(`Time slot blocked for ${blockReason}`)
      setShowBlockModal(false)
      setBlockReason('')
      setBlockType('break')
      setSelectedSlot(null)
      loadScheduleData()
    } catch (err) {
      toast.error(err.message || 'Failed to block time slot')
    }
  }

  const handleUnblockSlot = async (blockId) => {
    try {
      await doctorService.unblockTimeSlot(blockId)
      toast.success('Time slot unblocked successfully')
      loadScheduleData()
    } catch (err) {
      toast.error('Failed to unblock time slot')
    }
  }

  const handleEmergencyReservation = async () => {
    try {
      const { doctorId, day, timeSlot } = selectedSlot
      const date = scheduleData[doctorId].days[day.toLowerCase()].date

      await doctorService.reserveEmergencySlot(doctorId, date, timeSlot, emergencyPatientId, emergencyNotes)
      
      toast.success('Emergency slot reserved successfully')
      setShowEmergencyModal(false)
      setEmergencyPatientId('')
      setEmergencyNotes('')
      setSelectedSlot(null)
      loadScheduleData()
    } catch (err) {
      toast.error(err.message || 'Failed to reserve emergency slot')
    }
  }

  const getSlotStatus = (doctorId, day, timeSlot) => {
    const dayData = scheduleData[doctorId]?.days[day.toLowerCase()]
    if (!dayData || !dayData.workingHours) return { available: false, blocked: false }

    const { start, end } = dayData.workingHours
    if (timeSlot < start || timeSlot >= end) {
      return { available: false, blocked: false }
    }

    const blockedSlot = dayData.blockedSlots.find(slot => slot.timeSlot === timeSlot)
    if (blockedSlot) {
      return { 
        available: false, 
        blocked: true, 
        blockInfo: blockedSlot,
        isEmergency: blockedSlot.isEmergencySlot,
        isReserved: blockedSlot.reserved
      }
    }

    return { available: true, blocked: false }
  }

  const getLoadColor = (load) => {
    if (load >= 90) return 'bg-red-500'
    if (load >= 75) return 'bg-orange-500'
    if (load >= 50) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const filteredDoctors = Object.values(scheduleData).filter(item => {
    const doctor = item.doctor
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !selectedDepartment || doctor.departmentName === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const departments = [...new Set(Object.values(scheduleData).map(item => item.doctor.departmentName))]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadScheduleData} />

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Schedules</h1>
          <p className="text-gray-600">Manage doctor availability and time slots</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handlePreviousWeek}>
            <ApperIcon name="ChevronLeft" size={16} />
          </Button>
          <Button variant="outline" onClick={handleCurrentWeek}>
            Today
          </Button>
          <Button variant="outline" onClick={handleNextWeek}>
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>

      {/* Week Display */}
      <Card className="p-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Week of {format(currentWeek, 'MMMM d, yyyy')} - {format(addDays(currentWeek, 6), 'MMMM d, yyyy')}
          </h2>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search doctors or specializations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="input-field"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
            <span>Emergency Slot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span>Not Working</span>
          </div>
        </div>
      </Card>

      {/* Schedule Grid */}
      <Card className="p-4 overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2 w-48 border-b border-gray-200">
                  <div className="font-medium text-gray-900">Doctor</div>
                </th>
                {dayNames.map(day => (
                  <th key={day} className="text-center p-2 border-b border-gray-200 min-w-24">
                    <div className="font-medium text-gray-900">{day}</div>
                    <div className="text-xs text-gray-500">
                      {format(addDays(currentWeek, dayNames.indexOf(day)), 'MMM d')}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map(({ doctor, days }) => (
                <tr key={doctor.Id} className="border-b border-gray-100">
                  <td className="p-2 border-r border-gray-200">
                    <div className="font-medium text-gray-900">{doctor.name}</div>
                    <div className="text-sm text-gray-600">{doctor.specialization}</div>
                    <div className="text-xs text-gray-500">{doctor.departmentName}</div>
                  </td>
                  {dayNames.map(day => {
                    const dayKey = day.toLowerCase()
                    const dayData = days[dayKey]
                    const load = dayData?.appointmentLoad || 0
                    
                    return (
                      <td key={day} className="p-1 text-center">
                        {dayData?.workingHours ? (
                          <div className="space-y-1">
                            {/* Working Hours */}
                            <div className="text-xs text-gray-600">
                              {dayData.workingHours.start} - {dayData.workingHours.end}
                            </div>
                            
                            {/* Appointment Load */}
                            <div className="flex items-center justify-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${getLoadColor(load)}`}></div>
                              <span className="text-xs font-medium">{load}%</span>
                            </div>

                            {/* Time Slots Preview */}
                            <div className="grid grid-cols-4 gap-0.5 mt-2">
                              {timeSlots.slice(0, 16).map(timeSlot => {
                                const status = getSlotStatus(doctor.Id, day, timeSlot)
                                let bgColor = 'bg-gray-100'
                                
                                if (status.available) bgColor = 'bg-green-100'
                                else if (status.blocked && status.isEmergency) {
                                  bgColor = status.isReserved ? 'bg-purple-100' : 'bg-orange-100'
                                } else if (status.blocked) bgColor = 'bg-red-100'

                                return (
                                  <button
                                    key={timeSlot}
                                    onClick={() => handleSlotClick(doctor.Id, day, timeSlot, status.blocked, status.blockInfo)}
                                    className={`w-2 h-2 rounded-sm ${bgColor} hover:scale-150 transition-transform`}
                                    title={`${timeSlot} - ${status.blocked ? 
                                      (status.isEmergency ? 'Emergency Slot' : 'Blocked') : 
                                      (status.available ? 'Available' : 'Not Working')}`}
                                  />
                                )
                              })}
                            </div>

                            {/* Blocked Slots Count */}
                            {dayData.blockedSlots.length > 0 && (
                              <div className="text-xs text-gray-500">
                                {dayData.blockedSlots.length} blocked
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400">Not Working</div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Block Time Slot Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Block Time Slot</h3>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Block Type</label>
                <select
                  value={blockType}
                  onChange={(e) => setBlockType(e.target.value)}
                  className="input-field"
                >
                  <option value="break">Break</option>
                  <option value="meeting">Meeting</option>
                  <option value="surgery">Surgery</option>
                  <option value="emergency">Emergency Slot</option>
                  <option value="training">Training</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="form-label">Reason</label>
                <Input
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Enter reason for blocking..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowBlockModal(false)
                  setBlockReason('')
                  setBlockType('break')
                  setSelectedSlot(null)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBlockSlot}
                disabled={!blockReason.trim()}
              >
                Block Slot
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Slot Reservation Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reserve Emergency Slot</h3>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Patient ID</label>
                <Input
                  value={emergencyPatientId}
                  onChange={(e) => setEmergencyPatientId(e.target.value)}
                  placeholder="Enter patient ID..."
                />
              </div>

              <div>
                <label className="form-label">Notes</label>
                <textarea
                  value={emergencyNotes}
                  onChange={(e) => setEmergencyNotes(e.target.value)}
                  placeholder="Enter emergency details..."
                  className="input-field h-20 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEmergencyModal(false)
                  setEmergencyPatientId('')
                  setEmergencyNotes('')
                  setSelectedSlot(null)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEmergencyReservation}
                disabled={!emergencyPatientId.trim()}
              >
                Reserve Slot
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorSchedules