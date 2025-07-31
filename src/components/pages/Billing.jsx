import React, { useEffect, useState } from "react";
import billingService from "@/services/api/billingService";
import insuranceService from "@/services/api/insuranceService";
import tpaService from "@/services/api/tpaService";
import cptService from "@/services/api/cptService";
import { toast } from "react-toastify";
import icd10Service from "@/services/api/icd10Service";
import ApperIcon from "@/components/ApperIcon";
import Radiology from "@/components/pages/Radiology";
import Pharmacy from "@/components/pages/Pharmacy";
import Laboratory from "@/components/pages/Laboratory";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Billing = () => {
const [activeTab, setActiveTab] = useState('dashboard')
  const [charges, setCharges] = useState([])
  const [insurancePlans, setInsurancePlans] = useState([])
  const [tpaConfigs, setTpaConfigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCharge, setSelectedCharge] = useState(null)
  const [showChargeModal, setShowChargeModal] = useState(false)
  const [showInsuranceModal, setShowInsuranceModal] = useState(false)
  const [showDenialModal, setShowDenialModal] = useState(false)
  const [showAppealModal, setShowAppealModal] = useState(false)
  const [correctionNotes, setCorrectionNotes] = useState('')
  const [appealNotes, setAppealNotes] = useState('')
  const [denialAnalytics, setDenialAnalytics] = useState(null)
  const [chargeForm, setChargeForm] = useState({
    patientId: '',
    department: '',
    serviceCode: '',
    description: '',
    amount: '',
    icd10Code: '',
    cptCode: '',
    insuranceId: '',
    tpaId: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [chargesData, insuranceData, tpaData] = await Promise.all([
        billingService.getAll(),
        insuranceService.getAll(),
        tpaService.getAll()
      ])
      setCharges(chargesData)
      setInsurancePlans(insuranceData)
      setTpaConfigs(tpaData)
    } catch (error) {
      toast.error('Failed to load billing data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCharge = async () => {
    try {
      if (!chargeForm.patientId || !chargeForm.department || !chargeForm.amount) {
        toast.error('Please fill in required fields')
        return
      }
      
      const newCharge = await billingService.create(chargeForm)
      setCharges(prev => [newCharge, ...prev])
      setShowChargeModal(false)
      setChargeForm({
        patientId: '',
        department: '',
        serviceCode: '',
        description: '',
        amount: '',
        icd10Code: '',
        cptCode: '',
        insuranceId: '',
        tpaId: ''
      })
      toast.success('Charge created successfully')
    } catch (error) {
      toast.error('Failed to create charge')
    }
  }

  const handleVerifyInsurance = async (chargeId) => {
    try {
      const result = await insuranceService.verifyEligibility(chargeId)
      if (result.eligible) {
        toast.success('Insurance verified successfully')
        loadData()
      } else {
        toast.warning('Insurance verification failed: ' + result.reason)
      }
    } catch (error) {
      toast.error('Failed to verify insurance')
    }
  }

const handleProcessTPA = async (chargeId) => {
    try {
      const result = await tpaService.processCharge(chargeId)
      if (result.success) {
        toast.success('TPA processing completed')
        loadData()
      } else {
        toast.warning('TPA processing failed: ' + result.reason)
      }
    } catch (error) {
      toast.error('Failed to process TPA')
    }
  }

const handleSubmitClaim = async (chargeId) => {
    try {
      const result = await billingService.submitClaim(chargeId)
      if (result.success) {
        toast.success(`Claim ${result.claimId} submitted successfully`)
        loadData()
        
        // Show real-time status updates
        toast.info('Monitoring claim status in real-time...')
      } else {
        toast.warning('Claim submission failed: ' + result.message)
      }
    } catch (error) {
      toast.error('Failed to submit claim: ' + error.message)
    }
  }

  const handleResubmitClaim = async (chargeId) => {
    try {
      const result = await billingService.resubmitClaim(chargeId, correctionNotes)
      if (result.success) {
        toast.success(`Claim resubmitted as ${result.claimId}`)
        loadData()
        setShowDenialModal(false)
        setCorrectionNotes('')
      } else {
        toast.warning('Claim resubmission failed: ' + result.message)
      }
    } catch (error) {
      toast.error('Failed to resubmit claim: ' + error.message)
    }
  }

  const handleSubmitAppeal = async (chargeId, appealLevel = 1) => {
    try {
      const result = await billingService.submitAppeal(chargeId, appealNotes, appealLevel)
      if (result.success) {
        toast.success('Appeal submitted successfully')
        loadData()
        setShowAppealModal(false)
        setAppealNotes('')
      } else {
        toast.warning('Appeal submission failed: ' + result.message)
      }
    } catch (error) {
      toast.error('Failed to submit appeal: ' + error.message)
    }
  }

  const loadDenialAnalytics = async () => {
    try {
      const analytics = billingService.getDenialAnalytics()
      setDenialAnalytics(analytics)
    } catch (error) {
      console.error('Failed to load denial analytics:', error)
    }
  }

  const filteredCharges = charges.filter(charge =>
    charge.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charge.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charge.serviceCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charge.claimId?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const calculateMetrics = () => {
    const totalRevenue = charges.reduce((sum, charge) => sum + (charge.amount || 0), 0)
    const pendingCharges = charges.filter(c => c.status === 'pending').length
    const verifiedCharges = charges.filter(c => c.insuranceVerified).length
    const tpaProcessed = charges.filter(c => c.tpaProcessed).length
    
    return { totalRevenue, pendingCharges, verifiedCharges, tpaProcessed }
  }

  const metrics = calculateMetrics()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automated Billing Engine</h1>
          <p className="text-gray-600 mt-1">Real-time charge capture, insurance verification, and multi-payer billing</p>
        </div>
        <Button onClick={() => setShowChargeModal(true)} className="bg-primary-500 hover:bg-primary-600 text-white">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Charge
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <ApperIcon name="DollarSign" className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Charges</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.pendingCharges}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <ApperIcon name="Clock" className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Insurance Verified</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.verifiedCharges}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <ApperIcon name="Shield" className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">TPA Processed</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.tpaProcessed}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <ApperIcon name="Building" className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
<div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', name: 'Charge Capture', icon: 'CreditCard' },
            { id: 'claims', name: 'Claims Tracking', icon: 'FileCheck' },
            { id: 'insurance', name: 'Insurance Verification', icon: 'Shield' },
            { id: 'tpa', name: 'TPA Management', icon: 'Building' },
            { id: 'codes', name: 'Medical Codes', icon: 'FileText' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                if (tab.id === 'claims') loadDenialAnalytics()
              }}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} className="mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search charges by patient, department, or service code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
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
                  {filteredCharges.map((charge) => (
                    <tr key={charge.Id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{charge.patientName}</div>
                        <div className="text-sm text-gray-500">ID: {charge.patientId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {charge.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{charge.serviceCode}</div>
                        <div className="text-sm text-gray-500">{charge.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${charge.amount?.toLocaleString()}
                      </td>
<td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`px-2 py-1 text-xs rounded-full w-fit ${
                            charge.status === 'paid' 
                              ? 'bg-green-100 text-green-800'
                              : charge.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : charge.status === 'denied'
                              ? 'bg-red-100 text-red-800'
                              : charge.status === 'rejected'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {charge.status}
                          </span>
                          {charge.claimSubmitted && (
                            <span className={`px-2 py-1 text-xs rounded-full w-fit ${
                              charge.claimStatus === 'paid' 
                                ? 'bg-green-100 text-green-800'
                                : charge.claimStatus === 'accepted'
                                ? 'bg-blue-100 text-blue-800'
                                : charge.claimStatus === 'denied'
                                ? 'bg-red-100 text-red-800'
                                : charge.claimStatus === 'rejected'
                                ? 'bg-orange-100 text-orange-800'
                                : charge.claimStatus === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : charge.claimStatus === 'validated'
                                ? 'bg-purple-100 text-purple-800'
                                : charge.claimStatus === 'submitted'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              Claim: {charge.claimStatus}
                            </span>
                          )}
                          {charge.appealStatus && (
                            <span className={`px-2 py-1 text-xs rounded-full w-fit ${
                              charge.appealStatus === 'approved' 
                                ? 'bg-green-100 text-green-800'
                                : charge.appealStatus === 'denied'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              Appeal: {charge.appealStatus}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2">
<div className="flex flex-col space-y-1">
                          {!charge.insuranceVerified && (
                            <Button
                              onClick={() => handleVerifyInsurance(charge.Id)}
                              className="text-blue-600 hover:text-blue-900 text-xs"
                              variant="ghost"
                            >
                              Verify Insurance
                            </Button>
                          )}
                          {charge.insuranceVerified && !charge.tpaProcessed && charge.tpaId && (
                            <Button
                              onClick={() => handleProcessTPA(charge.Id)}
                              className="text-purple-600 hover:text-purple-900 text-xs"
                              variant="ghost"
                            >
                              Process TPA
                            </Button>
                          )}
                          {charge.insuranceVerified && !charge.claimSubmitted && charge.icd10Code && charge.cptCode && (
                            <Button
                              onClick={() => handleSubmitClaim(charge.Id)}
                              className="text-green-600 hover:text-green-900 text-xs"
                              variant="ghost"
                            >
                              <ApperIcon name="Send" size={12} className="mr-1" />
                              Submit Claim
                            </Button>
                          )}
                          {charge.status === 'denied' && charge.canResubmit && charge.resubmissionCount < charge.maxResubmissions && (
                            <Button
                              onClick={() => {
                                setSelectedCharge(charge)
                                setShowDenialModal(true)
                              }}
                              className="text-orange-600 hover:text-orange-900 text-xs"
                              variant="ghost"
                            >
                              <ApperIcon name="RefreshCw" size={12} className="mr-1" />
                              Resubmit
                            </Button>
                          )}
                          {charge.status === 'denied' && !charge.appealStatus && (
                            <Button
                              onClick={() => {
                                setSelectedCharge(charge)
                                setShowAppealModal(true)
                              }}
                              className="text-red-600 hover:text-red-900 text-xs"
                              variant="ghost"
                            >
                              <ApperIcon name="Scale" size={12} className="mr-1" />
                              Submit Appeal
                            </Button>
                          )}
                          {charge.claimSubmitted && charge.claimId && (
                            <div className="text-xs text-gray-500">
                              Claim: {charge.claimId}
                              {charge.resubmissionCount > 0 && (
                                <span className="ml-2 text-orange-600">
                                  (Resubmitted {charge.resubmissionCount}x)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
)}

      {activeTab === 'claims' && (
        <div className="space-y-6">
          {denialAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center">
                  <ApperIcon name="AlertTriangle" size={20} className="text-red-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total Denials</p>
                    <p className="text-2xl font-bold text-red-600">{denialAnalytics.totalDenials}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center">
                  <ApperIcon name="RefreshCw" size={20} className="text-orange-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Resubmission Rate</p>
                    <p className="text-2xl font-bold text-orange-600">{denialAnalytics.resubmissionRate}%</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center">
                  <ApperIcon name="Scale" size={20} className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Appeal Rate</p>
                    <p className="text-2xl font-bold text-blue-600">{denialAnalytics.appealRate}%</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center">
                  <ApperIcon name="FileCheck" size={20} className="text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Claims Submitted</p>
                    <p className="text-2xl font-bold text-green-600">{charges.filter(c => c.claimSubmitted).length}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Denials by Category</h3>
                {denialAnalytics?.denialsByCategory && Object.keys(denialAnalytics.denialsByCategory).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(denialAnalytics.denialsByCategory).map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{category}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No denial data available</p>
                )}
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims Status Distribution</h3>
                <div className="space-y-3">
                  {['submitted', 'processing', 'validated', 'accepted', 'paid', 'denied', 'rejected'].map(status => {
                    const count = charges.filter(c => c.claimStatus === status).length
                    return count > 0 ? (
                      <div key={status} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${
                            status === 'paid' ? 'bg-green-500' :
                            status === 'denied' ? 'bg-red-500' :
                            status === 'rejected' ? 'bg-orange-500' :
                            status === 'processing' ? 'bg-yellow-500' :
                            status === 'validated' ? 'bg-purple-500' :
                            status === 'accepted' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}></span>
                          <span className="text-sm text-gray-600 capitalize">{status}</span>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Claim Activities</h3>
              <div className="space-y-4">
                {charges
                  .filter(c => c.claimSubmitted)
                  .sort((a, b) => new Date(b.claimStatusUpdatedAt || b.updatedAt) - new Date(a.claimStatusUpdatedAt || a.updatedAt))
                  .slice(0, 10)
                  .map(charge => (
                    <div key={charge.Id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          charge.claimStatus === 'paid' ? 'bg-green-500' :
                          charge.claimStatus === 'denied' ? 'bg-red-500' :
                          charge.claimStatus === 'rejected' ? 'bg-orange-500' :
                          charge.claimStatus === 'processing' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{charge.patientName}</p>
                          <p className="text-sm text-gray-600">{charge.description}</p>
                          <p className="text-xs text-gray-500">Claim: {charge.claimId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium capitalize">{charge.claimStatus}</p>
                        <p className="text-xs text-gray-500">
                          {charge.claimStatusUpdatedAt ? 
                            new Date(charge.claimStatusUpdatedAt).toLocaleDateString() :
                            new Date(charge.updatedAt).toLocaleDateString()
                          }
                        </p>
                        {charge.claimStatusMessage && (
                          <p className="text-xs text-gray-400 mt-1">{charge.claimStatusMessage}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'insurance' && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Plans & Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insurancePlans.map((plan) => (
                <div key={plan.Id} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">{plan.name}</h4>
                  <p className="text-sm text-gray-600">{plan.type}</p>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-gray-500">
                      Coverage: {plan.coveragePercentage}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Deductible: ${plan.deductible}
                    </div>
                    <div className="text-xs text-gray-500">
                      Status: <span className={`${plan.active ? 'text-green-600' : 'text-red-600'}`}>
                        {plan.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'tpa' && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">TPA Configurations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tpaConfigs.map((tpa) => (
                <div key={tpa.Id} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">{tpa.name}</h4>
                  <p className="text-sm text-gray-600">{tpa.type}</p>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-gray-500">
                      Fee Schedule: {tpa.feeSchedule}
                    </div>
                    <div className="text-xs text-gray-500">
                      Processing Time: {tpa.processingTime}
                    </div>
                    <div className="text-xs text-gray-500">
                      Auto-Process: <span className={`${tpa.autoProcess ? 'text-green-600' : 'text-yellow-600'}`}>
                        {tpa.autoProcess ? 'Enabled' : 'Manual'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'codes' && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Coding Assistant</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">ICD-10 Diagnosis Codes</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Search ICD-10 codes..."
                    onChange={(e) => {
                      const results = icd10Service.search(e.target.value)
                      // Display results logic would go here
                    }}
                  />
                  <div className="text-sm text-gray-600">
                    {icd10Service.getAll().length} codes available
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">CPT Procedure Codes</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Search CPT codes..."
                    onChange={(e) => {
                      const results = cptService.search(e.target.value)
                      // Display results logic would go here
                    }}
                  />
                  <div className="text-sm text-gray-600">
                    {cptService.getAll().length} codes available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Charge Creation Modal */}
      {showChargeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Charge</h3>
              <Button
                onClick={() => setShowChargeModal(false)}
                variant="ghost"
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Patient ID *</label>
                <Input
                  value={chargeForm.patientId}
                  onChange={(e) => setChargeForm({...chargeForm, patientId: e.target.value})}
                  placeholder="Enter patient ID"
                />
              </div>
              <div>
                <label className="form-label">Department *</label>
                <select
                  value={chargeForm.department}
                  onChange={(e) => setChargeForm({...chargeForm, department: e.target.value})}
                  className="input-field"
                >
                  <option value="">Select department</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Cardiology">Cardiology</option>
                </select>
              </div>
              <div>
                <label className="form-label">Service Code</label>
                <Input
                  value={chargeForm.serviceCode}
                  onChange={(e) => setChargeForm({...chargeForm, serviceCode: e.target.value})}
                  placeholder="Service/procedure code"
                />
              </div>
              <div>
                <label className="form-label">Amount *</label>
                <Input
                  type="number"
                  value={chargeForm.amount}
                  onChange={(e) => setChargeForm({...chargeForm, amount: e.target.value})}
                  placeholder="Charge amount"
                />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Description</label>
                <Input
                  value={chargeForm.description}
                  onChange={(e) => setChargeForm({...chargeForm, description: e.target.value})}
                  placeholder="Service description"
                />
              </div>
              <div>
                <label className="form-label">ICD-10 Code</label>
                <Input
                  value={chargeForm.icd10Code}
                  onChange={(e) => setChargeForm({...chargeForm, icd10Code: e.target.value})}
                  placeholder="Diagnosis code"
                />
              </div>
              <div>
                <label className="form-label">CPT Code</label>
                <Input
                  value={chargeForm.cptCode}
                  onChange={(e) => setChargeForm({...chargeForm, cptCode: e.target.value})}
                  placeholder="Procedure code"
                />
              </div>
              <div>
                <label className="form-label">Insurance Plan</label>
                <select
                  value={chargeForm.insuranceId}
                  onChange={(e) => setChargeForm({...chargeForm, insuranceId: e.target.value})}
                  className="input-field"
                >
                  <option value="">Select insurance</option>
                  {insurancePlans.map(plan => (
                    <option key={plan.Id} value={plan.Id}>{plan.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">TPA</label>
                <select
                  value={chargeForm.tpaId}
                  onChange={(e) => setChargeForm({...chargeForm, tpaId: e.target.value})}
                  className="input-field"
                >
                  <option value="">Select TPA</option>
{tpaConfigs.map(tpa => (
                    <option key={tpa.Id} value={tpa.Id}>{tpa.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                onClick={() => setShowChargeModal(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCharge}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                Create Charge
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Denial Management Modal */}
      {showDenialModal && selectedCharge && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Claim Resubmission</h3>
                <button
                  onClick={() => setShowDenialModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ApperIcon name="AlertTriangle" size={16} className="text-red-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Denial Reason</p>
                      <p className="text-sm text-red-600">{selectedCharge.denialReasonText}</p>
                      <p className="text-xs text-red-500 mt-1">Code: {selectedCharge.denialReason}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-800 mb-2">Recommended Action</p>
                  <p className="text-sm text-blue-600">{selectedCharge.recommendedAction}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correction Notes
                  </label>
                  <textarea
                    value={correctionNotes}
                    onChange={(e) => setCorrectionNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="4"
                    placeholder="Describe the corrections made to address the denial reason..."
                  />
                </div>

                <div className="text-xs text-gray-500">
                  Resubmission Count: {selectedCharge.resubmissionCount} / {selectedCharge.maxResubmissions}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => setShowDenialModal(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleResubmitClaim(selectedCharge.Id)}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={!correctionNotes.trim()}
                >
                  <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                  Resubmit Claim
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appeal Modal */}
      {showAppealModal && selectedCharge && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Submit Appeal</h3>
                <button
                  onClick={() => setShowAppealModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ApperIcon name="AlertTriangle" size={16} className="text-red-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Original Denial</p>
                      <p className="text-sm text-red-600">{selectedCharge.denialReasonText}</p>
                      <p className="text-xs text-red-500 mt-1">Code: {selectedCharge.denialReason}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appeal Justification
                  </label>
                  <textarea
                    value={appealNotes}
                    onChange={(e) => setAppealNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="4"
                    placeholder="Provide detailed justification for why this claim should be approved..."
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <ApperIcon name="Info" size={16} className="inline mr-1" />
                    Appeals typically take 30-60 days to process. Success rate varies by denial reason.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => setShowAppealModal(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSubmitAppeal(selectedCharge.Id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                  disabled={!appealNotes.trim()}
                >
                  <ApperIcon name="Scale" size={16} className="mr-2" />
                  Submit Appeal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Billing