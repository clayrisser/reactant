import createConfig from '../../src/config/createConfig';

describe('createConfig({args})', () => {
  it('should create config', async () => {
    const config = createConfig({
      options: { platform: 'some-platform' },
      action: 'start'
    });
    expect(config).toMatchObject({
      action: 'start',
      host: 'localhost',
      platform: 'some-platform',
      title: 'Reactant'
    });
  });
});
