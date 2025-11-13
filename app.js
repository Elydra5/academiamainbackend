const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/auth')

dotenv.config()

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Version 1.0!')
})

app.use('/api', authRoutes)

app.listen(port, () => {
    console.log(`Academia Main backend running on port ${port}`)
})
