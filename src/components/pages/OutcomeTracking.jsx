import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import MetricCard from '@/components/molecules/MetricCard'
import outcomeTrackingService from '@/services/api/outcomeTrackingService'
import medicalHistoryService from '@/services/api/medicalHistoryService'
import patientService from '@/services/api/patientService'
import { format } from 'date-fns'

function OutcomeTracking() {
  const [outcomes, setOutcomes] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [protocolData, setProtocolData] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOutcome, setSelectedOutcome] = useState(null)
  const [showOutcomeModal, setShowOutcomeModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [outcomesData, analyticsData, protocolsData, patientsData] = await Promise.all([
        outcomeTrackingService.getAll(),
        outcomeTrackingService.getOutcomeAnalytics(),
        outcomeTrackingService.getProtocolEffectiveness(),
        patientService.getAll()
      ])
      
      setOutcomes(outcomesData)
      setAnalytics(analyticsData)
      setProtocolData(protocolsData)
      setPatients(patientsData)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load outcome tracking data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOutcome = async (outcomeData) => {
    try {
      await outcomeTrackingService.create(outcomeData)
      toast.success('Outcome record created successfully')
      loadData()
      setShowOutcomeModal(false)
    } catch (err) {
      toast.error('Failed to create outcome record')
    }
  }

  const handleUpdateOutcome = async (id, outcomeData) => {
    try {
      await outcomeTrackingService.update(id, outcomeData)
      toast.success('Outcome record updated successfully')
      loadData()
      setSelectedOutcome(null)
      setShowOutcomeModal(false)
    } catch (err) {
      toast.error('Failed to update outcome record')
    }
  }

  const handleDeleteOutcome = async (id) => {
    if (!window.confirm('Are you sure you want to delete this outcome record?')) {
      return
    }
    
    try {
      await outcomeTrackingService.delete(id)
      toast.success('Outcome record deleted successfully')
      loadData()
    } catch (err) {
      toast.error('Failed to delete outcome record')
    }
  }

  const filteredOutcomes = outcomes.filter(outcome => {
    const matchesSearch = outcome.diagnosisName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outcome.treatmentProtocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getPatientName(outcome.patientId).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || outcome.outcomeStatus === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === patientId)
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Improved': return 'success'
      case 'Stable': return 'warning'
      case 'Worsened': return 'error'
      default: return 'default'
    }
  }

  const getAdherenceColor = (adherence) => {
    if (adherence >= 80) return 'text-green-600'
    if (adherence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Outcome Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor treatment effectiveness and patient outcomes</p>
        </div>
        <Button
          onClick={() => {
            setSelectedOutcome(null)
            setShowOutcomeModal(true)
          }}
          className="btn-primary"
        >
          <ApperIcon name="Plus" size={16} />
          Add Outcome Record
        </Button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Outcomes Tracked"
            value={analytics.totalOutcomes}
            icon="Activity"
            color="primary"
          />
          <MetricCard
            title="Improved Outcomes"
            value={`${analytics.outcomes.improvedPercentage}%`}
            icon="TrendingUp"
            color="success"
            trend={{ value: analytics.outcomes.improved, label: `${analytics.outcomes.improved} patients` }}
          />
          <MetricCard
            title="Treatment Adherence"
            value={`${analytics.averageAdherence}%`}
            icon="Target"
            color="info"
          />
          <MetricCard
            title="Upcoming Reviews"
            value={analytics.upcomingReviews}
            icon="Calendar"
            color="warning"
          />
        </div>
      )}

      {/* Protocol Effectiveness */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <ApperIcon name="BarChart3" size={20} className="inline mr-2" />
          Treatment Protocol Effectiveness
        </h3>
        <div className="space-y-6">
          {protocolData.map((diagnosis, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h4 className="font-medium text-gray-900 mb-3">{diagnosis.diagnosisName}</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {diagnosis.protocols.map((protocol, protocolIndex) => (
                  <div key={protocolIndex} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-sm text-gray-900">{protocol.name}</h5>
                      <Badge variant={protocol.successRate >= 80 ? 'success' : protocol.successRate >= 70 ? 'warning' : 'error'}>
                        {protocol.successRate}% Success
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="text-green-600 font-medium">{protocol.improvedOutcomes}</span> Improved
                      </div>
                      <div>
                        <span className="text-yellow-600 font-medium">{protocol.stableOutcomes}</span> Stable
                      </div>
                      <div>
                        <span className="text-red-600 font-medium">{protocol.worsenedOutcomes}</span> Worsened
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      Avg. Adherence: <span className="font-medium">{protocol.averageAdherence}%</span> |
                      QoL Score: <span className="font-medium">{protocol.averageQualityOfLife}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by diagnosis, treatment, or patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="Improved">Improved</option>
              <option value="Stable">Stable</option>
              <option value="Worsened">Worsened</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Outcomes Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <ApperIcon name="FileText" size={20} className="inline mr-2" />
          Patient Outcomes ({filteredOutcomes.length})
        </h3>
        
        {filteredOutcomes.length === 0 ? (
          <Empty 
            message="No outcome records found"
            description="Start tracking patient outcomes by adding a new record"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-900">Patient</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-900">Diagnosis</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-900">Treatment Protocol</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-900">Adherence</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-900">QoL Score</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-900">Next Review</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOutcomes.map((outcome) => (
                  <tr key={outcome.Id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="font-medium text-gray-900">
                        {getPatientName(outcome.patientId)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Dr. {outcome.attendingPhysician.replace('Dr. ', '')}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-medium text-gray-900">{outcome.diagnosisCode}</div>
                      <div className="text-sm text-gray-600">{outcome.diagnosisName}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {outcome.treatmentProtocol}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={getStatusVariant(outcome.outcomeStatus)}>
                        {outcome.outcomeStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`font-medium ${getAdherenceColor(outcome.treatmentAdherence)}`}>
                        {outcome.treatmentAdherence}%
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center">
                        <span className="font-medium">{outcome.qualityOfLife}</span>
                        <span className="text-gray-500 text-sm">/10</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">
                      {format(new Date(outcome.nextReviewDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedOutcome(outcome)
                            setShowOutcomeModal(true)
                          }}
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteOutcome(outcome.Id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Outcome Modal would go here - simplified for this implementation */}
      {showOutcomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {selectedOutcome ? 'Edit Outcome Record' : 'Add Outcome Record'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOutcomeModal(false)}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
            <div className="text-center py-8 text-gray-500">
              <ApperIcon name="Construction" size={48} className="mx-auto mb-4 text-gray-400" />
              <p>Outcome record form would be implemented here</p>
              <p className="text-sm">This would include fields for patient selection, diagnosis, treatment protocol, metrics, and outcomes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OutcomeTracking