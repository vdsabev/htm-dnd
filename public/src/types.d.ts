export type ProxiedFunctions<T extends { [string]: Function }> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]>;
};
