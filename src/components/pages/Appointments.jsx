import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addMonths, eachDayOfInterval, endOfMonth, format, isSameDay, isToday, startOfMonth, subMonths } from "date-fns";
import appointmentService from "@/services/api/appointmentService";
import departmentService from "@/services/api/departmentService";
import ApperIcon from "@/components/ApperIcon";
import AppointmentBookingModal from "@/components/organisms/AppointmentBookingModal";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
const Appointments = () => {
const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [viewMode, setViewMode] = useState("month"); // month or week
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appointmentsData, departmentsData, todaysData] = await Promise.all([
        appointmentService.getByDateRange(
          format(startOfMonth(currentDate), 'yyyy-MM-dd'),
          format(endOfMonth(currentDate), 'yyyy-MM-dd')
        ),
        departmentService.getAll(),
        appointmentService.getTodaysAppointments()
      ]);
      
      setAppointments(appointmentsData);
      setDepartments(departmentsData);
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

  const getDepartmentColor = (departmentId) => {
    const department = departments.find(d => d.Id === departmentId);
    return department?.color || "#6B7280";
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.date === dateStr);
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
                          className="w-full h-4 rounded text-xs text-white px-1 truncate"
                          style={{ backgroundColor: getDepartmentColor(apt.departmentId) }}
                          title={`${apt.patientName} - ${apt.doctorName}`}
                        >
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