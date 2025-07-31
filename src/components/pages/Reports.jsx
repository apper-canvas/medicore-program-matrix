import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate reports and analyze hospital performance</p>
        </div>
      </div>
      
      <Card className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="FileText" className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Reports Module</h3>
          <p className="text-gray-600 mb-6">
            Coming soon! This module will include comprehensive reporting tools, 
            analytics dashboards, and performance metrics for all hospital operations.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">Planned Features:</h4>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Operational performance reports</li>
              <li>• Financial analytics and trends</li>
              <li>• Clinical quality metrics</li>
              <li>• Custom report builder</li>
              <li>• Automated report scheduling</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Reports