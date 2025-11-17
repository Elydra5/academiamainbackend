const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')

const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')
const studentRouter = require('./routes/student')
const attendanceRouter = require('./routes/attendance')
const billingRouter = require('./routes/billing')
const enrollmentRouter = require('./routes/enrollments')
const groupsRouter = require('./routes/groups')
const userRouter = require('./routes/users')

dotenv.config()

const app = express()
const port = 3000

var corsOptions = {
    origin: 'http://academia.tokyohost.eu',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyparser.json())

app.get('/', (req, res) => {
    res.send('Version 1.0!')
})

app.use('/api/', authRouter)
app.use('/admin/',adminRouter)
app.use('/students/',studentRouter)
app.use('/enrollment/',enrollmentRouter)
app.use('/groups/',groupsRouter)
app.use('/users/',userRouter)
app.use('/billing/',billingRouter)
app.use('/attendance/',attendanceRouter)

app.listen(port, () => {
    console.log(`Academia Main backend running on port ${port}`)
})
