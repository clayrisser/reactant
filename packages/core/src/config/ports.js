import _ from 'lodash';
import detectPort from 'detect-port';
import { sleep } from 'deasync';

export default class ConfigPorts {
  occupiedPorts = [];

  basePort = null;

  ports = null;

  constructor(config) {
    this.config = config;
    this.setBasePort();
    this.setPorts();
  }

  setBasePort() {
    this.getBasePort().then(basePort => {
      this.basePort = basePort;
    });
    while (!this.basePort) sleep(100);
    return true;
  }

  setPorts() {
    this.getPorts().then(ports => {
      this.ports = ports;
    });
    while (!this.ports) sleep(100);
    return true;
  }

  async getBasePort() {
    return this.resolve(this.config.port);
  }

  async getPorts() {
    const ports = {};
    for (const key in this.config.ports) {
      const port = this.config.ports[key];
      ports[key] =
        port ||
        (await this.resolve(
          (this.basePort || this.config.port) + _.keys(ports).length
        ));
    }
    return ports;
  }

  async resolve(port = 6001) {
    port = await detectPort(port);
    if (_.includes(this.occupiedPorts, port)) return this.resolve(++port);
    this.occupiedPorts.push(port);
    return port;
  }
}
