import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"

const Clinical = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clinical Management</h1>
          <p className="text-gray-600 mt-1">Manage clinical workflows and patient care</p>
        </div>
      </div>
      
      <Card className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Stethoscope" className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Clinical Module</h3>
          <p className="text-gray-600 mb-6">
            Coming soon! This module will include clinical documentation, treatment plans, 
            medical records management, and care coordination tools.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Planned Features:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Electronic medical records (EMR)</li>
              <li>• Clinical notes and documentation</li>
              <li>• Treatment plan management</li>
              <li>• Care team coordination</li>
              <li>• Clinical decision support</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Clinical