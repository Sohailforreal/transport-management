import { useState, useEffect } from 'react'
import { createOrder } from '../../api/order.api'
import { getRoutes } from '../../api/route.api'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

const OrderForm = ({ onSuccess, onCancel }) => {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    pickupAddress: '',
    deliveryAddress: '',
    routeId: '',
    goods: { description: '', weightTons: '' },
    scheduledDate: ''
  })

  useEffect(() => {
    getRoutes().then(res => setRoutes(res.data.routes))
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleGoodsChange = (e) => {
    setFormData({
      ...formData,
      goods: { ...formData.goods, [e.target.name]: e.target.value }
    })
  }

  const handleRouteSelect = (e) => {
    const route = routes.find(r => r._id === e.target.value)
    setFormData({
      ...formData,
      routeId: e.target.value,
      pickupAddress: route?.source || formData.pickupAddress,
      deliveryAddress: route?.destination || formData.deliveryAddress
    })
  }

  const handleSubmit = async () => {
    if (!formData.clientName || !formData.clientPhone ||
        !formData.pickupAddress || !formData.deliveryAddress) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      await createOrder(formData)
      toast.success('Order created!')
      onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-lg">Create Delivery Order</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Client Info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Client Name *</label>
            <input
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Raj Industries"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Client Phone *</label>
            <input
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              placeholder="9999999999"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Route */}
        <div>
          <label className="text-gray-400 text-sm mb-1 block">
            Select Route (optional)
          </label>
          <select
            value={formData.routeId}
            onChange={handleRouteSelect}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                       border border-gray-700 focus:outline-none
                       focus:border-blue-500 text-sm"
          >
            <option value="">Select a route</option>
            {routes.map(r => (
              <option key={r._id} value={r._id}>
                {r.name} — {r.distanceKm}km
              </option>
            ))}
          </select>
        </div>

        {/* Addresses */}
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Pickup Address *</label>
          <input
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
            placeholder="Factory, Boisar MIDC"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                       border border-gray-700 focus:outline-none
                       focus:border-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Delivery Address *</label>
          <input
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleChange}
            placeholder="Client Warehouse, Surat"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                       border border-gray-700 focus:outline-none
                       focus:border-blue-500 text-sm"
          />
        </div>

        {/* Goods */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Goods Description
            </label>
            <input
              name="description"
              value={formData.goods.description}
              onChange={handleGoodsChange}
              placeholder="Steel rods"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Weight (Tons)
            </label>
            <input
              name="weightTons"
              type="number"
              value={formData.goods.weightTons}
              onChange={handleGoodsChange}
              placeholder="5"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Scheduled Date */}
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Scheduled Date</label>
          <input
            name="scheduledDate"
            type="date"
            value={formData.scheduledDate}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                       border border-gray-700 focus:outline-none
                       focus:border-blue-500 text-sm"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800
                     text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? 'Creating...' : 'Create Order'}
        </button>
      </div>
    </div>
  )
}

export default OrderForm