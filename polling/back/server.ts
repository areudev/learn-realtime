import express from 'express'
import morgan from 'morgan'

const app = express()
app.use(morgan('short'))
app.use(express.json())

app.use(express.static('front'))

const port = 6969
app.listen(port)

console.log(`Listening on port ${port}`)
