import net from 'net';
import debug from 'debug';

const log = debug('app:remote:tcp');

type Params = { socket: net.Socket, readonly: boolean } | { host: string, port: number, readonly: boolean }

class RemoteTCP {
    private _socket: net.Socket;
    private _readonly: boolean;

    constructor(params: Params) {
        if ('socket' in params) {
            this._socket = params.socket;
        } else {
            this._socket = new net.Socket();
            this._socket.connect(params.port, params.host, () => {
                log('Connected to %s:%d', params.host, params.port);
            });
        }
        this._readonly = params.readonly;
    }

    attach(socket: any): void {
        this._socket.on('data', (data) => {
            log('Data received from socket, sending to client');
            socket.emit('data', data);
        })

        if (!this._readonly) {
            socket.on('data', (data: any) => {
                log('Data received from client, sending to socket');
                this._socket.write(data);
            })
        }

        this._socket.on('close', () => {
            this.close();
        })
    }

    send(data: string | Uint8Array) {
        this._socket.write(data)
    }

    close(): void {
        this._socket.destroy();
    }
}

export default RemoteTCP;