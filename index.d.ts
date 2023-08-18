export declare function singlePromise<T extends unknown[], R>(fn: (...args: T) => R, ctx: unknown): (...args: T) => Promise<R>;
