import express from 'express'
import morgan from 'morgan'
import CircleBuffer from '../lib/circle-buffer'

const msg = new CircleBuffer(50)
const getMsg = () => {
  return Array.from(msg).reverse()
}

msg.push({
  user: 'hutt',
  text: 'Hi!',
  time: Date.now(),
})
msg.push({
  user: 'brian',
  text: 'brian is dumb',
  time: Date.now(),
})

const app = express()
app.use(morgan('short'))
app.use(express.json())
app.use(express.static('front'))

app.get('/poll', (req, res) => {
  res.json({
    messages: getMsg(),
  })
})

const port = 6969
app.listen(port)

console.log(`Listening on port ${port}`)
