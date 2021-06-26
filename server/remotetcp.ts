import net from 'net';

class RemoteTCP {
    private _socket: net.Socket;
    private _readonly: boolean;

    constructor({ host, port, readonly }: { host: string, port: number, readonly: boolean }) {
        this._socket = new net.Socket();
        this._socket.connect(port, host);
        this._readonly = readonly;
    }

    attach(socket: any): void {
        this._socket.on('data', (data) => {
            socket.emit('data', data);
        })

        if(!this._readonly) {
            socket.on('data', (data: any) => {
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