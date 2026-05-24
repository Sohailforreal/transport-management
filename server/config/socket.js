const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    // Driver joins trip room
    socket.on('driver:join', ({ orderId, driverId }) => {
      socket.join(orderId)
      console.log(`Driver ${driverId} joined room ${orderId}`)
      io.to(orderId).emit('trip:started', { orderId, driverId })
    })

    // Driver sends location
    socket.on('driver:location', ({ orderId, lat, lng }) => {
      io.to(orderId).emit('location:update', {
        lat, lng,
        updatedAt: new Date()
      })
    })

    // Driver stops sharing
    socket.on('driver:stop', ({ orderId }) => {
      io.to(orderId).emit('trip:ended', { orderId })
      socket.leave(orderId)
    })

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`)
    })
    
    // Manager joins order room to watch
    socket.on('manager:join', ({ orderId }) => {
      socket.join(orderId)
      
    })
    
  })
}

module.exports = setupSocket