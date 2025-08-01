import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  error,
  list,
  autoComplete,
  ...props 
}, ref) => {
  return (
<input
      type={type}
      ref={ref}
      list={list}
      autoComplete={autoComplete}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200",
        error && "border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input