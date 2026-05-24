import API from './axios'

export const getDrivers = () => API.get('/drivers')
export const getDriver = (id) => API.get(`/drivers/${id}`)
export const createDriver = (data) => API.post('/drivers', data)
export const updateDriver = (id, data) => API.put(`/drivers/${id}`, data)
export const deactivateDriver = (id) => API.delete(`/drivers/${id}`)
export const uploadDocument = (id, data) => API.post(`/drivers/${id}/documents`, data)
export const verifyDocument = (id, docId) => API.put(`/drivers/${id}/documents/${docId}/verify`)
export const getDriverStats = (id) => API.get(`/drivers/${id}/stats`)
export const getMyStats = () => API.get('/drivers/me/stats')