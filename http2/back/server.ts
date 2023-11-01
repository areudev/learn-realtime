// openssl req -new -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
// openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt

import http2 from 'node:http2'
import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'node:url'
import handler from 'serve-handler'
import CircleBuffer from '../circle-buffer/circle-buffer.ts'

let connections: http2.ServerHttp2Stream[] = []

const msg = new CircleBuffer(10)
const getMsgs = () => Array.from(msg).reverse()

msg.push({
  user: 'Server',
  text: 'Welcome to the chat!',
  time: Date.now(),
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = http2.createSecureServer({
  cert: fs.readFileSync(path.join(__dirname, '/../server.crt')),
  key: fs.readFileSync(path.join(__dirname, '/../key.pem')),
})

server.on('stream', (stream, headers) => {
  const path = headers[':path']
  const method = headers[':method']

  if (path === '/msgs' && method === 'GET') {
    console.log('connected a stream' + stream.id)
    stream.respond({
      'content-type': 'text/plain; charset=utf-8',
      ':status': 200,
    })
    stream.write(JSON.stringify({msg: getMsgs()}))
    connections.push(stream)

    stream.on('close', () => {
      console.log('closed stream ' + stream.id)
      connections = connections.filter((s) => s !== stream)
      console.log(connections.length)
    })
  }
})

server.on('request', async (req, res) => {
  const path = req.headers[':path']
  const method = req.headers[':method']
  const httpVersion = req.httpVersion
  console.log({path, method, httpVersion})

  if (path !== '/msgs') {
    // @ts-ignore
    return handler(req, res, {
      public: './front',
    })
  } else if (method === 'POST') {
    const buffers = []
    for await (const chunk of req) {
      buffers.push(chunk)
    }
    const data = Buffer.concat(buffers).toString()
    const {user, text} = JSON.parse(data)

    msg.push({
      user,
      text,
      time: Date.now(),
    })

    res.end()

    connections.forEach((stream) => {
      stream.write(JSON.stringify({msg: getMsgs()}))
    })
  }
})

const port = 6969
server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
