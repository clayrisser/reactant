export interface Platform {
  moduleName: string;
  name: string;
  actions: Actions;
}

export interface Platforms {
  [key: string]: Platform;
}

export type Action = () => {};

export interface Actions {
  [key: string]: Action;
}
