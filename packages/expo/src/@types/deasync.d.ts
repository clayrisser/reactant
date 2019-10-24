declare module 'deasync' {
  function deasync(func: (...args: any) => Promise<any>): (...args: any) => any;
  export = deasync;
}
