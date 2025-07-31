import React, { useState, useEffect } from "react"
import MetricCard from "@/components/molecules/MetricCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import BedManagementWidget from "@/components/molecules/BedManagementWidget"
import dashboardService from "@/services/api/dashboardService"
const Dashboard = () => {
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await dashboardService.getDashboardMetrics()
      setMetrics(data)
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded-md w-64 animate-shimmer"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-shimmer"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2 animate-shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-shimmer"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hospital Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time overview of hospital operations</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.Id}
            title={metric.label}
            value={metric.value}
            unit={metric.unit}
            trend={metric.trend}
            icon={metric.icon}
            color={metric.color}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Patient Admitted</p>
                <p className="text-xs text-gray-500">John Doe admitted to Emergency - 2 min ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">📋</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Lab Results Ready</p>
                <p className="text-xs text-gray-500">Blood work completed for Patient #0003 - 5 min ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">⚠</span>
              </div>
              <div className="flex-1">
<p className="text-sm font-medium text-gray-900">Inventory Alert</p>
                <p className="text-xs text-gray-500">Lisinopril 10mg below reorder point (12/50 units) - 8 min ago</p>
              </div>
            </div>
          </div>
        </div>
{/* Bed Management Widget */}
        <BedManagementWidget />
      </div>
    </div>
  )
}

export default Dashboard