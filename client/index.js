// Logging
const log = debug('app:frontend');

const terminalsEl = document.getElementById('terminals');
const spinnerEl = document.getElementById('spinner');
// Fetch terminal list
fetch('/terminals').then(res => res.json()).then(res => {
  log('Get %o', res);
  terminalsEl.innerHTML = '';
  for(const el of res) {
    const link = document.createElement('a');
    link.innerText = el + ' ';
    link.href = '/terminal.html#' + el;
    link.target = '_blank';

    const li = document.createElement('li');
    li.appendChild(link);

    // Style
    link.classList.add('nav-link', 'active');
    li.classList.add('nav-item');

    terminalsEl.appendChild(li);
  }
  spinnerEl.style.display = 'none';
});
