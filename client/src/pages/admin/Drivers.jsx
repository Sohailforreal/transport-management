import { useState, useEffect } from 'react'
import { getDrivers } from '../../api/driver.api'
import DriverCard from '../../components/drivers/DriverCard'
import DriverForm from '../../components/drivers/DriverForm'
import DriverDetail from '../../components/drivers/DriverDetail'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

const Drivers = () => {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [editDriver, setEditDriver] = useState(null)

  const fetchDrivers = async () => {
    try {
      const res = await getDrivers()
      setDrivers(res.data.drivers)
    } catch {
      toast.error('Failed to load drivers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  if (loading) return <Loader />

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold">Drivers</h1>
          <p className="text-gray-400 text-sm">{drivers.length} total drivers</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setSelectedDriver(null) }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm
                     font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Add Driver
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6">
          <DriverForm
            driver={editDriver}
            onSuccess={() => {
              setShowForm(false)
              setEditDriver(null)
              fetchDrivers()
            }}
            onCancel={() => {
              setShowForm(false)
              setEditDriver(null)
            }}
          />
        </div>
      )}

      {/* Detail */}
      {selectedDriver && (
        <div className="mb-6">
          <DriverDetail
            driver={selectedDriver}
            onUpdate={() => {
              fetchDrivers()
              setSelectedDriver(null)
            }}
            onClose={() => setSelectedDriver(null)}
          />
        </div>
      )}

      {/* Grid */}
      {drivers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No drivers added yet</p>
          <p className="text-gray-600 text-sm mt-1">
            Click "Add Driver" to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {drivers.map(driver => (
            <DriverCard
              key={driver._id}
              driver={driver}
              onClick={setSelectedDriver}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Drivers