// Logging
const log = debug('app:frontend');

// Fit addon
const fitAddon = new FitAddon.FitAddon();

// Terminal initialization
const term = new Terminal();
term.loadAddon(fitAddon);
term.open(document.getElementById('terminal'));

fitAddon.fit();

// Socket.io initialization
const socket = io();

// Two-directional binding
term.onData(data => socket.emit('data', data));
socket.on('data', (data) => {
  term.write(new Uint8Array(data));
});

socket.emit('client', decodeURI(location.hash.slice(1)));