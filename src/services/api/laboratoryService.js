const labTestCatalog = [
  // Blood Tests
  {
    Id: 1, 
    name: "Complete Blood Count (CBC)", 
    code: "CBC",
    category: "Blood",
    description: "Evaluates overall health and detects various disorders",
    specimenType: "Whole Blood",
    specimenVolume: "3ml EDTA tube",
    fastingRequired: false,
    turnaroundTime: "2-4 hours",
    normalRange: "Various parameters",
    price: 25.00,
    parameters: [
      { name: "WBC", normalRange: "4.5-11.0", unit: "×10³/μL", criticalLow: 2.0, criticalHigh: 30.0 },
      { name: "RBC", normalRange: "4.2-5.4", unit: "×10⁶/μL", criticalLow: 2.5, criticalHigh: 7.0 },
      { name: "Hemoglobin", normalRange: "12.0-16.0", unit: "g/dL", criticalLow: 7.0, criticalHigh: 20.0 },
      { name: "Hematocrit", normalRange: "36-46", unit: "%", criticalLow: 20, criticalHigh: 60 },
      { name: "Platelets", normalRange: "150-450", unit: "×10³/μL", criticalLow: 50, criticalHigh: 1000 }
    ]
  },
  { 
    Id: 2, 
    name: "Basic Metabolic Panel", 
    code: "BMP",
    category: "Blood",
    description: "Measures glucose, electrolytes, and kidney function",
    specimenType: "Serum",
    specimenVolume: "5ml SST tube",
    fastingRequired: true,
    fastingHours: 8,
    turnaroundTime: "1-2 hours",
    normalRange: "Various parameters",
    price: 35.00,
    parameters: [
      { name: "Glucose", normalRange: "70-100", unit: "mg/dL", criticalLow: 40, criticalHigh: 400 },
      { name: "Sodium", normalRange: "136-145", unit: "mmol/L", criticalLow: 120, criticalHigh: 160 },
      { name: "Potassium", normalRange: "3.5-5.1", unit: "mmol/L", criticalLow: 2.8, criticalHigh: 6.2 },
      { name: "Chloride", normalRange: "98-107", unit: "mmol/L", criticalLow: 80, criticalHigh: 120 },
      { name: "BUN", normalRange: "6-24", unit: "mg/dL", criticalLow: 2, criticalHigh: 80 },
      { name: "Creatinine", normalRange: "0.6-1.3", unit: "mg/dL", criticalLow: 0.2, criticalHigh: 8.0 }
    ]
  },
  { 
    Id: 3, 
    name: "Lipid Panel", 
    code: "LIPID",
    category: "Blood",
    description: "Cholesterol and triglyceride levels",
    specimenType: "Serum",
    specimenVolume: "5ml SST tube",
    fastingRequired: true,
    fastingHours: 12,
    turnaroundTime: "2-4 hours",
    normalRange: "Various parameters",
    price: 45.00,
    parameters: [
      { name: "Total Cholesterol", normalRange: "<200", unit: "mg/dL", criticalLow: 50, criticalHigh: 500 },
      { name: "HDL Cholesterol", normalRange: ">40", unit: "mg/dL", criticalLow: 10, criticalHigh: 150 },
      { name: "LDL Cholesterol", normalRange: "<100", unit: "mg/dL", criticalLow: 20, criticalHigh: 400 },
      { name: "Triglycerides", normalRange: "<150", unit: "mg/dL", criticalLow: 20, criticalHigh: 1000 }
    ]
  },
  { 
    Id: 4, 
    name: "Thyroid Function Tests", 
    code: "TFT",
    category: "Blood",
    description: "TSH, T3, T4 levels",
    specimenType: "Serum",
    specimenVolume: "5ml SST tube",
    fastingRequired: false,
    turnaroundTime: "4-6 hours",
    normalRange: "Various parameters",
    price: 55.00,
    parameters: [
      { name: "TSH", normalRange: "0.4-4.0", unit: "mIU/L", criticalLow: 0.1, criticalHigh: 20.0 },
      { name: "Free T4", normalRange: "0.8-1.8", unit: "ng/dL", criticalLow: 0.2, criticalHigh: 5.0 },
      { name: "Free T3", normalRange: "2.3-4.2", unit: "pg/mL", criticalLow: 1.0, criticalHigh: 10.0 }
    ]
  },
  { 
    Id: 5, 
    name: "Liver Function Tests", 
    code: "LFT",
    category: "Blood",
    description: "ALT, AST, Bilirubin, Albumin levels",
    specimenType: "Serum",
    specimenVolume: "5ml SST tube",
    fastingRequired: true,
    fastingHours: 8,
    turnaroundTime: "2-4 hours",
    normalRange: "Various parameters",
    price: 40.00,
    parameters: [
      { name: "ALT", normalRange: "7-40", unit: "U/L", criticalLow: 0, criticalHigh: 1000 },
      { name: "AST", normalRange: "10-40", unit: "U/L", criticalLow: 0, criticalHigh: 1000 },
      { name: "Total Bilirubin", normalRange: "0.2-1.2", unit: "mg/dL", criticalLow: 0, criticalHigh: 20.0 },
      { name: "Albumin", normalRange: "3.5-5.0", unit: "g/dL", criticalLow: 1.5, criticalHigh: 6.0 }
    ]
  },
  
  // Urine Tests
  { 
    Id: 6, 
    name: "Urinalysis Complete", 
    code: "UA",
    category: "Urine",
    description: "Complete urine examination including microscopy",
    specimenType: "Urine",
    specimenVolume: "50ml clean catch midstream",
    fastingRequired: false,
    turnaroundTime: "1-2 hours",
    normalRange: "Various parameters",
    price: 20.00,
    parameters: [
      { name: "Specific Gravity", normalRange: "1.003-1.030", unit: "", criticalLow: 1.000, criticalHigh: 1.040 },
      { name: "pH", normalRange: "4.6-8.0", unit: "", criticalLow: 3.0, criticalHigh: 9.0 },
      { name: "Protein", normalRange: "Negative", unit: "", criticalLow: null, criticalHigh: null },
      { name: "Glucose", normalRange: "Negative", unit: "", criticalLow: null, criticalHigh: null },
      { name: "WBC", normalRange: "0-5", unit: "/hpf", criticalLow: null, criticalHigh: 50 }
    ]
  },
  { 
    Id: 7, 
    name: "Urine Culture & Sensitivity", 
    code: "UC&S",
    category: "Urine",
    description: "Bacterial identification and antibiotic sensitivity",
    specimenType: "Urine",
    specimenVolume: "50ml sterile container",
    fastingRequired: false,
    turnaroundTime: "24-48 hours",
    normalRange: "No growth",
    price: 30.00,
    parameters: [
      { name: "Bacterial Count", normalRange: "<10,000", unit: "CFU/mL", criticalLow: null, criticalHigh: 100000 }
    ]
  },
  { 
    Id: 8, 
    name: "24-Hour Urine Protein", 
    code: "24H-PROT",
    category: "Urine",
    description: "Total protein excretion over 24 hours",
    specimenType: "24-hour Urine",
    specimenVolume: "Complete 24-hour collection",
    fastingRequired: false,
    turnaroundTime: "4-6 hours",
    normalRange: "<150 mg/24h",
    price: 35.00,
    parameters: [
      { name: "Total Protein", normalRange: "<150", unit: "mg/24h", criticalLow: null, criticalHigh: 3000 }
    ]
  },
  
  // Imaging
  { 
    Id: 9, 
    name: "Chest X-Ray", 
    code: "CXR",
    category: "Imaging",
    description: "Two-view chest radiograph",
    specimenType: "N/A",
    specimenVolume: "N/A",
    fastingRequired: false,
    turnaroundTime: "30 minutes",
    normalRange: "No acute findings",
    price: 75.00,
    parameters: []
  },
  { 
    Id: 10, 
    name: "Abdominal Ultrasound", 
    code: "ABD-US",
    category: "Imaging",
    description: "Complete abdominal ultrasound examination",
    specimenType: "N/A",
    specimenVolume: "N/A",
    fastingRequired: true,
    fastingHours: 8,
    turnaroundTime: "1 hour",
    normalRange: "Normal findings",
    price: 150.00,
    parameters: []
  },
  { 
    Id: 11, 
    name: "CT Scan Head", 
    code: "CT-HEAD",
    category: "Imaging",
    description: "Non-contrast head CT scan",
    specimenType: "N/A",
    specimenVolume: "N/A",
    fastingRequired: false,
    turnaroundTime: "2 hours",
    normalRange: "No acute findings",
    price: 300.00,
    parameters: []
  },
  
  // Specialized Tests
  { 
    Id: 12, 
    name: "Hemoglobin A1C", 
    code: "HbA1C",
    category: "Specialized",
    description: "Average blood glucose over 3 months",
    specimenType: "Whole Blood",
    specimenVolume: "3ml EDTA tube",
    fastingRequired: false,
    turnaroundTime: "2-4 hours",
    normalRange: "<5.7%",
    price: 50.00,
    parameters: [
      { name: "HbA1c", normalRange: "<5.7", unit: "%", criticalLow: 2.0, criticalHigh: 15.0 }
    ]
  },
  { 
    Id: 13, 
    name: "Cardiac Troponin I", 
    code: "TnI",
    category: "Specialized",
    description: "Heart muscle damage marker",
    specimenType: "Serum",
    specimenVolume: "5ml SST tube",
    fastingRequired: false,
    turnaroundTime: "1 hour",
    normalRange: "<0.04 ng/mL",
    price: 60.00,
    parameters: [
      { name: "Troponin I", normalRange: "<0.04", unit: "ng/mL", criticalLow: null, criticalHigh: 0.04 }
    ]
  },
  { 
    Id: 14, 
    name: "Vitamin D (25-OH)", 
    code: "VIT-D",
    category: "Specialized",
    description: "Vitamin D deficiency assessment",
    specimenType: "Serum",
    specimenVolume: "5ml SST tube",
    fastingRequired: false,
    turnaroundTime: "4-6 hours",
    normalRange: "30-100 ng/mL",
    price: 70.00,
    parameters: [
      { name: "Vitamin D", normalRange: "30-100", unit: "ng/mL", criticalLow: 10, criticalHigh: 150 }
    ]
  },
  { 
    Id: 15, 
    name: "COVID-19 PCR", 
    code: "COVID-PCR",
    category: "Specialized",
    description: "SARS-CoV-2 detection by PCR",
    specimenType: "Nasopharyngeal Swab",
    specimenVolume: "Swab in VTM",
    fastingRequired: false,
    turnaroundTime: "4-6 hours",
    normalRange: "Not Detected",
    price: 80.00,
    parameters: [
      { name: "SARS-CoV-2", normalRange: "Not Detected", unit: "", criticalLow: null, criticalHigh: null }
    ]
  }
];

// Quality Control Samples
const qcSamples = [
  {
    Id: 1,
    name: "Normal Control Level 1",
    type: "Normal",
    lotNumber: "QC2024001",
    expiryDate: "2024-12-31",
    applicableTests: [1, 2, 3, 4, 5],
    lastRun: "2024-01-15T08:00:00",
    frequency: "Daily",
    status: "Active"
  },
  {
    Id: 2,
    name: "Abnormal Control Level 2",
    type: "Abnormal",
    lotNumber: "QC2024002",
    expiryDate: "2024-12-31",
    applicableTests: [1, 2, 3, 4, 5],
    lastRun: "2024-01-15T08:00:00",
    frequency: "Daily",
    status: "Active"
  },
  {
    Id: 3,
    name: "Chemistry Control High",
    type: "High",
    lotNumber: "QC2024003",
    expiryDate: "2024-11-30",
    applicableTests: [2, 3, 5],
    lastRun: "2024-01-14T10:30:00",
    frequency: "Every 8 hours",
    status: "Expiring Soon"
  }
];

// Calibration Schedule
const calibrationSchedule = [
  {
    Id: 1,
    equipment: "Hematology Analyzer HA-100",
    testCodes: ["CBC"],
    lastCalibration: "2024-01-10T09:00:00",
    nextDue: "2024-01-17T09:00:00",
    frequency: "Weekly",
    status: "Due Soon",
    calibrationType: "Full Calibration"
  },
  {
    Id: 2,
    equipment: "Chemistry Analyzer CA-200",
    testCodes: ["BMP", "LIPID", "LFT"],
    lastCalibration: "2024-01-12T14:00:00",
    nextDue: "2024-01-19T14:00:00",
    frequency: "Weekly",
    status: "Current",
    calibrationType: "Multi-point"
  },
  {
    Id: 3,
    equipment: "Immunoassay Analyzer IA-150",
    testCodes: ["TFT", "HbA1C", "TnI", "VIT-D"],
    lastCalibration: "2024-01-08T11:00:00",
    nextDue: "2024-01-15T11:00:00",
    frequency: "Weekly",
    status: "Overdue",
    calibrationType: "Automated"
  },
  {
    Id: 4,
    equipment: "PCR Analyzer PCR-300",
    testCodes: ["COVID-PCR"],
    lastCalibration: "2024-01-14T16:00:00",
    nextDue: "2024-01-28T16:00:00",
    frequency: "Bi-weekly",
    status: "Current",
    calibrationType: "Internal Standard"
calibrationType: "Internal Standard"
  }
];

const labOrders = [];
class LaboratoryService {
  constructor() {
    this.tests = [...labTestCatalog];
    this.orders = [...labOrders];
    this.processingQueue = [];
    this.qcSamples = [...qcSamples];
    this.calibrationSchedule = [...calibrationSchedule];
  }

  // Test Catalog Methods
  async getAllTests() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.tests];
  }

  async getTestsByCategory(category) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.tests.filter(test => test.category === category);
  }

  async getTestById(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const test = this.tests.find(t => t.Id === parseInt(id));
    if (!test) {
      throw new Error("Test not found");
    }
    return { ...test };
  }

  async searchTests(query) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const lowercaseQuery = query.toLowerCase();
    return this.tests.filter(test => 
      test.name.toLowerCase().includes(lowercaseQuery) ||
      test.code.toLowerCase().includes(lowercaseQuery) ||
      test.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  getTestCategories() {
    return ["Blood", "Urine", "Imaging", "Specialized"];
  }

  // Lab Order Methods
  async getAllOrders() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.orders];
  }

  async getOrdersByPatient(patientId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.orders.filter(order => order.patientId === parseInt(patientId));
  }

  async getOrderById(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const order = this.orders.find(o => o.Id === parseInt(id));
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  }

async createOrder(orderData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Generate new ID
    const maxId = Math.max(...this.orders.map(o => o.Id), 0);
    // Get test details for the ordered tests
    const testsWithDetails = orderData.testIds.map(testId => {
      const test = this.tests.find(t => t.Id === testId);
      return test ? { ...test } : null;
    }).filter(Boolean);

    // Calculate consolidated requirements
    const requirements = this.calculateRequirements(testsWithDetails);
    
    // Calculate estimated processing time
    const estimatedProcessingTime = this.calculateProcessingTime(testsWithDetails, orderData.priority);
    
    const newOrder = {
      ...orderData,
      Id: maxId + 1,
      tests: testsWithDetails,
      requirements,
      totalPrice: testsWithDetails.reduce((sum, test) => sum + test.price, 0),
      status: "Pending",
      orderDate: new Date().toISOString(),
      collectionStatus: "Pending",
      resultsStatus: "Pending",
      estimatedProcessingTime,
      queuePosition: null
    };
    
    this.orders.push(newOrder);
    this.updateProcessingQueue();
    return { ...newOrder };
  }

  async updateOrder(id, orderData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Order not found");
    }
    
    this.orders[index] = {
      ...this.orders[index],
      ...orderData,
      Id: parseInt(id)
    };
    
    return { ...this.orders[index] };
  }

  async getAllSpecimens() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.orders.map(order => ({
      Id: order.Id,
      orderId: order.Id,
      patientId: order.patientId,
      barcode: order.barcode || null,
      status: order.collectionStatus,
      collectionDate: order.collectionDate || null,
      tests: order.tests?.map(t => t.name).join(", ") || "",
      priority: order.priority
    }));
  }

  async generateSpecimenBarcode(orderId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const order = this.orders.find(o => o.Id === parseInt(orderId));
    if (!order) {
      throw new Error("Order not found");
    }
    
    // Generate barcode (timestamp + order ID)
    const barcode = `SPE${Date.now().toString().slice(-8)}${orderId.toString().padStart(4, '0')}`;
    
    // Update order with barcode
    order.barcode = barcode;
    order.barcodeGenerated = new Date().toISOString();
    
    return barcode;
  }

  async updateSpecimenStatus(specimenId, newStatus) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const order = this.orders.find(o => o.Id === parseInt(specimenId));
    if (!order) {
      throw new Error("Specimen not found");
    }
    
    order.collectionStatus = newStatus;
    order.lastStatusUpdate = new Date().toISOString();
    
    // Track status history
    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString()
    });
    
    return { ...order };
  }

  async rejectSpecimen(specimenId, rejectionReason) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const order = this.orders.find(o => o.Id === parseInt(specimenId));
    if (!order) {
      throw new Error("Specimen not found");
    }
    
    // Update original order as rejected
    order.collectionStatus = "Rejected";
    order.rejectionReason = rejectionReason;
    order.rejectionDate = new Date().toISOString();
    
    // Create new order (reorder)
    const maxId = Math.max(...this.orders.map(o => o.Id), 0);
    const reOrder = {
      ...order,
      Id: maxId + 1,
      collectionStatus: "Pending", 
      originalOrderId: order.Id,
      isReorder: true,
      reorderReason: rejectionReason,
      orderDate: new Date().toISOString(),
      barcode: null,
      statusHistory: []
    };
    
    this.orders.push(reOrder);
    
    return { rejectedOrder: order, newOrder: reOrder };
  }

  async getSpecimenByBarcode(barcode) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const order = this.orders.find(o => o.barcode === barcode);
    if (!order) {
      throw new Error("Specimen not found");
    }
    
    return {
      ...order,
      specimenId: order.Id,
      tests: order.tests
    };
  }

  getRejectionReasons() {
    return [
      "Insufficient sample volume",
      "Hemolyzed specimen", 
      "Clotted specimen",
      "Incorrect container",
      "Unlabeled specimen",
      "Patient identification mismatch",
      "Specimen leaked/broken",
      "Expired collection container",
"Temperature excursion",
      "Contaminated specimen"
    ];
  }
  async deleteOrder(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Order not found");
    }
    
    const deletedOrder = this.orders.splice(index, 1)[0];
    return { ...deletedOrder };
  }

// Helper Methods
  calculateRequirements(tests) {
    const specimens = new Set();
    const fastingRequired = tests.some(test => test.fastingRequired);
    const maxFastingHours = Math.max(...tests.filter(t => t.fastingRequired).map(t => t.fastingHours || 8), 0);
    const instructions = [];
    
    tests.forEach(test => {
      if (test.specimenType !== "N/A") {
        specimens.add(`${test.specimenVolume} (${test.specimenType})`);
      }
      if (test.fastingRequired) {
        instructions.push(`${test.name}: Fast for ${test.fastingHours || 8} hours`);
      }
    });

    return {
      specimenTypes: Array.from(specimens),
      fastingRequired,
      fastingHours: maxFastingHours,
      specialInstructions: instructions,
      totalTests: tests.length
    };
  }

  calculateProcessingTime(tests, priority) {
    // Base processing time from test turnaround times
    const baseTime = Math.max(...tests.map(test => {
      const turnaround = test.turnaroundTime || "2-4 hours";
      const hours = parseInt(turnaround.split('-')[1] || turnaround.split(' ')[0]);
      return hours;
    }));

    // Priority multipliers
    const priorityMultipliers = {
      'STAT': 0.25,    // 15 minutes for STAT
      'Urgent': 0.5,   // 30 minutes for Urgent  
      'Routine': 1.0   // Full time for Routine
    };

    return Math.ceil(baseTime * (priorityMultipliers[priority] || 1.0));
  }

  updateProcessingQueue() {
    // Get orders ready for processing
    const readyOrders = this.orders.filter(order => 
      order.collectionStatus === "Received" || order.collectionStatus === "Processing"
    );

    // Sort by priority and processing time
    this.processingQueue = readyOrders.sort((a, b) => {
      // Priority weights (lower number = higher priority)
      const priorityWeights = { 'STAT': 1, 'Urgent': 2, 'Routine': 3 };
      
      const aPriority = priorityWeights[a.priority] || 3;
      const bPriority = priorityWeights[b.priority] || 3;
      
      // First sort by priority
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // Then by processing time (shorter first within same priority)
      const aTime = a.estimatedProcessingTime || 999;
      const bTime = b.estimatedProcessingTime || 999;
      
      if (aTime !== bTime) {
        return aTime - bTime;
      }
      
      // Finally by order date (older first)
      return new Date(a.orderDate) - new Date(b.orderDate);
    });

    // Update queue positions
    this.processingQueue.forEach((order, index) => {
      const originalOrder = this.orders.find(o => o.Id === order.Id);
      if (originalOrder) {
        originalOrder.queuePosition = index + 1;
      }
    });
  }

  async getProcessingQueue() {
    await new Promise(resolve => setTimeout(resolve, 200));
    this.updateProcessingQueue();
    return [...this.processingQueue];
  }

  getQueueStatistics() {
    const queue = this.processingQueue;
    const stats = {
      total: queue.length,
      stat: queue.filter(o => o.priority === 'STAT').length,
      urgent: queue.filter(o => o.priority === 'Urgent').length,
      routine: queue.filter(o => o.priority === 'Routine').length,
      averageWaitTime: 0
    };

    if (queue.length > 0) {
      const totalTime = queue.reduce((sum, order) => sum + (order.estimatedProcessingTime || 0), 0);
      stats.averageWaitTime = Math.ceil(totalTime / queue.length);
    }

    return stats;
  }

  getPriorityLevels() {
    return ["Routine", "Urgent", "STAT"];
  }

  getCollectionTimeSlots() {
    return [
      "07:00 - 08:00",
      "08:00 - 09:00", 
      "09:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
      "14:00 - 15:00",
"15:00 - 16:00",
      "16:00 - 17:00"
    ];
  }
  getWorkflowStatuses() {
    return [
      { status: "Pending", description: "Awaiting sample collection", color: "warning" },
      { status: "Collected", description: "Sample collected, needs transport", color: "collected" },
      { status: "Received", description: "Received in laboratory", color: "info" },
      { status: "Processing", description: "Currently being analyzed", color: "processing" },
      { status: "Completed", description: "Results available", color: "success" },
{ status: "Rejected", description: "Specimen rejected", color: "rejected" }
    ];
  }

  // Batch Processing Methods
  async processBatch(specimenIds) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const processedOrders = [];
    for (const specimenId of specimenIds) {
      const order = this.orders.find(o => o.Id === parseInt(specimenId));
      if (order && order.collectionStatus === "Received") {
        // Run quality control checks
        const qcResult = this.validateQualityControl(order);
        if (qcResult.passed) {
          order.collectionStatus = "Processing";
          order.processingStarted = new Date().toISOString();
          order.qcResults = qcResult;
          processedOrders.push(order);
        } else {
          // Auto-reject specimens that fail QC
          order.collectionStatus = "Rejected";
          order.rejectionReason = `QC Failed: ${qcResult.failureReasons.join(', ')}`;
          order.rejectionDate = new Date().toISOString();
        }
      }
    }
    
    this.updateProcessingQueue();
    return processedOrders;
  }

  async completeBatch(specimenIds, resultsData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const completedOrders = [];
    for (const specimenId of specimenIds) {
      const order = this.orders.find(o => o.Id === parseInt(specimenId));
      if (order && order.collectionStatus === "Processing") {
        order.collectionStatus = "Completed";
        order.resultsStatus = "Available";
        order.processingCompleted = new Date().toISOString();
        order.results = resultsData[specimenId] || {};
        order.processingTime = this.calculateActualProcessingTime(order);
        completedOrders.push(order);
      }
    }
    
    this.updateProcessingQueue();
    return completedOrders;
  }

  async rejectBatch(specimenIds, rejectionReason) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const rejectedOrders = [];
    const reOrders = [];
    
    for (const specimenId of specimenIds) {
      const order = this.orders.find(o => o.Id === parseInt(specimenId));
      if (order) {
        // Reject original order
        order.collectionStatus = "Rejected";
        order.rejectionReason = rejectionReason;
        order.rejectionDate = new Date().toISOString();
        rejectedOrders.push(order);
        
        // Create reorder
        const maxId = Math.max(...this.orders.map(o => o.Id), 0);
        const reOrder = {
          ...order,
          Id: maxId + rejectedOrders.length,
          collectionStatus: "Pending",
          originalOrderId: order.Id,
          isReorder: true,
          reorderReason: rejectionReason,
          orderDate: new Date().toISOString(),
          barcode: null,
          statusHistory: []
        };
        
        this.orders.push(reOrder);
        reOrders.push(reOrder);
      }
    }
    
    this.updateProcessingQueue();
    return { rejectedOrders, reOrders };
  }

  validateQualityControl(order) {
    // Simulate QC validation
    const qcChecks = [
      { name: "Specimen Volume", passed: Math.random() > 0.1 },
      { name: "Specimen Integrity", passed: Math.random() > 0.05 },
      { name: "Label Verification", passed: Math.random() > 0.02 },
      { name: "Temperature Control", passed: Math.random() > 0.03 },
      { name: "Chain of Custody", passed: Math.random() > 0.01 }
    ];
    
    const failedChecks = qcChecks.filter(check => !check.passed);
    
    return {
      passed: failedChecks.length === 0,
      checks: qcChecks,
      failureReasons: failedChecks.map(check => check.name),
      timestamp: new Date().toISOString()
    };
  }

async getBatchResults(specimenIds) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results = {};
    for (const specimenId of specimenIds) {
      const order = this.orders.find(o => o.Id === parseInt(specimenId));
      if (order) {
        // Generate template results for each test with parameters
        results[specimenId] = {
          orderId: order.Id,
          tests: order.tests?.map(test => {
            const testCatalog = this.tests.find(t => t.Id === test.Id);
            return {
              testId: test.Id,
              testName: test.name,
              parameters: testCatalog?.parameters?.map(param => ({
                name: param.name,
                result: "",
                unit: param.unit,
                normalRange: param.normalRange,
                criticalLow: param.criticalLow,
                criticalHigh: param.criticalHigh,
                flag: "Normal"
              })) || [],
              overallFlag: "Normal"
            };
          }) || []
        };
      }
    }

    return results;
  }

  // Quality Control Methods
  async getQcSamples() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.qcSamples];
  }

  async getCalibrationSchedule() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.calibrationSchedule];
  }

  async getCalibrationReminders() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const now = new Date();
    const reminderThreshold = 24 * 60 * 60 * 1000; // 24 hours

    return this.calibrationSchedule.filter(cal => {
      const dueDate = new Date(cal.nextDue);
      const timeDiff = dueDate - now;
      return timeDiff <= reminderThreshold && timeDiff > -24 * 60 * 60 * 1000;
    }).map(cal => ({
      ...cal,
      urgency: cal.status === 'Overdue' ? 'Critical' : 
               cal.status === 'Due Soon' ? 'High' : 'Medium',
      hoursUntilDue: Math.ceil((new Date(cal.nextDue) - now) / (1000 * 60 * 60))
    }));
  }

  async performCalibration(calibrationId, results) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const calibration = this.calibrationSchedule.find(c => c.Id === calibrationId);
    if (calibration) {
      const now = new Date();
      calibration.lastCalibration = now.toISOString();
      
      // Calculate next due date based on frequency
      const nextDue = new Date(now);
      switch (calibration.frequency) {
        case 'Daily':
          nextDue.setDate(nextDue.getDate() + 1);
          break;
        case 'Weekly':
          nextDue.setDate(nextDue.getDate() + 7);
          break;
        case 'Bi-weekly':
          nextDue.setDate(nextDue.getDate() + 14);
          break;
        case 'Monthly':
          nextDue.setMonth(nextDue.getMonth() + 1);
          break;
      }
      
      calibration.nextDue = nextDue.toISOString();
      calibration.status = 'Current';
      calibration.lastResults = results;
    }
    
    return calibration;
  }

  validateResultFlag(result, parameter) {
    if (!result || result === "") return "Pending";
    
    const numResult = parseFloat(result);
    if (isNaN(numResult)) return "Normal";
    
    // Check critical values first
    if (parameter.criticalLow !== null && numResult <= parameter.criticalLow) return "Critical Low";
    if (parameter.criticalHigh !== null && numResult >= parameter.criticalHigh) return "Critical High";
    
    // Parse normal range
    const range = parameter.normalRange;
    if (range.includes("-")) {
      const [low, high] = range.split("-").map(v => parseFloat(v.trim()));
      if (!isNaN(low) && !isNaN(high)) {
        if (numResult < low) return "Low";
        if (numResult > high) return "High";
      }
    } else if (range.startsWith("<")) {
      const threshold = parseFloat(range.substring(1));
      if (!isNaN(threshold) && numResult >= threshold) return "High";
    } else if (range.startsWith(">")) {
      const threshold = parseFloat(range.substring(1));
      if (!isNaN(threshold) && numResult <= threshold) return "Low";
    }
    
    return "Normal";
  }

  async updateBatchResults(specimenIds, resultsData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update results with proper flagging
    for (const specimenId in resultsData) {
      const specimenResults = resultsData[specimenId];
      for (const test of specimenResults.tests) {
        for (const param of test.parameters) {
          param.flag = this.validateResultFlag(param.result, param);
        }
        // Set overall test flag based on worst parameter flag
        const flags = test.parameters.map(p => p.flag);
        if (flags.includes("Critical High") || flags.includes("Critical Low")) {
          test.overallFlag = "Critical";
        } else if (flags.includes("High") || flags.includes("Low")) {
          test.overallFlag = "Abnormal";
        } else {
          test.overallFlag = "Normal";
        }
      }
    }
    
return resultsData;
  }

  getTestUnit(test) {
    // Return appropriate unit based on test type
    const unitMap = {
      "CBC": "cells/μL",
      "BMP": "mg/dL",
      "LIPID": "mg/dL",
      "TFT": "μIU/mL",
      "LFT": "U/L",
      "UA": "various",
      "HbA1C": "%",
      "TnI": "ng/mL",
      "VIT-D": "ng/mL"
    };
    
    return unitMap[test.code] || "units";
  }
calculateActualProcessingTime(order) {
    if (!order.processingStarted || !order.processingCompleted) {
      return null;
    }
    const startTime = new Date(order.processingStarted);
    const endTime = new Date(order.processingCompleted);
    const diffMinutes = Math.ceil((endTime - startTime) / (1000 * 60));
    
    return {
      minutes: diffMinutes,
      formatted: `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`
    };
  }
}

export default new LaboratoryService();