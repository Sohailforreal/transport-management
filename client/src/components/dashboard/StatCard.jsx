const StatCard = ({ label, value, color, icon: Icon }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-xs">{label}</p>
        {Icon && <Icon size={16} className={color} />}
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

export default StatCard