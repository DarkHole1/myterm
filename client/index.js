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

const terminalsEl = document.getElementById('terminals');
// Fetch terminal list
fetch('/terminals').then(res => res.json()).then(res => {
  log('Get %o', res);
  terminalsEl.innerHTML = '';
  for(const [id, el] of Object.entries(res)) {
    const li = document.createElement('li');
    li.innerText = el;
    li.addEventListener('click', () => {
      socket.emit('client', [id]);
    });
    terminalsEl.appendChild(li);
  }
});
