import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Patients from '@/components/pages/Patients'
import PatientProfile from '@/components/pages/PatientProfile'
import Appointments from '@/components/pages/Appointments'
import DoctorSchedules from '@/components/pages/DoctorSchedules'
import Clinical from '@/components/pages/Clinical'
import OutcomeTracking from '@/components/pages/OutcomeTracking'
import Laboratory from '@/components/pages/Laboratory'
import Pharmacy from '@/components/pages/Pharmacy'
import Radiology from '@/components/pages/Radiology'
import Billing from '@/components/pages/Billing'
import Reports from '@/components/pages/Reports'
import Administration from "@/components/pages/Administration"
import BedManagement from "@/components/pages/BedManagement"
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
<Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="patients/:patientId" element={<PatientProfile />} />
            <Route path="appointments" element={<Appointments />} />
<Route path="appointments" element={<Appointments />} />
        <Route path="doctor-schedules" element={<DoctorSchedules />} />
        <Route path="clinical" element={<Clinical />} />
        <Route path="outcome-tracking" element={<OutcomeTracking />} />
        <Route path="laboratory" element={<Laboratory />} />
        <Route path="pharmacy" element={<Pharmacy />} />
        <Route path="radiology" element={<Radiology />} />
        <Route path="bed-management" element={<BedManagement />} />
        <Route path="billing" element={<Billing />} />
            <Route path="administration" element={<Administration />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App