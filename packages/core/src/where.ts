import execa from 'execa';

export default async function where(
  program: string,
  unixCommand?: string,
  PATH = process.env.PATH
): Promise<string | null> {
  if (!unixCommand) {
    const splitChar = process.platform === 'win32' ? ';' : ':';
    process.env.PATH = process.env.PATH?.split(splitChar)
      .reduce((envPaths: string[], envPath: string) => {
        if (envPath.indexOf('node_modules/.bin') > -1) return envPaths;
        envPaths.push(envPath);
        return envPaths;
      }, [])
      .join(splitChar);
  }
  const command =
    process.platform === 'win32' ? 'whereis' : unixCommand || 'where';
  let result = null;
  try {
    const ps = await execa(command, [program], { stdio: 'pipe' });
    if (ps.exitCode === 0) result = ps.stdout;
  } catch (err) {
    if (process.platform !== 'win32' && !unixCommand) {
      return where(program, 'which', PATH);
    }
  }
  process.env.PATH = PATH;
  if (typeof result === 'string') {
    result = result.split(' ').pop() || null;
    if (!result?.length) result = null;
  }
  return result;
}
