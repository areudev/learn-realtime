import express from 'express'
import morgan from 'morgan'
import CircleBuffer from '../circle-buffer/circle-buffer.ts'

const msg = new CircleBuffer(10)
const getMsg = () => {
  return Array.from(msg).reverse()
}

msg.push({
  user: 'hutt',
  text: 'Hi!',
  time: Date.now(),
})
msg.push({
  user: 'lime',
  text: 'lime is dumb',
  time: Date.now(),
})

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('front'))

app.get('/poll', (req, res) => {
  // res.status(Math.random() > 0.5 ? 200 : 500).json({
  res.status(200).json({
    messages: getMsg(),
  })
})

app.post('/poll', (req, res) => {
  const {user, text} = req.body
  msg.push({
    user,
    text,
    time: Date.now(),
  })

  res.json({status: 'ok'})
})

const port = 6969
app.listen(port)

console.log(`Listening on port ${port}`)
