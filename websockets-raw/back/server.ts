import http from 'http'
import handler from 'serve-handler'
import CircleBuffer from '../circle-buffer'

import objToResponse from './obj-to-response'
import generateAcceptValue from './generate-accept-value'
import parseMessage from './parse-message'

let connections = []
const msg = new CircleBuffer(50)
const getMsgs = () => Array.from(msg).reverse()

msg.push({
  user: 'brian',
  text: 'hi',
  time: Date.now(),
})

const server = http.createServer((request, response) => {
  // @ts-ignore
  return handler(request, response, {
    public: './front',
  })
})

const port = process.env.PORT || 6969
server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
)
