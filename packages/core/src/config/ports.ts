import deasync from 'deasync';
import detectPort from 'detect-port';
import { Config, Ports } from '../types';

const detectPortSync = deasync(detectPort);

export default class ConfigPorts {
  occupiedPorts: number[] = [];
  private _basePort: number;
  private _ports: Ports;

  constructor(private config: Config) {}

  get basePort(): number {
    if (this._basePort) return this._basePort;
    this._basePort = this.resolve(this.config.port);
    return this._basePort;
  }

  get ports(): Ports {
    if (this._ports) return this._ports;
    this._ports = Object.entries(this.config.ports || {}).reduce(
      (ports: Ports, [key, port]: [string, number | boolean | null]) => {
        ports[key] = this.resolve(
          typeof port === 'number' ? port : this.basePort + 1
        );
        return ports;
      },
      {}
    );
    return this._ports;
  }

  resolve(port = 6001): number {
    port = detectPortSync(port);
    if (this.occupiedPorts.includes(port)) return this.resolve(++port);
    this.occupiedPorts.push(port);
    return port;
  }
}
