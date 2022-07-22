const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    socketId: {
        type: String,
        required: true,
        unique: true
    }
})


module.exports = model('users', userSchema)