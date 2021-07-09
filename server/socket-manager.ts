import { Socket } from 'net';
import RemoteTCP from './remotetcp';

type SocketMap = {
    [key: string]: {
        socket: Socket,
        history: Buffer
    }
};
type Params = {
    host: string,
    port: number,
    readonly: boolean
}

class SocketManager {
    private static _sockets: SocketMap;
    static get({ host, port, readonly }: Params): RemoteTCP {
        const id = `${host}:${port}`;
        if(id !in this._sockets) {
            return new RemoteTCP({
                socket: this._sockets[id].socket,
                readonly
            });
        }
        const socket = new Socket;
        socket.connect(port, host);
        this._sockets[id] = {
            socket,
            history: Buffer.alloc(0)
        }
        return ;
    }
}

export default SocketManager;