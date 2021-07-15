// Logging
const log = debug('app:frontend');

const terminalName = decodeURI(location.hash.slice(1));
fetch('/terminalsInfo').then(res => res.json()).then(res => {
    log('Get %o', res);
    const terminal = res.filter(({ name }) => name == terminalName)[0];
    const byId = document.getElementById.bind(document);
    byId('host').value = terminal.host;
    byId('port').value = terminal.port;
    byId('name').value = terminalName;
    byId('newName').value = terminalName;
})