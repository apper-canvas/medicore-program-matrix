import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import MetricCard from "@/components/molecules/MetricCard"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Input from "@/components/atoms/Input"
import Label from "@/components/atoms/Label"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import prescriptionService from "@/services/api/prescriptionService"
import medicationService from "@/services/api/medicationService"
import allergyService from "@/services/api/allergyService"

const Pharmacy = () => {
  const [activeTab, setActiveTab] = useState("queue")
  const [prescriptions, setPrescriptions] = useState([])
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([])
const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [workflowStats, setWorkflowStats] = useState(null)
  
  // Inventory states
  const [inventory, setInventory] = useState([])
  const [inventoryStats, setInventoryStats] = useState(null)
  const [inventoryFilter, setInventoryFilter] = useState("all")
  const [inventorySort, setInventorySort] = useState("name")
  const [selectedDrug, setSelectedDrug] = useState(null)
  const [showReorderModal, setShowReorderModal] = useState(false)

  // Modal states
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [showDispensingModal, setShowDispensingModal] = useState(false)
  const [showCounselingModal, setShowCounselingModal] = useState(false)
  const [showInteractionModal, setShowInteractionModal] = useState(false)
  // Form states
  const [verificationData, setVerificationData] = useState({
    interactions: [],
    allergies: [],
    notes: ""
  })
  const [dispensingData, setDispensingData] = useState({
    barcodeScanned: false,
    lotNumber: "",
    expirationDate: "",
    quantityVerified: false,
    dispensedBy: "Current Pharmacist"
  })
  const [counselingData, setCounselingData] = useState({
    topics: [],
    patientQuestions: "",
    responses: "",
    adherenceDiscussion: "",
    followUpNeeded: false,
    followUpDate: "",
    patientUnderstood: false,
    counseledBy: "Current Pharmacist"
  })

  useEffect(() => {
    loadPrescriptions()
    loadWorkflowStats()
  }, [])

useEffect(() => {
    filterPrescriptions()
  }, [prescriptions, searchTerm, activeTab])

  useEffect(() => {
    if (activeTab === "inventory") {
      loadInventory()
    }
  }, [activeTab])
  const loadPrescriptions = async () => {
    try {
      setLoading(true)
      const data = await prescriptionService.getAll()
      setPrescriptions(data)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load prescriptions")
    } finally {
      setLoading(false)
    }
  }

  const loadWorkflowStats = async () => {
    try {
      const stats = await prescriptionService.getWorkflowStats()
      setWorkflowStats(stats)
    } catch (err) {
console.error("Failed to load workflow stats:", err)
    }
  }

  async function loadInventory() {
    try {
      setLoading(true)
      const [inventoryData, stats] = await Promise.all([
        medicationService.getInventory(),
        medicationService.getInventoryStats()
      ])
      setInventory(inventoryData)
      setInventoryStats(stats)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load inventory data")
    } finally {
      setLoading(false)
    }
  }

  function filterInventory() {
    let filtered = inventory

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ndc.includes(searchTerm)
      )
    }

    if (inventoryFilter !== "all") {
      filtered = filtered.filter(item => {
        switch (inventoryFilter) {
          case "low_stock":
            return item.currentStock <= item.reorderPoint
          case "expiring":
            const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
            return daysUntilExpiry <= 90 && daysUntilExpiry > 0
          case "expired":
            return new Date(item.expiryDate) < new Date()
          case "out_of_stock":
            return item.currentStock === 0
          default:
            return true
        }
      })
    }

    // Sort inventory
    filtered.sort((a, b) => {
      switch (inventorySort) {
        case "name":
          return a.drugName.localeCompare(b.drugName)
        case "stock":
          return a.currentStock - b.currentStock
        case "expiry":
          return new Date(a.expiryDate) - new Date(b.expiryDate)
        case "reorder":
          return (a.currentStock - a.reorderPoint) - (b.currentStock - b.reorderPoint)
        default:
          return 0
      }
    })

    return filtered
  }

  async function handleUpdateStock(drugId, newStock) {
    try {
      await medicationService.updateStock(drugId, newStock)
      await loadInventory()
      toast.success("Stock updated successfully")
    } catch (err) {
      toast.error("Failed to update stock")
    }
  }

  async function handleSetReorderPoint(drugId, reorderPoint) {
    try {
      await medicationService.setReorderPoint(drugId, reorderPoint)
      await loadInventory()
      setShowReorderModal(false)
      toast.success("Reorder point updated successfully")
    } catch (err) {
      toast.error("Failed to update reorder point")
    }
  }

  function getStockStatusColor(item) {
    if (item.currentStock === 0) return "error"
    if (item.currentStock <= item.reorderPoint) return "warning"
    return "success"
  }

  function getExpiryStatusColor(expiryDate) {
    const daysUntilExpiry = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
    if (daysUntilExpiry < 0) return "error"
    if (daysUntilExpiry <= 30) return "error"
    if (daysUntilExpiry <= 90) return "warning"
    return "success"
  }

  const filterPrescriptions = () => {
    let filtered = prescriptions

    // Filter by tab
    switch (activeTab) {
      case "queue":
        filtered = filtered.filter(p => p.status === "Pending")
        break
      case "review":
        filtered = filtered.filter(p => ["Verified", "Requires Review"].includes(p.status))
        break
      case "dispensing":
        filtered = filtered.filter(p => p.status === "Verified")
        break
      case "counseling":
        filtered = filtered.filter(p => p.status === "Dispensed")
        break
      default:
        break
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(p =>
        p.prescriptionNumber.toLowerCase().includes(search) ||
        p.patientName.toLowerCase().includes(search) ||
        p.doctorName.toLowerCase().includes(search) ||
        p.medications.some(m => m.drugName.toLowerCase().includes(search))
      )
    }

    setFilteredPrescriptions(filtered)
  }

  const handleVerifyPrescription = async (prescription) => {
    try {
      setSelectedPrescription(prescription)
      
      // Check interactions and allergies
      const interactions = await prescriptionService.checkInteractions(prescription.Id)
      const allergies = await prescriptionService.checkAllergies(prescription.Id)
      
      setVerificationData({
        interactions,
        allergies,
        notes: prescription.notes || ""
      })
      
      setShowVerificationModal(true)
    } catch (err) {
      toast.error("Failed to verify prescription")
    }
  }

  const handleCompleteVerification = async () => {
    try {
      await prescriptionService.verifyPrescription(selectedPrescription.Id)
      await loadPrescriptions()
      setShowVerificationModal(false)
      toast.success("Prescription verified successfully")
    } catch (err) {
      toast.error("Failed to complete verification")
    }
  }

  const handleStartDispensing = (prescription) => {
    setSelectedPrescription(prescription)
    setDispensingData({
      barcodeScanned: false,
      lotNumber: "",
      expirationDate: "",
      quantityVerified: false,
      dispensedBy: "Current Pharmacist"
    })
    setShowDispensingModal(true)
  }

  const handleScanBarcode = async (medication) => {
    try {
      setDispensingData(prev => ({ ...prev, barcodeScanned: true }))
      
      // Simulate barcode scanning
      const scanResult = await prescriptionService.scanBarcode(medication.ndc, medication)
      
      if (scanResult.verified) {
        toast.success(`✅ ${medication.drugName} verified successfully`)
      } else {
        toast.error("⚠️ Barcode does not match expected medication")
      }
    } catch (err) {
      toast.error("Failed to scan barcode")
    }
  }

  const handleCompleteDispensing = async () => {
    try {
      const dispensingInfo = {
        ...dispensingData,
        drugName: selectedPrescription.medications[0].drugName,
        dosage: selectedPrescription.medications[0].dosage,
        quantity: selectedPrescription.medications[0].quantity,
        barcodeVerified: dispensingData.barcodeScanned,
        verificationSteps: [
          "Patient identity verified",
          "Prescription reviewed",
          "Drug interactions checked",
          "Allergy alerts reviewed",
          "Medication verified via barcode",
          "Quantity counted and verified"
        ]
      }

      await prescriptionService.dispenseMedication(selectedPrescription.Id, dispensingInfo)
      await loadPrescriptions()
      setShowDispensingModal(false)
      toast.success("Medication dispensed successfully")
    } catch (err) {
      toast.error("Failed to dispense medication")
    }
  }

  const handleStartCounseling = (prescription) => {
    setSelectedPrescription(prescription)
    setCounselingData({
      topics: [
        "Medication purpose and benefits",
        "Proper dosing schedule",
        "Food and drug interactions",
        "Side effects to monitor",
        "When to contact doctor"
      ],
      patientQuestions: "",
      responses: "",
      adherenceDiscussion: "",
      followUpNeeded: false,
      followUpDate: "",
      patientUnderstood: false,
      counseledBy: "Current Pharmacist"
    })
    setShowCounselingModal(true)
  }

  const handleCompleteCounseling = async () => {
    try {
      const counselingInfo = {
        ...counselingData,
        patientId: selectedPrescription.patientId,
        topics: counselingData.topics,
        patientQuestions: counselingData.patientQuestions.split('\n').filter(q => q.trim()),
        responses: counselingData.responses.split('\n').filter(r => r.trim())
      }

      await prescriptionService.addCounselingNotes(selectedPrescription.Id, counselingInfo)
      await loadPrescriptions()
      setShowCounselingModal(false)
      toast.success("Patient counseling completed successfully")
    } catch (err) {
      toast.error("Failed to complete counseling")
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical": return "error"
      case "High": return "warning"
      case "Normal": return "info"
      default: return "default"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "warning"
      case "Verified": return "info"
      case "Requires Review": return "error"
      case "Dispensed": return "success"
      case "Counseled": return "primary"
      default: return "default"
    }
  }

const tabs = [
    { id: "queue", name: "Prescription Queue", icon: "Inbox", count: prescriptions.filter(p => p.status === "Pending").length },
    { id: "review", name: "Review & Verify", icon: "Shield", count: prescriptions.filter(p => ["Verified", "Requires Review"].includes(p.status)).length },
    { id: "dispensing", name: "Dispensing", icon: "Package", count: prescriptions.filter(p => p.status === "Verified").length },
    { id: "counseling", name: "Patient Counseling", icon: "MessageSquare", count: prescriptions.filter(p => p.status === "Dispensed").length },
    { id: "inventory", name: "Drug Inventory", icon: "Database", count: inventory.filter(item => item.currentStock <= item.reorderPoint).length }
  ]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadPrescriptions} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prescription Processing Center</h1>
          <p className="text-gray-600 mt-1">E-prescription management, verification, and dispensing workflow</p>
        </div>
{activeTab === "inventory" && inventoryStats ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Total Items"
              value={inventoryStats.totalItems}
              icon="Package"
              color="primary"
            />
            <MetricCard
              title="Low Stock"
              value={inventoryStats.lowStock}
              icon="AlertTriangle"
              color="warning"
            />
            <MetricCard
              title="Expiring Soon"
              value={inventoryStats.expiringSoon}
              icon="Clock"
              color="error"
            />
            <MetricCard
              title="Out of Stock"
              value={inventoryStats.outOfStock}
              icon="XCircle"
              color="error"
            />
          </div>
        ) : workflowStats && (
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{workflowStats.total}</div>
              <div className="text-sm text-gray-500">Total Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{workflowStats.statusCounts.Counseled || 0}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{workflowStats.statusCounts.Pending || 0}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.name}</span>
              {tab.count > 0 && (
                <Badge variant="primary" className="ml-2">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
{activeTab === "inventory" ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search drugs, NDC, or manufacturer..."
              className="max-w-md"
            />
            
            <div className="flex space-x-4">
              <select
                value={inventoryFilter}
                onChange={(e) => setInventoryFilter(e.target.value)}
                className="input-field min-w-40"
              >
                <option value="all">All Items</option>
                <option value="low_stock">Low Stock</option>
                <option value="expiring">Expiring Soon</option>
                <option value="expired">Expired</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
              
              <select
                value={inventorySort}
                onChange={(e) => setInventorySort(e.target.value)}
                className="input-field min-w-32"
              >
                <option value="name">Name</option>
                <option value="stock">Stock Level</option>
                <option value="expiry">Expiry Date</option>
                <option value="reorder">Reorder Status</option>
              </select>
            </div>
          </div>

          {/* Inventory Content */}
          {filterInventory().length === 0 ? (
            <Empty message="No inventory items found" />
          ) : (
            <div className="grid gap-6">
              {filterInventory().map((item) => {
                const daysUntilExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
                const stockStatus = getStockStatusColor(item)
                const expiryStatus = getExpiryStatusColor(item.expiryDate)
                
                return (
                  <Card key={item.Id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center space-x-4 mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.drugName}
                          </h3>
                          <Badge variant={stockStatus}>
                            {item.currentStock === 0 ? "Out of Stock" : 
                             item.currentStock <= item.reorderPoint ? "Low Stock" : "In Stock"}
                          </Badge>
                          <Badge variant={expiryStatus}>
                            {daysUntilExpiry < 0 ? "Expired" :
                             daysUntilExpiry <= 30 ? "Expires Soon" :
                             daysUntilExpiry <= 90 ? "Expiring" : "Good"}
                          </Badge>
                        </div>

                        {/* Drug Info */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500">NDC</div>
                            <div className="font-medium">{item.ndc}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Manufacturer</div>
                            <div className="font-medium">{item.manufacturer}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Dosage Form</div>
                            <div className="font-medium">{item.dosageForm}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Strength</div>
                            <div className="font-medium">{item.strength}</div>
                          </div>
                        </div>

                        {/* Stock Information */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500">Current Stock</div>
                            <div className={`text-xl font-bold ${
                              item.currentStock === 0 ? "text-red-600" :
                              item.currentStock <= item.reorderPoint ? "text-orange-600" : "text-green-600"
                            }`}>
                              {item.currentStock} {item.unit}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Reorder Point</div>
                            <div className="font-medium">{item.reorderPoint} {item.unit}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Expiry Date</div>
                            <div className={`font-medium ${
                              daysUntilExpiry < 0 ? "text-red-600" :
                              daysUntilExpiry <= 30 ? "text-red-600" :
                              daysUntilExpiry <= 90 ? "text-orange-600" : "text-gray-900"
                            }`}>
                              {new Date(item.expiryDate).toLocaleDateString()}
                              <div className="text-sm text-gray-500">
                                {daysUntilExpiry < 0 ? `${Math.abs(daysUntilExpiry)} days ago` :
                                 `${daysUntilExpiry} days left`}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Location</div>
                            <div className="font-medium">{item.location}</div>
                          </div>
                        </div>

                        {/* Alerts */}
                        {(item.currentStock <= item.reorderPoint || daysUntilExpiry <= 90) && (
                          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <ApperIcon name="AlertTriangle" className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-medium text-yellow-800">Inventory Alerts</span>
                            </div>
                            {item.currentStock <= item.reorderPoint && (
                              <div className="text-sm text-yellow-700 mb-1">
                                Stock level is at or below reorder point
                              </div>
                            )}
                            {daysUntilExpiry <= 90 && daysUntilExpiry > 0 && (
                              <div className="text-sm text-yellow-700">
                                Item expires in {daysUntilExpiry} days
                              </div>
                            )}
                            {daysUntilExpiry <= 0 && (
                              <div className="text-sm text-red-700">
                                Item has expired
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2 ml-6">
                        <Button
                          onClick={() => {
                            const newStock = prompt("Enter new stock quantity:", item.currentStock)
                            if (newStock && !isNaN(newStock)) {
                              handleUpdateStock(item.Id, parseInt(newStock))
                            }
                          }}
                          variant="secondary"
                          size="sm"
                        >
                          <ApperIcon name="Edit" size={16} className="mr-2" />
                          Update Stock
                        </Button>
                        
                        <Button
                          onClick={() => {
                            setSelectedDrug(item)
                            setShowReorderModal(true)
                          }}
                          variant="secondary"
                          size="sm"
                        >
                          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                          Set Reorder
                        </Button>
                        
                        {item.currentStock <= item.reorderPoint && (
                          <Button
                            onClick={() => {
                              const orderQty = prompt("Enter order quantity:", item.reorderPoint * 2)
                              if (orderQty && !isNaN(orderQty)) {
                                toast.success(`Order placed for ${orderQty} ${item.unit} of ${item.drugName}`)
                              }
                            }}
                            variant="warning"
                            size="sm"
                          >
                            <ApperIcon name="ShoppingCart" size={16} className="mr-2" />
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search prescriptions, patients, or medications..."
              className="max-w-md"
            />
          </div>

          {/* Content */}
          {filteredPrescriptions.length === 0 ? (
            <Empty message="No prescriptions found" />
          ) : (
            <div className="grid gap-6">
              {filteredPrescriptions.map((prescription) => (
                <Card key={prescription.Id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center space-x-4 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {prescription.prescriptionNumber}
                        </h3>
                        <Badge variant={getStatusColor(prescription.status)}>
                          {prescription.status}
                        </Badge>
                        <Badge variant={getPriorityColor(prescription.priority)}>
                          {prescription.priority}
                        </Badge>
                      </div>

                      {/* Patient Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Patient</div>
                          <div className="font-medium">{prescription.patientName}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Prescriber</div>
                          <div className="font-medium">{prescription.doctorName}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Received</div>
                          <div className="font-medium">
                            {new Date(prescription.dateReceived).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Medications */}
                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-2">Medications</div>
                        <div className="space-y-2">
                          {prescription.medications.map((med, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div>
                                <div className="font-medium">{med.drugName} {med.dosage}</div>
                                <div className="text-sm text-gray-600">
                                  {med.frequency} • Qty: {med.quantity} • {med.daysSupply} days
                                </div>
                                <div className="text-sm text-gray-500">{med.instructions}</div>
                              </div>
                              <div className="text-xs text-gray-400">NDC: {med.ndc}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Alerts */}
                      {(prescription.interactions.length > 0 || prescription.allergies.length > 0) && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <ApperIcon name="AlertTriangle" className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium text-red-800">Clinical Alerts</span>
                          </div>
                          {prescription.interactions.length > 0 && (
                            <div className="text-sm text-red-700 mb-1">
                              Drug Interactions: {prescription.interactions.length} found
                            </div>
                          )}
                          {prescription.allergies.length > 0 && (
                            <div className="text-sm text-red-700">
                              Allergy Alerts: {prescription.allergies.join(", ")}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-6">
                      {activeTab === "queue" && prescription.status === "Pending" && (
                        <Button
                          onClick={() => handleVerifyPrescription(prescription)}
                          className="btn-primary"
                        >
                          <ApperIcon name="Shield" size={16} className="mr-2" />
                          Verify
                        </Button>
                      )}
                      
                      {activeTab === "dispensing" && prescription.status === "Verified" && (
                        <Button
                          onClick={() => handleStartDispensing(prescription)}
                          className="btn-primary"
                        >
                          <ApperIcon name="Package" size={16} className="mr-2" />
                          Dispense
                        </Button>
                      )}
                      
                      {activeTab === "counseling" && prescription.status === "Dispensed" && (
                        <Button
                          onClick={() => handleStartCounseling(prescription)}
                          className="btn-primary"
                        >
                          <ApperIcon name="MessageSquare" size={16} className="mr-2" />
                          Counsel
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Verification Modal */}
      {showVerificationModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Prescription Verification</h2>
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Patient & Prescription Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Prescription Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Patient: {selectedPrescription.patientName}</div>
                    <div>Prescriber: {selectedPrescription.doctorName}</div>
                    <div>Rx #: {selectedPrescription.prescriptionNumber}</div>
                    <div>Priority: {selectedPrescription.priority}</div>
                  </div>
                </div>

                {/* Drug Interactions */}
                {verificationData.interactions.length > 0 && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <h3 className="font-medium text-red-800 mb-3">Drug Interactions Found</h3>
                    <div className="space-y-2">
                      {verificationData.interactions.map((interaction, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium text-red-700">
                            {interaction.drug1} + {interaction.drug2}
                          </div>
                          <div className="text-red-600">
                            Severity: {interaction.severity} - {interaction.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Allergy Alerts */}
                {verificationData.allergies.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                    <h3 className="font-medium text-orange-800 mb-3">Allergy Alerts</h3>
                    <div className="space-y-2">
                      {verificationData.allergies.map((allergy, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium text-orange-700">
                            {allergy.allergen} - {allergy.severity}
                          </div>
                          <div className="text-orange-600">{allergy.reaction}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verification Notes */}
                <div>
                  <Label htmlFor="notes">Verification Notes</Label>
                  <textarea
                    id="notes"
                    value={verificationData.notes}
                    onChange={(e) => setVerificationData(prev => ({ ...prev, notes: e.target.value }))}
                    className="input-field mt-1"
                    rows={3}
                    placeholder="Add any verification notes or comments..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => setShowVerificationModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCompleteVerification}
                  className="btn-primary"
                >
                  Complete Verification
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispensing Modal */}
      {showDispensingModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Medication Dispensing</h2>
                <button
                  onClick={() => setShowDispensingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Medications to Dispense */}
                <div>
                  <h3 className="font-medium mb-3">Medications to Dispense</h3>
                  <div className="space-y-3">
                    {selectedPrescription.medications.map((med, index) => (
                      <div key={index} className="border p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-medium">{med.drugName} {med.dosage}</div>
                            <div className="text-sm text-gray-600">Quantity: {med.quantity}</div>
                          </div>
                          <Button
                            onClick={() => handleScanBarcode(med)}
                            className={`btn-${dispensingData.barcodeScanned ? 'success' : 'primary'}`}
                            disabled={dispensingData.barcodeScanned}
                          >
                            <ApperIcon name={dispensingData.barcodeScanned ? "Check" : "Scan"} size={16} className="mr-2" />
                            {dispensingData.barcodeScanned ? "Verified" : "Scan Barcode"}
                          </Button>
                        </div>
                        <div className="text-xs text-gray-500">NDC: {med.ndc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lot Number & Expiration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lotNumber">Lot Number</Label>
                    <Input
                      id="lotNumber"
                      value={dispensingData.lotNumber}
                      onChange={(e) => setDispensingData(prev => ({ ...prev, lotNumber: e.target.value }))}
                      placeholder="Enter lot number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expirationDate">Expiration Date</Label>
                    <Input
                      id="expirationDate"
                      type="date"
                      value={dispensingData.expirationDate}
                      onChange={(e) => setDispensingData(prev => ({ ...prev, expirationDate: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Verification Checklist */}
                <div>
                  <h3 className="font-medium mb-3">Dispensing Checklist</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={dispensingData.barcodeScanned}
                        readOnly
                        className="rounded"
                      />
                      <span className="text-sm">Medication verified via barcode scan</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={dispensingData.quantityVerified}
                        onChange={(e) => setDispensingData(prev => ({ ...prev, quantityVerified: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Quantity counted and verified</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => setShowDispensingModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCompleteDispensing}
                  className="btn-primary"
                  disabled={!dispensingData.barcodeScanned || !dispensingData.quantityVerified}
                >
                  Complete Dispensing
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Counseling Modal */}
      {showCounselingModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Patient Counseling</h2>
                <button
                  onClick={() => setShowCounselingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Counseling Topics */}
                <div>
                  <Label>Counseling Topics Covered</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      "Medication purpose and benefits",
                      "Proper dosing schedule",
                      "Food and drug interactions",
                      "Side effects to monitor",
                      "When to contact doctor"
                    ].map((topic, index) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={counselingData.topics.includes(topic)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCounselingData(prev => ({ ...prev, topics: [...prev.topics, topic] }))
                            } else {
                              setCounselingData(prev => ({ ...prev, topics: prev.topics.filter(t => t !== topic) }))
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{topic}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Patient Questions */}
                <div>
                  <Label htmlFor="patientQuestions">Patient Questions</Label>
                  <textarea
                    id="patientQuestions"
                    value={counselingData.patientQuestions}
                    onChange={(e) => setCounselingData(prev => ({ ...prev, patientQuestions: e.target.value }))}
                    className="input-field mt-1"
                    rows={3}
                    placeholder="Record patient questions (one per line)"
                  />
                </div>

                {/* Pharmacist Responses */}
                <div>
                  <Label htmlFor="responses">Pharmacist Responses</Label>
                  <textarea
                    id="responses"
                    value={counselingData.responses}
                    onChange={(e) => setCounselingData(prev => ({ ...prev, responses: e.target.value }))}
                    className="input-field mt-1"
                    rows={3}
                    placeholder="Record responses and advice given (one per line)"
                  />
                </div>

                {/* Adherence Discussion */}
                <div>
                  <Label htmlFor="adherenceDiscussion">Adherence Discussion</Label>
                  <textarea
                    id="adherenceDiscussion"
                    value={counselingData.adherenceDiscussion}
                    onChange={(e) => setCounselingData(prev => ({ ...prev, adherenceDiscussion: e.target.value }))}
                    className="input-field mt-1"
                    rows={2}
                    placeholder="Document adherence counseling and patient's understanding"
                  />
                </div>

                {/* Follow-up */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={counselingData.followUpNeeded}
                        onChange={(e) => setCounselingData(prev => ({ ...prev, followUpNeeded: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Follow-up needed</span>
                    </label>
                  </div>
                  {counselingData.followUpNeeded && (
                    <div>
                      <Label htmlFor="followUpDate">Follow-up Date</Label>
                      <Input
                        id="followUpDate"
                        type="date"
                        value={counselingData.followUpDate}
                        onChange={(e) => setCounselingData(prev => ({ ...prev, followUpDate: e.target.value }))}
                      />
                    </div>
                  )}
                </div>

                {/* Patient Understanding */}
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={counselingData.patientUnderstood}
                      onChange={(e) => setCounselingData(prev => ({ ...prev, patientUnderstood: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Patient demonstrated understanding</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => setShowCounselingModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCompleteCounseling}
                  className="btn-primary"
                  disabled={!counselingData.patientUnderstood}
                >
                  Complete Counseling
                </Button>
              </div>
            </div>
          </div>
        </div>
)}

      {/* Reorder Point Modal */}
      {showReorderModal && selectedDrug && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Set Reorder Point</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReorderModal(false)}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Drug Name</Label>
                <Input value={selectedDrug.drugName} disabled />
              </div>
              
              <div>
                <Label>Current Stock</Label>
                <Input value={`${selectedDrug.currentStock} ${selectedDrug.unit}`} disabled />
              </div>
              
              <div>
                <Label>Current Reorder Point</Label>
                <Input value={`${selectedDrug.reorderPoint} ${selectedDrug.unit}`} disabled />
              </div>
              
              <div>
                <Label>New Reorder Point</Label>
                <Input
                  type="number"
                  placeholder="Enter new reorder point"
                  id="newReorderPoint"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowReorderModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const newPoint = document.getElementById('newReorderPoint').value
                  if (newPoint && !isNaN(newPoint)) {
                    handleSetReorderPoint(selectedDrug.Id, parseInt(newPoint))
                  }
                }}
                className="flex-1"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pharmacy