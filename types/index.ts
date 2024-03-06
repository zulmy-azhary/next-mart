export type Params<T> = {
  params: T extends object ? T : never;
};
