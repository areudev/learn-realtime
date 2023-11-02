import http from 'http'
import handler from 'serve-handler'
import CircleBuffer from '../circle-buffer'

import objToResponse from './obj-to-response'
import generateAcceptValue from './generate-accept-value'
import parseMessage from './parse-message'

let connections: any[] = []
const msg = new CircleBuffer(50)
const getMsgs = () => Array.from(msg).reverse()

msg.push({
  user: 'brian',
  text: 'hi',
  time: Date.now(),
})

// serve static assets
const server = http.createServer((request, response) => {
  // @ts-ignore
  return handler(request, response, {
    public: './front',
  })
})

server.on('upgrade', function (req, socket) {
  if (req.headers['upgrade'] !== 'websocket') {
    socket.end('HTTP/1.1 400 Bad Request')
    return
  }
  const acceptKey = req.headers['sec-websocket-key']
  if (!acceptKey) {
    socket.end('HTTP/1.1 400 Bad Request')
    return
  }

  const acceptValue = generateAcceptValue(acceptKey)

  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
      'Upgrade: websocket\r\n' +
      'Connection: Upgrade\r\n' +
      `Sec-WebSocket-Accept: ${acceptValue}\r\n` +
      '\r\n'
  )

  socket.write(objToResponse({msg: getMsgs()}))

  connections.push(socket)

  socket.on('data', (buffer) => {
    const message = parseMessage(buffer)
    if (message) {
      console.log(message)
      msg.push({
        user: message.user,
        text: message.text,
        time: Date.now(),
      })

      connections.forEach((s) => s.write(objToResponse({msg: getMsgs()})))
    } else if (message === null) {
      socket.end()
    }
  })

  socket.on('end', () => {
    connections = connections.filter((s) => s !== socket)
  })
})

const port = 6969
server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
)
