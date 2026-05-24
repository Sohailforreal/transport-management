import API from './axios'

export const getAdminDashboard = () => API.get('/dashboard/admin')
export const getManagerDashboard = () => API.get('/dashboard/manager')
export const getDriverDashboard = () => API.get('/dashboard/driver')