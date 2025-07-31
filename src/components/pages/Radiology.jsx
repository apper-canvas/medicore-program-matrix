import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"

const Radiology = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Radiology Management</h1>
          <p className="text-gray-600 mt-1">Manage imaging orders, studies, and reports</p>
        </div>
      </div>
      
      <Card className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="ScanLine" className="h-8 w-8 text-teal-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Radiology Module</h3>
          <p className="text-gray-600 mb-6">
            Coming soon! This module will include imaging order management, study scheduling, 
            DICOM integration, and radiology reporting systems.
          </p>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h4 className="font-medium text-teal-900 mb-2">Planned Features:</h4>
            <ul className="text-sm text-teal-800 space-y-1">
              <li>• Imaging order management</li>
              <li>• Study scheduling and tracking</li>
              <li>• DICOM image viewer integration</li>
              <li>• Radiology reporting workflow</li>
              <li>• Equipment maintenance tracking</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Radiology