import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"

const Administration = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600 mt-1">System administration and configuration settings</p>
        </div>
      </div>
      
      <Card className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Settings" className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Administration Module</h3>
          <p className="text-gray-600 mb-6">
            Coming soon! This module will include system configuration, user management, 
            security settings, and administrative tools.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Planned Features:</h4>
            <ul className="text-sm text-gray-800 space-y-1">
              <li>• User roles and permissions</li>
              <li>• System configuration settings</li>
              <li>• Audit logs and security monitoring</li>
              <li>• Data backup and recovery</li>
              <li>• Integration management</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Administration