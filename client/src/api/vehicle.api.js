import API from './axios'

export const getVehicles = () => API.get('/vehicles')
export const getVehicle = (id) => API.get(`/vehicles/${id}`)
export const createVehicle = (data) => API.post('/vehicles', data)
export const updateVehicle = (id, data) => API.put(`/vehicles/${id}`, data)
export const deactivateVehicle = (id) => API.delete(`/vehicles/${id}`)
export const updateInsurance = (id, data) => API.post(`/vehicles/${id}/insurance`, data)
export const updatePuc = (id, data) => API.post(`/vehicles/${id}/puc`, data)
export const addMaintenance = (id, data) => API.post(`/vehicles/${id}/maintenance`, data)
export const getExpiryAlerts = () => API.get('/vehicles/alerts/expiry')