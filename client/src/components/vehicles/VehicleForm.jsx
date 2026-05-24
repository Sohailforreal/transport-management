import { useState } from 'react'
import { createVehicle, updateVehicle } from '../../api/vehicle.api'
import toast from 'react-hot-toast'

const VehicleForm = ({ vehicle, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    registrationNo: vehicle?.registrationNo || '',
    type: vehicle?.type || 'truck',
    capacityTons: vehicle?.capacityTons || '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!formData.registrationNo || !formData.capacityTons) {
      toast.error('Please fill all fields')
      return
    }
    setLoading(true)
    try {
      if (vehicle) {
        await updateVehicle(vehicle._id, formData)
        toast.success('Vehicle updated!')
      } else {
        await createVehicle(formData)
        toast.success('Vehicle added!')
      }
      onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-white font-bold text-lg mb-6">
        {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
      </h2>

      <div className="space-y-4">
        {/* Registration No */}
        <div>
          <label className="text-gray-400 text-sm mb-1 block">
            Registration Number
          </label>
          <input
            name="registrationNo"
            value={formData.registrationNo}
            onChange={handleChange}
            placeholder="MH04AB1234"
            disabled={!!vehicle}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                       border border-gray-700 focus:outline-none
                       focus:border-blue-500 text-sm uppercase
                       disabled:opacity-50"
          />
        </div>

        {/* Type */}
        <div>
          <label className="text-gray-400 text-sm mb-1 block">
            Vehicle Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                       border border-gray-700 focus:outline-none
                       focus:border-blue-500 text-sm"
          >
            <option value="truck">Truck</option>
            <option value="mini">Mini</option>
            <option value="tempo">Tempo</option>
          </select>
        </div>

        {/* Capacity */}
        <div>
          <label className="text-gray-400 text-sm mb-1 block">
            Capacity (Tons)
          </label>
          <input
            name="capacityTons"
            type="number"
            value={formData.capacityTons}
            onChange={handleChange}
            placeholder="10"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                       border border-gray-700 focus:outline-none
                       focus:border-blue-500 text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800
                       text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Saving...' : vehicle ? 'Update' : 'Add Vehicle'}
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
  )
}

export default VehicleForm