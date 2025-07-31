import React, { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { format } from "date-fns"

const Header = ({ onMenuToggle }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  const currentUser = {
    name: "Dr. Sarah Johnson",
    role: "Doctor",
    department: "Emergency Medicine"
  }
  
  const hospitalName = "MediCore General Hospital"
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-card">
      <div className="flex items-center justify-between">
        {/* Left Section - Mobile Menu + Hospital Name */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{hospitalName}</h1>
            <p className="text-sm text-gray-500">{format(currentTime, "EEEE, MMMM dd, yyyy")}</p>
          </div>
        </div>
        
        {/* Center Section - Current Time */}
        <div className="hidden md:flex items-center text-center">
          <div className="px-4 py-2 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Current Time</p>
            <p className="text-lg font-bold text-gray-900">
              {format(currentTime, "HH:mm:ss")}
            </p>
          </div>
        </div>
        
        {/* Right Section - User Info + Notifications */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <ApperIcon name="Bell" className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-xs text-gray-500">{currentUser.role} • {currentUser.department}</p>
            </div>
            <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {currentUser.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header