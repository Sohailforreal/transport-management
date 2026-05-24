const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const setupSocket = require('./config/socket')

dotenv.config()
connectDB()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
})

setupSocket(io)

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())
app.use('/uploads', express.static('uploads'))




// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Transport Management API Running' })
})

const authRoutes = require('./routes/auth.routes')
app.use('/api/auth', authRoutes)

const vehicleRoutes = require('./routes/vehicle.routes')
app.use('/api/vehicles', vehicleRoutes)

const driverRoutes = require('./routes/driver.routes')
app.use('/api/drivers', driverRoutes)


const routeRoutes = require('./routes/route.routes')
app.use('/api/routes', routeRoutes)

const orderRoutes = require('./routes/order.routes')
app.use('/api/orders', orderRoutes)

const trackingRoutes = require('./routes/tracking.routes')
app.use('/api/tracking', trackingRoutes)

const dashboardRoutes = require('./routes/dashboard.routes')
app.use('/api/dashboard', dashboardRoutes)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Keep alive - prevent Render sleep
if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    const https = require('https')
    https.get(process.env.RENDER_URL || '', () => {}).on('error', () => {})
  }, 14 * 60 * 1000)
}