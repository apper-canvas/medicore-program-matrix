import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addMonths, eachDayOfInterval, endOfMonth, format, isSameDay, isToday, startOfMonth, subMonths } from "date-fns";
import appointmentService from "@/services/api/appointmentService";
import departmentService from "@/services/api/departmentService";
import doctorService from "@/services/api/doctorService";
import ApperIcon from "@/components/ApperIcon";
import AppointmentBookingModal from "@/components/organisms/AppointmentBookingModal";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
const Appointments = () => {
const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [viewMode, setViewMode] = useState("month"); // month or week
  const [calendarDays, setCalendarDays] = useState([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");

  useEffect(() => {
    loadData();
  }, [currentDate]);

const loadData = async () => {
    setLoading(true);
    try {
      const [appointmentsData, departmentsData, doctorsData, todaysData] = await Promise.all([
        appointmentService.getByDateRange(
          format(startOfMonth(currentDate), 'yyyy-MM-dd'),
          format(endOfMonth(currentDate), 'yyyy-MM-dd')
        ),
        departmentService.getAll(),
        doctorService.getAll(),
        appointmentService.getTodaysAppointments()
      ]);
      
      setAppointments(appointmentsData);
      setDepartments(departmentsData);
      setDoctors(doctorsData);
      setTodaysAppointments(todaysData);
      
      // Generate calendar days
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const days = eachDayOfInterval({ start, end });
      setCalendarDays(days);
      
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever filter states or appointments change
  useEffect(() => {
    applyFilters();
  }, [appointments, searchTerm, selectedDepartment, selectedDoctor, selectedStatus, dateRangeStart, dateRangeEnd]);

  const applyFilters = () => {
    let filtered = [...appointments];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(apt => 
        apt.patientName.toLowerCase().includes(searchLower) ||
        apt.doctorName.toLowerCase().includes(searchLower)
      );
    }

    // Apply department filter
    if (selectedDepartment) {
      filtered = filtered.filter(apt => apt.departmentId === parseInt(selectedDepartment));
    }

    // Apply doctor filter
    if (selectedDoctor) {
      filtered = filtered.filter(apt => apt.doctorId === parseInt(selectedDoctor));
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter(apt => apt.status === selectedStatus);
    }

    // Apply date range filter
    if (dateRangeStart) {
      filtered = filtered.filter(apt => apt.date >= dateRangeStart);
    }
    if (dateRangeEnd) {
      filtered = filtered.filter(apt => apt.date <= dateRangeEnd);
    }

    setFilteredAppointments(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("");
    setSelectedDoctor("");
    setSelectedStatus("");
    setDateRangeStart("");
    setDateRangeEnd("");
    toast.success("Filters cleared");
  };

  const getFilteredDoctors = () => {
    if (!selectedDepartment) return doctors;
    return doctors.filter(doctor => doctor.departmentId === parseInt(selectedDepartment));
  };

  const getDepartmentColor = (departmentId) => {
    const department = departments.find(d => d.Id === departmentId);
    return department?.color || "#6B7280";
  };

const getAppointmentsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredAppointments.filter(apt => apt.date === dateStr);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleScheduleNew = (date = null) => {
    setSelectedDate(date);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    loadData();
    setSelectedDate(null);
  };

const handleQuickAction = async (appointmentId, action, reason = "") => {
    try {
      switch (action) {
        case "checkin":
          await appointmentService.checkIn(appointmentId);
          toast.success("Patient checked in successfully");
          break;
        case "start":
          await appointmentService.startAppointment(appointmentId);
          toast.success("Appointment started");
          break;
        case "complete":
          await appointmentService.complete(appointmentId, reason);
          toast.success("Appointment completed");
          break;
        case "cancel":
          await appointmentService.cancel(appointmentId, reason);
          toast.success("Appointment cancelled");
          break;
        default:
          break;
      }
      loadData();
    } catch (error) {
      toast.error(`Failed to ${action} appointment`);
    }
  };

  const getStatusVariant = (status) => {
switch (status) {
      case "scheduled": return "info";
      case "checked-in": return "warning";
      case "in-progress": return "in-progress";
      case "completed": return "success";
      case "cancelled": return "error";
      default: return "default";
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage patient appointments and scheduling</p>
        </div>
        <Button onClick={() => handleScheduleNew()}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Schedule New
        </Button>
</div>

      {/* Search and Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Search & Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="X" size={16} className="mr-1" />
              Clear Filters
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <SearchBar
                placeholder="Search by patient or doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.Id} value={dept.Id}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Doctor Filter */}
            <div>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="">All Doctors</option>
                {getFilteredDoctors().map(doctor => (
                  <option key={doctor.Id} value={doctor.Id}>{doctor.name}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="checked-in">Checked In</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="Start Date"
                value={dateRangeStart}
                onChange={(e) => setDateRangeStart(e.target.value)}
                className="text-sm"
              />
              <Input
                type="date"
                placeholder="End Date"
                value={dateRangeEnd}
                onChange={(e) => setDateRangeEnd(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedDepartment || selectedDoctor || selectedStatus || dateRangeStart || dateRangeEnd) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-gray-600 font-medium">Active filters:</span>
              {searchTerm && (
                <Badge variant="info" className="text-xs">
                  Search: "{searchTerm}"
                </Badge>
              )}
              {selectedDepartment && (
                <Badge variant="info" className="text-xs">
                  Department: {departments.find(d => d.Id === parseInt(selectedDepartment))?.name}
                </Badge>
              )}
              {selectedDoctor && (
                <Badge variant="info" className="text-xs">
                  Doctor: {doctors.find(d => d.Id === parseInt(selectedDoctor))?.name}
                </Badge>
              )}
              {selectedStatus && (
                <Badge variant="info" className="text-xs">
                  Status: {selectedStatus}
                </Badge>
              )}
              {dateRangeStart && (
                <Badge variant="info" className="text-xs">
                  From: {format(new Date(dateRangeStart), 'MMM d, yyyy')}
                </Badge>
              )}
              {dateRangeEnd && (
                <Badge variant="info" className="text-xs">
                  To: {format(new Date(dateRangeEnd), 'MMM d, yyyy')}
                </Badge>
              )}
              <span className="text-xs text-gray-500">
                ({filteredAppointments.length} of {appointments.length} appointments)
              </span>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth("prev")}
                  >
                    <ApperIcon name="ChevronLeft" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth("next")}
                  >
                    <ApperIcon name="ChevronRight" size={16} />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "month" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                >
                  Month
                </Button>
                <Button
                  variant={viewMode === "week" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("week")}
                >
                  Week
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              {calendarDays.map(day => {
                const dayAppointments = getAppointmentsForDate(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);
                
                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-[80px] p-2 border cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary-50 border-primary-300"
                        : isTodayDate
                        ? "bg-blue-50 border-blue-300"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className={`text-sm font-medium ${
                      isTodayDate ? "text-blue-600" : "text-gray-900"
                    }`}>
                      {format(day, 'd')}
                    </div>
<div className="space-y-1 mt-1">
                      {dayAppointments.slice(0, 2).map(apt => (
                        <div
                          key={apt.Id}
                          className={`w-full h-4 rounded text-xs text-white px-1 truncate relative ${
                            apt.hasConflicts ? 'ring-2 ring-orange-400' : ''
                          }`}
                          style={{ backgroundColor: getDepartmentColor(apt.departmentId) }}
                          title={`${apt.patientName} - ${apt.doctorName}${apt.hasConflicts ? ' (Has Conflicts)' : ''}`}
                        >
                          {apt.hasConflicts && (
                            <ApperIcon 
                              name="AlertTriangle" 
                              size={8} 
                              className="absolute -top-1 -right-1 text-orange-500 bg-white rounded-full"
                            />
                          )}
                          {apt.time}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayAppointments.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Date Details */}
            {selectedDate && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <Button
                    size="sm"
                    onClick={() => handleScheduleNew(format(selectedDate, 'yyyy-MM-dd'))}
                  >
                    <ApperIcon name="Plus" size={14} className="mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {getAppointmentsForDate(selectedDate).map(apt => (
                    <div
                      key={apt.Id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{apt.patientName}</div>
                        <div className="text-sm text-gray-600">
                          {apt.time} • {apt.doctorName} • {apt.departmentName}
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(apt.status)}>
                        {apt.status}
                      </Badge>
                    </div>
                  ))}
                  {getAppointmentsForDate(selectedDate).length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No appointments scheduled for this date
                    </p>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Panel - Management */}
        <div className="space-y-6">
          {/* Today's Appointments */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Today's Appointments</h3>
            <div className="space-y-3">
              {todaysAppointments.map(apt => (
                <div key={apt.Id} className="border border-gray-200 rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{apt.patientName}</div>
                    <Badge variant={getStatusVariant(apt.status)}>
                      {apt.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <div>{apt.time} • {apt.doctorName}</div>
                    <div>{apt.departmentName} • {apt.type}</div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex space-x-2">
                    {apt.status === "scheduled" && (
                      <Button
                        size="sm"
                        variant="accent"
                        onClick={() => handleQuickAction(apt.Id, "checkin")}
                      >
                        Check In
                      </Button>
)}
                    {apt.status === "checked-in" && (
                      <Button
                        size="sm"
                        variant="accent"
                        onClick={() => handleQuickAction(apt.Id, "start")}
                      >
                        Start
                      </Button>
                    )}
                    {apt.status === "in-progress" && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleQuickAction(apt.Id, "complete")}
                      >
                        Complete
                      </Button>
                    )}
                    {apt.status !== "completed" && apt.status !== "cancelled" && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            const reason = prompt("Reason for cancellation:");
                            if (reason) handleQuickAction(apt.Id, "cancel", reason);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedDate(new Date(apt.date))}
                        >
                          <ApperIcon name="Calendar" size={14} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {todaysAppointments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Calendar" size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </Card>

          {/* Department Legend */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Departments</h3>
            <div className="space-y-2">
              {departments.map(dept => (
                <div key={dept.Id} className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-sm">{dept.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <AppointmentBookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedDate(null);
        }}
        onSuccess={handleBookingSuccess}
        selectedDate={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null}
      />
    </div>
  );
}

export default Appointments