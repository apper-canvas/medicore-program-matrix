import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import Header from "@/components/organisms/Header"
import Sidebar from "@/components/organisms/Sidebar"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={handleMenuToggle} />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout