import { useState, useEffect } from 'react'
import { getAdminDashboard } from '../../api/dashboard.api'
import StatCard from '../../components/dashboard/StatCard'
import ExpiryAlerts from '../../components/dashboard/ExpiryAlerts'
import Loader from '../../components/common/Loader'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'
import {
  Package, Truck, Users, CheckCircle,
  XCircle, Clock, AlertTriangle, TrendingUp
} from 'lucide-react'
import toast from 'react-hot-toast'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const AdminDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminDashboard()
      .then(res => setData(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  const orderStats = [
    { label: 'Total Orders', value: data.orders.total, color: 'text-blue-400', icon: Package },
    { label: 'This Month', value: data.orders.thisMonth, color: 'text-purple-400', icon: TrendingUp },
    { label: 'Delivered', value: data.orders.delivered, color: 'text-green-400', icon: CheckCircle },
    { label: 'Failed', value: data.orders.failed, color: 'text-red-400', icon: XCircle },
    { label: 'In Transit', value: data.orders.intransit, color: 'text-yellow-400', icon: Truck },
    { label: 'Pending', value: data.orders.pending, color: 'text-gray-400', icon: Clock },
  ]

  const vehicleStats = [
    { label: 'Total Vehicles', value: data.vehicles.total, color: 'text-blue-400', icon: Truck },
    { label: 'Available', value: data.vehicles.available, color: 'text-green-400', icon: CheckCircle },
    { label: 'On Trip', value: data.vehicles.onTrip, color: 'text-yellow-400', icon: Truck },
  ]

  const driverStats = [
    { label: 'Total Drivers', value: data.drivers.total, color: 'text-blue-400', icon: Users },
    { label: 'Available', value: data.drivers.available, color: 'text-green-400', icon: CheckCircle },
    { label: 'On Duty', value: data.drivers.onDuty, color: 'text-yellow-400', icon: Users },
  ]

  const trendData = data.monthlyTrend.map(m => ({
    name: months[m._id.month - 1],
    Delivered: m.delivered,
    Failed: m.failed,
    Total: m.total
  }))

  const failureData = data.failureBreakdown.map(f => ({
    name: f._id?.replace(/_/g, ' ') || 'Unknown',
    value: f.count
  }))

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-white text-xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm">Overview of all operations</p>
      </div>

      {/* Expiry Alerts */}
      {data.expiryAlerts?.length > 0 && (
        <ExpiryAlerts alerts={data.expiryAlerts} />
      )}

      {/* Order Stats */}
      <div>
        <h2 className="text-gray-400 text-xs font-semibold uppercase 
                        tracking-wider mb-3">Orders</h2>
        <div className="grid grid-cols-2 gap-3">
          {orderStats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </div>

      {/* Monthly Trend Chart */}
      {trendData.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">
            Monthly Delivery Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData}>
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="Delivered" fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="Failed" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Failure Breakdown */}
      {failureData.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h3 className="text-white font-semibold text-sm mb-4">
            Failure Reasons
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={failureData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {failureData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Vehicle Stats */}
      <div>
        <h2 className="text-gray-400 text-xs font-semibold uppercase
                        tracking-wider mb-3">Vehicles</h2>
        <div className="grid grid-cols-3 gap-3">
          {vehicleStats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </div>

      {/* Driver Stats */}
      <div>
        <h2 className="text-gray-400 text-xs font-semibold uppercase
                        tracking-wider mb-3">Drivers</h2>
        <div className="grid grid-cols-3 gap-3">
          {driverStats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard