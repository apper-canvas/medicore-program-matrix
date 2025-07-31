import React from "react"
import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const NavItem = ({ to, icon, children, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative",
          isActive
            ? "bg-primary-500 text-white shadow-card"
            : "text-gray-600 hover:bg-white hover:text-primary-600 hover:shadow-card"
        )
      }
    >
      {({ isActive }) => (
        <>
          <ApperIcon 
            name={icon} 
            className={cn(
              "h-5 w-5 mr-3 transition-colors duration-200",
              isActive ? "text-white" : "text-gray-400 group-hover:text-primary-500"
            )} 
          />
          <span className="flex-1">{children}</span>
          {badge && (
            <span className={cn(
              "ml-3 px-2 py-1 text-xs font-medium rounded-full",
              isActive 
                ? "bg-white text-primary-600" 
                : "bg-primary-100 text-primary-600"
            )}>
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

export default NavItem