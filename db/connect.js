const mongoose = require('mongoose')


const connnectDB = (url) => {
    return mongoose.connect(url)
}

module.exports = connnectDB