import { useState, useEffect } from 'react'
import { getOrders } from '../../api/order.api'
import { getOrder } from '../../api/order.api'
import OrderCard from '../../components/orders/OrderCard'
import OrderForm from '../../components/orders/OrderForm'
import OrderDetail from '../../components/orders/OrderDetail'
import Loader from '../../components/common/Loader'
import { Package } from 'lucide-react'
import toast from 'react-hot-toast'
import API from '../../api/axios'

const statusFilters = [
  'all', 'pending', 'dispatched', 'intransit', 'delivered', 'failed', 'cancelled'
]

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [filter, setFilter] = useState('all')

  const fetchOrders = async () => {
    try {
      const res = await getOrders(filter === 'all' ? '' : filter)
      setOrders(res.data.orders)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [filter])

  const handleOrderClick = async (order) => {
    try {
      const [orderRes, timelineRes] = await Promise.all([
        getOrder(order._id),
        API.get(`/orders/${order._id}/timeline`)
      ])
      setSelectedOrder(orderRes.data.order)
      setTimeline(timelineRes.data.events)
    } catch {
      toast.error('Failed to load order details')
    }
  }

  if (loading) return <Loader />

  return (
    // Added w-full max-w-full to prevent layout overflow constraints from scaling up awkwardly
    <div className="p-4 w-full max-w-full box-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div>
          <h1 className="text-white text-xl font-bold">Delivery Orders</h1>
          <p className="text-gray-400 text-sm">{orders.length} orders</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setSelectedOrder(null) }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm
                     font-semibold px-4 py-2 rounded-lg transition-colors
                     flex items-center gap-2 shrink-0"
        >
          <Package size={16} />
          New Order
        </button>
      </div>

      {/* Filter tabs */}
<div className="flex gap-2 overflow-x-auto pb-1 mb-4"
     style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {statusFilters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize
                        whitespace-nowrap transition-colors
                        ${filter === f
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
          >
            {f} {/* FIXED: Added missing closing curly brace here */}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <OrderForm
          onSuccess={() => {
            setShowForm(false)
            fetchOrders()
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Detail */}
      {selectedOrder && (
        <div className="mb-6">
          <OrderDetail
            order={selectedOrder}
            timeline={timeline}
            onUpdate={() => {
              fetchOrders()
              setSelectedOrder(null)
            }}
            onClose={() => setSelectedOrder(null)}
          />
        </div>
      )}

      {/* Orders list */}
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-600 text-sm mt-1">
            Click "New Order" to create one
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <OrderCard
              key={order._id}
              order={order}
              onClick={handleOrderClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
