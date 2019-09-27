import { Config } from './config';
import { getReactantPlatforms, Platforms } from './platform';

export type Action = () => {};

export interface Actions {
  [key: string]: Action;
}

export async function getActionNames(config: Config): Promise<Set<string>> {
  let actionNames: string[] = [];
  const platforms: Platforms = await getReactantPlatforms(config);
  Object.values(platforms).forEach(platform => {
    actionNames = {
      ...actionNames,
      ...Object.keys(platform.actions)
    };
  });
  return new Set(actionNames);
}
