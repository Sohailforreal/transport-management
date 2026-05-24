const DriverStats = ({ stats }) => {
  if (!stats) return null

  const items = [
    { label: 'Total', value: stats.total, color: 'text-blue-400' },
    { label: 'Delivered', value: stats.delivered, color: 'text-green-400' },
    { label: 'Failed', value: stats.failed, color: 'text-red-400' },
    { label: 'This Month', value: stats.thisMonth, color: 'text-purple-400' },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {items.map((item, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-gray-400 text-xs mt-1">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-gray-800 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-yellow-400">{stats.successRate}%</p>
        <p className="text-gray-400 text-xs mt-1">Success Rate</p>
      </div>
    </div>
  )
}

export default DriverStats