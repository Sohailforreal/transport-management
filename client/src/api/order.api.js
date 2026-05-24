import API from './axios'

export const getOrders = (status) => API.get(`/orders${status ? `?status=${status}` : ''}`)
export const getOrder = (id) => API.get(`/orders/${id}`)
export const createOrder = (data) => API.post('/orders', data)
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data)
export const assignOrder = (id, data) => API.put(`/orders/${id}/assign`, data)
export const updateStatus = (id, data) => API.put(`/orders/${id}/status`, data)
export const failOrder = (id, data) => API.put(`/orders/${id}/fail`, data)
export const cancelOrder = (id) => API.put(`/orders/${id}/cancel`)
export const getMyOrders = () => API.get('/orders/driver/me')
export const trackOrder = (orderNo) => API.get(`/orders/track/${orderNo}`)