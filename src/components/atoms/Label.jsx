import React from "react"
import { cn } from "@/utils/cn"

const Label = ({ className, children, required, ...props }) => {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-gray-700 mb-2",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

export default Label