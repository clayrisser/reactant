declare class Err extends Error {
  constructor(message: Err | string, code?: number | string);

  code: number | string;

  isJoi?: boolean;

  originalError?: Err;

  output?: Err;

  statusCode?: number | string;
}

declare module 'err' {
  export = Err;
}
