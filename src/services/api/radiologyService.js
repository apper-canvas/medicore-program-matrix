// Mock data for radiology orders
const mockRadiologyOrders = [
  {
    Id: 1,
    patientId: 1,
    examType: "CT Chest",
    clinicalIndication: "Shortness of breath",
    icd10Code: "R06.02",
    contrastAgent: "iodine",
    contrastRequired: true,
    specialInstructions: "Patient has mild kidney dysfunction - use low osmolar contrast",
    patientPreparation: "NPO 4 hours prior to exam",
    priority: "routine",
    scheduledDate: "2024-01-15",
    scheduledTime: "14:30",
    equipmentId: 1,
    status: "pending",
    orderingPhysician: "Dr. Sarah Johnson",
    createdDate: "2024-01-10T10:30:00Z",
    preparationCompleted: false
  },
  {
    Id: 2,
    patientId: 2,
    examType: "MRI Brain",
    clinicalIndication: "Headaches",
    icd10Code: "R51",
    contrastAgent: "gadolinium",
    contrastRequired: true,
    specialInstructions: "Check for metal implants",
    patientPreparation: "Remove all metal objects, MRI safety screening required",
    priority: "urgent",
    scheduledDate: "2024-01-12",
    scheduledTime: "09:00",
    equipmentId: 2,
    status: "in-progress",
    orderingPhysician: "Dr. Michael Chen",
    createdDate: "2024-01-08T14:15:00Z",
    preparationCompleted: true
  },
  {
    Id: 3,
    patientId: 3,
    examType: "X-Ray Chest",
    clinicalIndication: "Chest pain",
    icd10Code: "R07.9",
    contrastAgent: "",
    contrastRequired: false,
    specialInstructions: "",
    patientPreparation: "No special preparation required",
    priority: "stat",
    scheduledDate: "2024-01-14",
    scheduledTime: "11:15",
    equipmentId: 4,
    status: "pending",
    orderingPhysician: "Dr. Emily Rodriguez",
    createdDate: "2024-01-14T08:30:00Z",
    preparationCompleted: false
  },
  {
    Id: 4,
    patientId: 4,
    examType: "Ultrasound Abdomen",
    clinicalIndication: "Abdominal pain",
    icd10Code: "R10.9",
    contrastAgent: "",
    contrastRequired: false,
    specialInstructions: "Patient should have full bladder",
    patientPreparation: "NPO 8 hours prior, drink 32oz water 1 hour before",
    priority: "routine",
    scheduledDate: "2024-01-16",
    scheduledTime: "13:45",
    equipmentId: 5,
    status: "pending",
    orderingPhysician: "Dr. Robert Kim",
    createdDate: "2024-01-13T16:20:00Z",
    preparationCompleted: false
  }
];

// Equipment/Modalities
const mockEquipment = [
  {
    Id: 1,
    name: "CT Scanner 1 - Siemens SOMATOM",
    type: "CT",
    location: "Radiology - Room 101",
    status: "available",
    dailyCapacity: 24,
    maintenanceSchedule: "Weekly Wednesday 6-8 AM"
  },
  {
    Id: 2,
    name: "MRI 1 - GE Signa Explorer",
    type: "MRI",
    location: "Radiology - Room 201",
    status: "available", 
    dailyCapacity: 16,
    maintenanceSchedule: "Monthly - First Sunday"
  },
  {
    Id: 3,
    name: "MRI 2 - Philips Achieva",
    type: "MRI",
    location: "Radiology - Room 202",
    status: "maintenance",
    dailyCapacity: 16,
    maintenanceSchedule: "Currently under maintenance"
  },
  {
    Id: 4,
    name: "X-Ray Room 1",
    type: "X-Ray",
    location: "Radiology - Room 301",
    status: "available",
    dailyCapacity: 40,
    maintenanceSchedule: "Daily 7-8 PM"
  },
  {
    Id: 5,
    name: "Ultrasound 1 - GE Logiq",
    type: "Ultrasound",
    location: "Radiology - Room 401",
    status: "occupied",
    dailyCapacity: 20,
    maintenanceSchedule: "Weekly Friday 8-9 AM"
  },
  {
    Id: 6,
    name: "Mammography - Hologic Selenia",
    type: "Mammography",
    location: "Women's Health - Room 501",
    status: "available",
    dailyCapacity: 30,
    maintenanceSchedule: "Bi-weekly Monday 7-8 AM"
  }
];

// Preparation Protocols
const mockPreparationProtocols = [
  {
    Id: 1,
    examType: "CT Chest",
    requirements: [
      "NPO (nothing by mouth) 4 hours prior if contrast required",
      "Remove all metal objects including jewelry and clothing with metal",
      "Inform patient about contrast injection if required",
      "Check kidney function (creatinine) if contrast required",
      "Verify allergy history, especially iodine/shellfish allergies"
    ]
  },
  {
    Id: 2,
    examType: "MRI Brain",
    requirements: [
      "Complete MRI safety screening form",
      "Remove all metal objects, implants verification",
      "Check for pacemakers, cochlear implants, metal fragments",
      "Patient should wear comfortable clothing without metal",
      "Inform about loud noises and provide hearing protection"
    ]
  },
  {
    Id: 3,
    examType: "X-Ray Chest",
    requirements: [
      "Remove all clothing and jewelry from chest area",
      "Provide hospital gown with opening in back",
      "Ensure no metal objects in X-ray field",
      "Patient should hold breath when instructed"
    ]
  },
  {
    Id: 4,
    examType: "Ultrasound Abdomen",
    requirements: [
      "NPO 8 hours prior to examination",
      "Drink 32 oz of clear fluids 1 hour before exam",
      "Do not empty bladder before exam",
      "Wear comfortable, loose-fitting clothing",
      "Avoid gum, candy, or smoking before exam"
    ]
  }
];

// Workflow Items (Active examinations)
const mockWorkflowItems = [
  {
    Id: 1,
    orderId: 2,
    patientId: 2,
    status: "in-progress",
    startTime: "09:00",
    estimatedDuration: 45,
    progress: 60,
    technologist: "Sarah Miller, RT",
    notes: "Patient tolerated procedure well, contrast administered"
  },
  {
    Id: 2,
    orderId: 5,
    patientId: 1,
    status: "paused",
    startTime: "10:30",
    estimatedDuration: 30,
    progress: 25,
    technologist: "Mike Johnson, RT",
    notes: "Patient became claustrophobic, taking break"
  }
];
// Mock DICOM Studies Data
const mockDicomStudies = [
  {
    Id: 1,
    orderId: 2,
    patientId: 2,
    patientName: "Sarah Johnson",
    studyDescription: "MRI Brain with Contrast",
    modality: "MRI",
    studyDate: "2024-01-15",
    studyTime: "14:30:00",
    images: [
      {
        Id: 1,
        seriesDescription: "T1 Axial",
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VDEgQXhpYWwgLSBTbGljZSAxPC90ZXh0Pjwvc3ZnPg=="
      },
      {
        Id: 2,
        seriesDescription: "T1 Axial",
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iIzQ0NDQ0NCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VDEgQXhpYWwgLSBTbGljZSAyPC90ZXh0Pjwvc3ZnPg=="
      },
      {
        Id: 3,
        seriesDescription: "T2 FLAIR",
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iIzU1NTU1NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VDIgRkxBSVIgLSBTbGljZSAxPC90ZXh0Pjwvc3ZnPg=="
      }
    ]
  },
  {
    Id: 2,
    orderId: 3,
    patientId: 3,
    patientName: "Michael Davis",
    studyDescription: "CT Chest with Contrast",
    modality: "CT",
    studyDate: "2024-01-15",
    studyTime: "16:45:00",
    images: [
      {
        Id: 4,
        seriesDescription: "Chest Axial",
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iIzIyMjIyMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q1QgQ2hlc3QgLSBBeGlhbDwvdGV4dD48Y2lyY2xlIGN4PSIyNTYiIGN5PSIyNTYiIHI9IjEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4="
      },
      {
        Id: 5,
        seriesDescription: "Chest Coronal",
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q1QgQ2hlc3QgLSBDb3JvbmFsPC90ZXh0Pjwvc3ZnPg=="
      }
    ]
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
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockRadiologyOrders];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const order = mockRadiologyOrders.find(order => order.Id === parseInt(id));
    if (!order) {
      throw new Error('Radiology order not found');
    }
    return { ...order };
  }

  async getByPatient(patientId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRadiologyOrders.filter(order => order.patientId === parseInt(patientId));
  }

  async create(orderData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newOrder = {
      Id: mockRadiologyOrders.length + 1,
      ...orderData,
      patientId: parseInt(orderData.patientId),
      equipmentId: parseInt(orderData.equipmentId) || null,
      status: 'pending',
      preparationCompleted: false,
      createdDate: new Date().toISOString()
    };
    
    mockRadiologyOrders.push(newOrder);
    return { ...newOrder };
  }

  async update(id, orderData) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = mockRadiologyOrders.findIndex(order => order.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Radiology order not found');
    }
    
    mockRadiologyOrders[index] = {
      ...mockRadiologyOrders[index],
      ...orderData,
      Id: parseInt(id)
    };
    
    return { ...mockRadiologyOrders[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = mockRadiologyOrders.findIndex(order => order.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Radiology order not found');
    }
    
    mockRadiologyOrders.splice(index, 1);
    return { success: true };
  }

  // Equipment Management
  async getEquipment() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockEquipment];
  }

  async getEquipmentByType(type) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockEquipment.filter(equip => equip.type === type);
  }

  // Preparation Protocols
  async getPreparationProtocols() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockPreparationProtocols];
  }

  async getProtocolByExamType(examType) {
    await new Promise(resolve => setTimeout(resolve, 150));
    return mockPreparationProtocols.find(protocol => protocol.examType === examType);
  }

  // Workflow Management
  async getWorkflowItems() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockWorkflowItems];
  }

  async updateStatus(orderId, status) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const orderIndex = mockRadiologyOrders.findIndex(order => order.Id === parseInt(orderId));
    if (orderIndex !== -1) {
      mockRadiologyOrders[orderIndex].status = status;
    }

    // Update workflow items
    if (status === "in-progress") {
      const existingWorkflow = mockWorkflowItems.find(item => item.orderId === parseInt(orderId));
      if (!existingWorkflow) {
        mockWorkflowItems.push({
          Id: mockWorkflowItems.length + 1,
          orderId: parseInt(orderId),
          patientId: mockRadiologyOrders[orderIndex].patientId,
          status: "in-progress",
          startTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          estimatedDuration: 30,
          progress: 0,
          technologist: "Current User",
          notes: "Examination started"
        });
      }
    } else if (status === "completed") {
      const workflowIndex = mockWorkflowItems.findIndex(item => item.orderId === parseInt(orderId));
      if (workflowIndex !== -1) {
        mockWorkflowItems.splice(workflowIndex, 1);
      }
    }
    
    return { success: true };
  }

  async updatePreparation(orderId, preparationData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockRadiologyOrders.findIndex(order => order.Id === parseInt(orderId));
    if (index !== -1) {
      mockRadiologyOrders[index].preparationCompleted = true;
      mockRadiologyOrders[index].preparationData = preparationData;
    }
    
    return { success: true };
  }
// DICOM Viewer Methods
  async getDicomStudy(orderId) {
    await this.delay(500); // Simulate network delay
    
    const study = mockDicomStudies.find(s => s.orderId === orderId);
    if (!study) {
      throw new Error('DICOM study not found');
    }
    
    return { ...study };
  }

  async getStudiesByPatient(patientId) {
    await this.delay(300);
    
    return mockDicomStudies
      .filter(s => s.patientId === patientId)
      .map(s => ({ ...s }));
  }

  async getDicomImage(imageId) {
    await this.delay(300);
    
    // Find image across all studies
    for (const study of mockDicomStudies) {
      const image = study.images.find(img => img.Id === imageId);
      if (image) {
        return { ...image };
      }
    }
    
    throw new Error('DICOM image not found');
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper methods
  getExamTypes() {
    return [...examTypes];
  }

  getContrastAgents() {
    return [...contrastAgents];
  }

  getPatientPreparation(examType) {
    const exam = examTypes.find(e => e.value === examType);
    return exam ? exam.preparation : "No special preparation required";
  }
}

export default new RadiologyService();