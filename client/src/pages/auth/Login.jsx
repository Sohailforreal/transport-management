import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../api/auth.api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginUser(formData)
      login(res.data.token, res.data.user)
      toast.success('Login successful!')
      const role = res.data.user.role
      if (role === 'admin') navigate('/admin/dashboard')
      else if (role === 'manager') navigate('/manager/dashboard')
      else if (role === 'driver') navigate('/driver/dashboard')
      else navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-800">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">🚛</div>
          <h1 className="text-white text-2xl font-bold">Transport MS</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@test.com"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 
                         border border-gray-700 focus:outline-none 
                         focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 
                         border border-gray-700 focus:outline-none 
                         focus:border-blue-500 text-sm"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800
                       text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default Login