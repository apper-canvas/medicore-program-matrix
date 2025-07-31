import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"

const Pharmacy = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pharmacy Management</h1>
          <p className="text-gray-600 mt-1">Manage medications, prescriptions, and inventory</p>
        </div>
      </div>
      
      <Card className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Pill" className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Pharmacy Module</h3>
          <p className="text-gray-600 mb-6">
            Coming soon! This module will include prescription management, medication inventory, 
            drug interaction checking, and dispensing workflows.
          </p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="font-medium text-indigo-900 mb-2">Planned Features:</h4>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>• Electronic prescription processing</li>
              <li>• Medication inventory management</li>
              <li>• Drug interaction checking</li>
              <li>• Automated dispensing systems</li>
              <li>• Prescription history tracking</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Pharmacy