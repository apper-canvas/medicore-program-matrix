import React from "react"
import { cn } from "@/utils/cn"

const Loading = ({ className, rows = 5 }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded-md w-48 animate-shimmer"></div>
        <div className="h-10 bg-gray-200 rounded-md w-32 animate-shimmer"></div>
      </div>
      
      {/* Search bar skeleton */}
      <div className="h-10 bg-gray-200 rounded-md w-full animate-shimmer"></div>
      
      {/* Table skeleton */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        {/* Table header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-shimmer"></div>
            ))}
          </div>
        </div>
        
        {/* Table rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-200 last:border-b-0">
            <div className="grid grid-cols-7 gap-4 items-center">
              {Array.from({ length: 7 }).map((_, j) => (
                <div key={j} className="h-4 bg-gray-200 rounded animate-shimmer"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading