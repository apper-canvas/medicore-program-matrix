// Mock appointment data
const mockAppointments = [
  {
    Id: 1,
    patientId: 1,
    patientName: "Sarah Johnson",
    doctorId: 1,
    doctorName: "Dr. Smith",
    departmentId: 1,
    departmentName: "Cardiology",
    date: "2024-01-15",
    time: "09:00",
    duration: 30,
    type: "Consultation",
    status: "scheduled",
    notes: "Regular checkup",
    createdAt: "2024-01-10T10:00:00Z"
  },
  {
    Id: 2,
    patientId: 2,
    patientName: "Michael Chen",
    doctorId: 2,
    doctorName: "Dr. Davis",
    departmentId: 2,
    departmentName: "Neurology",
    date: "2024-01-15",
time: "10:30",
    duration: 45,
    type: "Follow-up",
    status: "in-progress",
    notes: "Follow-up appointment",
    checkedInAt: "2024-01-15T10:15:00Z",
    startedAt: "2024-01-15T10:35:00Z",
    createdAt: "2024-01-12T14:30:00Z"
  },
  {
    Id: 3,
    patientId: 3,
    patientName: "Emily Rodriguez",
    doctorId: 1,
    doctorName: "Dr. Smith",
    departmentId: 1,
    departmentName: "Cardiology",
    date: "2024-01-15",
time: "14:00",
    duration: 30,
    type: "Consultation",
    status: "completed",
    notes: "Initial consultation",
    checkedInAt: "2024-01-15T13:45:00Z",
    startedAt: "2024-01-15T14:05:00Z",
    completedAt: "2024-01-15T14:30:00Z",
    createdAt: "2024-01-13T09:15:00Z"
  },
  {
    Id: 4,
    patientId: 4,
    patientName: "David Wilson",
    doctorId: 3,
    doctorName: "Dr. Johnson",
    departmentId: 3,
    departmentName: "Orthopedics",
    date: "2024-01-16",
    time: "11:00",
    duration: 60,
    type: "Surgery Consultation",
    status: "scheduled",
    notes: "Pre-surgery consultation",
    createdAt: "2024-01-11T16:20:00Z"
  },
  {
    Id: 5,
    patientId: 5,
    patientName: "Lisa Anderson",
    doctorId: 2,
    doctorName: "Dr. Davis",
    departmentId: 2,
    departmentName: "Neurology",
    date: "2024-01-17",
    time: "15:30",
    duration: 30,
    type: "Follow-up",
    status: "cancelled",
    notes: "Patient cancelled",
    createdAt: "2024-01-14T11:45:00Z"
  }
];

class AppointmentService {
  constructor() {
    this.appointments = [...mockAppointments];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.appointments];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const appointment = this.appointments.find(a => a.Id === parseInt(id));
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    return { ...appointment };
  }

  async getByDate(date) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.appointments.filter(a => a.date === date).map(a => ({ ...a }));
  }

  async getByDateRange(startDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.appointments.filter(a => a.date >= startDate && a.date <= endDate).map(a => ({ ...a }));
  }

  async getTodaysAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return await this.getByDate(today);
  }

  async create(appointmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = Math.max(...this.appointments.map(a => a.Id), 0);
    const newAppointment = {
      ...appointmentData,
      Id: maxId + 1,
      status: "scheduled",
      createdAt: new Date().toISOString()
    };
    
    this.appointments.push(newAppointment);
    return { ...newAppointment };
  }

  async update(id, appointmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    
    this.appointments[index] = {
      ...this.appointments[index],
      ...appointmentData,
      Id: parseInt(id)
    };
    
    return { ...this.appointments[index] };
  }

  async updateStatus(id, status, notes = "") {
    return await this.update(id, { status, notes });
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    
    const deletedAppointment = this.appointments.splice(index, 1)[0];
    return { ...deletedAppointment };
}

  async checkIn(id) {
    const appointment = await this.getById(id);
    const updateData = {
      status: "checked-in",
      notes: "Patient checked in",
      checkedInAt: new Date().toISOString()
    };
    return await this.update(id, updateData);
  }

  async startAppointment(id) {
    const appointment = await this.getById(id);
    const updateData = {
      status: "in-progress",
      notes: "Appointment started",
      startedAt: new Date().toISOString()
    };
    return await this.update(id, updateData);
}

  async complete(id, notes = "") {
    const appointment = await this.getById(id);
    const updateData = {
      status: "completed",
      notes: notes || "Appointment completed",
      completedAt: new Date().toISOString()
    };
    return await this.update(id, updateData);
  }

  async cancel(id, reason = "") {
    return await this.updateStatus(id, "cancelled", reason);
  }
}

export default new AppointmentService();