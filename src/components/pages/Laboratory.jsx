import React, { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Badge from "@/components/atoms/Badge"
import FormField from "@/components/molecules/FormField"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import laboratoryService from "@/services/api/laboratoryService"
import patientService from "@/services/api/patientService"
import { toast } from "react-toastify"

const Laboratory = () => {
  const [activeTab, setActiveTab] = useState("orders")
  const [tests, setTests] = useState([])
  const [orders, setOrders] = useState([])
  const [patients, setPatients] = useState([])
  const [selectedTests, setSelectedTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [orderForm, setOrderForm] = useState({
    patientId: "",
    priority: "Routine",
    collectionTime: "",
    notes: ""
  })

  const tabs = [
    { id: "orders", label: "Lab Orders", icon: "ClipboardList" },
    { id: "catalog", label: "Test Catalog", icon: "Search" },
    { id: "results", label: "Results", icon: "FileCheck" }
  ]

  const categories = ["All", "Blood", "Urine", "Imaging", "Specialized"]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [testsData, ordersData, patientsData] = await Promise.all([
        laboratoryService.getAllTests(),
        laboratoryService.getAllOrders(),
        patientService.getAll()
      ])
      setTests(testsData)
      setOrders(ordersData)
      setPatients(patientsData)
      setError(null)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load laboratory data")
    } finally {
      setLoading(false)
    }
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "STAT": return "error"
      case "Urgent": return "warning"
      case "Routine": return "success"
      default: return "default"
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "Blood": return "error"
      case "Urine": return "warning"
      case "Imaging": return "info"
      case "Specialized": return "primary"
      default: return "default"
    }
  }

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

      {/* Lab Orders Tab */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Lab Orders</h2>
            <Button onClick={() => setActiveTab("catalog")}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              New Order
            </Button>
          </div>

          <Card>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="TestTube" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No lab orders found</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setActiveTab("catalog")}
                  >
                    Create First Order
                  </Button>
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
                          Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tests
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Collection Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => {
                        const patient = patients.find(p => p.Id === order.patientId)
                        return (
                          <tr key={order.Id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order.Id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="max-w-xs">
                                {order.tests?.slice(0, 2).map(test => test.name).join(", ")}
                                {order.tests?.length > 2 && ` +${order.tests.length - 2} more`}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={getPriorityColor(order.priority)}>
                                {order.priority}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={order.status === "Completed" ? "success" : "warning"}>
                                {order.collectionStatus}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.collectionTime || "Not scheduled"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleDeleteOrder(order.Id)}
                                >
                                  <ApperIcon name="Trash2" size={16} />
                                </Button>
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

      {/* Test Catalog Tab */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Test Catalog</h2>
            {selectedTests.length > 0 && (
              <Badge variant="primary" className="text-sm">
                {selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''} selected
              </Badge>
            )}
          </div>

          {/* Search and Filters */}
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Test Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.map((test) => {
              const isSelected = selectedTests.some(t => t.Id === test.Id)
              return (
                <Card 
                  key={test.Id}
                  className={`cursor-pointer transition-all ${
                    isSelected ? "ring-2 ring-primary-500 bg-primary-50" : "hover:shadow-card-hover"
                  }`}
                  onClick={() => handleTestSelection(test)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">{test.name}</h3>
                        <Badge variant={getCategoryColor(test.category)} className="text-xs">
                          {test.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Code: {test.code}</div>
                        <div>Specimen: {test.specimenType}</div>
                        {test.fastingRequired && (
                          <div className="text-orange-600">Fasting: {test.fastingHours}h</div>
                        )}
                        <div>TAT: {test.turnaroundTime}</div>
                        <div className="font-medium text-gray-900">${test.price}</div>
                      </div>
                    </div>
                    <div className="ml-2">
                      {isSelected ? (
                        <ApperIcon name="CheckCircle" className="h-5 w-5 text-primary-500" />
                      ) : (
                        <ApperIcon name="Circle" className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Order Summary */}
          {selectedTests.length > 0 && (
            <Card className="bg-gray-50">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Order Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Tests ({selectedTests.length})</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {selectedTests.map(test => (
                        <div key={test.Id} className="flex justify-between">
                          <span>{test.name}</span>
                          <span>${test.price}</span>
                        </div>
                      ))}
                      <div className="border-t pt-1 font-medium text-gray-900">
                        <div className="flex justify-between">
                          <span>Total</span>
                          <span>${selectedTests.reduce((sum, test) => sum + test.price, 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Collection Requirements</h4>
                    {(() => {
                      const requirements = calculateOrderRequirements()
                      return (
                        <div className="space-y-2 text-sm text-gray-600">
                          {requirements?.specimenTypes.map((specimen, index) => (
                            <div key={index}>• {specimen}</div>
                          ))}
                          {requirements?.fastingRequired && (
                            <div className="text-orange-600 font-medium">
                              ⚠ Fasting required: {requirements.fastingHours} hours
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label="Patient"
                    type="select"
                    value={orderForm.patientId}
                    onChange={(e) => setOrderForm({...orderForm, patientId: e.target.value})}
                    options={[
                      { value: "", label: "Select patient..." },
                      ...patients.map(patient => ({
                        value: patient.Id,
                        label: `${patient.firstName} ${patient.lastName}`
                      }))
                    ]}
                  />
                  
                  <FormField
                    label="Priority"
                    type="select"
                    value={orderForm.priority}
                    onChange={(e) => setOrderForm({...orderForm, priority: e.target.value})}
                    options={laboratoryService.getPriorityLevels().map(priority => ({
                      value: priority,
                      label: priority
                    }))}
                  />
                  
                  <FormField
                    label="Collection Time"
                    type="select"
                    value={orderForm.collectionTime}
                    onChange={(e) => setOrderForm({...orderForm, collectionTime: e.target.value})}
                    options={[
                      { value: "", label: "Select time..." },
                      ...laboratoryService.getCollectionTimeSlots().map(slot => ({
                        value: slot,
                        label: slot
                      }))
                    ]}
                  />
                </div>

                <FormField
                  label="Notes"
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
                  placeholder="Additional instructions..."
                />

                <div className="flex space-x-4">
                  <Button onClick={handleCreateOrder}>
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Create Order
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => setSelectedTests([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Results Tab */}
      {activeTab === "results" && (
        <Card className="text-center py-16">
          <div className="max-w-md mx-auto">
            <ApperIcon name="FileCheck" className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Results Module</h3>
            <p className="text-gray-600 mb-6">
              Results entry and reporting functionality will be available here.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
export default Laboratory