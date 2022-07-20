const socket = io()
const h1 = document.querySelector('h1');
const form = document.querySelector('form');
const text = document.querySelector('#text');


form.addEventListener('submit', (e) => {
    e.preventDefault()
    const txt = text.value
    const span = document.createElement('span')
        span.innerHTML = txt
        h1.append(span)
    socket.emit('msg', txt)
    socket.on('msg', (msg) => {
        const span = document.createElement('span')
        span.innerHTML = msg
        h1.append(span)
    })
})