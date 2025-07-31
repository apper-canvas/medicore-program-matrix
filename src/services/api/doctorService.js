// Mock doctor data with schedule information
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
    status: "active",
    appointmentLoad: {
      monday: 85,
      tuesday: 92,
      wednesday: 78,
      thursday: 88,
      friday: 95,
      saturday: 45,
      sunday: 0
    }
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
    status: "active",
    appointmentLoad: {
      monday: 72,
      tuesday: 68,
      wednesday: 85,
      thursday: 90,
      friday: 75,
      saturday: 0,
      sunday: 0
    }
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
    status: "active",
    appointmentLoad: {
      monday: 60,
      tuesday: 82,
      wednesday: 55,
      thursday: 75,
      friday: 88,
      saturday: 35,
      sunday: 0
    }
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
    status: "active",
    appointmentLoad: {
      monday: 95,
      tuesday: 88,
      wednesday: 92,
      thursday: 85,
      friday: 78,
      saturday: 0,
      sunday: 0
    }
  }
];

// Mock blocked slots data
const mockBlockedSlots = [
  {
    Id: 1,
    doctorId: 1,
    date: "2024-01-15",
    timeSlot: "11:00",
    duration: 60,
    reason: "Surgery",
    type: "surgery",
    isEmergencySlot: false
  },
  {
    Id: 2,
    doctorId: 2,
    date: "2024-01-15",
    timeSlot: "14:00",
    duration: 30,
    reason: "Meeting",
    type: "meeting",
    isEmergencySlot: false
  },
  {
    Id: 3,
    doctorId: 1,
    date: "2024-01-16",
    timeSlot: "16:00",
    duration: 30,
    reason: "Emergency Reserve",
    type: "emergency",
    isEmergencySlot: true
  }
];
class DoctorService {
  constructor() {
    this.doctors = [...mockDoctors];
    this.blockedSlots = [...mockBlockedSlots];
    this.nextBlockedSlotId = Math.max(...mockBlockedSlots.map(slot => slot.Id), 0) + 1;
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
      const isBlocked = this.blockedSlots.some(slot => 
        slot.doctorId === doctorId && 
        slot.date === date && 
        slot.timeSlot === currentTime
      );

      slots.push({
        time: currentTime,
        available: !isBlocked && Math.random() > 0.3,
        blocked: isBlocked
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

  async getWeeklySchedule(weekStart) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const schedule = {};
    const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    for (const doctor of this.doctors) {
      schedule[doctor.Id] = {
        doctor: { ...doctor },
        days: {}
      };
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = dayNames[i];
        
        const workingHours = doctor.workingHours[dayName];
        const blockedSlots = this.blockedSlots.filter(slot => 
          slot.doctorId === doctor.Id && slot.date === dateStr
        );
        
        schedule[doctor.Id].days[dayName] = {
          date: dateStr,
          workingHours,
          blockedSlots: [...blockedSlots],
          appointmentLoad: doctor.appointmentLoad[dayName] || 0
        };
      }
    }
    
    return schedule;
  }

  async blockTimeSlot(doctorId, date, timeSlot, reason, type = 'break', duration = 30) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const existingBlock = this.blockedSlots.find(slot =>
      slot.doctorId === doctorId && 
      slot.date === date && 
      slot.timeSlot === timeSlot
    );
    
    if (existingBlock) {
      throw new Error('Time slot is already blocked');
    }

    const newBlock = {
      Id: this.nextBlockedSlotId++,
      doctorId,
      date,
      timeSlot,
      duration,
      reason,
      type,
      isEmergencySlot: type === 'emergency',
      createdAt: new Date().toISOString()
    };

    this.blockedSlots.push(newBlock);
    return { ...newBlock };
  }

  async unblockTimeSlot(blockId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.blockedSlots.findIndex(slot => slot.Id === parseInt(blockId));
    if (index === -1) {
      throw new Error('Blocked slot not found');
    }

    const unblocked = this.blockedSlots.splice(index, 1)[0];
    return { ...unblocked };
  }

  async getBlockedSlots(doctorId, date) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.blockedSlots
      .filter(slot => slot.doctorId === doctorId && slot.date === date)
      .map(slot => ({ ...slot }));
  }

  async getEmergencySlots(date) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.blockedSlots
      .filter(slot => slot.isEmergencySlot && slot.date === date)
      .map(slot => ({ ...slot }));
  }

  async reserveEmergencySlot(doctorId, date, timeSlot, patientId, notes = '') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const emergencySlot = this.blockedSlots.find(slot =>
      slot.doctorId === doctorId && 
      slot.date === date && 
      slot.timeSlot === timeSlot &&
      slot.isEmergencySlot
    );

    if (!emergencySlot) {
      throw new Error('Emergency slot not found');
    }

    if (emergencySlot.reserved) {
      throw new Error('Emergency slot already reserved');
    }

    emergencySlot.reserved = true;
    emergencySlot.patientId = patientId;
    emergencySlot.reservationNotes = notes;
    emergencySlot.reservedAt = new Date().toISOString();

    return { ...emergencySlot };
  }
}

export default new DoctorService();