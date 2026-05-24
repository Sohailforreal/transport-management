import { useEffect, useState, useRef } from 'react'
import { useSocket } from '../../context/SocketContext'
import { getLastLocation } from '../../api/tracking.api'
import { MapPin, Truck, CheckCircle, Clock } from 'lucide-react'

const LiveTracker = ({ order }) => {
  const { socket } = useSocket()
  const [isLive, setIsLive] = useState(false)
  const [truckPosition, setTruckPosition] = useState(0)
  const [lastUpdate, setLastUpdate] = useState(null)
  const animRef = useRef(null)

  const route = order.routeId
  const checkpoints = route?.checkpoints || []
  const stops = [
    { name: route?.source || 'Source', type: 'source' },
    ...checkpoints.map(cp => ({ name: cp.name, type: 'checkpoint' })),
    { name: route?.destination || 'Destination', type: 'destination' }
  ]
  const totalStops = stops.length

  useEffect(() => {
    // Get last known location
    getLastLocation(order._id)
      .then(res => {
        if (res.data.trip?.isLive) {
          setIsLive(true)
        }
      })
      .catch(() => {})

    if (!socket) return

    // Join order room
    socket.emit('manager:join', { orderId: order._id })

    // Listen for location updates
    socket.on('location:update', ({ lat, lng }) => {
      setLastUpdate(new Date())
      setIsLive(true)
      // Animate truck position slightly
      setTruckPosition(prev => Math.min(prev + 2, 95))
    })

    socket.on('trip:started', () => setIsLive(true))
    socket.on('trip:ended', () => setIsLive(false))

    return () => {
      socket.off('location:update')
      socket.off('trip:started')
      socket.off('trip:ended')
    }
  }, [socket, order._id])

  // Progress based on order status
  const statusProgress = {
    pending: 0,
    dispatched: 10,
    intransit: 50,
    delivered: 100,
    failed: 0,
    cancelled: 0
  }

  const progress = isLive
    ? truckPosition
    : statusProgress[order.status] || 0

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Truck size={18} className="text-blue-400" />
          <span className="text-white font-semibold text-sm">Live Tracking</span>
        </div>
        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="flex items-center gap-1.5 bg-green-500/20 
                             text-green-400 border border-green-500/30
                             px-2 py-1 rounded-full text-xs">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"/>
              Live
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-gray-700
                             text-gray-400 px-2 py-1 rounded-full text-xs">
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"/>
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Route visualization */}
      <div className="relative mb-6">
        {/* Track line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-600 z-0" />
        
        {/* Progress line */}
        <div
          className="absolute top-4 left-4 h-0.5 bg-blue-500 z-0 transition-all duration-1000"
          style={{ width: `calc(${progress}% - 2rem)` }}
        />

        {/* Truck icon */}
        <div
          className="absolute top-1 z-20 transition-all duration-1000"
          style={{ left: `calc(${progress}% - 12px)` }}
        >
          <div className="bg-blue-600 rounded-full p-1.5 shadow-lg shadow-blue-500/30">
            <Truck size={14} className="text-white" />
          </div>
        </div>

        {/* Stops */}
        <div className="flex justify-between relative z-10 pt-8">
          {stops.map((stop, i) => {
            const stopProgress = (i / (totalStops - 1)) * 100
            const isPassed = progress >= stopProgress
            const isCurrent = progress >= stopProgress &&
              (i === totalStops - 1 || progress < ((i + 1) / (totalStops - 1)) * 100)

            return (
              <div key={i} className="flex flex-col items-center"
                   style={{ maxWidth: `${100 / totalStops}%` }}>
                <div className={`w-3 h-3 rounded-full border-2 mb-2 -mt-6
                                 ${isPassed
                                   ? 'bg-blue-500 border-blue-400'
                                   : 'bg-gray-700 border-gray-600'
                                 }
                                 ${stop.type === 'destination' && isPassed
                                   ? 'bg-green-500 border-green-400'
                                   : ''
                                 }`}
                />
                <p className={`text-center leading-tight
                               ${stop.type === 'source' ? 'text-left' : ''}
                               ${stop.type === 'destination' ? 'text-right' : ''}
                               ${isPassed ? 'text-white' : 'text-gray-500'}
                               text-xs`}
                   style={{ fontSize: '10px', maxWidth: '60px' }}>
                  {stop.name}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Status info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Clock size={12} />
          {lastUpdate
            ? `Updated ${lastUpdate.toLocaleTimeString()}`
            : 'Waiting for driver...'
          }
        </div>
        {order.routeId && (
          <div className="text-gray-400 text-xs">
            {order.routeId.distanceKm}km • ~{order.routeId.estimatedHours}h
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveTracker