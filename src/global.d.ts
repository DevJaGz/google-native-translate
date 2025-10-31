declare global {
  /**
   * Utility type to simplify and "prettify" inferred or complex types.
   * Expands intersections/unions for easier reading in IDEs.
   */
  type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};
}

export {};
