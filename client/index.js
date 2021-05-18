// Logging
const log = debug('app:frontend');

// Status initialization
let status = null;
const statusEl = document.getElementById('status');
setStatus('Disconnected');

function setStatus(newStatus) {
  log('Setting new status %o', newStatus);
  status = newStatus;
  statusEl.innerText = newStatus;
}

// Terminal initialization
const term = new Terminal();
term.open(document.getElementById('terminal'));

// Socket.io initialization
const socket = io();

// Two-directional binding
term.onData(data => socket.emit('data', data));
socket.on('data', (data) => {
  term.write(data)
});

// Status handling
socket.on('status', setStatus);

// Connecting logic
document.getElementById('form').addEventListener('submit', connect);
function connect(e) {
  e.preventDefault();

  const host = document.getElementById('host').value;
  const port = parseInt(document.getElementById('port').value);
  debug('Connecting to %o %o', host, port);
  socket.emit('client', [host, port]);
}
