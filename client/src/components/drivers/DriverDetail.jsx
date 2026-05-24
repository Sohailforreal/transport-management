import { useState, useEffect } from 'react'
import { getDriverStats, verifyDocument, deactivateDriver } from '../../api/driver.api'
import StatusBadge from '../common/StatusBadge'
import AlertBadge from '../common/AlertBadge'
import DriverStats from './DriverStats'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const DriverDetail = ({ driver, onUpdate, onClose }) => {
  const { user } = useAuth()
  const [tab, setTab] = useState('info')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getDriverStats(driver._id)
      .then(res => setStats(res.data.stats))
      .catch(() => {})
  }, [driver._id])

  const handleVerify = async (docId) => {
    try {
      await verifyDocument(driver._id, docId)
      toast.success('Document verified!')
      onUpdate()
    } catch {
      toast.error('Something went wrong')
    }
  }

  const driverUser = driver.userId
  const tabs = ['info', 'documents', 'stats']

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {driverUser?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">{driverUser?.name}</h2>
            <p className="text-gray-400 text-sm">{driver.employeeId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={driver.status} />
          {user?.role === 'admin' && (
  <button
    onClick={async () => {
      if (confirm(`Deactivate ${driverUser?.name}?`)) {
        try {
          await deactivateDriver(driver._id)
          toast.success('Driver deactivated!')
          onUpdate()
          onClose()
        } catch {
          toast.error('Something went wrong')
        }
      }
    }}
    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 
               border border-red-500/30 text-xs px-3 py-1.5 
               rounded-lg transition-colors"
  >
    Deactivate
  </button>
)}
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize
                        transition-colors
                        ${tab === t
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Info Tab */}
      {tab === 'info' && (
        <div className="space-y-3">
          <AlertBadge expiryDate={driver.licenseExpiry} label="License" />
          <div className="grid grid-cols-2 gap-3 mt-3">
            {[
              { label: 'Email', value: driverUser?.email },
              { label: 'Phone', value: driverUser?.phone || 'N/A' },
              { label: 'License No', value: driver.licenseNo },
              { label: 'License Expiry', value: driver.licenseExpiry
                ? format(new Date(driver.licenseExpiry), 'dd MMM yyyy')
                : 'N/A'
              },
              { label: 'Vehicle', value: driver.assignedVehicleId?.registrationNo || 'None' },
              { label: 'Joined', value: format(new Date(driver.createdAt), 'dd MMM yyyy') }
            ].map((item, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                <p className="text-white text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {tab === 'documents' && (
        <div className="space-y-3">
          {driver.documents?.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              No documents uploaded
            </p>
          ) : (
            driver.documents.map((doc, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium capitalize">
                    {doc.docType}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Uploaded: {format(new Date(doc.uploadedAt), 'dd MMM yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {doc.verified ? (
                    <span className="bg-green-500/20 text-green-400 border border-green-500/30
                                     px-2 py-1 rounded-full text-xs">
                      Verified ✓
                    </span>
                  ) : (
                    user?.role === 'admin' && (
                      <button
                        onClick={() => handleVerify(doc._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white
                                   text-xs px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Verify
                      </button>
                    )
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Stats Tab */}
      {tab === 'stats' && <DriverStats stats={stats} />}
    </div>
  )
}

export default DriverDetail