import { useState, useEffect } from 'react'
import { getVehicles } from '../../api/vehicle.api'
import VehicleCard from '../../components/vehicles/VehicleCard'
import VehicleForm from '../../components/vehicles/VehicleForm'
import VehicleDetail from '../../components/vehicles/VehicleDetail'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [editVehicle, setEditVehicle] = useState(null)

  const fetchVehicles = async () => {
    try {
      const res = await getVehicles()
      setVehicles(res.data.vehicles)
    } catch {
      toast.error('Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  if (loading) return <Loader />

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold">Vehicles</h1>
          <p className="text-gray-400 text-sm">{vehicles.length} total vehicles</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setSelectedVehicle(null) }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm
                     font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Add Vehicle
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-6">
          <VehicleForm
            vehicle={editVehicle}
            onSuccess={() => {
              setShowForm(false)
              setEditVehicle(null)
              fetchVehicles()
            }}
            onCancel={() => {
              setShowForm(false)
              setEditVehicle(null)
            }}
          />
        </div>
      )}

      {/* Vehicle Detail */}
      {selectedVehicle && (
        <div className="mb-6">
          <VehicleDetail
            vehicle={selectedVehicle}
            onUpdate={() => {
              fetchVehicles()
              setSelectedVehicle(null)
            }}
            onClose={() => setSelectedVehicle(null)}
          />
        </div>
      )}

      {/* Vehicles Grid */}
      {vehicles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No vehicles added yet</p>
          <p className="text-gray-600 text-sm mt-1">
            Click "Add Vehicle" to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {vehicles.map(vehicle => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              onClick={setSelectedVehicle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Vehicles