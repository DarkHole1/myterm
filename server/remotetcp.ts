import net from 'net';
import debug from 'debug';

const log = debug('app:remote:tcp');

class RemoteTCP {
    private _socket: net.Socket;
    private _readonly: boolean;
    private _id: string;
    private _attached: any;
    private _history: any;

    constructor({ host, port, readonly }: { host: string, port: number, readonly: boolean }) {
        this._id = `${host}:${port}`;
        this._socket = new net.Socket();
        this._socket.connect(port, host, () => {
            log('Connected to %s:%d', host, port);
        });
        this._readonly = readonly;
    }

    attach(socket: any): void {
        this._attached = socket;
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

    history(history: any, length: number, drop: number): void {
        this._history = history;
        log("History enabled %o", history);
        let taken = !this._history['_'+this._id];
        this._history['_'+this._id] = true;
        if(this._id in history) {
            log("Has history, writing to attached");
            this._attached.emit('data', history[this._id]);
        } else {
            log("Has no history ;(");
            history[this._id] = Buffer.alloc(0);
        }
        this._socket.on('data', data => {
            if(!taken) {
                taken = !this._history['_'+this._id];
                this._history['_'+this._id] = true;
                if(!taken) return;
            }
            history[this._id] = Buffer.concat([history[this._id], data]);
            if(history[this._id].length > length) {
                history[this._id] = history[this._id].slice(drop);
            }
        })
    }

    close(): void {
        this._history['_'+this._id] = false;
        this._socket.destroy();
    }
}

export default RemoteTCP;