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
import Orders from '../pages/admin/Orders'
import { SocketProvider } from '../context/SocketContext'
import ActiveTrip from '../pages/driver/ActiveTrip'
import AdminDashboard from '../pages/admin/AdminDashboard'
import DriverDashboard from '../pages/driver/DriverDashboard'
import MyTrips from '../pages/driver/MyTrips'



// Layout wrapper
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="overflow-x-hidden">
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
      <AdminDashboard />
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
             <DriverDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/dashboard" element={
  <ProtectedRoute roles={['admin']}>
    <Layout>
      <AdminDashboard />
    </Layout>
  </ProtectedRoute>
} />

<Route path="/driver/dashboard" element={
  <ProtectedRoute roles={['driver']}>
    <Layout>
      <DriverDashboard />
    </Layout>
  </ProtectedRoute>
} />

<Route path="/driver/trips" element={
  <ProtectedRoute roles={['driver']}>
    <Layout>
      <MyTrips />
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

<Route path="/admin/orders" element={
  <ProtectedRoute roles={['admin']}>
    <Layout>
      <Orders />
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
      <SocketProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <AppRoutes />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  )
}


export default App