import { useState, useEffect } from 'react'
import { getRoutes, createRoute, updateRoute, deactivateRoute } from '../../api/route.api'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

const RouteForm = ({ route, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const [checkpoints, setCheckpoints] = useState(
    route?.checkpoints || []
  )
  const [cpInput, setCpInput] = useState('')
  const [formData, setFormData] = useState({
    name: route?.name || '',
    source: route?.source || '',
    destination: route?.destination || '',
    distanceKm: route?.distanceKm || '',
    estimatedHours: route?.estimatedHours || ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const addCheckpoint = () => {
    if (!cpInput.trim()) return
    setCheckpoints([...checkpoints, {
      name: cpInput.trim(),
      order: checkpoints.length + 1
    }])
    setCpInput('')
  }

  const removeCheckpoint = (index) => {
    const updated = checkpoints
      .filter((_, i) => i !== index)
      .map((cp, i) => ({ ...cp, order: i + 1 }))
    setCheckpoints(updated)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.source || !formData.destination) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      const data = { ...formData, checkpoints }
      if (route) {
        await updateRoute(route._id, data)
        toast.success('Route updated!')
      } else {
        await createRoute(data)
        toast.success('Route created!')
      }
      onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
      <h2 className="text-white font-bold text-lg mb-6">
        {route ? 'Edit Route' : 'Add New Route'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Route Name *</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Mumbai to Surat"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                       border border-gray-700 focus:outline-none
                       focus:border-blue-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Source *</label>
            <input
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="Mumbai"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Destination *</label>
            <input
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Surat"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Distance (km)</label>
            <input
              name="distanceKm"
              type="number"
              value={formData.distanceKm}
              onChange={handleChange}
              placeholder="280"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Est. Hours</label>
            <input
              name="estimatedHours"
              type="number"
              value={formData.estimatedHours}
              onChange={handleChange}
              placeholder="5"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Checkpoints */}
        <div>
          <label className="text-gray-400 text-sm mb-2 block">Checkpoints</label>

          {/* Checkpoint visual */}
          {checkpoints.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-4 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-blue-400 text-sm font-medium">
                  {formData.source || 'Source'}
                </span>
                {checkpoints.map((cp, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-gray-500">──▶</span>
                    <div className="flex items-center gap-1 bg-gray-700 
                                    rounded-full px-3 py-1">
                      <span className="text-white text-xs">{cp.name}</span>
                      <button
                        onClick={() => removeCheckpoint(i)}
                        className="text-red-400 text-xs ml-1 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                <span className="text-gray-500">──▶</span>
                <span className="text-green-400 text-sm font-medium">
                  {formData.destination || 'Destination'}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <input
              value={cpInput}
              onChange={e => setCpInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCheckpoint()}
              placeholder="Add checkpoint (e.g. Vasai Toll)"
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
            <button
              onClick={addCheckpoint}
              className="bg-blue-600 hover:bg-blue-700 text-white
                         px-4 py-3 rounded-lg transition-colors text-sm"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800
                       text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Saving...' : route ? 'Update Route' : 'Create Route'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-800 hover:bg-gray-700
                       text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

const RouteCard = ({ route, onEdit, onDeactivate }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="text-white font-bold">{route.name}</h3>
        <p className="text-gray-400 text-sm mt-0.5">
          {route.distanceKm} km • ~{route.estimatedHours} hrs
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(route)}
          className="text-blue-400 hover:text-blue-300 text-xs
                     bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDeactivate(route)}
          className="text-red-400 hover:text-red-300 text-xs
                     bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          Remove
        </button>
      </div>
    </div>

    {/* Route visual */}
    <div className="bg-gray-800 rounded-xl p-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-blue-400 text-xs font-medium">{route.source}</span>
        </div>
        {route.checkpoints?.map((cp, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-gray-600 text-xs">──▶</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-400 text-xs">{cp.name}</span>
            </div>
          </div>
        ))}
        <span className="text-gray-600 text-xs">──▶</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-400 text-xs font-medium">{route.destination}</span>
        </div>
      </div>
    </div>
  </div>
)

const Routes = () => {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editRoute, setEditRoute] = useState(null)

  const fetchRoutes = async () => {
    try {
      const res = await getRoutes()
      setRoutes(res.data.routes)
    } catch {
      toast.error('Failed to load routes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRoutes() }, [])

  const handleDeactivate = async (route) => {
    if (confirm(`Remove route "${route.name}"?`)) {
      try {
        await deactivateRoute(route._id)
        toast.success('Route removed!')
        fetchRoutes()
      } catch {
        toast.error('Something went wrong')
      }
    }
  }

  if (loading) return <Loader />

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold">Routes</h1>
          <p className="text-gray-400 text-sm">{routes.length} active routes</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditRoute(null) }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm
                     font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Add Route
        </button>
      </div>

      {showForm && (
        <RouteForm
          route={editRoute}
          onSuccess={() => {
            setShowForm(false)
            setEditRoute(null)
            fetchRoutes()
          }}
          onCancel={() => {
            setShowForm(false)
            setEditRoute(null)
          }}
        />
      )}

      {routes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No routes added yet</p>
          <p className="text-gray-600 text-sm mt-1">
            Click "Add Route" to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {routes.map(route => (
            <RouteCard
              key={route._id}
              route={route}
              onEdit={(r) => { setEditRoute(r); setShowForm(true) }}
              onDeactivate={handleDeactivate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Routes