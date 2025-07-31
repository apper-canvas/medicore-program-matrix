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
    price: 25.00
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
    price: 35.00
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
    price: 45.00
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
    price: 55.00
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
    price: 40.00
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
    price: 20.00
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
    price: 30.00
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
    price: 35.00
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
    price: 75.00
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
    price: 150.00
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
    price: 300.00
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
    price: 50.00
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
    price: 60.00
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
    price: 70.00
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
    price: 80.00
  }
];

const labOrders = [];

class LaboratoryService {
  constructor() {
    this.tests = [...labTestCatalog];
    this.orders = [...labOrders];
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
    
    const newOrder = {
      ...orderData,
      Id: maxId + 1,
      tests: testsWithDetails,
      requirements,
      totalPrice: testsWithDetails.reduce((sum, test) => sum + test.price, 0),
      status: "Pending",
      orderDate: new Date().toISOString(),
      collectionStatus: "Not Collected",
      resultsStatus: "Pending"
    };
    
    this.orders.push(newOrder);
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
}

export default new LaboratoryService();