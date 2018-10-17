import path from 'path';
import pkgDir from 'pkg-dir';
import ConfigPaths from '../../src/config/paths';

describe('ConfigPaths.paths', () => {
  it('it resolves config paths', async () => {
    const configPaths = new ConfigPaths({
      platform: 'some-platform',
      paths: {
        hello: 'world',
        world: 'hello/{hello}'
      }
    });
    expect(configPaths.paths.hello).toBe(
      path.resolve(pkgDir.sync(process.cwd()), 'world')
    );
    expect(configPaths.paths.world).toBe(
      path.resolve(pkgDir.sync(process.cwd()), 'hello/world')
    );
  });
  it('it throws error for cyclic config paths', async () => {
    try {
      new ConfigPaths({
        platform: 'some-platform',
        paths: {
          hello: '{world}',
          world: '{hello}'
        }
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe(
        "cyclical path variables detected 'hello', 'world'"
      );
    }
  });
});