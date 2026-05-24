import StatusBadge from '../common/StatusBadge'
import { format } from 'date-fns'

const OrderCard = ({ order, onClick }) => {
  return (
    <div
      onClick={() => onClick(order)}
      className="bg-gray-900 border border-gray-800 rounded-xl p-4
                 cursor-pointer hover:border-blue-500/50 transition-all"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-bold">{order.orderNo}</h3>
          <p className="text-gray-400 text-sm mt-0.5">{order.clientName}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Addresses */}
      <div className="space-y-1 mb-3">
        <div className="flex items-start gap-2">
          <span className="text-blue-400 text-xs mt-0.5">FROM</span>
          <p className="text-gray-300 text-sm">{order.pickupAddress}</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-green-400 text-xs mt-0.5">TO</span>
          <p className="text-gray-300 text-sm">{order.deliveryAddress}</p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs">
          {order.scheduledDate
            ? format(new Date(order.scheduledDate), 'dd MMM yyyy')
            : 'No date set'
          }
        </p>
        {order.driverId && (
          <p className="text-gray-400 text-xs">
            🚛 {order.driverId?.userId?.name || 'Assigned'}
          </p>
        )}
      </div>
    </div>
  )
}

export default OrderCard