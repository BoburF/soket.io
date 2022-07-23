window.addEventListener('load',async function (e) {
    const socket = io()

    const msgField = document.querySelector('.chat__messages');
    const chatForm = document.querySelector('#chat-form');
    const msgInp = document.querySelector('.chat__message');
    const roomName = document.querySelector('.chat__room_name');
    const userList = document.querySelector('.chat_userss');

    const { username, room } = Qs.parse(location.search, {
        ignoreQueryPrefix: true
    })

    const userOptions = {
        name: username,
        room: room
    }

    socket.emit('join', userOptions)

    socket.on('room', (users) => {
        userList.innerHTML = ''
        users.forEach((user) => {
            roomName.innerHTML = user.room
            const li = document.createElement('li');
            li.innerHTML = user.name
            userList.append(li)
        })
    })

    socket.on('bot', (data) => {
        const date = new Date()
        const p = document.createElement('p')
        p.classList.add('notification')
        p.innerHTML = `
        <strong class="username_message">${data.user.name}</strong> ${data.msg} <span class="message_time">${date.toLocaleTimeString()}</span>
        `
        msgField.append(p)
    })

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault()
        let val = msgInp.value
        socket.emit('message', val)
        msgInp.value = ''
    })

    socket.on('message', (data) => {
        msgSend(data)
    })

    socket.on('left', (data) => {
        const date = new Date()
        const p = document.createElement('p')
        p.classList.add('notification')
        p.innerHTML = `
        <strong class="username_message">${data.user.name}</strong> ${data.msg} <span class="message_time">${date.toLocaleTimeString()}</span>
        `
        msgField.append(p)
        userList.innerHTML = ''
        data.users.forEach((user) => {
            roomName.innerHTML = user.room
            const li = document.createElement('li');
            li.innerHTML = user.name
            userList.append(li)
        })
    })

    function msgSend(data) {
        const date = new Date()
        const p = document.createElement('p')
        p.classList.add('message')
        p.innerHTML = `
        <strong class="username_message">${data.user.name}</strong> ${data.msg} <span class="message_time">${date.toLocaleTimeString()}</span>
        `
        msgField.append(p)
    }



});