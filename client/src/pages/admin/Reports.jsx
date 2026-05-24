import { useState, useEffect } from 'react'
import { getOrders } from '../../api/order.api'
import { getDrivers } from '../../api/driver.api'
import { getDriverStats } from '../../api/driver.api'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { format } from 'date-fns'
import { FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const Reports = () => {
  const [orders, setOrders] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('deliveries')

  useEffect(() => {
    Promise.all([
      getOrders(),
      getDrivers()
    ])
      .then(([ordersRes, driversRes]) => {
        setOrders(ordersRes.data.orders)
        setDrivers(driversRes.data.drivers)
      })
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  const delivered = orders.filter(o => o.status === 'delivered').length
  const failed = orders.filter(o => o.status === 'failed').length
  const successRate = orders.length > 0
    ? ((delivered / orders.length) * 100).toFixed(1)
    : 0

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <FileText size={20} className="text-blue-400" />
        <h1 className="text-white text-xl font-bold">Reports</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Orders', value: orders.length, color: 'text-blue-400' },
          { label: 'Delivered', value: delivered, color: 'text-green-400' },
          { label: 'Failed', value: failed, color: 'text-red-400' },
          { label: 'Success Rate', value: `${successRate}%`, color: 'text-yellow-400' },
        ].map((item, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">{item.label}</p>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['deliveries', 'drivers'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize
                        transition-colors
                        ${tab === t
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400'
                        }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Deliveries Tab */}
      {tab === 'deliveries' && (
        <div className="space-y-2">
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            orders.map(order => (
              <div key={order._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-semibold text-sm">
                    {order.orderNo}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-gray-400 text-xs">{order.clientName}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {order.createdAt
                    ? format(new Date(order.createdAt), 'dd MMM yyyy')
                    : 'N/A'}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Drivers Tab */}
      {tab === 'drivers' && (
        <div className="space-y-2">
          {drivers.map(driver => (
            <div key={driver._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">
                    {driver.userId?.name}
                  </p>
                  <p className="text-gray-400 text-xs">{driver.employeeId}</p>
                </div>
                <StatusBadge status={driver.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reports