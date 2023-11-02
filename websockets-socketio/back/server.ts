import http from 'http'
import handler from 'serve-handler'
import {Server} from 'socket.io'
import CircleBuffer from '../circle-buffer'

const PORT = 6969

const msg = new CircleBuffer(10)
const getMsgs = () => Array.from(msg).reverse()

msg.push({
  user: 'Server',
  text: 'Welcome to the chat!',
  time: Date.now(),
})
const server = http.createServer((req, res) => {
  return handler(req, res, {public: './front'})
})

const io = new Server(server, {})
io.on('connection', (socket) => {
  console.log(`connected: ${socket.id}`)

  socket.emit('msg:get', {msg: getMsgs()})

  socket.on('msg:post', (data) => {
    msg.push({
      user: data.user,
      text: data.text,
      time: Date.now(),
    })
    io.emit('msg:get', {msg: getMsgs()})
  })

  socket.on('disconnect', () => {
    console.log(`disconnect: ${socket.id}`)
  })
})

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})

// Bun.serve({
//   port: PORT,
//   // @ts-ignore
//   fetch: async (req, res) => {
//     return handler(req, res, {public: './front'})
//   },
// })
