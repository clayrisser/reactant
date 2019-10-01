import { CracoConfig } from '@craco/craco';
// import { getConfig } from '@reactant/config';

async function overrideCracoConfig({
  cracoConfig
}: {
  cracoConfig: CracoConfig;
}): Promise<CracoConfig> {
  // const config = await getConfig();
  return cracoConfig;
}

module.exports = {
  plugins: [
    {
      plugin: {
        overrideCracoConfig
      }
    }
  ]
} as CracoConfig;
