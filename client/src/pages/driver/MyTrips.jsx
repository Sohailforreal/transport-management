import { useState, useEffect } from 'react'
import { getMyOrders } from '../../api/order.api'
import OrderCard from '../../components/orders/OrderCard'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

const MyTrips = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data.orders))
      .catch(() => toast.error('Failed to load trips'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-white text-xl font-bold">My Trips</h1>
        <p className="text-gray-400 text-sm">{orders.length} total trips</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No trips assigned yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <OrderCard
              key={order._id}
              order={order}
              onClick={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyTrips