import wildcard from 'socketio-wildcard'
import SocketIO from 'socket.io'

const { log } = console

let io
let mSocket

export default server => {
  if (io) return io
  io = SocketIO.listen(server)
  io.use(wildcard())
  io.on('connection', socket => {
    mSocket = socket
    socket.emit('connection')
    log(`☕ Socket: An user connected.`.green)
    socket.on('*', event => {
      const name = event.data ? event.data[0] : ''
      const data = event.data ? event.data[1] || {} : {}
      const { room } = data
      delete data.room
      return room ? socket.to(room).emit(name, data) : socket.broadcast.emit(name, data)
    })
    socket.on('join', room => {
      socket.join(room)
    })
    socket.on('leave', room => {
      socket.leave(room)
    })
  })
}
