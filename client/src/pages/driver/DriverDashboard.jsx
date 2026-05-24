import { useState, useEffect } from 'react'
import { getDriverDashboard } from '../../api/dashboard.api'
import ActiveTrip from './ActiveTrip'
import StatCard from '../../components/dashboard/StatCard'
import Loader from '../../components/common/Loader'
import { Package, CheckCircle, XCircle, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

const DriverDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    getDriverDashboard()
      .then(res => setData(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  if (loading) return <Loader />

  const stats = [
    { label: 'Total Trips', value: data.stats.total, color: 'text-blue-400', icon: Package },
    { label: 'Delivered', value: data.stats.delivered, color: 'text-green-400', icon: CheckCircle },
    { label: 'Failed', value: data.stats.failed, color: 'text-red-400', icon: XCircle },
    { label: 'Success Rate', value: `${data.stats.successRate}%`, color: 'text-yellow-400', icon: TrendingUp },
  ]

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-white text-xl font-bold">My Dashboard</h1>
        <p className="text-gray-400 text-sm">Your delivery overview</p>
      </div>

      {/* Active Trip */}
      {data.activeOrder && (
        <div>
          <h2 className="text-gray-400 text-xs font-semibold uppercase
                          tracking-wider mb-3">Active Trip</h2>
          <ActiveTrip
            order={data.activeOrder}
            onUpdate={fetchData}
          />
        </div>
      )}

      {/* Stats */}
      <div>
        <h2 className="text-gray-400 text-xs font-semibold uppercase
                        tracking-wider mb-3">My Stats</h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default DriverDashboard