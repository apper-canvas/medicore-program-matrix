import React from "react"
import { cn } from "@/utils/cn"

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    primary: "bg-primary-100 text-primary-800",
    "in-progress": "bg-orange-100 text-orange-800",
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-600",
    critical: "bg-red-100 text-red-800",
    discharged: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-700",
    radiology: "bg-purple-100 text-purple-800",
    lab: "bg-cyan-100 text-cyan-800",
    prescription: "bg-orange-100 text-orange-800",
    image: "bg-pink-100 text-pink-800",
    medical: "bg-indigo-100 text-indigo-800"
  }
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge