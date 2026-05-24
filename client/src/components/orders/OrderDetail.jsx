import { useState, useEffect } from 'react'
import { updateStatus, cancelOrder, assignOrder } from '../../api/order.api'
import { getDrivers } from '../../api/driver.api'
import { getVehicles } from '../../api/vehicle.api'
import StatusBadge from '../common/StatusBadge'
import OrderTimeline from './OrderTimeline'
import FailureModal from './FailureModal'
import { format } from 'date-fns'
import { X, Truck, User, MapPin, Package, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const OrderDetail = ({ order, timeline, onUpdate, onClose }) => {
  const { user } = useAuth()
  const [tab, setTab] = useState('info')
  const [showFailModal, setShowFailModal] = useState(false)
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [assigning, setAssigning] = useState(false)
  const [assignData, setAssignData] = useState({
    vehicleId: order.vehicleId?._id || '',
    driverId: order.driverId?._id || ''
  })

  useEffect(() => {
    if (user?.role !== 'driver') {
      getDrivers().then(res => setDrivers(res.data.drivers))
      getVehicles().then(res => setVehicles(res.data.vehicles))
    }
  }, [])

  const handleStatusUpdate = async (status) => {
    try {
      await updateStatus(order._id, { status })
      toast.success(`Status updated to ${status}`)
      onUpdate()
    } catch {
      toast.error('Something went wrong')
    }
  }

  const handleCancel = async () => {
    if (confirm('Cancel this order?')) {
      try {
        await cancelOrder(order._id)
        toast.success('Order cancelled')
        onUpdate()
        onClose()
      } catch {
        toast.error('Something went wrong')
      }
    }
  }

  const handleAssign = async () => {
    if (!assignData.vehicleId || !assignData.driverId) {
      toast.error('Select both vehicle and driver')
      return
    }
    setAssigning(true)
    try {
      await assignOrder(order._id, assignData)
      toast.success('Order assigned!')
      onUpdate()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setAssigning(false)
    }
  }

  const nextStatus = {
    pending: 'dispatched',
    dispatched: 'intransit',
    intransit: 'delivered'
  }

  const tabs = user?.role === 'driver'
    ? ['info', 'timeline']
    : ['info', 'assign', 'timeline']

  return (
    <>
      {showFailModal && (
        <FailureModal
          order={order}
          onSuccess={onUpdate}
          onClose={() => setShowFailModal(false)}
        />
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-white font-bold text-xl">{order.orderNo}</h2>
            <p className="text-gray-400 text-sm mt-0.5">{order.clientName}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize
                          whitespace-nowrap transition-colors
                          ${tab === t
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Info Tab */}
        {tab === 'info' && (
          <div className="space-y-4">
            {/* Addresses */}
            <div className="bg-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Pickup</p>
                  <p className="text-white text-sm">{order.pickupAddress}</p>
                </div>
              </div>
              <div className="h-px bg-gray-700" />
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Delivery</p>
                  <p className="text-white text-sm">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>

            {/* Client + Driver */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Phone size={12} className="text-gray-400" />
                  <p className="text-gray-400 text-xs">Client Phone</p>
                </div>
                <p className="text-white text-sm">{order.clientPhone}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Truck size={12} className="text-gray-400" />
                  <p className="text-gray-400 text-xs">Vehicle</p>
                </div>
                <p className="text-white text-sm">
                  {order.vehicleId?.registrationNo || 'Not assigned'}
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <User size={12} className="text-gray-400" />
                  <p className="text-gray-400 text-xs">Driver</p>
                </div>
                <p className="text-white text-sm">
                  {order.driverId?.userId?.name || 'Not assigned'}
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Package size={12} className="text-gray-400" />
                  <p className="text-gray-400 text-xs">Goods</p>
                </div>
                <p className="text-white text-sm">
                  {order.goods?.description || 'N/A'}
                </p>
              </div>
            </div>

            {/* Actions */}
            {['pending','dispatched','intransit'].includes(order.status) && (
              <div className="space-y-2 pt-2">
                {nextStatus[order.status] && (
                  <button
                    onClick={() => handleStatusUpdate(nextStatus[order.status])}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white
                               font-semibold py-3 rounded-xl transition-colors text-sm"
                  >
                    Mark as {nextStatus[order.status]}
                  </button>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowFailModal(true)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400
                               border border-red-500/30 font-semibold py-2.5
                               rounded-xl transition-colors text-sm"
                  >
                    Mark Failed
                  </button>
                  {user?.role !== 'driver' && (
                    <button
                      onClick={handleCancel}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-400
                                 font-semibold py-2.5 rounded-xl transition-colors text-sm"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Assign Tab */}
        {tab === 'assign' && user?.role !== 'driver' && (
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Select Vehicle
              </label>
              <select
                value={assignData.vehicleId}
                onChange={e => setAssignData({...assignData, vehicleId: e.target.value})}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                           border border-gray-700 focus:outline-none
                           focus:border-blue-500 text-sm"
              >
                <option value="">Select vehicle</option>
                {vehicles.map(v => (
                  <option key={v._id} value={v._id}>
                    {v.registrationNo} — {v.type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Select Driver
              </label>
              <select
                value={assignData.driverId}
                onChange={e => setAssignData({...assignData, driverId: e.target.value})}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                           border border-gray-700 focus:outline-none
                           focus:border-blue-500 text-sm"
              >
                <option value="">Select driver</option>
                {drivers.map(d => (
                  <option key={d._id} value={d._id}>
                    {d.userId?.name} — {d.employeeId}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAssign}
              disabled={assigning}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800
                         text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {assigning ? 'Assigning...' : 'Assign Order'}
            </button>
          </div>
        )}

        {/* Timeline Tab */}
        {tab === 'timeline' && (
          <OrderTimeline events={timeline} />
        )}
      </div>
    </>
  )
}

export default OrderDetail