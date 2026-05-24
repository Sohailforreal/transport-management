import { useState } from 'react'
import StatusBadge from '../common/StatusBadge'
import AlertBadge from '../common/AlertBadge'
import MaintenanceLog from './MaintenanceLog'
import { updateInsurance, updatePuc } from '../../api/vehicle.api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const VehicleDetail = ({ vehicle, onUpdate, onClose }) => {
  const [tab, setTab] = useState('info')
  const [insuranceForm, setInsuranceForm] = useState({
    provider: vehicle.insurance?.provider || '',
    policyNo: vehicle.insurance?.policyNo || '',
    expiryDate: vehicle.insurance?.expiryDate?.split('T')[0] || ''
  })
  const [pucForm, setPucForm] = useState({
    certNo: vehicle.puc?.certNo || '',
    expiryDate: vehicle.puc?.expiryDate?.split('T')[0] || ''
  })
  const [loading, setLoading] = useState(false)

  const handleInsuranceSave = async () => {
    setLoading(true)
    try {
      await updateInsurance(vehicle._id, insuranceForm)
      toast.success('Insurance updated!')
      onUpdate()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handlePucSave = async () => {
    setLoading(true)
    try {
      await updatePuc(vehicle._id, pucForm)
      toast.success('PUC updated!')
      onUpdate()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const tabs = ['info', 'insurance', 'puc', 'maintenance']

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">
            {vehicle.registrationNo}
          </h2>
          <p className="text-gray-400 text-sm capitalize">
            {vehicle.type} • {vehicle.capacityTons} Tons
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={vehicle.status} />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize 
                        whitespace-nowrap transition-colors
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
          <div className="flex flex-wrap gap-2 mb-4">
            <AlertBadge
              expiryDate={vehicle.insurance?.expiryDate}
              label="Insurance"
            />
            <AlertBadge
              expiryDate={vehicle.puc?.expiryDate}
              label="PUC"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Type', value: vehicle.type },
              { label: 'Capacity', value: `${vehicle.capacityTons} Tons` },
              { label: 'Status', value: vehicle.status },
              { label: 'Added', value: format(new Date(vehicle.createdAt), 'dd MMM yyyy') }
            ].map((item, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                <p className="text-white text-sm font-medium capitalize">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insurance Tab */}
      {tab === 'insurance' && (
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Provider</label>
            <input
              value={insuranceForm.provider}
              onChange={e => setInsuranceForm({...insuranceForm, provider: e.target.value})}
              placeholder="HDFC Ergo"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Policy Number</label>
            <input
              value={insuranceForm.policyNo}
              onChange={e => setInsuranceForm({...insuranceForm, policyNo: e.target.value})}
              placeholder="POL123456"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Expiry Date</label>
            <input
              type="date"
              value={insuranceForm.expiryDate}
              onChange={e => setInsuranceForm({...insuranceForm, expiryDate: e.target.value})}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
          </div>
          <button
            onClick={handleInsuranceSave}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white
                       font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Saving...' : 'Save Insurance'}
          </button>
        </div>
      )}

      {/* PUC Tab */}
      {tab === 'puc' && (
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Certificate Number</label>
            <input
              value={pucForm.certNo}
              onChange={e => setPucForm({...pucForm, certNo: e.target.value})}
              placeholder="PUC123456"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Expiry Date</label>
            <input
              type="date"
              value={pucForm.expiryDate}
              onChange={e => setPucForm({...pucForm, expiryDate: e.target.value})}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 text-sm"
            />
          </div>
          <button
            onClick={handlePucSave}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white
                       font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Saving...' : 'Save PUC'}
          </button>
        </div>
      )}

      {/* Maintenance Tab */}
      {tab === 'maintenance' && (
        <MaintenanceLog vehicle={vehicle} onUpdate={onUpdate} />
      )}
    </div>
  )
}

export default VehicleDetail