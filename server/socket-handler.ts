import SocketManager from './socket-manager';
import { UserModel } from './models/user';
import Credentials from './credentials';
import Config from './config';
import debug from 'debug';
import { isDocument } from '@typegoose/typegoose';
const log = debug('app:socket');

let history: any = {};

export default function (io: any, config: Config): void {
    io.on('connection', async (socket: any) => {
        log('Client connected');
        log('Terminal %o', socket.handshake.query.terminal);

        const cookies: any = Object.fromEntries(socket.handshake.headers.cookie.split('; ').map((e: any) => e.split('=').map((e: string) => decodeURIComponent(e))));
        log('Cookies: %o', cookies);
        const user = await UserModel.findByCredentials(
            // Credentials.fromBasicAuth(socket.handshake.headers.authorization)
            Credentials.fromCookies(cookies)
        );

        if(!user) {
            socket.close()
            return
        }

        log('Connecting to remote');
        const terminalId = socket.handshake.query.terminal
        const terminalInfo = await user.getTerminalById(terminalId)
        if(!terminalInfo) {
            socket.close()
            return
        }

        const { terminal, readonly } = terminalInfo
        const { port, server } = isDocument(terminal) ? terminal : { port: 0, server: { host: '' } }
        const host = isDocument(server) ? server.host : ''
        log('Rights: %o', {
            port, host, readonly
        })

        let [client, history] = SocketManager.get({ host, port, readonly, config });
        client.attach(socket);
        log("Sessions %o", config.recordSessions);
        if (config.recordSessions) {
            socket.emit('data', history);
        }
    })
}