declare interface Environment {
  value: string;
  production: boolean;
}

declare module 'js-info' {
  export const environment: Environment;
}
