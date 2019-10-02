import detectPort from 'detect-port';
import { Ports } from '@reactant/types';
import { reduce } from 'bluebird';

export class CalculatePorts {
  occupiedPorts: Set<number> = new Set();

  private basePort: number;

  private _basePort: number;

  private _ports: Ports;

  constructor(private ports: Ports = {}, basePort?: number) {
    if (typeof basePort === 'number') {
      this.basePort = basePort;
    } else {
      const keys = Object.keys(ports);
      const basePort = keys.length ? ports[keys[0]] : null;
      this.basePort = typeof basePort === 'number' ? basePort : 6001;
    }
  }

  async getBasePort(): Promise<number> {
    if (this._basePort) return this._basePort;
    this._basePort = await this.resolvePort(this.basePort);
    return this._basePort;
  }

  async getPorts(): Promise<Ports> {
    if (this._ports) return this._ports;
    this._ports = await reduce(
      Object.entries(this.ports),
      async (ports: Ports, [key, port]: [string, number | boolean | null]) => {
        if (port === false) return ports;
        ports[key] = await this.resolvePort(
          typeof port === 'number' ? port : (await this.getBasePort()) + 1
        );
        return ports;
      },
      {}
    );
    return this._ports;
  }

  async resolvePort(port: number): Promise<number> {
    port = await detectPort(port);
    if (this.occupiedPorts.has(port)) return this.resolvePort(++port);
    this.occupiedPorts.add(port);
    return port;
  }
}
