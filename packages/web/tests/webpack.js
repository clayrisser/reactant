import { createConfig } from '@reactant/cli/config';
import { createWebpackConfig } from '../src/webpack';

describe('createWebpackConfig(config, webpackConfig)', () => {
  it('should create webpack config', async () => {
    const config = createConfig({});
    const webpackConfig = createWebpackConfig(config, {});
    expect(webpackConfig).toMatchObject({
      target: 'web'
    });
  });
});
