const path = require('path');
const express = require('express');
const router = express.Router();
const log = require('debug')('app:static');

const STATIC = {
  '/': '../client/index.html',
  '/index.js': '../client/index.js',
  '/debug.js': '../client/debug.js',
  '/xterm.css': '../node_modules/xterm/css/xterm.css',
  '/xterm.js': '../node_modules/xterm/lib/xterm.js',
}

for(let [url, filepath] of Object.entries(STATIC)) {
  router.get(url, (req, res) => {
    log('GET %o %o', url, filepath);
    res.sendFile(path.join(__dirname, filepath));
  })
}

module.exports = router;
