const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

io.on('connection', (socket) => {
    socket.on('msg', (msg) => {
        socket.broadcast.emit('msg', msg)
    })
    console.log('WS connecting...')
})

server.listen(3000, () => {
    console.log('Server working on', 3000, '...')
})