import ora from 'ora';

export default class Logger {
  level: number;

  constructor(level: string | number = 'info') {
    this.level = ((level: string | number) => {
      if (typeof level === 'number') return level;
      return ({
        silent: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        silly: 5,
      } as { [key: string]: number })[level];
    })(level);
  }

  spinner = ora();

  error(message?: any, ...optionalParams: any[]): any {
    if (this.level < 1) return null;
    // eslint-disable-next-line no-console
    return console.error(message, ...optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]): any {
    if (this.level < 2) return null;
    // eslint-disable-next-line no-console
    return console.warn(message, ...optionalParams);
  }

  info(message?: any, ...optionalParams: any[]): any {
    if (this.level < 3) return null;
    // eslint-disable-next-line no-console
    return console.info(message, ...optionalParams);
  }

  debug(message?: any, ...optionalParams: any[]): any {
    if (this.level < 4) return null;
    // eslint-disable-next-line no-console
    return console.debug(message, ...optionalParams);
  }

  silly(message?: any, ...optionalParams: any[]): any {
    if (this.level < 5) return null;
    // eslint-disable-next-line no-console
    return console.log(message, ...optionalParams);
  }
}
