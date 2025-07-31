import React from "react";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  required, 
  className,
  children,
  type,
  options = [],
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
{children || (
        type === "select" ? (
          <select
            className={cn(
              "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200",
              error && "border-red-500 focus:ring-red-500"
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            className={cn(
              "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none",
              error && "border-red-500 focus:ring-red-500"
            )}
            {...props}
          />
        ) : (
          <Input error={error} {...props} />
        )
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default FormField