import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"

const Billing = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Revenue</h1>
          <p className="text-gray-600 mt-1">Manage billing, payments, and financial operations</p>
        </div>
      </div>
      
      <Card className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="CreditCard" className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Billing Module</h3>
          <p className="text-gray-600 mb-6">
            Coming soon! This module will include patient billing, insurance claims processing, 
            payment tracking, and financial reporting.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">Planned Features:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Patient billing and invoicing</li>
              <li>• Insurance claims management</li>
              <li>• Payment processing and tracking</li>
              <li>• Financial reporting and analytics</li>
              <li>• Revenue cycle management</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Billing