import createLocalDomainSocket from 'create-local-domain-socket';
import http from 'http';
import { log } from '@reactant/base';

const server = http.createServer((req, res) => {
  const body = http.STATUS_CODES[426];
  res.writeHead(426, {
    'Content-Length': body.length,
    'Content-Type': 'text/plain'
  });
  res.end(body);
});

createLocalDomainSocket(server, '/var/run/reactant.sock', err => {
  if (err) {
    log.error(err);
  } else {
    log.debug('socket server started');
  }
});
