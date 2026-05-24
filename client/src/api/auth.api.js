import API from './axios'

export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')
export const updateMe = (data) => API.put('/auth/me', data)
export const changePassword = (data) => API.put('/auth/change-password', data)