import net from 'net';
import debug from 'debug';

const log = debug('app:remote:tcp');

type Params = { 
    socket?: net.Socket,
    host?: string, 
    port?: number, 
    readonly: boolean
}

class RemoteTCP {
    private _socket: net.Socket;
    private _readonly: boolean;

    constructor({ host, socket, port, readonly }: Params) {
        if(socket) {
            this._socket = socket;
        } else {
            this._socket = new net.Socket();
            this._socket.connect(port, host, () => {
                log('Connected to %s:%d', host, port);
            });
        }
        this._readonly = readonly;
    }

    attach(socket: any): void {
        this._socket.on('data', (data) => {
            log('Data received from socket, sending to client');
            socket.emit('data', data);
        })

        if(!this._readonly) {
            socket.on('data', (data: any) => {
                log('Data received from client, sending to socket');
                this._socket.write(data);
            })
        }

        this._socket.on('close', () => {
            this.close();
        })
    }

    close(): void {
        this._socket.destroy();
    }
}

export default RemoteTCP;