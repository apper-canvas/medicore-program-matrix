import React from "react"
import ApperIcon from "@/components/ApperIcon"
import NavItem from "@/components/molecules/NavItem"
import { cn } from "@/utils/cn"

const Sidebar = ({ isOpen, onClose }) => {
const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Patients", href: "/patients", icon: "Users" },
    { name: "Appointments", href: "/appointments", icon: "Calendar", badge: "12" },
    { name: "Doctor Schedules", href: "/doctor-schedules", icon: "CalendarDays" },
    { name: "Clinical", href: "/clinical", icon: "Stethoscope" },
    { name: "Laboratory", href: "/laboratory", icon: "TestTube", badge: "5" },
    { name: "Pharmacy", href: "/pharmacy", icon: "Pill" },
    { name: "Radiology", href: "/radiology", icon: "ScanLine" },
    { name: "Bed Management", href: "/bed-management", icon: "Hospital" },
    { name: "Billing", href: "/billing", icon: "CreditCard" },
    { name: "Reports", href: "/reports", icon: "FileText" },
    { name: "Administration", href: "/administration", icon: "Settings" },
  ]
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-gradient-to-b from-gray-800 to-gray-900 shadow-elevated">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Heart" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">MediCore</h2>
              <p className="text-sm text-gray-300">ERP System</p>
            </div>
          </div>
        </div>
        
        <nav className="px-4 pb-6 space-y-2">
          {navigation.map((item) => (
            <NavItem
              key={item.name}
              to={item.href}
              icon={item.icon}
              badge={item.badge}
            >
              {item.name}
            </NavItem>
          ))}
        </nav>
      </aside>
      
      {/* Mobile Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 w-64 h-full bg-gradient-to-b from-gray-800 to-gray-900 shadow-elevated transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Heart" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">MediCore</h2>
                <p className="text-sm text-gray-300">ERP System</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ApperIcon name="X" className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <nav className="px-4 pb-6 space-y-2">
          {navigation.map((item) => (
            <NavItem
              key={item.name}
              to={item.href}
              icon={item.icon}
              badge={item.badge}
            >
              {item.name}
            </NavItem>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar