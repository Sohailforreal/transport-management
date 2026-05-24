import API from './axios'

export const startTracking = (orderId) => API.post(`/tracking/${orderId}/start`)
export const updateLocation = (orderId, data) => API.put(`/tracking/${orderId}/location`, data)
export const stopTracking = (orderId) => API.post(`/tracking/${orderId}/stop`)
export const getLastLocation = (orderId) => API.get(`/tracking/${orderId}`)