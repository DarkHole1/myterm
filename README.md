myterm
========
This is project providing web terminal interface over tcp sockets.

# Building and running
First, install dependencies: `yarn install`. Then run `node server/server.js`.

For test, you can use `socat`. Example: `socat tcp4-listen:3001,reuseaddr,fork exec:bash,pty,stderr`. This start bash on the port 3001.
