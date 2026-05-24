import { useState } from 'react'
import { failOrder } from '../../api/order.api'
import toast from 'react-hot-toast'

const reasons = [
  { value: 'customer_unavailable', label: 'Customer Not Available' },
  { value: 'wrong_address', label: 'Wrong Address' },
  { value: 'goods_damaged', label: 'Goods Damaged' },
  { value: 'vehicle_breakdown', label: 'Vehicle Breakdown' },
  { value: 'other', label: 'Other' },
]

const FailureModal = ({ order, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    reason: 'customer_unavailable',
    description: '',
    internalNote: '',
    reAttempt: false
  })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await failOrder(order._id, formData)
      toast.success('Order marked as failed')
      onSuccess()
      onClose()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 
                    flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 
                      rounded-2xl p-6 w-full max-w-sm">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">Mark as Failed</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >✕</button>
        </div>

        <div className="space-y-4">
          {/* Reason */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Failure Reason
            </label>
            <select
              value={formData.reason}
              onChange={e => setFormData({...formData, reason: e.target.value})}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-red-500 text-sm"
            >
              {reasons.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Description
            </label>
            <input
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Additional details..."
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-red-500 text-sm"
            />
          </div>

          {/* Internal note */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Internal Note (not visible to client)
            </label>
            <input
              value={formData.internalNote}
              onChange={e => setFormData({...formData, internalNote: e.target.value})}
              placeholder="Internal note..."
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-red-500 text-sm"
            />
          </div>

          {/* Re-attempt */}
          <div className="flex items-center gap-3 bg-gray-800 
                          rounded-xl px-4 py-3">
            <input
              type="checkbox"
              id="reattempt"
              checked={formData.reAttempt}
              onChange={e => setFormData({...formData, reAttempt: e.target.checked})}
              className="w-4 h-4 accent-blue-500"
            />
            <label htmlFor="reattempt" className="text-white text-sm">
              Schedule re-attempt delivery
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800
                         text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Saving...' : 'Confirm Failed'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700
                         text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FailureModal