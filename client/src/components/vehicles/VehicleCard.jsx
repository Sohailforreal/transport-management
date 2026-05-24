import StatusBadge from '../common/StatusBadge'
import AlertBadge from '../common/AlertBadge'

const VehicleCard = ({ vehicle, onClick }) => {
  return (
    <div
      onClick={() => onClick(vehicle)}
      className="bg-gray-900 border border-gray-800 rounded-xl p-4 
                 cursor-pointer hover:border-blue-500/50 transition-all"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-bold text-lg">
            {vehicle.registrationNo}
          </h3>
          <p className="text-gray-400 text-sm capitalize">
            {vehicle.type} • {vehicle.capacityTons} Tons
          </p>
        </div>
        <StatusBadge status={vehicle.status} />
      </div>

      {/* Vehicle photo */}
      {vehicle.photo ? (
        <img
          src={vehicle.photo}
          alt={vehicle.registrationNo}
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
      ) : (
        <div className="w-full h-32 bg-gray-800 rounded-lg mb-3 
                        flex items-center justify-center">
          <svg width="48" height="28" viewBox="0 0 80 44" fill="none">
            <rect x="2" y="10" width="48" height="28" rx="3" fill="#2563eb"/>
            <rect x="50" y="16" width="26" height="22" rx="3" fill="#1d4ed8"/>
            <rect x="54" y="19" width="14" height="10" rx="2" fill="#93c5fd"/>
            <rect x="74" y="24" width="4" height="4" rx="1" fill="#fbbf24"/>
            <circle cx="18" cy="40" r="6" fill="#1f2937" stroke="#4b5563" strokeWidth="2"/>
            <circle cx="40" cy="40" r="6" fill="#1f2937" stroke="#4b5563" strokeWidth="2"/>
            <circle cx="62" cy="40" r="6" fill="#1f2937" stroke="#4b5563" strokeWidth="2"/>
          </svg>
        </div>
      )}

      {/* Alerts */}
      <div className="flex flex-wrap gap-2">
        <AlertBadge
          expiryDate={vehicle.insurance?.expiryDate}
          label="Insurance"
        />
        <AlertBadge
          expiryDate={vehicle.puc?.expiryDate}
          label="PUC"
        />
      </div>
    </div>
  )
}

export default VehicleCard