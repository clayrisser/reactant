export function getArgs(argv: string[], command: any): string[] {
  argv = argv.slice(1);
  return argv.reduce((args: string[], arg: string, i: number) => {
    const flags = Object.keys(command.flags).map((flag: string) => `--${flag}`);
    if (!(flags.includes(arg) || flags.includes(argv[i]))) args.push(arg);
    return args;
  }, []);
}
