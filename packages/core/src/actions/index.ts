import { Context, Logger, PlatformAction, PluginAction } from '@reactant/types';
import { PlatformApi } from '@reactant/platform';
import { PluginApi } from '@reactant/plugin';
import { mapSeries } from '@reactant/helpers';
import { setContext } from '@reactant/context';
import build from './build';
import clean from './clean';
import install from './install';
import start from './start';
import status from './status';
import test from './test';
import { preProcess, postProcess } from '../hooks';

export { build, clean, install, start, status, test };

export default async function runActions(
  context: Context,
  logger: Logger,
  pluginActions: PluginAction[],
  platformActions: PlatformAction[] = []
) {
  await preProcess(context, logger);
  if (pluginActions.length) {
    const pluginApi = new PluginApi(context, logger);
    await mapSeries(pluginActions, async (pluginAction: PluginAction) => {
      const newContext = await pluginAction(context, logger, pluginApi);
      if (newContext === false) postProcess(context, logger);
      if (
        typeof newContext === 'object' &&
        newContext?.masterPid === process.pid
      ) {
        context = setContext(newContext);
      }
    });
  }
  if (platformActions?.length) {
    const platformApi = new PlatformApi(context, logger);
    await mapSeries(platformActions, async (platformAction: PlatformAction) => {
      const newContext = await platformAction(context, logger, platformApi);
      if (newContext === false) postProcess(context, logger);
      if (
        typeof newContext === 'object' &&
        newContext?.masterPid === process.pid
      ) {
        context = setContext(newContext);
      }
    });
  }
}
