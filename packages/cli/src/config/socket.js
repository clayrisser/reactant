import CircularJSON from 'circular-json';
import ipc from 'node-ipc';
import { sleep } from 'deasync';
import { loadConfig } from '.';

export default class Socket {
  constructor(socketConfig) {
    ipc.config = {
      ...ipc.config,
      id: 'server',
      retry: 1000,
      silent: true,
      ...socketConfig
    };
  }

  handleConfigRequest(data, socket) {
    const config = loadConfig({});
    ipc.server.emit(socket, 'config.res', {
      config: JSON.parse(CircularJSON.stringify(config))
    });
  }

  handleServe() {
    ipc.server.on('config.req', this.handleConfigRequest);
  }

  async start() {
    return new Promise(resolve => {
      ipc.serve(() => {
        this.handleServe();
        resolve();
      });
      ipc.server.start();
    });
  }

  stop() {
    return ipc.server.stop();
  }
}

function socketGetConfigAsync(socketConfig) {
  ipc.config = {
    ...ipc.config,
    id: 'client',
    retry: 1000,
    silent: true,
    ...socketConfig
  };
  return new Promise(resolve => {
    try {
      return ipc.connectTo('server', () => {
        ipc.of.server.on('config.res', res => {
          return resolve(res.config);
        });
        ipc.of.server.emit('config.req');
      });
    } catch (err) {
      return resolve(null);
    }
  });
}

export function socketGetConfig(...args) {
  let config = null;
  socketGetConfigAsync(...args).then(loadedConfig => {
    config = loadedConfig;
  });
  while (!config) sleep(100);
  return config;
}
