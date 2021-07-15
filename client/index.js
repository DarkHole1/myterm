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
    link.innerText = el.name + ' ';
    link.href = '/terminal.html#' + el.name;
    link.target = '_blank';

    if(el.readonly) {
      // <span class="badge rounded-pill bg-primary">read only</span>
      const badge = document.createElement('span');
      badge.innerText = 'read only';
      badge.classList.add('badge', 'rounded-pill', 'bg-primary');

      link.appendChild(badge);
    }

    const li = document.createElement('li');
    li.appendChild(link);

    // Style
    link.classList.add('nav-link', 'active');
    li.classList.add('nav-item');

    terminalsEl.appendChild(li);
  }
  spinnerEl.style.display = 'none';
});
