import mergeConfiguration from 'merge-configuration';
import { CracoConfig } from '@craco/craco';
import { getConfig } from '@reactant/config';

function overrideCracoConfig({
  cracoConfig
}: {
  cracoConfig: CracoConfig;
}): CracoConfig {
  const config = getConfig();
  return mergeConfiguration<CracoConfig>(cracoConfig, config.craco);
}

module.exports = {
  reactScriptsVersion: 'expo',
  plugins: [
    {
      plugin: {
        overrideCracoConfig
      }
    }
  ]
} as CracoConfig;
