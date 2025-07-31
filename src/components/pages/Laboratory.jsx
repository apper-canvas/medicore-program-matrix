import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"

const Laboratory = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laboratory Management</h1>
          <p className="text-gray-600 mt-1">Manage lab orders, results, and testing workflows</p>
        </div>
      </div>
      
      <Card className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="TestTube" className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Laboratory Module</h3>
          <p className="text-gray-600 mb-6">
            Coming soon! This module will include lab order management, result tracking, 
            specimen processing, and quality control systems.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">Planned Features:</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Lab order creation and tracking</li>
              <li>• Result entry and validation</li>
              <li>• Specimen management system</li>
              <li>• Quality control monitoring</li>
              <li>• Integration with lab equipment</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Laboratory