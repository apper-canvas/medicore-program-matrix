import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import { cn } from "@/utils/cn"

const MetricCard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  icon, 
  className,
  color = "primary"
}) => {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-50",
    success: "text-green-600 bg-green-50",
    warning: "text-yellow-600 bg-yellow-50",
    error: "text-red-600 bg-red-50",
    info: "text-blue-600 bg-blue-50"
  }
  
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    stable: "text-gray-600"
  }
  
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                className={cn("h-4 w-4 mr-1", trendColors[trend])}
              />
              <span className={cn("text-sm font-medium", trendColors[trend])}>
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} vs last week
              </span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", colorClasses[color])}>
          <ApperIcon name={icon} className="h-6 w-6" />
        </div>
      </div>
    </Card>
  )
}

export default MetricCard