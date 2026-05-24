import { useState, useEffect } from 'react'
import { startTracking, stopTracking, updateLocation } from '../../api/tracking.api'
import { updateStatus } from '../../api/order.api'
import { useSocket } from '../../context/SocketContext'
import { MapPin, Navigation, Square, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const ActiveTrip = ({ order, onUpdate }) => {
  const { socket } = useSocket()
  const [isSharing, setIsSharing] = useState(false)
  const [watchId, setWatchId] = useState(null)

  const startSharing = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      return
    }
    try {
      await startTracking(order._id)
      socket?.emit('driver:join', {
        orderId: order._id,
        driverId: order.driverId?._id
      })

      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords
          socket?.emit('driver:location', { orderId: order._id, lat, lng })
          updateLocation(order._id, { lat, lng })
        },
        (err) => toast.error('Location error: ' + err.message),
        { enableHighAccuracy: true, maximumAge: 10000 }
      )
      setWatchId(id)
      setIsSharing(true)
      toast.success('Location sharing started!')
    } catch {
      toast.error('Failed to start tracking')
    }
  }

  const stopSharing = async () => {
    if (watchId) navigator.geolocation.clearWatch(watchId)
    socket?.emit('driver:stop', { orderId: order._id })
    await stopTracking(order._id)
    setIsSharing(false)
    setWatchId(null)
    toast.success('Location sharing stopped')
  }

  useEffect(() => {
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
    }
  }, [watchId])

  const handleDeliver = async () => {
    if (confirm('Mark this order as delivered?')) {
      try {
        await stopSharing()
        await updateStatus(order._id, { status: 'delivered' })
        toast.success('Order marked as delivered!')
        onUpdate()
      } catch {
        toast.error('Something went wrong')
      }
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="text-white font-bold mb-4">Active Trip — {order.orderNo}</h3>

      {/* Route info */}
      <div className="bg-gray-800 rounded-xl p-4 mb-4 space-y-2">
        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-blue-400 mt-0.5" />
          <div>
            <p className="text-gray-400 text-xs">Pickup</p>
            <p className="text-white text-sm">{order.pickupAddress}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-green-400 mt-0.5" />
          <div>
            <p className="text-gray-400 text-xs">Delivery</p>
            <p className="text-white text-sm">{order.deliveryAddress}</p>
          </div>
        </div>
      </div>

      {/* Location sharing */}
      <div className="space-y-3">
        {!isSharing ? (
          <button
            onClick={startSharing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white
                       font-semibold py-3 rounded-xl transition-colors
                       flex items-center justify-center gap-2"
          >
            <Navigation size={18} />
            Start Sharing Location
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 
                            bg-green-500/20 border border-green-500/30
                            rounded-xl py-3">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">
                Sharing Location Live
              </span>
            </div>
            <button
              onClick={stopSharing}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white
                         font-semibold py-3 rounded-xl transition-colors
                         flex items-center justify-center gap-2"
            >
              <Square size={16} />
              Stop Sharing
            </button>
          </div>
        )}

        <button
          onClick={handleDeliver}
          className="w-full bg-green-600 hover:bg-green-700 text-white
                     font-semibold py-3 rounded-xl transition-colors
                     flex items-center justify-center gap-2"
        >
          <CheckCircle size={18} />
          Mark as Delivered
        </button>
      </div>
    </div>
  )
}

export default ActiveTrip