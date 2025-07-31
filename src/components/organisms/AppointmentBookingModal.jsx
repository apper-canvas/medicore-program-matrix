import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import FormField from "@/components/molecules/FormField";
import patientService from "@/services/api/patientService";
import doctorService from "@/services/api/doctorService";
import departmentService from "@/services/api/departmentService";
import appointmentService from "@/services/api/appointmentService";

const AppointmentBookingModal = ({ isOpen, onClose, onSuccess, selectedDate = null }) => {
const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [patientSearch, setPatientSearch] = useState("");
  const [conflicts, setConflicts] = useState([]);
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    doctorId: "",
    doctorName: "",
    departmentId: "",
    departmentName: "",
    date: selectedDate || new Date().toISOString().split('T')[0],
    time: "",
    type: "Consultation",
    duration: 30,
    notes: ""
  });
  const [errors, setErrors] = useState({});

useEffect(() => {
    if (isOpen) {
      loadData();
      if (selectedDate) {
        setFormData(prev => ({ ...prev, date: selectedDate }));
      }
    }
  }, [isOpen, selectedDate]);

  useEffect(() => {
    if (formData.doctorId && formData.date) {
      loadAvailableSlots();
    }
  }, [formData.doctorId, formData.date]);

  useEffect(() => {
    if (formData.patientId && formData.doctorId && formData.date && formData.time) {
      checkForConflicts();
    }
  }, [formData.patientId, formData.doctorId, formData.date, formData.time]);

  const checkForConflicts = async () => {
    try {
      const conflictData = await appointmentService.validateAppointmentSlot(formData);
      setConflicts(conflictData);
      setShowConflictWarning(conflictData.length > 0);
    } catch (error) {
      console.error("Error checking conflicts:", error);
    }
  };

  const loadData = async () => {
    try {
      const [patientsData, doctorsData, departmentsData] = await Promise.all([
        patientService.getAll(),
        doctorService.getAll(),
        departmentService.getActiveOnly()
      ]);
      setPatients(patientsData);
      setDoctors(doctorsData);
      setDepartments(departmentsData);
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const loadAvailableSlots = async () => {
    try {
      const slots = await doctorService.getAvailableSlots(formData.doctorId, formData.date);
      setAvailableSlots(slots);
    } catch (error) {
      toast.error("Failed to load available slots");
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.firstName.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.patientId.includes(patientSearch)
  );

  const handlePatientSelect = (patient) => {
    setFormData(prev => ({
      ...prev,
      patientId: patient.Id,
      patientName: `${patient.firstName} ${patient.lastName}`
    }));
    setPatientSearch("");
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    const doctor = doctors.find(d => d.Id === parseInt(doctorId));
    setFormData(prev => ({
      ...prev,
      doctorId,
      doctorName: doctor?.name || "",
      departmentId: doctor?.departmentId || "",
      departmentName: doctor?.departmentName || "",
      time: "" // Reset time when doctor changes
    }));
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    const department = departments.find(d => d.Id === parseInt(departmentId));
    setFormData(prev => ({
      ...prev,
      departmentId,
      departmentName: department?.name || "",
      doctorId: "", // Reset doctor when department changes
      doctorName: "",
      time: ""
    }));
  };

const validateForm = () => {
    const newErrors = {};
    if (!formData.patientId) newErrors.patient = "Patient is required";
    if (!formData.doctorId) newErrors.doctor = "Doctor is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.type) newErrors.type = "Appointment type is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Show confirmation if conflicts exist
    if (conflicts.length > 0) {
      const confirmMessage = `This appointment has ${conflicts.length} conflict(s). Do you want to proceed anyway?`;
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    setLoading(true);
    try {
      await appointmentService.create(formData);
      if (conflicts.length > 0) {
        toast.warning("Appointment scheduled with conflicts - please review");
      } else {
        toast.success("Appointment scheduled successfully");
      }
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      toast.error("Failed to schedule appointment");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      patientName: "",
      doctorId: "",
      doctorName: "",
      departmentId: "",
      departmentName: "",
      date: new Date().toISOString().split('T')[0],
      time: "",
      type: "Consultation",
      notes: ""
    });
    setPatientSearch("");
    setErrors({});
    setAvailableSlots([]);
  };

  const departmentDoctors = doctors.filter(d => 
    !formData.departmentId || d.departmentId === parseInt(formData.departmentId)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Schedule New Appointment</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient Search */}
          <div>
            <Label required>Patient</Label>
            <div className="relative">
              <Input
                placeholder="Search patient by name or ID..."
                value={formData.patientName || patientSearch}
                onChange={(e) => {
                  if (formData.patientId) {
                    setFormData(prev => ({ ...prev, patientId: "", patientName: "" }));
                  }
                  setPatientSearch(e.target.value);
                }}
                error={errors.patient}
              />
              {patientSearch && !formData.patientId && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto z-10">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map(patient => (
                      <div
                        key={patient.Id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => handlePatientSelect(patient)}
                      >
                        <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                        <div className="text-sm text-gray-500">ID: {patient.patientId}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500">No patients found</div>
                  )}
                </div>
              )}
            </div>
            {errors.patient && <p className="text-red-500 text-sm mt-1">{errors.patient}</p>}
          </div>

          {/* Department */}
          <FormField label="Department" error={errors.department}>
            <select
              value={formData.departmentId}
              onChange={handleDepartmentChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.Id} value={dept.Id}>{dept.name}</option>
              ))}
            </select>
          </FormField>

          {/* Doctor */}
          <FormField label="Doctor" required error={errors.doctor}>
            <select
              value={formData.doctorId}
              onChange={handleDoctorChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={!formData.departmentId}
            >
              <option value="">Select Doctor</option>
              {departmentDoctors.map(doctor => (
                <option key={doctor.Id} value={doctor.Id}>{doctor.name}</option>
              ))}
            </select>
          </FormField>

          {/* Date */}
          <FormField label="Date" required error={errors.date}>
            <Input
              type="date"
              value={formData.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value, time: "" }))}
              error={errors.date}
            />
          </FormField>

          {/* Available Time Slots */}
{availableSlots.length > 0 && (
            <div>
              <Label required>Available Time Slots</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {availableSlots.map(slot => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setFormData(prev => ({ ...prev, time: slot.time }))}
                    className={`p-2 text-sm rounded-md border transition-colors ${
                      formData.time === slot.time
                        ? "bg-primary-500 text-white border-primary-500"
                        : slot.available
                        ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>
          )}

          {/* Conflict Warning */}
          {showConflictWarning && conflicts.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
              <div className="flex items-start space-x-2">
                <ApperIcon name="AlertTriangle" size={20} className="text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-orange-800 mb-2">
                    Scheduling Conflicts Detected
                  </h4>
                  <div className="space-y-2">
                    {conflicts.map((conflict, index) => (
                      <div key={index} className="text-sm text-orange-700 bg-orange-100 p-2 rounded">
                        <div className="font-medium">{conflict.conflictMessage}</div>
                        <div className="text-xs mt-1">
                          {conflict.conflictType === 'doctor' ? 'Doctor' : 'Patient'} conflict at {conflict.time} on {conflict.date}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-orange-600 mt-2">
                    You can still proceed, but please confirm this is intentional.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Appointment Type */}
          <FormField label="Appointment Type" required error={errors.type}>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Consultation">Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Surgery Consultation">Surgery Consultation</option>
              <option value="Emergency">Emergency</option>
              <option value="Routine Checkup">Routine Checkup</option>
            </select>
          </FormField>

          {/* Notes */}
          <FormField label="Notes">
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Additional notes or requirements..."
            />
          </FormField>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Appointment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentBookingModal;