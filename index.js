const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const User = require('./model/Users')
const path = require('path')

require('dotenv').config()
require('./helper/db')()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'))
})

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})



async function getCurrentUser(socketId) {
    const user = await User.findOne({socketId : socketId})
    return user
}
async function leftUser(id) {
    const user = await User.findOneAndDelete({socketId : id})
    return user
}

io.on('connection', (socket) => {
    console.log('New WS connected...');

    socket.on('join', async (options) => {
        const isUser = await User.findOne({name: options.name})
        if(isUser){
            options.name = options.name + '2'
        }
        const user = new User({
            name: options.name,
            room: options.room,
            socketId: socket.id
        })
        await user.save()
        socket.join(user.room)
        const usersList = await User.find({room : user.room})
        io.to(user.room).emit('room', usersList)

        socket.emit('bot', {
            user: { name: 'bot' }, msg: 'Welcome to the chat'
        }) // Salomlashish

        socket.broadcast.to(user.room).emit('bot', {
            user: { name: user.name }, msg: 'Joined the chat'
        }
        ) // faqat user o'ziga ko'rinmaydi
    })

    socket.on('message',async (msg) => {
        const user = await getCurrentUser(socket.id)
        io.to(user.room).emit('message', { user, msg })
    })

    socket.on('disconnect',async () => {
        const user = await leftUser(socket.id)
        const users = await User.find()
        socket.broadcast.to(user.room).emit('left', { user,users, msg: 'Left the chat ' })
    })

})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server working on port ${PORT}`))