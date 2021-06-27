import path from 'path';
import express from 'express';
import debug from 'debug';

const router = express.Router();
const log = debug('app:static');

const STATIC = {
  '/xterm.css': '../node_modules/xterm/css/xterm.css',
  '/xterm.js': '../node_modules/xterm/lib/xterm.js',
  '/xterm-addon-fit.js': '../node_modules/xterm-addon-fit/lib/xterm-addon-fit.js'
}

router.use(express.static(path.join(__dirname, '../client')));

for(let [url, filepath] of Object.entries(STATIC)) {
  router.get(url, (req, res) => {
    log('GET %o %o', url, filepath);
    res.sendFile(path.join(__dirname, filepath));
  })
}

export default router;
