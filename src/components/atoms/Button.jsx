import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
const variants = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white shadow-card hover:shadow-card-hover",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300",
    accent: "bg-accent-500 hover:bg-accent-600 text-white shadow-card hover:shadow-card-hover",
    success: "bg-green-500 hover:bg-green-600 text-white shadow-card hover:shadow-card-hover",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-card hover:shadow-card-hover",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white shadow-card hover:shadow-card-hover",
    ghost: "hover:bg-gray-100 text-gray-700"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }
  
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transform hover:-translate-y-0.5 active:scale-98",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed hover:transform-none",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button