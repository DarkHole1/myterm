import { Socket } from 'net';
import RemoteTCP from './remotetcp';
import Config from './config';
import debug from 'debug';

const log = debug('app:socket-manager');

type SocketMap = {
    [key: string]: {
        socket: Socket,
        history: Buffer
    }
};
type GetParams = {
    host: string,
    port: number,
    readonly: boolean,
    config: Config
}

type RestartParams = {
    host: string,
    port: number,
    config: Config
}

class SocketManager {
    private static _sockets: SocketMap = {};
    static get({ host, port, readonly, config }: GetParams): [RemoteTCP, Buffer] {
        const id = `${host}:${port}`;
        log('Data %o', this._sockets);
        if(!(id in this._sockets)) {
            log('Creating socket %s', id);
            const socket = new Socket;
            socket.connect(port, host);
            this._sockets[id] = {
                socket,
                history: Buffer.alloc(0)
            }
            if(config.recordSessions) {
                socket.on('data', data => {
                    let { history } = this._sockets[id];
                    history = Buffer.concat([history, data]);
                    if(history.length > config.sessionBytesCount) {
                        history = history.slice(config.dropBytes);
                    }
                    this._sockets[id].history = history;
                });
            }

            socket.on('error', err => {
                log("Error in socket: %o", err);
                delete this._sockets[id];
            });
        }
        return [
            new RemoteTCP({
                socket: this._sockets[id].socket,
                readonly
            }),
            this._sockets[id].history
        ];
    }

    static restart({ host, port, config }: RestartParams): void {
        const id = `${host}:${port}`;
        if(!(id in this._sockets)) {
            return;
        }
        this._sockets[id].socket.destroy();
        
        const socket = new Socket;
        socket.connect(port, host);

        this._sockets[id].socket = socket;
        if(config.recordSessions) {
            socket.on('data', data => {
                let { history } = this._sockets[id];
                history = Buffer.concat([history, data]);
                if(history.length > config.sessionBytesCount) {
                    history = history.slice(config.dropBytes);
                }
                this._sockets[id].history = history;
            });
        }

        socket.on('error', err => {
            log("Error in socket: %o", err);
            delete this._sockets[id];
        });
    }
}

export default SocketManager;