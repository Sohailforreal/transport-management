import { AlertTriangle } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'

const ExpiryAlerts = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null

  return (
    <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-yellow-400" />
        <h3 className="text-white font-semibold text-sm">Expiry Alerts</h3>
        <span className="bg-yellow-500/20 text-yellow-400 text-xs 
                         px-2 py-0.5 rounded-full">
          {alerts.length}
        </span>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, i) => {
          const daysLeft = differenceInDays(new Date(alert.expiryDate), new Date())
          return (
            <div key={i} className="flex items-center justify-between
                                     bg-gray-800 rounded-lg px-3 py-2">
              <div>
                <p className="text-white text-xs font-medium capitalize">
                  {alert.type} — {alert.vehicleNo || alert.driverId}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {format(new Date(alert.expiryDate), 'dd MMM yyyy')}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full
                                ${daysLeft < 0
                                  ? 'bg-red-500/20 text-red-400'
                                  : daysLeft <= 7
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                {daysLeft < 0 ? 'Expired' : `${daysLeft}d left`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExpiryAlerts