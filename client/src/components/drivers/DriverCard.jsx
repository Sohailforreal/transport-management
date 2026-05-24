import StatusBadge from '../common/StatusBadge'
import AlertBadge from '../common/AlertBadge'

const DriverCard = ({ driver, onClick }) => {
  const user = driver.userId

  return (
    <div
      onClick={() => onClick(driver)}
      className="bg-gray-900 border border-gray-800 rounded-xl p-4
                 cursor-pointer hover:border-blue-500/50 transition-all"
    >
      {/* Top row */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar */}
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          {user?.photo ? (
            <img src={user.photo} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold truncate">{user?.name}</h3>
          <p className="text-gray-400 text-sm">{driver.employeeId}</p>
        </div>
        <StatusBadge status={driver.status} />
      </div>

      {/* Info */}
      <div className="space-y-1 mb-3">
        <p className="text-gray-400 text-sm">
          📞 {user?.phone || 'N/A'}
        </p>
        <p className="text-gray-400 text-sm">
          🚛 {driver.assignedVehicleId?.registrationNo || 'No vehicle assigned'}
        </p>
        <p className="text-gray-400 text-sm">
          🪪 {driver.licenseNo}
        </p>
      </div>

      {/* License expiry */}
      <AlertBadge
        expiryDate={driver.licenseExpiry}
        label="License"
      />
    </div>
  )
}

export default DriverCard