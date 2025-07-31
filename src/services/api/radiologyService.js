// Mock data for radiology orders
const mockRadiologyOrders = [
  {
    Id: 1,
    patientId: 1,
    examType: "CT Chest",
    clinicalIndication: "Shortness of breath",
    icd10Code: "R06.02",
    contrastAgent: "Iodine-based",
    contrastRequired: true,
    specialInstructions: "Patient has mild kidney dysfunction - use low osmolar contrast",
    patientPreparation: "NPO 4 hours prior to exam",
    priority: "routine",
    scheduledDate: "2024-01-15",
    scheduledTime: "14:30",
    status: "scheduled",
    orderingPhysician: "Dr. Sarah Johnson",
    createdDate: "2024-01-10T10:30:00Z"
  },
  {
    Id: 2,
    patientId: 2,
    examType: "MRI Brain",
    clinicalIndication: "Headaches",
    icd10Code: "R51",
    contrastAgent: "Gadolinium",
    contrastRequired: true,
    specialInstructions: "Check for metal implants",
    patientPreparation: "Remove all metal objects, MRI safety screening required",
    priority: "urgent",
    scheduledDate: "2024-01-12",
    scheduledTime: "09:00",
    status: "completed",
    orderingPhysician: "Dr. Michael Chen",
    createdDate: "2024-01-08T14:15:00Z"
  }
];

// Common exam types
const examTypes = [
  { value: "CT Chest", label: "CT Chest", preparation: "NPO 4 hours if contrast" },
  { value: "CT Abdomen", label: "CT Abdomen/Pelvis", preparation: "NPO 4 hours, oral contrast 2 hours prior" },
  { value: "CT Head", label: "CT Head", preparation: "No special preparation" },
  { value: "MRI Brain", label: "MRI Brain", preparation: "Remove all metal objects, MRI safety screening" },
  { value: "MRI Spine", label: "MRI Spine", preparation: "Remove all metal objects, MRI safety screening" },
  { value: "MRI Knee", label: "MRI Knee", preparation: "Remove all metal objects, MRI safety screening" },
  { value: "X-Ray Chest", label: "Chest X-Ray", preparation: "No special preparation" },
  { value: "X-Ray Spine", label: "Spine X-Ray", preparation: "No special preparation" },
  { value: "Ultrasound Abdomen", label: "Abdominal Ultrasound", preparation: "NPO 8 hours prior" },
  { value: "Ultrasound Pelvis", label: "Pelvic Ultrasound", preparation: "Full bladder required" },
  { value: "Mammography", label: "Mammography", preparation: "No deodorant, powder, or lotion" },
  { value: "DEXA Scan", label: "DEXA Bone Density", preparation: "No calcium supplements 24 hours prior" }
];

// Contrast agents
const contrastAgents = [
  { value: "iodine", label: "Iodine-based (CT)", contraindications: ["Severe kidney disease", "Iodine allergy"] },
  { value: "gadolinium", label: "Gadolinium (MRI)", contraindications: ["Severe kidney disease", "Gadolinium allergy"] },
  { value: "barium", label: "Barium Sulfate", contraindications: ["Bowel perforation", "Severe dehydration"] },
  { value: "none", label: "No Contrast", contraindications: [] }
];

class RadiologyService {
  constructor() {
    this.radiologyOrders = [...mockRadiologyOrders];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.radiologyOrders];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const order = this.radiologyOrders.find(o => o.Id === parseInt(id));
    if (!order) {
      throw new Error("Radiology order not found");
    }
    return { ...order };
  }

  async getByPatient(patientId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.radiologyOrders.filter(o => o.patientId === parseInt(patientId));
  }

  async create(orderData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = Math.max(...this.radiologyOrders.map(o => o.Id), 0);
    const newOrder = {
      ...orderData,
      Id: maxId + 1,
      status: "scheduled",
      createdDate: new Date().toISOString()
    };
    
    this.radiologyOrders.push(newOrder);
    return { ...newOrder };
  }

  async update(id, orderData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.radiologyOrders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Radiology order not found");
    }
    
    this.radiologyOrders[index] = {
      ...this.radiologyOrders[index],
      ...orderData,
      Id: parseInt(id)
    };
    
    return { ...this.radiologyOrders[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.radiologyOrders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Radiology order not found");
    }
    
    const deletedOrder = this.radiologyOrders.splice(index, 1)[0];
    return { ...deletedOrder };
  }

  // Get available exam types
  getExamTypes() {
    return examTypes;
  }

  // Get contrast agents
  getContrastAgents() {
    return contrastAgents;
  }

  // Get patient preparation for specific exam type
  getPatientPreparation(examType) {
    const exam = examTypes.find(e => e.value === examType);
    return exam ? exam.preparation : "";
  }
}

export default new RadiologyService();