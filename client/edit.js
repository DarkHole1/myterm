// Logging
const log = debug('app:frontend');

const terminalId = decodeURI(location.hash.slice(1));
fetch('/terminalsInfo').then(res => res.json()).then(res => {
    log('Get %o', res);
    const terminal = res.filter(({ _id }) => _id == terminalId)[0];
    const byId = document.getElementById.bind(document);
    byId('host').value = terminal.host;
    byId('port').value = terminal.port;
    byId('id').value = terminalId;
    byId('newName').value = terminal.name;
})