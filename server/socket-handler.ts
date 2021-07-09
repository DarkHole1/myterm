import RemoteTCP from './remotetcp';
import SocketManager from './socket-manager';
import User from './user';
import Credentials from './credentials';
import Config from './config';
import debug from 'debug';
const log = debug('app:socket');

let history: any = {};

export default function(io: any, config: Config): void {
    io.on('connection', async (socket: any) => {
        log('Client connected');
        let client: RemoteTCP = null;
      
        const user = await User.findByCredentials(
            Credentials.fromBasicAuth(socket.handshake.headers.authorization)
        );
      
        socket.on('client', (name: string) => {
            if(client != null) {
                log('Trying to reconnect, ignoring');
                return;
            }
            log('Connecting to remote');
            const { host, port, readonly } = user.terminals.filter((el: any) => el.name == name)[0];
      
            let history;
            [client, history] = SocketManager.get({ host, port, readonly, config });
            client.attach(socket);
            log("Sessions %o", config.recordSessions);
            if(config.recordSessions) {
                socket.emit('data', history);
            }
        });
      })
}