const statusStyles = {
  // Vehicle status
  available: 'bg-green-500/20 text-green-400 border border-green-500/30',
  ontrip: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  maintenance: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  // Order status
  pending: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  dispatched: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  intransit: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-400 border border-green-500/30',
  failed: 'bg-red-500/20 text-red-400 border border-red-500/30',
  cancelled: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  // Driver status
  available: 'bg-green-500/20 text-green-400 border border-green-500/30',
  onduty: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  off: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
}

const statusLabels = {
  available: 'Available',
  ontrip: 'On Trip',
  maintenance: 'Maintenance',
  pending: 'Pending',
  dispatched: 'Dispatched',
  intransit: 'In Transit',
  delivered: 'Delivered',
  failed: 'Failed',
  cancelled: 'Cancelled',
  onduty: 'On Duty',
  off: 'Off Duty',
}

const StatusBadge = ({ status }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${statusStyles[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {statusLabels[status] || status}
    </span>
  )
}

export default StatusBadge