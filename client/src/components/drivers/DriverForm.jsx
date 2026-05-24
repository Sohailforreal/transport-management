import { useState, useEffect } from 'react'
import { createDriver, updateDriver } from '../../api/driver.api'
import { getVehicles } from '../../api/vehicle.api'
import toast from 'react-hot-toast'

const CredentialsCard = ({ credentials, driverName, onClose }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = `Transport MS — Driver Login\nName: ${driverName}\nLogin ID (Phone): ${credentials.loginId}\nPassword: ${credentials.password}\n\nPlease change your password after first login.`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 
                          rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-white font-bold text-lg">Driver Added!</h2>
          <p className="text-gray-400 text-sm mt-1">
            Share these credentials with {driverName}
          </p>
        </div>

        {/* Credentials */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4 space-y-3">
          <div className="flex items-center justify-between">
  <span className="text-gray-400 text-sm">Email</span>
  <span className="text-white font-mono font-semibold">
    {credentials.loginId}
  </span>
</div>
          <div className="h-px bg-gray-700" />
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Password</span>
            <span className="text-white font-mono font-semibold">
              {credentials.password}
            </span>
          </div>
        </div>

        {/* Note */}
        <p className="text-yellow-400 text-xs text-center mb-4">
          ⚠️ Driver must change password after first login
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white
                       font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            {copied ? '✓ Copied!' : 'Copy Credentials'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white
                       font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

const DriverForm = ({ driver, onSuccess, onCancel }) => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState(null)
  const [newDriverName, setNewDriverName] = useState('')
  const [formData, setFormData] = useState({
    name: driver?.userId?.name || '',
    email: driver?.userId?.email || '',
    phone: driver?.userId?.phone || '',
    licenseNo: driver?.licenseNo || '',
    licenseExpiry: driver?.licenseExpiry?.split('T')[0] || '',
    assignedVehicleId: driver?.assignedVehicleId?._id || ''
  })

  useEffect(() => {
    getVehicles().then(res => setVehicles(res.data.vehicles))
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.licenseNo || !formData.licenseExpiry) {
      toast.error('Please fill all required fields')
      return
    }
    if (!driver && (!formData.email || !formData.phone)) {
      toast.error('Email and phone are required')
      return
    }
    setLoading(true)
    try {
      if (driver) {
        await updateDriver(driver._id, formData)
        toast.success('Driver updated!')
        onSuccess()
      } else {
        const res = await createDriver(formData)
        setNewDriverName(formData.name)
        setCredentials(res.data.credentials)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Credentials Modal */}
      {credentials && (
        <CredentialsCard
          credentials={credentials}
          driverName={newDriverName}
          onClose={() => {
            setCredentials(null)
            onSuccess()
          }}
        />
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-bold text-lg mb-6">
          {driver ? 'Edit Driver' : 'Add New Driver'}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Full Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                           border border-gray-700 focus:outline-none
                           focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Phone *</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9999999999"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                           border border-gray-700 focus:outline-none
                           focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {!driver && (
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email *</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="driver@example.com"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                           border border-gray-700 focus:outline-none
                           focus:border-blue-500 text-sm"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">License No *</label>
              <input
                name="licenseNo"
                value={formData.licenseNo}
                onChange={handleChange}
                placeholder="MH0120210012345"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                           border border-gray-700 focus:outline-none
                           focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">License Expiry *</label>
              <input
                name="licenseExpiry"
                type="date"
                value={formData.licenseExpiry}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                           border border-gray-700 focus:outline-none
                           focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Assign Vehicle</label>
            <select
              name="assignedVehicleId"
              value={formData.assignedVehicleId}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 text-sm"
            >
              <option value="">No vehicle assigned</option>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>
                  {v.registrationNo} — {v.type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800
                         text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : driver ? 'Update Driver' : 'Add Driver'}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-800 hover:bg-gray-700
                         text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DriverForm