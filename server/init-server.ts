import http from 'http';
import https from 'https';
import fs from 'fs';
import debug from 'debug';
const log = debug('app:init');

export default function(app: any) {
    try { 
        let privateKey  = fs.readFileSync('ssl/server.key', 'utf8');
        let certificate = fs.readFileSync('ssl/server.crt', 'utf8');
        return https.createServer({
            key: privateKey,
            cert: certificate
        }, app);
    } catch(e) {
        log('Failed initialise SSL, reason %o', e);
        return http.createServer(app);
    }
}
