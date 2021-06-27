import RemoteTCP from './remotetcp';
import User from './user';
import Credentials from './credentials';
import debug from 'debug';
const log = debug('app:socket');

export default function(io: any): void {
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
            const { host, port, readonly }: { 
                    host: string, port: number, readonly: boolean
                } = user.terminals.filter((el: any) => el.name == name)[0];
      
            client = new RemoteTCP({ host, port, readonly });
            client.attach(socket);
        });
      })
}