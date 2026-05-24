import { useState } from 'react'
import { addMaintenance } from '../../api/vehicle.api'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const MaintenanceLog = ({ vehicle, onUpdate }) => {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    cost: '',
    nextDueDate: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!formData.date || !formData.description) {
      toast.error('Please fill required fields')
      return
    }
    setLoading(true)
    try {
      await addMaintenance(vehicle._id, formData)
      toast.success('Maintenance log added!')
      setShowForm(false)
      setFormData({ date: '', description: '', cost: '', nextDueDate: '' })
      onUpdate()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Maintenance Log</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white 
                     text-sm px-3 py-1.5 rounded-lg transition-colors"
        >
          + Add Entry
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-xl p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2
                           border border-gray-600 focus:outline-none
                           focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Cost (₹)</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                placeholder="5000"
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2
                           border border-gray-600 focus:outline-none
                           focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Description *</label>
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Oil change, brake pad replacement..."
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2
                         border border-gray-600 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Next Due Date</label>
            <input
              type="date"
              name="nextDueDate"
              value={formData.nextDueDate}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2
                         border border-gray-600 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white
                         text-sm py-2 rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white
                         text-sm py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Log List */}
      {vehicle.maintenanceLog?.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">
          No maintenance records yet
        </p>
      ) : (
        <div className="space-y-3">
          {[...vehicle.maintenanceLog].reverse().map((log, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-start mb-1">
                <p className="text-white text-sm font-medium">{log.description}</p>
                {log.cost && (
                  <span className="text-green-400 text-sm font-semibold">
                    ₹{log.cost}
                  </span>
                )}
              </div>
              <div className="flex gap-4 mt-1">
                <p className="text-gray-400 text-xs">
                  Date: {format(new Date(log.date), 'dd MMM yyyy')}
                </p>
                {log.nextDueDate && (
                  <p className="text-yellow-400 text-xs">
                    Next: {format(new Date(log.nextDueDate), 'dd MMM yyyy')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MaintenanceLog