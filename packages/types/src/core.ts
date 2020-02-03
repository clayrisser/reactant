export interface Spinner {
  fail(message?: string): Spinner;
  info(message?: string): Spinner;
  start(message?: string): Spinner;
  stop(): any;
  succeed(message?: string): Spinner;
  warn(message?: string): Spinner;
}

export interface Logger {
  debug(message?: any, ...optionalParams: any[]): any;
  silly(message?: any, ...optionalParams: any[]): any;
  error(message?: any, ...optionalParams: any[]): any;
  info(message?: any, ...optionalParams: any[]): any;
  spinner: Spinner;
  warn(message?: any, ...optionalParams: any[]): any;
}

export interface Status {
  version: string;
}
