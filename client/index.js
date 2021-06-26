// Logging
const log = debug('app:frontend');

const terminalsEl = document.getElementById('terminals');
// Fetch terminal list
fetch('/terminals').then(res => res.json()).then(res => {
  log('Get %o', res);
  terminalsEl.innerHTML = '';
  for(const el of res) {
    const link = document.createElement('a');
    link.innerText = el;
    link.href = '/terminal#' + el;
    terminalsEl.appendChild(link);
  }
});
