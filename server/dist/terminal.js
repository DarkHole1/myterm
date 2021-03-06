// Logging
const log = debug('app:frontend');

// Fit addon
const fitAddon = new FitAddon.FitAddon();

// Terminal initialization
const term = new Terminal();
term.loadAddon(fitAddon);
term.open(document.getElementById('terminal'));

fitAddon.fit();
window.addEventListener('resize', e => {
  fitAddon.fit();
})

const terminalId = decodeURI(location.hash.slice(1));

// Socket.io initialization
const socket = io({
  query: {
    terminal: terminalId
  }
});

// Two-directional binding
term.onData(data => socket.emit('data', data));
socket.on('data', (data) => {
  term.write(new Uint8Array(data));
});

// Getting terminal name
fetch(`/api/terminal.get?id=${terminalId}`).then(res => res.json()).then(res => {
  document.title = res.name;
})