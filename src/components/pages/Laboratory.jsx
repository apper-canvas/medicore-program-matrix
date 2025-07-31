import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import laboratoryService from "@/services/api/laboratoryService";
import patientService from "@/services/api/patientService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import Card from "@/components/atoms/Card";

const Laboratory = () => {
const [activeTab, setActiveTab] = useState("collection")
  const [orders, setOrders] = useState([])
  const [specimens, setSpecimens] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
const [rejectionReason, setRejectionReason] = useState("")
  const [barcodeModal, setBarcodeModal] = useState({ isOpen: false, specimen: null })
  const [rejectionModal, setRejectionModal] = useState({ isOpen: false, specimenId: null })
  // Additional state for test management
  const [tests, setTests] = useState([])
const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTests, setSelectedTests] = useState([])
  const [selectedSpecimens, setSelectedSpecimens] = useState([])
  const [showBatchResults, setShowBatchResults] = useState(false)
  const [batchResults, setBatchResults] = useState({})
  const [processingBatch, setProcessingBatch] = useState(false)
  const [orderForm, setOrderForm] = useState({
    patientId: "",
    priority: "Routine",
    collectionTime: "",
    notes: ""
  })
  // Processing queue state
  const [processingQueue, setProcessingQueue] = useState([])
  const [queueStats, setQueueStats] = useState({})

const tabs = [
    { id: "collection", label: "Sample Collection", icon: "TestTube" },
    { id: "tracking", label: "Specimen Tracking", icon: "Truck" },
    { id: "processing", label: "Lab Processing", icon: "Activity" },
    { id: "results", label: "Results Management", icon: "FileCheck" }
  ]

  const statusFilters = ["All", "Pending", "Collected", "Received", "Processing", "Completed", "Rejected"]
  
  const rejectionReasons = [
    "Insufficient sample volume",
    "Hemolyzed specimen", 
    "Clotted specimen",
    "Incorrect container",
    "Unlabeled specimen",
    "Patient identification mismatch",
    "Specimen leaked/broken",
    "Expired collection container"
  ]

  const categories = ["All", "Blood", "Urine", "Imaging", "Specialized"]

  useEffect(() => {
    loadData()
  }, [])

const loadData = async () => {
    try {
      setLoading(true)
      const [ordersData, specimensData, patientsData] = await Promise.all([
        laboratoryService.getAllOrders(),
        laboratoryService.getAllSpecimens(),
        patientService.getAll()
      ])
      setOrders(ordersData)
      setSpecimens(specimensData)
      setPatients(patientsData)
      setError(null)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load laboratory data")
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateBarcode = async (orderId) => {
    try {
      const barcode = await laboratoryService.generateSpecimenBarcode(orderId)
      const specimen = specimens.find(s => s.orderId === orderId)
      setBarcodeModal({ isOpen: true, specimen: { ...specimen, barcode } })
      toast.success("Barcode generated successfully")
    } catch (err) {
      toast.error("Failed to generate barcode")
    }
  }

  const handleUpdateStatus = async (specimenId, newStatus) => {
    try {
      await laboratoryService.updateSpecimenStatus(specimenId, newStatus)
      await loadData()
      toast.success(`Specimen status updated to ${newStatus}`)
    } catch (err) {
      toast.error("Failed to update specimen status")
    }
  }

  const handleRejectSpecimen = async () => {
    try {
      await laboratoryService.rejectSpecimen(rejectionModal.specimenId, rejectionReason)
      await loadData()
      setRejectionModal({ isOpen: false, specimenId: null })
      setRejectionReason("")
      toast.success("Specimen rejected and reorder triggered")
    } catch (err) {
      toast.error("Failed to reject specimen")
    }
  }

  const handlePrintLabel = (specimen) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head><title>Specimen Label</title></head>
        <body style="font-family: Arial; padding: 20px;">
          <div style="border: 2px solid #000; padding: 15px; width: 300px;">
            <h3>SPECIMEN LABEL</h3>
            <p><strong>Barcode:</strong> ${specimen.barcode}</p>
            <p><strong>Patient:</strong> ${specimen.patientName}</p>
            <p><strong>Tests:</strong> ${specimen.tests}</p>
            <p><strong>Collection Date:</strong> ${specimen.collectionDate}</p>
            <div style="font-family: monospace; font-size: 24px; text-align: center; margin: 10px 0;">
              ||||| ${specimen.barcode} |||||
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || test.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleTestSelection = (test) => {
    const isSelected = selectedTests.some(t => t.Id === test.Id)
    if (isSelected) {
      setSelectedTests(selectedTests.filter(t => t.Id !== test.Id))
    } else {
      setSelectedTests([...selectedTests, test])
    }
  }

  const calculateOrderRequirements = () => {
    if (selectedTests.length === 0) return null
    return laboratoryService.calculateRequirements(selectedTests)
  }

  const handleCreateOrder = async () => {
    if (selectedTests.length === 0) {
      toast.error("Please select at least one test")
      return
    }
    if (!orderForm.patientId) {
      toast.error("Please select a patient")
      return
    }

    try {
      const orderData = {
        ...orderForm,
        patientId: parseInt(orderForm.patientId),
        testIds: selectedTests.map(test => test.Id)
      }
      
      const newOrder = await laboratoryService.createOrder(orderData)
      setOrders([...orders, newOrder])
      setSelectedTests([])
      setOrderForm({
        patientId: "",
        priority: "Routine",
        collectionTime: "",
        notes: ""
      })
      setActiveTab("orders")
      toast.success("Lab order created successfully")
    } catch (err) {
      toast.error("Failed to create lab order")
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return
    
    try {
      await laboratoryService.deleteOrder(orderId)
      setOrders(orders.filter(order => order.Id !== orderId))
      toast.success("Lab order deleted successfully")
    } catch (err) {
      toast.error("Failed to delete lab order")
    }
  }
const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "warning"
      case "Collected": return "collected"
      case "Received": return "info"
      case "Processing": return "processing"
      case "Completed": return "success"
      case "Rejected": return "rejected"
      default: return "default"
    }
  }

const getPriorityColor = (priority) => {
    switch (priority) {
      case "STAT": return "error"
      case "Urgent": return "warning"
      case "Routine": return "success"
      default: return "default"
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "STAT": return "Zap"
      case "Urgent": return "AlertTriangle"
      case "Routine": return "Clock"
      default: return "Clock"
    }
  }
const loadProcessingQueue = async () => {
    try {
      const queue = await laboratoryService.getProcessingQueue()
      const stats = laboratoryService.getQueueStatistics()
      setProcessingQueue(queue)
      setQueueStats(stats)
    } catch (error) {
      console.error('Error loading processing queue:', error)
      toast.error('Failed to load processing queue')
    }
  }

  const handleSpecimenSelection = (specimenId, checked) => {
    setSelectedSpecimens(prev => 
      checked 
        ? [...prev, specimenId]
        : prev.filter(id => id !== specimenId)
    )
  }

  const handleSelectAllSpecimens = (checked) => {
    setSelectedSpecimens(checked ? processingQueue.map(item => item.Id) : [])
  }

  const handleBatchProcess = async () => {
    if (selectedSpecimens.length === 0) {
      toast.warning('Please select specimens to process')
      return
    }

    setProcessingBatch(true)
    try {
      await laboratoryService.processBatch(selectedSpecimens)
      toast.success(`Started processing ${selectedSpecimens.length} specimens`)
      setSelectedSpecimens([])
      await loadProcessingQueue()
    } catch (error) {
      console.error('Error processing batch:', error)
      toast.error('Failed to process batch')
    } finally {
      setProcessingBatch(false)
    }
  }

  const handleBatchComplete = async () => {
    if (selectedSpecimens.length === 0) {
      toast.warning('Please select specimens to complete')
      return
    }

    try {
      const results = await laboratoryService.getBatchResults(selectedSpecimens)
      setBatchResults(results)
      setShowBatchResults(true)
    } catch (error) {
      console.error('Error loading batch results:', error)
      toast.error('Failed to load batch results')
    }
  }

  const handleBatchReject = async () => {
    if (selectedSpecimens.length === 0) {
      toast.warning('Please select specimens to reject')
      return
    }

    const reason = prompt('Enter rejection reason:')
    if (!reason) return

    try {
      await laboratoryService.rejectBatch(selectedSpecimens, reason)
      toast.success(`Rejected ${selectedSpecimens.length} specimens`)
      setSelectedSpecimens([])
      await loadProcessingQueue()
    } catch (error) {
      console.error('Error rejecting batch:', error)
      toast.error('Failed to reject batch')
    }
  }

  const handleSaveBatchResults = async () => {
    try {
      await laboratoryService.completeBatch(selectedSpecimens, batchResults)
      toast.success(`Completed processing for ${selectedSpecimens.length} specimens`)
      setShowBatchResults(false)
      setBatchResults({})
      setSelectedSpecimens([])
      await loadProcessingQueue()
    } catch (error) {
      console.error('Error saving batch results:', error)
      toast.error('Failed to save batch results')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === "" || 
      order.Id.toString().includes(searchQuery) ||
      patients.find(p => p.Id === order.patientId)?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patients.find(p => p.Id === order.patientId)?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === "All" || order.collectionStatus === selectedStatus
    return matchesSearch && matchesStatus
  })
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laboratory Management</h1>
          <p className="text-gray-600 mt-1">Manage lab orders, test catalog, and results</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

{/* Sample Collection Tab */}
      {activeTab === "collection" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Sample Collection Workflow</h2>
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Search orders or patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {statusFilters.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <Card>
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="TestTube" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pending collections found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tests Ordered
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Collection Requirements
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => {
                        const patient = patients.find(p => p.Id === order.patientId)
                        return (
                          <tr key={order.Id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order.Id}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div>
                                <div className="font-medium">
                                  {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown"}
                                </div>
                                <div className="text-gray-500">
                                  DOB: {patient?.dateOfBirth || "N/A"} | 
                                  ID: {patient?.patientId || "N/A"}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="max-w-xs">
                                {order.tests?.map(test => (
                                  <div key={test.Id} className="mb-1">
                                    <span className="font-medium">{test.name}</span>
                                    <span className="text-gray-500 ml-2">({test.code})</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="space-y-1">
                                {order.requirements?.specimenTypes?.map((type, idx) => (
                                  <div key={idx}>
                                    <Badge variant="info" className="text-xs mr-1">{type}</Badge>
                                  </div>
                                ))}
                                {order.requirements?.fastingRequired && (
                                  <div className="text-red-600 text-xs">
                                    <ApperIcon name="Clock" size={12} className="inline mr-1" />
                                    Fasting: {order.requirements.fastingHours}hrs
                                  </div>
                                )}
                                {order.requirements?.specialInstructions && (
                                  <div className="text-orange-600 text-xs">
                                    {order.requirements.specialInstructions}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={getPriorityColor(order.priority)}>
                                {order.priority}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={getStatusColor(order.collectionStatus)}>
                                {order.collectionStatus}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                {order.collectionStatus === "Pending" && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleGenerateBarcode(order.Id)}
                                      title="Generate Barcode"
                                    >
                                      <ApperIcon name="QrCode" size={16} />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="success"
                                      onClick={() => handleUpdateStatus(order.Id, "Collected")}
                                      title="Mark as Collected"
                                    >
                                      <ApperIcon name="Check" size={16} />
                                    </Button>
                                  </>
                                )}
                                {order.collectionStatus === "Collected" && (
                                  <Button 
                                    size="sm" 
                                    variant="info"
                                    onClick={() => handleUpdateStatus(order.Id, "Received")}
                                    title="Receive in Lab"
                                  >
                                    <ApperIcon name="Package" size={16} />
                                  </Button>
                                )}
                                {(order.collectionStatus === "Collected" || order.collectionStatus === "Received") && (
                                  <Button 
                                    size="sm" 
                                    variant="error"
                                    onClick={() => setRejectionModal({ isOpen: true, specimenId: order.Id })}
                                    title="Reject Specimen"
                                  >
                                    <ApperIcon name="X" size={16} />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Specimen Tracking Tab */}
      {activeTab === "tracking" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Specimen Tracking</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.collectionStatus === "Pending").length}
              </div>
              <div className="text-sm text-gray-600">Pending Collection</div>
            </Card>
            <Card className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.collectionStatus === "Collected").length}
              </div>
              <div className="text-sm text-gray-600">Collected</div>
            </Card>
            <Card className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {orders.filter(o => o.collectionStatus === "Processing").length}
              </div>
              <div className="text-sm text-gray-600">In Processing</div>
            </Card>
            <Card className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {orders.filter(o => o.collectionStatus === "Rejected").length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {orders.slice(0, 10).map(order => {
                const patient = patients.find(p => p.Id === order.patientId)
                return (
                  <div key={order.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">
                        Order #{order.Id} - {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.tests?.length || 0} tests ordered
                      </div>
                    </div>
                    <Badge variant={getStatusColor(order.collectionStatus)}>
                      {order.collectionStatus}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Lab Processing Tab */}
{activeTab === "processing" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Lab Processing Queue</h2>
            <Button onClick={loadProcessingQueue} variant="secondary">
              <ApperIcon name="RefreshCw" size={16} />
              Refresh Queue
            </Button>
          </div>

          {/* Queue Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ApperIcon name="Zap" size={20} className="text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{queueStats.stat || 0}</div>
                  <div className="text-sm text-gray-600">STAT Tests</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ApperIcon name="AlertTriangle" size={20} className="text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{queueStats.urgent || 0}</div>
                  <div className="text-sm text-gray-600">Urgent Tests</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ApperIcon name="Clock" size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{queueStats.routine || 0}</div>
                  <div className="text-sm text-gray-600">Routine Tests</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ApperIcon name="Timer" size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{queueStats.averageWaitTime || 0}h</div>
                  <div className="text-sm text-gray-600">Avg. Processing</div>
                </div>
              </div>
            </Card>
          </div>
          
<Card>
            <h3 className="text-lg font-semibold mb-4">Processing Queue - Organized by Urgency & Time</h3>
            
            {processingQueue.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="TestTube" size={48} className="mx-auto mb-4 opacity-50" />
                <p>No tests in processing queue</p>
              </div>
            ) : (
              <div className="space-y-3">
                {processingQueue.map((order, index) => {
                  const patient = patients.find(p => p.Id === order.patientId)
                  const isProcessing = order.collectionStatus === "Processing"
                  
                  return (
                    <div 
                      key={order.Id} 
                      className={`border rounded-lg p-4 transition-all duration-200 ${
                        order.priority === 'STAT' ? 'border-red-200 bg-red-50' :
                        order.priority === 'Urgent' ? 'border-yellow-200 bg-yellow-50' :
                        'border-green-200 bg-green-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={getPriorityColor(order.priority)}>
                                <ApperIcon name={getPriorityIcon(order.priority)} size={12} />
                                {order.priority}
                              </Badge>
                              <span className="text-sm text-gray-500">#{order.queuePosition || index + 1}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Est. {order.estimatedProcessingTime || 'N/A'}h processing
                            </div>
                          </div>
                          
                          <div className="font-medium mb-1">
                            Order #{order.Id} - {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown"}
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            Tests: {order.tests?.map(t => t.name).join(", ")}
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Ordered: {new Date(order.orderDate).toLocaleDateString()}</span>
                            {order.collectionTime && (
                              <span>Collected: {new Date(order.collectionTime).toLocaleTimeString()}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isProcessing ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="in-progress">
                                <ApperIcon name="Activity" size={12} />
                                Processing
                              </Badge>
                              <Button 
                                onClick={() => handleUpdateStatus(order.Id, "Completed")}
                                variant="success"
                                size="sm"
                              >
                                Complete
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              onClick={() => {
                                handleUpdateStatus(order.Id, "Processing")
                                loadProcessingQueue()
                              }}
                              variant="primary"
                              size="sm"
                              className={
                                order.priority === 'STAT' ? 'bg-red-600 hover:bg-red-700' :
                                order.priority === 'Urgent' ? 'bg-yellow-600 hover:bg-yellow-700' :
                                'bg-green-600 hover:bg-green-700'
                              }
                            >
                              <ApperIcon name="Play" size={12} />
                              Start Processing
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Results Management Tab */}
      {activeTab === "results" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Results Management</h2>
          </div>
          
          <Card>
            <h3 className="text-lg font-semibold mb-4">Completed Tests</h3>
            <div className="space-y-4">
              {orders.filter(o => o.collectionStatus === "Completed").map(order => {
                const patient = patients.find(p => p.Id === order.patientId)
                return (
                  <div key={order.Id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          Order #{order.Id} - {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown"}
                        </div>
                        <div className="text-sm text-gray-600">
                          Tests: {order.tests?.map(t => t.name).join(", ")}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getPriorityColor(order.priority)}>
                            {order.priority}
                          </Badge>
                          <Badge variant="success">Completed</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm">
                          <ApperIcon name="FileText" size={14} />
                          View Results
                        </Button>
                        <Button variant="primary" size="sm">
                          <ApperIcon name="Send" size={14} />
                          Send Report
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Barcode Modal */}
      {barcodeModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Specimen Barcode</h3>
              <Button 
                variant="ghost" 
                onClick={() => setBarcodeModal({ isOpen: false, specimen: null })}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
            
            {barcodeModal.specimen && (
              <div className="text-center space-y-4">
                <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                  <div className="font-mono text-xl font-bold">
                    {barcodeModal.specimen.barcode}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    ||||| {barcodeModal.specimen.barcode} |||||
                  </div>
                </div>
                
                <div className="text-left space-y-2">
                  <div><strong>Patient:</strong> {barcodeModal.specimen.patientName}</div>
                  <div><strong>Tests:</strong> {barcodeModal.specimen.tests}</div>
                  <div><strong>Collection Date:</strong> {new Date().toLocaleDateString()}</div>
                </div>
                
                <Button 
                  onClick={() => handlePrintLabel(barcodeModal.specimen)}
                  variant="primary"
                  className="w-full"
                >
                  <ApperIcon name="Printer" size={16} className="mr-2" />
                  Print Label
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reject Specimen</h3>
              <Button 
                variant="ghost" 
                onClick={() => setRejectionModal({ isOpen: false, specimenId: null })}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select reason...</option>
                  {rejectionReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="error"
                  onClick={handleRejectSpecimen}
                  disabled={!rejectionReason}
                  className="flex-1"
                >
                  Reject & Reorder
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setRejectionModal({ isOpen: false, specimenId: null })}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Laboratory