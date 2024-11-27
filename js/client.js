const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

var audio = new Audio('ring.mp3')

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position); // Use dynamic position class
    messageContainer.appendChild(messageElement);
    if(position=='left'){
        audio.play()
    }
};

const name = prompt("What is your name?") || "Anonymous";
socket.emit('new-user-joined', name);

socket.on("user-joined", name => {
    append(`${name} joined the chat`, 'right');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name}: left the chat`, 'left');
});