import React from "react";
import Error from "@/components/ui/Error";
class MedicationService {
  constructor() {
this.medications = [
      {
        Id: 1,
        patientId: 1,
        drugName: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        route: "Oral",
        startDate: "2024-01-15",
        endDate: null,
        prescribingDoctor: "Dr. Johnson",
        instructions: "Take with food in the morning",
        indication: "Hypertension"
      },
      {
        Id: 2,
        patientId: 1,
        drugName: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        route: "Oral",
        startDate: "2024-02-01",
        endDate: null,
        prescribingDoctor: "Dr. Smith",
        instructions: "Take with meals",
        indication: "Type 2 Diabetes"
      },
      {
        Id: 3,
        patientId: 2,
        drugName: "Aspirin",
        dosage: "81mg",
        frequency: "Once daily",
        route: "Oral",
        startDate: "2024-01-20",
        endDate: null,
        prescribingDoctor: "Dr. Brown",
        instructions: "Take with food to reduce stomach irritation",
        indication: "Cardiovascular protection"
      }
    ]

    this.drugInteractions = [
      {
        drug1: "Warfarin",
        drug2: "Aspirin",
        severity: "Major",
        description: "Increased risk of bleeding when used together"
      },
      {
        drug1: "Lisinopril",
        drug2: "Potassium",
        severity: "Moderate",
        description: "May cause hyperkalemia (high potassium levels)"
      },
      {
        drug1: "Metformin",
        drug2: "Alcohol",
        severity: "Major",
        description: "Increased risk of lactic acidosis"
      }
    ]

    // Enhanced batch tracking and recall management system
    this.batchTracker = [
      {
        Id: 1,
        drugName: "Lisinopril",
        lotNumber: "LOT123456",
        batchId: "BATCH001",
        receivedDate: "2024-01-10",
        expiryDate: "2024-06-15",
        currentStock: 5,
        initialStock: 25,
        dispensedCount: 20,
        unit: "bottles",
        status: "active"
      },
      {
        Id: 2,
        drugName: "Metformin",
        lotNumber: "LOT789012",
        batchId: "BATCH002",
        receivedDate: "2024-02-01",
        expiryDate: "2025-01-20",
        currentStock: 45,
        initialStock: 50,
        dispensedCount: 5,
        unit: "bottles",
        status: "active"
      },
      {
        Id: 3,
        drugName: "Acetaminophen",
        lotNumber: "LOT112233",
        batchId: "BATCH003",
        receivedDate: "2023-12-15",
        expiryDate: "2024-02-28",
        currentStock: 15,
        initialStock: 30,
        dispensedCount: 15,
        unit: "bottles",
        status: "expired"
      },
      {
        Id: 4,
        drugName: "Omeprazole",
        lotNumber: "LOT445566",
        batchId: "BATCH004",
        receivedDate: "2023-11-20",
        expiryDate: "2024-01-15",
        currentStock: 22,
        initialStock: 25,
        dispensedCount: 3,
        unit: "bottles",
        status: "expired"
      }
    ]

    // FDA Recall management system
    this.recalls = [
      {
        Id: 1,
        drugName: "Acetaminophen",
        recallType: "Class II",
        riskLevel: "Medium",
        reason: "Potential contamination with foreign particles detected during quality control testing",
        fdaNumber: "R2024-001",
        recallDate: "2024-02-25",
        affectedLots: ["LOT112233", "LOT112234", "LOT112235"],
        manufacturer: "Pain Relief Corp",
        status: "active",
        requiredActions: [
          "Quarantine all affected inventory immediately",
          "Notify patients who received medications from affected lots",
          "Complete FDA Form 3500A for adverse event reporting",
          "Arrange for return/disposal of recalled products"
        ],
        patientsNotified: 0,
        stockQuarantined: false,
        createdDate: "2024-02-25T10:00:00Z"
      },
      {
        Id: 2,
        drugName: "Simvastatin",
        recallType: "Class I",
        riskLevel: "High",
        reason: "Incorrect labeling - tablets may contain double the indicated strength",
        fdaNumber: "R2024-002",
        recallDate: "2024-03-01",
        affectedLots: ["LOT901234"],
        manufacturer: "Cardio Meds",
        status: "resolved",
        requiredActions: [
          "Immediate cessation of distribution",
          "Patient notification for dosage adjustment",
          "Medical monitoring for affected patients",
          "Complete inventory audit and disposal"
        ],
        patientsNotified: 12,
        stockQuarantined: true,
        createdDate: "2024-03-01T08:00:00Z"
      }
    ]

    // Enhanced disposal tracking system with batch compliance
    this.disposalRecords = [
      {
        Id: 1,
        drugId: 3,
        drugName: "Amoxicillin",
        lotNumber: "LOT345678",
        batchId: "BATCH005",
        quantity: 12,
        unit: "bottles",
        expiryDate: "2024-03-10",
        disposalDate: "2024-03-15",
        disposalReason: "Expired medication",
        disposalMethod: "DEA approved incinerator",
        witness: "Dr. Sarah Johnson",
        disposedBy: "Pharmacist John Smith",
        complianceNotes: "DEA Form 41 completed and filed",
        location: "Shelf C-1",
        costWriteOff: 219.00,
        isRecallDisposal: false,
        batchTrackingCompliant: true,
        regulatoryFilings: ["DEA Form 41"]
      },
      {
        Id: 2,
        drugId: 6,
        drugName: "Acetaminophen",
        lotNumber: "LOT112233",
        batchId: "BATCH003",
        quantity: 15,
        unit: "bottles",
        expiryDate: "2024-02-28",
        disposalDate: "2024-03-05",
        disposalReason: "Recalled medication",
        disposalMethod: "DEA approved incinerator",
        witness: "Dr. Emily Rodriguez",
        disposedBy: "Pharmacist John Smith",
        complianceNotes: "FDA recall disposal - R2024-001 compliance completed",
        location: "Shelf D-2",
        costWriteOff: 127.50,
        isRecallDisposal: true,
        batchTrackingCompliant: true,
        regulatoryFilings: ["FDA Form 3500A", "DEA Form 41"]
      }
    ]
  }

async getInventory() {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const mockInventory = [
      {
        Id: 1,
        drugName: "Lisinopril",
        ndc: "12345-0001-01",
        manufacturer: "Generic Pharma",
        dosageForm: "Tablet",
        strength: "10mg",
        currentStock: 5,
        reorderPoint: 20,
        maxStock: 100,
        unit: "bottles",
        expiryDate: "2024-06-15",
        location: "Shelf A-1",
        lotNumber: "LOT123456",
        batchId: "BATCH001",
        costPerUnit: 15.50,
        receivedDate: "2024-01-10",
        batchStatus: "active"
      },
      {
        Id: 2,
        drugName: "Metformin",
        ndc: "12345-0002-01",
        manufacturer: "Diabetes Care Inc",
        dosageForm: "Tablet",
        strength: "500mg",
        currentStock: 45,
        reorderPoint: 30,
        maxStock: 200,
        unit: "bottles",
        expiryDate: "2025-01-20",
        location: "Shelf B-2",
        lotNumber: "LOT789012",
        batchId: "BATCH002",
        costPerUnit: 12.75,
        receivedDate: "2024-02-01",
        batchStatus: "active"
      },
      {
        Id: 3,
        drugName: "Amoxicillin",
        ndc: "12345-0003-01",
        manufacturer: "Antibiotic Labs",
        dosageForm: "Capsule",
        strength: "250mg",
        currentStock: 0,
        reorderPoint: 15,
        maxStock: 75,
        unit: "bottles",
        expiryDate: "2024-03-10",
        location: "Shelf C-1",
        lotNumber: "LOT345678",
        batchId: "BATCH005",
        costPerUnit: 18.25,
        receivedDate: "2024-01-05",
        batchStatus: "disposed"
      },
      {
        Id: 4,
        drugName: "Simvastatin",
        ndc: "12345-0004-01",
        manufacturer: "Cardio Meds",
        dosageForm: "Tablet",
        strength: "20mg",
        currentStock: 25,
        reorderPoint: 10,
        maxStock: 60,
        unit: "bottles",
        expiryDate: "2024-04-30",
        location: "Shelf A-3",
        lotNumber: "LOT901234",
        batchId: "BATCH006",
        costPerUnit: 22.00,
        receivedDate: "2024-01-15",
        batchStatus: "recalled"
      },
      {
        Id: 5,
        drugName: "Hydrochlorothiazide",
        ndc: "12345-0005-01",
        manufacturer: "Diuretic Corp",
        dosageForm: "Tablet",
        strength: "25mg",
        currentStock: 8,
        reorderPoint: 12,
        maxStock: 50,
        unit: "bottles",
        expiryDate: "2024-05-15",
        location: "Shelf B-1",
        lotNumber: "LOT567890",
        batchId: "BATCH007",
        costPerUnit: 9.75,
        receivedDate: "2024-01-20",
        batchStatus: "active"
      },
      {
        Id: 6,
        drugName: "Acetaminophen",
        ndc: "12345-0006-01",
        manufacturer: "Pain Relief Corp",
        dosageForm: "Tablet",
        strength: "500mg",
        currentStock: 15,
        reorderPoint: 25,
        maxStock: 100,
        unit: "bottles",
        expiryDate: "2024-02-28",
        location: "Shelf D-2",
        lotNumber: "LOT112233",
        batchId: "BATCH003",
        costPerUnit: 8.50,
        receivedDate: "2023-12-15",
        batchStatus: "recalled"
      },
      {
        Id: 7,
        drugName: "Omeprazole",
        ndc: "12345-0007-01",
        manufacturer: "Gastro Meds",
        dosageForm: "Capsule",
        strength: "20mg",
        currentStock: 22,
        reorderPoint: 18,
        maxStock: 80,
        unit: "bottles",
        expiryDate: "2024-01-15",
        location: "Shelf E-1",
        lotNumber: "LOT445566",
        batchId: "BATCH004",
        costPerUnit: 16.75,
        receivedDate: "2023-11-20",
        batchStatus: "expired"
      }
    ]
    
    return mockInventory
  }

async getInventoryStats() {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const inventory = await this.getInventory()
    const now = new Date()
    
    const stats = {
      totalItems: inventory.length,
      lowStock: inventory.filter(item => item.currentStock <= item.reorderPoint).length,
      outOfStock: inventory.filter(item => item.currentStock === 0).length,
      expiringSoon: inventory.filter(item => {
        const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - now) / (1000 * 60 * 60 * 24))
        return daysUntilExpiry <= 90 && daysUntilExpiry > 0
      }).length,
      expired: inventory.filter(item => new Date(item.expiryDate) < now).length,
      recalled: inventory.filter(item => item.batchStatus === "recalled").length,
      totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0),
      batchTracked: inventory.filter(item => item.lotNumber && item.batchId).length
    }
    
    return stats
  }

async updateStock(drugId, newStock, lotNumber = null) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!drugId || newStock < 0) {
      throw new Error("Invalid drug ID or stock quantity")
    }
    
    // Update batch tracker if lot number provided
    if (lotNumber) {
      const batchIndex = this.batchTracker.findIndex(batch => batch.lotNumber === lotNumber)
      if (batchIndex !== -1) {
        const oldStock = this.batchTracker[batchIndex].currentStock
        this.batchTracker[batchIndex].currentStock = newStock
        this.batchTracker[batchIndex].dispensedCount += (oldStock - newStock)
        this.batchTracker[batchIndex].lastUpdated = new Date().toISOString()
      }
    }
    
    return {
      success: true,
      message: "Stock updated successfully with batch tracking",
      batchTracked: !!lotNumber
    }
  }

async setReorderPoint(drugId, reorderPoint) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!drugId || reorderPoint < 0) {
      throw new Error("Invalid drug ID or reorder point")
    }
    
    return {
      success: true,
      message: "Reorder point updated successfully with batch tracking"
    }
  }

  async checkLowStock() {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const inventory = await this.getInventory()
    return inventory.filter(item => item.currentStock <= item.reorderPoint)
  }

  async getExpiringDrugs(days = 90) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const inventory = await this.getInventory()
    const now = new Date()
    
    return inventory.filter(item => {
      const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - now) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry <= days && daysUntilExpiry > 0
    })
  }

  // Get expired medications that require disposal
  async getExpiredMedications() {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const inventory = await this.getInventory()
    const now = new Date()
    
    return inventory.filter(item => {
      return new Date(item.expiryDate) < now && item.currentStock > 0
    })
  }

  // Dispose expired medication
async disposeMedication(drugId, disposalData) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (!drugId || !disposalData) {
      throw new Error("Invalid disposal data")
    }

    // Validate required fields
    const requiredFields = ['quantity', 'disposalReason', 'disposalMethod', 'witness', 'disposedBy']
    for (const field of requiredFields) {
      if (!disposalData[field]) {
        throw new Error(`${field} is required for disposal`)
      }
    }

    // Enhanced disposal record with batch tracking
    const disposalRecord = {
      Id: Date.now() + Math.random(),
      drugId,
      drugName: disposalData.drugName,
      lotNumber: disposalData.lotNumber,
      batchId: disposalData.batchId,
      quantity: disposalData.quantity,
      unit: disposalData.unit,
      expiryDate: disposalData.expiryDate,
      disposalDate: new Date().toISOString(),
      disposalReason: disposalData.disposalReason,
      disposalMethod: disposalData.disposalMethod,
      witness: disposalData.witness,
      disposedBy: disposalData.disposedBy,
      complianceNotes: disposalData.complianceNotes || "",
      location: disposalData.location,
      costWriteOff: disposalData.quantity * disposalData.costPerUnit,
      isRecallDisposal: disposalData.isRecallDisposal || false,
      batchTrackingCompliant: !!(disposalData.lotNumber && disposalData.batchId),
      regulatoryFilings: [],
      regulatoryCompliance: {
        deaFormRequired: disposalData.disposalMethod === "DEA approved incinerator",
        fdaNotificationRequired: disposalData.isRecallDisposal,
        witnessRequired: true,
        documentationComplete: true,
        approvalRequired: disposalData.quantity * disposalData.costPerUnit > 500,
        batchTrackingRequired: true
      }
    }

    // Add appropriate regulatory filings
    if (disposalRecord.regulatoryCompliance.deaFormRequired) {
      disposalRecord.regulatoryFilings.push("DEA Form 41")
    }
    
    if (disposalRecord.regulatoryCompliance.fdaNotificationRequired) {
      disposalRecord.regulatoryFilings.push("FDA Form 3500A")
    }

    // Update batch tracker
    if (disposalData.lotNumber) {
      const batchIndex = this.batchTracker.findIndex(batch => batch.lotNumber === disposalData.lotNumber)
      if (batchIndex !== -1) {
        this.batchTracker[batchIndex].currentStock -= disposalData.quantity
        this.batchTracker[batchIndex].status = "disposed"
        this.batchTracker[batchIndex].disposalDate = new Date().toISOString()
      }
    }

    // Add to disposal records
    this.disposalRecords.push(disposalRecord)

    return {
      success: true,
      message: disposalData.isRecallDisposal 
        ? "Recalled medication disposed successfully with FDA compliance"
        : "Medication disposed successfully with batch tracking",
      disposalRecord,
      complianceStatus: "Complete",
      batchTracked: disposalRecord.batchTrackingCompliant,
      regulatoryFilings: disposalRecord.regulatoryFilings
    }
  }

// Get disposal history with batch tracking
  async getDisposalHistory() {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return this.disposalRecords.sort((a, b) => new Date(b.disposalDate) - new Date(a.disposalDate))
  }

  // Get batch tracking data
  async getBatchTracker() {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return this.batchTracker.sort((a, b) => new Date(b.receivedDate) - new Date(a.receivedDate))
  }

  // FDA Recall Management
  async getActiveRecalls() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return this.recalls.filter(recall => recall.status === "active")
  }

  async getAllRecalls() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return this.recalls.sort((a, b) => new Date(b.recallDate) - new Date(a.recallDate))
  }

  async createRecallAlert(recallData) {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const recall = {
      Id: Date.now() + Math.random(),
      drugName: recallData.drugName,
      recallType: recallData.recallType,
      riskLevel: recallData.riskLevel,
      reason: recallData.reason,
      fdaNumber: recallData.fdaNumber,
      recallDate: recallData.recallDate,
      affectedLots: recallData.affectedLots,
      manufacturer: recallData.manufacturer,
      status: "active",
      requiredActions: recallData.requiredActions || [],
      patientsNotified: 0,
      stockQuarantined: false,
      createdDate: new Date().toISOString()
    }
    
    this.recalls.push(recall)
    
    return {
      success: true,
      message: "Recall alert created successfully",
      recall
    }
  }

  async notifyRecallPatients(recallId) {
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    const recall = this.recalls.find(r => r.Id === recallId)
    if (!recall) {
      throw new Error("Recall not found")
    }
    
    // Simulate patient notification process
    const affectedPatients = Math.floor(Math.random() * 50) + 10
    recall.patientsNotified = affectedPatients
    recall.lastUpdated = new Date().toISOString()
    
    return {
      success: true,
      message: `${affectedPatients} patients notified successfully`,
      patientsNotified: affectedPatients
    }
  }

  async quarantineRecalledStock(recallId) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const recall = this.recalls.find(r => r.Id === recallId)
    if (!recall) {
      throw new Error("Recall not found")
    }
    
    // Update inventory status for affected lots
    const inventory = await this.getInventory()
    let quarantinedItems = 0
    
    inventory.forEach(item => {
      if (recall.affectedLots.includes(item.lotNumber)) {
        item.batchStatus = "quarantined"
        quarantinedItems++
      }
    })
    
    recall.stockQuarantined = true
    recall.lastUpdated = new Date().toISOString()
    
    return {
      success: true,
      message: `${quarantinedItems} inventory items quarantined`,
      quarantinedItems
    }
  }

// Enhanced disposal statistics with batch tracking
  async getDisposalStats() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const thisMonth = new Date()
    const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1, 1)
    
    const thisMonthDisposals = this.disposalRecords.filter(record => 
      new Date(record.disposalDate) >= lastMonth
    )

    return {
      totalDisposals: this.disposalRecords.length,
      thisMonthDisposals: thisMonthDisposals.length,
      totalCostWriteOff: this.disposalRecords.reduce((sum, record) => sum + record.costWriteOff, 0),
      thisMonthCostWriteOff: thisMonthDisposals.reduce((sum, record) => sum + record.costWriteOff, 0),
      recallDisposals: this.disposalRecords.filter(record => record.isRecallDisposal).length,
      batchTrackedDisposals: this.disposalRecords.filter(record => record.batchTrackingCompliant).length,
      disposalReasons: this.disposalRecords.reduce((acc, record) => {
        acc[record.disposalReason] = (acc[record.disposalReason] || 0) + 1
        return acc
      }, {}),
      disposalMethods: this.disposalRecords.reduce((acc, record) => {
        acc[record.disposalMethod] = (acc[record.disposalMethod] || 0) + 1
        return acc
      }, {}),
      regulatoryFilings: this.disposalRecords.reduce((acc, record) => {
        record.regulatoryFilings?.forEach(filing => {
          acc[filing] = (acc[filing] || 0) + 1
        })
        return acc
      }, {})
    }
  }

// Enhanced Automated Alert System with Batch Tracking
  async monitorInventoryAlerts() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const inventory = await this.getInventory()
    const alerts = []
    
    inventory.forEach(item => {
      // Low stock alerts
      if (item.currentStock <= item.reorderPoint) {
        alerts.push({
          Id: `stock_${item.Id}`,
          type: 'low_stock',
          priority: item.currentStock === 0 ? 'critical' : 'high',
          drugId: item.Id,
          drugName: item.drugName,
          lotNumber: item.lotNumber,
          currentStock: item.currentStock,
          reorderPoint: item.reorderPoint,
          message: item.currentStock === 0 
            ? `${item.drugName} (Lot: ${item.lotNumber}) is out of stock`
            : `${item.drugName} (Lot: ${item.lotNumber}) is below reorder point (${item.currentStock}/${item.reorderPoint})`,
          timestamp: new Date().toISOString(),
          location: item.location
        })
      }
      
      // Expiry alerts
      const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
      if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
        alerts.push({
          Id: `expiry_${item.Id}`,
          type: 'expiring',
          priority: daysUntilExpiry <= 7 ? 'critical' : 'medium',
          drugId: item.Id,
          drugName: item.drugName,
          lotNumber: item.lotNumber,
          expiryDate: item.expiryDate,
          daysUntilExpiry,
          message: `${item.drugName} (Lot: ${item.lotNumber}) expires in ${daysUntilExpiry} days`,
          timestamp: new Date().toISOString()
        })
      }

      // Expired alerts (disposal required)
      if (daysUntilExpiry <= 0 && item.currentStock > 0) {
        alerts.push({
          Id: `expired_${item.Id}`,
          type: 'expired',
          priority: 'critical',
          drugId: item.Id,
          drugName: item.drugName,
          lotNumber: item.lotNumber,
          expiryDate: item.expiryDate,
          daysExpired: Math.abs(daysUntilExpiry),
          currentStock: item.currentStock,
          message: `${item.drugName} (Lot: ${item.lotNumber}) expired ${Math.abs(daysUntilExpiry)} days ago - disposal required`,
          timestamp: new Date().toISOString(),
          action: 'disposal_required'
        })
      }

      // Recall alerts
      if (item.batchStatus === "recalled") {
        alerts.push({
          Id: `recall_${item.Id}`,
          type: 'recall',
          priority: 'critical',
          drugId: item.Id,
          drugName: item.drugName,
          lotNumber: item.lotNumber,
          message: `${item.drugName} (Lot: ${item.lotNumber}) is subject to FDA recall - immediate action required`,
          timestamp: new Date().toISOString(),
          action: 'recall_compliance_required'
        })
      }

      // Batch tracking alerts
      if (!item.lotNumber || !item.batchId) {
        alerts.push({
          Id: `batch_${item.Id}`,
          type: 'batch_tracking',
          priority: 'medium',
          drugId: item.Id,
          drugName: item.drugName,
          message: `${item.drugName} missing batch tracking information`,
          timestamp: new Date().toISOString(),
          action: 'update_batch_info'
        })
      }
    })
    
    return alerts
  }

  // Purchase Order Generation
  async generateAutomaticPurchaseOrders() {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const lowStockItems = await this.checkLowStock()
    const purchaseOrders = []
    
    for (const item of lowStockItems) {
      if (item.autoReorder) {
        const orderQuantity = this.calculateOrderQuantity(item)
        const supplier = await this.getPreferredSupplier(item.Id)
        
        const purchaseOrder = {
          Id: Date.now() + Math.random(),
          orderNumber: `PO-${Date.now()}-${item.Id}`,
          drugId: item.Id,
          drugName: item.drugName,
          currentStock: item.currentStock,
          ndc: item.ndc,
          reorderPoint: item.reorderPoint,
          orderQuantity,
          estimatedCost: orderQuantity * item.unitCost,
          supplier: supplier,
          priority: item.currentStock === 0 ? 'urgent' : 'normal',
          status: 'pending_approval',
          createdDate: new Date().toISOString(),
          expectedDelivery: this.calculateDeliveryDate(supplier.leadTimeDays),
          autoGenerated: true,
          approvalRequired: orderQuantity * item.unitCost > 1000
        }
        
        purchaseOrders.push(purchaseOrder)
      }
    }
    
    return purchaseOrders
  }

  calculateOrderQuantity(item) {
    // Calculate order quantity based on usage patterns and lead times
    const monthlyUsage = item.monthlyUsage || 50
    const leadTimeDays = item.supplier?.leadTimeDays || 7
    const safetyStock = item.reorderPoint
    
    // Order enough for lead time + safety stock + monthly usage
    const leadTimeStock = Math.ceil((monthlyUsage / 30) * leadTimeDays)
    const recommendedQuantity = leadTimeStock + safetyStock + monthlyUsage
    
    // Round up to nearest pack size if available
    const packSize = item.packSize || 1
    return Math.ceil(recommendedQuantity / packSize) * packSize
  }

  async getPreferredSupplier(drugId) {
    // Mock supplier data - in real system would come from supplier database
    const suppliers = [
      {
        Id: 1,
        name: "PharmaCorp Distribution",
        contactEmail: "orders@pharmacorp.com",
        contactPhone: "1-800-PHARMA-1",
        leadTimeDays: 3,
        reliability: 0.98,
        preferredForCategories: ["antibiotics", "pain_management"]
      },
      {
        Id: 2,
        name: "MedSupply Plus",
        contactEmail: "orders@medsupplyplus.com",
        contactPhone: "1-888-MED-SUPP",
        leadTimeDays: 5,
        reliability: 0.95,
        preferredForCategories: ["cardiovascular", "diabetes"]
      },
      {
        Id: 3,
        name: "Emergency Medical Supply",
        contactEmail: "urgent@emergencymedsupply.com",
        contactPhone: "1-800-URGENT-1",
        leadTimeDays: 1,
        reliability: 0.92,
        emergencySupplier: true
      }
    ]
    
    // Return preferred supplier based on drug category or default to first
    return suppliers[0]
  }

  calculateDeliveryDate(leadTimeDays) {
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + leadTimeDays)
    return deliveryDate.toISOString()
  }

  // Purchase Order Management
  async getPurchaseOrders() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Mock purchase orders - would be stored in database
    return [
      {
        Id: 1,
        orderNumber: "PO-2024-001",
        drugName: "Acetaminophen 500mg",
        supplier: { name: "PharmaCorp Distribution", phone: "1-800-PHARMA-1" },
        orderQuantity: 500,
        estimatedCost: 125.00,
        status: "pending_approval",
        priority: "normal",
        createdDate: new Date().toISOString(),
        expectedDelivery: this.calculateDeliveryDate(3),
        autoGenerated: true
      },
      {
        Id: 2,
        orderNumber: "PO-2024-002",
        drugName: "Ibuprofen 200mg",
        supplier: { name: "MedSupply Plus", phone: "1-888-MED-SUPP" },
        orderQuantity: 1000,
        estimatedCost: 89.50,
        status: "approved",
        priority: "normal",
        createdDate: new Date(Date.now() - 86400000).toISOString(),
        expectedDelivery: this.calculateDeliveryDate(5),
        autoGenerated: false
      }
    ]
  }

  async approvePurchaseOrder(orderId, approvedBy) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // In real system, would update database and send order to supplier
    return {
      success: true,
      message: "Purchase order approved and sent to supplier",
      orderNumber: `PO-2024-${orderId}`,
      approvalDate: new Date().toISOString(),
      approvedBy
    }
  }

  async createManualPurchaseOrder(orderData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const purchaseOrder = {
      Id: Date.now(),
      orderNumber: `PO-${Date.now()}`,
      ...orderData,
      status: 'pending_approval',
      createdDate: new Date().toISOString(),
      autoGenerated: false,
      approvalRequired: orderData.estimatedCost > 1000
    }
    
    return purchaseOrder
  }

  // Alert Notification System
async getActiveAlerts() {
    const alerts = await this.monitorInventoryAlerts()
    
    // Filter for active/unresolved alerts with enhanced batch tracking
    return alerts.filter(alert => {
      if (alert.type === 'low_stock') {
        return alert.currentStock <= alert.reorderPoint
      }
      if (alert.type === 'expiring') {
        return alert.daysUntilExpiry <= 30
      }
      if (alert.type === 'recall') {
        return true // All recall alerts are active until resolved
      }
      if (alert.type === 'batch_tracking') {
        return true // All batch tracking issues need resolution
      }
      return true
    })
  }

async dismissAlert(alertId) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // In real system, would mark alert as dismissed in database
    return {
      success: true,
      message: "Alert dismissed successfully"
    }
  }

  // Batch tracking specific methods
  async updateBatchInfo(drugId, batchData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const batchIndex = this.batchTracker.findIndex(batch => batch.Id === drugId)
    if (batchIndex !== -1) {
      this.batchTracker[batchIndex] = {
        ...this.batchTracker[batchIndex],
        ...batchData,
        lastUpdated: new Date().toISOString()
      }
    } else {
      // Create new batch record
      const newBatch = {
        Id: Date.now() + Math.random(),
        ...batchData,
        createdDate: new Date().toISOString()
      }
      this.batchTracker.push(newBatch)
    }
    
    return {
      success: true,
      message: "Batch information updated successfully"
    }
  }

  async getBatchHistory(lotNumber) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const batch = this.batchTracker.find(b => b.lotNumber === lotNumber)
    if (!batch) {
      throw new Error("Batch not found")
    }
    
    // Return batch history with all transactions
    return {
      batchInfo: batch,
      disposalHistory: this.disposalRecords.filter(d => d.lotNumber === lotNumber),
      recallHistory: this.recalls.filter(r => r.affectedLots.includes(lotNumber))
    }
  }

  async searchBatchesByLot(lotNumber) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return this.batchTracker.filter(batch => 
      batch.lotNumber.toLowerCase().includes(lotNumber.toLowerCase())
    )
  }
}

  // Configuration Management
  async updateInventorySettings(settings) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Settings like auto-reorder thresholds, default suppliers, etc.
    const defaultSettings = {
      autoReorderEnabled: true,
      alertThresholds: {
        lowStock: 'reorderPoint',
        criticalStock: 0,
        expiryWarning: 30,
        expiryAlert: 7
      },
      approvalLimits: {
        autoApprove: 500,
        managerApproval: 1000,
        adminApproval: 5000
      },
      defaultLeadTime: 7,
      safetyStockMultiplier: 1.2
    }
    
    return { ...defaultSettings, ...settings }
  }

async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.medications]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const medication = this.medications.find(med => med.Id === parseInt(id))
    if (!medication) {
      throw new Error("Medication not found")
    }
    return { ...medication }
  }

  async getByPatientId(patientId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.medications.filter(med => med.patientId === parseInt(patientId)).map(med => ({ ...med }))
  }

  async create(medicationData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const maxId = Math.max(...this.medications.map(med => med.Id), 0)
    const newMedication = {
      ...medicationData,
      Id: maxId + 1,
      patientId: parseInt(medicationData.patientId)
    }
    
    this.medications.push(newMedication)
    return { ...newMedication }
  }

async update(id, medicationData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.medications.findIndex(med => med.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Medication not found")
    }
    
    this.medications[index] = {
      ...this.medications[index],
      ...medicationData,
      Id: parseInt(id),
      patientId: parseInt(medicationData.patientId)
    }
    
    return { ...this.medications[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.medications.findIndex(med => med.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Medication not found")
    }
    
    const deletedMedication = this.medications.splice(index, 1)[0]
    return { ...deletedMedication }
  }

  async checkInteractions(patientId, newDrug) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const patientMedications = this.medications.filter(med => med.patientId === parseInt(patientId))
    const interactions = []
    
    for (const medication of patientMedications) {
      const interaction = this.drugInteractions.find(interaction => 
        (interaction.drug1.toLowerCase() === newDrug.toLowerCase() && 
         interaction.drug2.toLowerCase() === medication.drugName.toLowerCase()) ||
        (interaction.drug2.toLowerCase() === newDrug.toLowerCase() && 
         interaction.drug1.toLowerCase() === medication.drugName.toLowerCase())
      )
      
      if (interaction) {
        interactions.push({
          ...interaction,
          existingMedication: medication.drugName
        })
      }
    }
    
    return interactions
  }

  async getActiveCount(patientId) {
    await new Promise(resolve => setTimeout(resolve, 100))
    const activeMedications = this.medications.filter(med => 
      med.patientId === parseInt(patientId) && 
      (!med.endDate || new Date(med.endDate) > new Date())
    )
    return activeMedications.length
}
  
  async searchDrugs(query) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Mock drug database for search
    const drugDatabase = [
      { name: "Lisinopril", genericName: "Lisinopril", commonDosage: "10mg", category: "ACE Inhibitor" },
      { name: "Metformin", genericName: "Metformin", commonDosage: "500mg", category: "Antidiabetic" },
      { name: "Aspirin", genericName: "Acetylsalicylic Acid", commonDosage: "81mg", category: "NSAID" },
      { name: "Atorvastatin", genericName: "Atorvastatin", commonDosage: "20mg", category: "Statin" },
      { name: "Amlodipine", genericName: "Amlodipine", commonDosage: "5mg", category: "Calcium Channel Blocker" },
      { name: "Omeprazole", genericName: "Omeprazole", commonDosage: "20mg", category: "PPI" },
      { name: "Levothyroxine", genericName: "Levothyroxine", commonDosage: "50mcg", category: "Thyroid Hormone" },
      { name: "Albuterol", genericName: "Albuterol", commonDosage: "90mcg", category: "Bronchodilator" },
      { name: "Warfarin", genericName: "Warfarin", commonDosage: "5mg", category: "Anticoagulant" },
      { name: "Prednisone", genericName: "Prednisone", commonDosage: "10mg", category: "Corticosteroid" },
      { name: "Amoxicillin", genericName: "Amoxicillin", commonDosage: "500mg", category: "Antibiotic" },
      { name: "Ibuprofen", genericName: "Ibuprofen", commonDosage: "400mg", category: "NSAID" },
      { name: "Acetaminophen", genericName: "Acetaminophen", commonDosage: "500mg", category: "Analgesic" },
      { name: "Hydrochlorothiazide", genericName: "Hydrochlorothiazide", commonDosage: "25mg", category: "Diuretic" },
      { name: "Furosemide", genericName: "Furosemide", commonDosage: "40mg", category: "Loop Diuretic" }
    ]

    return drugDatabase.filter(drug => 
      drug.name.toLowerCase().includes(query.toLowerCase()) ||
      drug.genericName.toLowerCase().includes(query.toLowerCase()) ||
      drug.category.toLowerCase().includes(query.toLowerCase())
    )
  }

  async calculateDosage(drugName, patientWeight, patientAge) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Simplified dosage calculation logic
    const calculations = {
      "ibuprofen": {
        adult: "400-600mg every 6-8 hours",
        pediatric: "10mg/kg every 6-8 hours"
      },
      "acetaminophen": {
        adult: "500-1000mg every 4-6 hours",
        pediatric: "10-15mg/kg every 4-6 hours"
      },
      "amoxicillin": {
        adult: "500mg every 8 hours",
        pediatric: "25-45mg/kg/day divided every 8 hours"
      }
    }

    const drugKey = drugName.toLowerCase()
    const ageGroup = patientAge < 18 ? 'pediatric' : 'adult'
    
    return calculations[drugKey]?.[ageGroup] || "Consult prescribing information"
  }
}

export default new MedicationService()