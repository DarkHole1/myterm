const net = require('net');
const debug = require('debug')('app:socket')

class TCPSocket {
  constructor(host, port, cb) {
    this._socket = new net.Socket();
    this._socket.connect(port, host, cb);
    debug('Socket created');
  }

  onData(cb) {
    this._socket.on('data', (data) => cb(data.toString()));
  }

  onError(cb) {
    this._socket.on('error', cb);
  }

  onClose(cb) {
    this._socket.on('close', cb);
  }

  write(data) {
    this._socket.write(data);
  }

  close() {
    this._socket.destroy();
  }
}

module.exports = TCPSocket;
