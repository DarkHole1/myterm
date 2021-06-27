// Logging
const log = debug('app:frontend');

// Terminal initialization
const term = new Terminal();
term.open(document.getElementById('terminal'));

// Socket.io initialization
const socket = io();

// Two-directional binding
term.onData(data => socket.emit('data', data));
socket.on('data', (data) => {
  term.write(new Uint8Array(data));
});

socket.emit('client', decodeURI(location.hash.slice(1)));