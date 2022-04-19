import RemoteTCP from './remotetcp';
import SocketManager from './socket-manager';
import User, { TerminalInfo } from './user';
import Credentials from './credentials';
import Config from './config';
import debug from 'debug';
const log = debug('app:socket');

let history: any = {};

export default function (io: any, config: Config): void {
    io.on('connection', async (socket: any) => {
        log('Client connected');
        log('Terminal %o', socket.handshake.query.terminal);

        const cookies: any = Object.fromEntries(socket.handshake.headers.cookie.split('; ').map((e: any) => e.split('=')));
        log('Cookies: %o', cookies);
        const user = await User.findByCredentials(
            // Credentials.fromBasicAuth(socket.handshake.headers.authorization)
            Credentials.fromCookies(cookies)
        );

        log('Connecting to remote');
        const terminalId = socket.handshake.query.terminal;
        const { terminal: { host, port }, readonly } = await user.getTerminalById(terminalId);

        let [client, history] = SocketManager.get({ host, port, readonly, config });
        client.attach(socket);
        log("Sessions %o", config.recordSessions);
        if (config.recordSessions) {
            socket.emit('data', history);
        }
    })
}