// Mock doctor data
const mockDoctors = [
  {
    Id: 1,
    name: "Dr. Smith",
    specialization: "Cardiology",
    departmentId: 1,
    departmentName: "Cardiology",
    phone: "+1-555-0101",
    email: "dr.smith@hospital.com",
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "17:00" },
      saturday: { start: "09:00", end: "13:00" },
      sunday: null
    },
    status: "active"
  },
  {
    Id: 2,
    name: "Dr. Davis",
    specialization: "Neurology",
    departmentId: 2,
    departmentName: "Neurology",
    phone: "+1-555-0102",
    email: "dr.davis@hospital.com",
    workingHours: {
      monday: { start: "08:00", end: "16:00" },
      tuesday: { start: "08:00", end: "16:00" },
      wednesday: { start: "08:00", end: "16:00" },
      thursday: { start: "08:00", end: "16:00" },
      friday: { start: "08:00", end: "16:00" },
      saturday: null,
      sunday: null
    },
    status: "active"
  },
  {
    Id: 3,
    name: "Dr. Johnson",
    specialization: "Orthopedics",
    departmentId: 3,
    departmentName: "Orthopedics",
    phone: "+1-555-0103",
    email: "dr.johnson@hospital.com",
    workingHours: {
      monday: { start: "10:00", end: "18:00" },
      tuesday: { start: "10:00", end: "18:00" },
      wednesday: { start: "10:00", end: "18:00" },
      thursday: { start: "10:00", end: "18:00" },
      friday: { start: "10:00", end: "18:00" },
      saturday: { start: "10:00", end: "14:00" },
      sunday: null
    },
    status: "active"
  },
  {
    Id: 4,
    name: "Dr. Williams",
    specialization: "Pediatrics",
    departmentId: 4,
    departmentName: "Pediatrics",
    phone: "+1-555-0104",
    email: "dr.williams@hospital.com",
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "17:00" },
      saturday: null,
      sunday: null
    },
    status: "active"
  }
];

class DoctorService {
  constructor() {
    this.doctors = [...mockDoctors];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.doctors];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const doctor = this.doctors.find(d => d.Id === parseInt(id));
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    return { ...doctor };
  }

  async getByDepartment(departmentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.doctors.filter(d => d.departmentId === parseInt(departmentId)).map(d => ({ ...d }));
  }

  async getAvailableSlots(doctorId, date) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const doctor = await this.getById(doctorId);
    const dayName = new Date(date).toLocaleLowerCase().split('t')[0];
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = dayNames[new Date(date).getDay()];
    
    const workingHours = doctor.workingHours[dayOfWeek];
    if (!workingHours) {
      return []; // Doctor doesn't work on this day
    }

    // Generate 30-minute slots
    const slots = [];
    const startTime = workingHours.start;
    const endTime = workingHours.end;
    
    let currentTime = startTime;
    while (currentTime < endTime) {
      slots.push({
        time: currentTime,
        available: Math.random() > 0.3 // 70% chance slot is available
      });
      
      // Add 30 minutes
      const [hours, minutes] = currentTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + 30;
      const newHours = Math.floor(totalMinutes / 60);
      const newMinutes = totalMinutes % 60;
      currentTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    }
    
    return slots;
  }
}

export default new DoctorService();