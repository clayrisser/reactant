import ConfigPaths from '../../src/config/paths';

describe('ConfigPaths.paths', () => {
  it('it resolves config paths', async () => {
    const configPaths = new ConfigPaths({
      platformName: 'some-platform',
      paths: {
        hello: 'world',
        world: 'hello/{hello}',
        howdy: 'hello/{world}',
        texas: 'howdy/{hello}'
      }
    });
    expect(configPaths.paths.hello).toBe('./world');
    expect(configPaths.paths.world).toBe('./hello/world');
    expect(configPaths.paths.howdy).toBe('./hello/hello/world');
    expect(configPaths.paths.texas).toBe('./howdy/world');
  });
  it('it throws error for cyclic config paths', async () => {
    try {
      new ConfigPaths({
        platformName: 'some-platform',
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
