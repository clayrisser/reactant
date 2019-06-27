import { createServer } from 'http';
import { createConfig } from '../../src/config';
import ConfigPorts from '../../src/config/ports';

describe('new ConfigPorts(config).basePort', () => {
  const config = createConfig();
  const { basePort } = new ConfigPorts(config);
  it('should create basePort', async () => {
    expect(basePort).toEqual(basePort);
  });
});

describe('new ConfigPorts(config).ports', () => {
  const config = createConfig(
    null,
    {},
    {
      ports: {
        http: true,
        https: 4444,
        ssh: true
      }
    }
  );
  it('should create ports', async () => {
    const { ports } = new ConfigPorts(config);
    expect(ports).toEqual({
      http: 6002,
      https: 4444,
      ssh: 6003
    });
  });
  it('should skip running ports', async () => {
    const freePort = await occupyPort(6003);
    const { ports } = new ConfigPorts(config);
    await freePort();
    expect(ports).toEqual({
      http: 6002,
      https: 4444,
      ssh: 6004
    });
  });
});

async function occupyPort(port: number): Promise<() => Promise<null>> {
  const sockets = {};
  const server = createServer(f => f);
  const freePort = (): Promise<null> => {
    return new Promise((resolve, reject) => {
      server.close((err: Error) => {
        if (err) return reject(err);
        return resolve(null);
      });
      Object.entries(sockets).forEach(
        ([key, socket]: [string, { destroy: () => {} }]) => {
          socket.destroy();
          delete sockets[key];
        }
      );
    });
  };
  return new Promise((resolve, reject) => {
    let nextSocketId = 0;
    server.on('connection', socket => {
      const socketId = nextSocketId++;
      sockets[socketId] = socket;
      socket.on('close', (err: Error) => {
        if (err) return reject(err);
        delete sockets[socketId];
        return null;
      });
    });
    // @ts-ignore
    return server.listen(port, (err: Error) => {
      if (err) return reject(err);
      return resolve(freePort);
    });
  });
}
