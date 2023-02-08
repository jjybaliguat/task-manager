const express = require('express')
const app = express()
require('dotenv').config()
const connectDB = require('./db/connect')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const tasks = require('./routes/task')

app.use(express.static('./public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/api/v1/tasks', tasks)
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const URL = process.env.MONGO_URI

const start = async () => {
    try {
        await connectDB(URL)
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()