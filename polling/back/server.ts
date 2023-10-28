import express from 'express'

const app = express()
app.use(express.static('front'))

const port = 6969
app.listen(port)
console.log(`Listening on port ${port}`)
