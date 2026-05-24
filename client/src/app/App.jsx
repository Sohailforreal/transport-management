import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../context/AuthContext'
import ProtectedRoute from '../components/common/ProtectedRoute'
import Login from '../pages/auth/Login'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['admin']}>
              <div className="text-white p-8">Admin Dashboard — Coming Soon</div>
            </ProtectedRoute>
          } />

          {/* Manager Routes */}
          <Route path="/manager/dashboard" element={
            <ProtectedRoute roles={['manager']}>
              <div className="text-white p-8">Manager Dashboard — Coming Soon</div>
            </ProtectedRoute>
          } />

          {/* Driver Routes */}
          <Route path="/driver/dashboard" element={
            <ProtectedRoute roles={['driver']}>
              <div className="text-white p-8">Driver Dashboard — Coming Soon</div>
            </ProtectedRoute>
          } />

          {/* Unauthorized */}
          <Route path="/unauthorized" element={
            <div className="text-white p-8">Unauthorized Access</div>
          } />

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App