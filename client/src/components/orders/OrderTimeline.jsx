import { format } from 'date-fns'

const eventConfig = {
  ordered:            { label: 'Order Created',        color: 'bg-blue-500',   icon: '📋' },
  packed:             { label: 'Goods Packed',         color: 'bg-yellow-500', icon: '📦' },
  dispatched:         { label: 'Dispatched',           color: 'bg-purple-500', icon: '🚛' },
  checkpoint_reached: { label: 'Checkpoint Reached',   color: 'bg-orange-500', icon: '📍' },
  delivered:          { label: 'Delivered',            color: 'bg-green-500',  icon: '✅' },
  failed:             { label: 'Delivery Failed',      color: 'bg-red-500',    icon: '❌' },
}

const OrderTimeline = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-4">
        No timeline events yet
      </p>
    )
  }

  return (
    <div className="space-y-0">
      {events.map((event, i) => {
        const config = eventConfig[event.eventType] || {
          label: event.eventType,
          color: 'bg-gray-500',
          icon: '📌'
        }
        const isLast = i === events.length - 1

        return (
          <div key={event._id} className="flex gap-3">
            {/* Left — dot + line */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 ${config.color} rounded-full 
                              flex items-center justify-center text-sm
                              flex-shrink-0 z-10`}>
                {config.icon}
              </div>
              {!isLast && (
                <div className="w-0.5 bg-gray-700 flex-1 my-1"></div>
              )}
            </div>

            {/* Right — content */}
            <div className={`pb-4 ${isLast ? '' : ''}`}>
              <p className="text-white font-medium text-sm">{config.label}</p>
              {event.location && (
                <p className="text-gray-400 text-xs mt-0.5">📍 {event.location}</p>
              )}
              {event.description && (
                <p className="text-gray-500 text-xs mt-0.5">{event.description}</p>
              )}
              <p className="text-gray-600 text-xs mt-1">
                {format(new Date(event.timestamp), 'dd MMM yyyy, hh:mm a')}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OrderTimeline