import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bedService from "@/services/api/bedService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const BedManagementWidget = () => {
  const [bedStats, setBedStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    critical: 0,
    occupancyRate: 0
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadBedStats()
  }, [])

const loadBedStats = async () => {
    try {
      const [beds, admissionQueue] = await Promise.all([
        bedService.getAll(),
        bedService.getAdmissionQueue()
      ])
      
      const stats = {
        total: beds.length,
        available: beds.filter(b => b.status === "available").length,
        occupied: beds.filter(b => b.status.startsWith("occupied")).length,
        critical: beds.filter(b => b.status === "occupied_critical").length,
        maintenance: beds.filter(b => b.status === "maintenance").length,
        queueLength: admissionQueue.length,
        highPriorityQueue: admissionQueue.filter(p => {
          const priority = calculatePriority(p)
          return priority >= 15
        }).length
      }
      stats.occupancyRate = Math.round((stats.occupied / stats.total) * 100) || 0
      setBedStats(stats)
    } catch (error) {
      console.error("Failed to load bed stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculatePriority = (patient) => {
    let score = 0
    if (patient.condition === 'critical') score += 10
    else if (patient.condition === 'urgent') score += 7
    else if (patient.condition === 'moderate') score += 4
    else score += 1
    
    const waitHours = Math.floor((Date.now() - new Date(patient.requestTime).getTime()) / (1000 * 60 * 60))
    score += Math.min(waitHours, 10)
    
    const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
    if (age >= 70) score += 3
    else if (age >= 60) score += 2
    
    return Math.min(score, 20)
  }

  const statusConfig = [
    { 
      status: "available", 
      count: bedStats.available, 
      color: "bg-green-500", 
      label: "Available",
      textColor: "text-green-700"
    },
    { 
      status: "occupied", 
      count: bedStats.occupied - bedStats.critical, 
      color: "bg-yellow-500", 
      label: "Occupied",
      textColor: "text-yellow-700"
    },
    { 
      status: "critical", 
      count: bedStats.critical, 
      color: "bg-red-500", 
      label: "Critical",
      textColor: "text-red-700"
    },
    { 
      status: "maintenance", 
      count: bedStats.maintenance, 
      color: "bg-blue-500", 
      label: "Maintenance",
      textColor: "text-blue-700"
    }
  ]

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Bed Occupancy</h3>
        <Button
          onClick={() => navigate("/bed-management")}
          variant="secondary"
          size="sm"
        >
          View All
        </Button>
      </div>

      {/* Occupancy Rate */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Overall Occupancy</span>
          <span className="text-2xl font-bold text-primary-600">{bedStats.occupancyRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${bedStats.occupancyRate}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Bed Status Summary */}
      <div className="space-y-3 mb-6">
        {statusConfig.map((item) => (
          <div key={item.status} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${item.color}`}></div>
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
            <span className={`text-sm font-medium ${item.textColor}`}>
              {item.count}
            </span>
          </div>
        ))}
      </div>

      {/* Total Beds */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ApperIcon name="Hospital" className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">Total Beds</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{bedStats.total}</span>
<span className="text-lg font-bold text-gray-900">{bedStats.total}</span>
        </div>
      </div>
      <div className="space-y-2">
        {bedStats.critical > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <ApperIcon name="AlertTriangle" className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm text-red-700">
                {bedStats.critical} bed{bedStats.critical > 1 ? 's' : ''} with critical patients
              </span>
            </div>
          </div>
        )}
        
        {bedStats.highPriorityQueue > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <ApperIcon name="Clock" className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm text-yellow-700">
                {bedStats.highPriorityQueue} high-priority patient{bedStats.highPriorityQueue > 1 ? 's' : ''} in queue
              </span>
            </div>
          </div>
        )}

        {bedStats.queueLength > 0 && bedStats.available === 0 && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center">
              <ApperIcon name="AlertCircle" className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-sm text-orange-700">
                No available beds - {bedStats.queueLength} patient{bedStats.queueLength > 1 ? 's' : ''} waiting
              </span>
            </div>
          </div>
)}
      </div>
    </Card>
  )
}

export default BedManagementWidget