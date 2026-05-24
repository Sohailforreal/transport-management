import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../context/AuthContext'
import ProtectedRoute from '../components/common/ProtectedRoute'
import Sidebar from '../components/common/Sidebar'
import Navbar from '../components/common/Navbar'
import Login from '../pages/auth/Login'
import Vehicles from '../pages/admin/Vehicles'
import Drivers from '../pages/admin/Drivers'
import { useAuth } from '../context/AuthContext'
import RoutesPage from '../pages/admin/Routes'


// Layout wrapper
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 lg:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-0">
          {children}
        </main>
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute roles={['admin']}>
          <Layout>
            <div className="p-4 text-white">Admin Dashboard — Coming Soon</div>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/vehicles" element={
        <ProtectedRoute roles={['admin']}>
          <Layout>
            <Vehicles />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/drivers" element={
  <ProtectedRoute roles={['admin']}>
    <Layout>
      <Drivers />
    </Layout>
  </ProtectedRoute>
} />

      {/* Manager */}
      <Route path="/manager/dashboard" element={
        <ProtectedRoute roles={['manager']}>
          <Layout>
            <div className="p-4 text-white">Manager Dashboard — Coming Soon</div>
          </Layout>
        </ProtectedRoute>
      } />

      {/* Driver */}
      <Route path="/driver/dashboard" element={
        <ProtectedRoute roles={['driver']}>
          <Layout>
            <div className="p-4 text-white">Driver Dashboard — Coming Soon</div>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/routes" element={
  <ProtectedRoute roles={['admin']}>
    <Layout>
      <RoutesPage />
    </Layout>
  </ProtectedRoute>
} />

      {/* Unauthorized */}
      <Route path="/unauthorized" element={
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <p className="text-white text-xl">Unauthorized Access</p>
        </div>
      } />

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App