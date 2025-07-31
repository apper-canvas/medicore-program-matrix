import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"

const Appointments = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage patient appointments and scheduling</p>
        </div>
      </div>
      
      <Card className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Calendar" className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Appointments Module</h3>
          <p className="text-gray-600 mb-6">
            Coming soon! This module will include appointment scheduling, calendar management, 
            patient booking system, and appointment reminders.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Planned Features:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Daily, weekly, and monthly calendar views</li>
              <li>• Online appointment booking system</li>
              <li>• Automated appointment reminders</li>
              <li>• Doctor availability management</li>
              <li>• Patient appointment history</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Appointments