export interface MergeOptions {
  _level: number;
  concat: boolean;
  dedup: boolean;
  level: number;
  mergeModifierFunction: boolean;
}

export type MergeModifier = <Config>(
  config: Partial<Config>,
  ...args: any[]
) => Partial<Config>;
