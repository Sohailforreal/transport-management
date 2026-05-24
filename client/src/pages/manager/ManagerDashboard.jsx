import { useState, useEffect } from 'react'
import { getManagerDashboard } from '../../api/dashboard.api'
import StatCard from '../../components/dashboard/StatCard'
import OrderCard from '../../components/orders/OrderCard'
import Loader from '../../components/common/Loader'
import { Package, Truck, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

const ManagerDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getManagerDashboard()
      .then(res => setData(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  const stats = [
    { label: 'Total Orders', value: data.orders.total, color: 'text-blue-400', icon: Package },
    { label: 'This Month', value: data.orders.thisMonth, color: 'text-purple-400', icon: TrendingUp },
    { label: 'In Transit', value: data.orders.intransit, color: 'text-yellow-400', icon: Truck },
    { label: 'Pending', value: data.orders.pending, color: 'text-gray-400', icon: Clock },
    { label: 'Delivered', value: data.orders.delivered, color: 'text-green-400', icon: CheckCircle },
    { label: 'Failed', value: data.orders.failed, color: 'text-red-400', icon: XCircle },
  ]

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-white text-xl font-bold">Manager Dashboard</h1>
        <p className="text-gray-400 text-sm">Operations overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Recent Orders */}
      {data.recentOrders?.length > 0 && (
        <div>
          <h2 className="text-gray-400 text-xs font-semibold uppercase
                          tracking-wider mb-3">Recent Orders</h2>
          <div className="space-y-3">
            {data.recentOrders.map(order => (
              <OrderCard
                key={order._id}
                order={order}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagerDashboard