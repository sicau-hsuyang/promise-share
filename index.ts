let hasExecuteFn = false;

type Resolve = (value: unknown) => void;

type Reject = (reason?: any) => void;

type Executor = "resolve" | "reject";

const queue: Array<{
  resolve: Resolve;
  reject: Reject;
}> = [];

function flushQueue(exec: Executor, val: unknown) {
  while (queue.length) {
    const node = queue.shift();
    const executor = node![exec];
    executor(val);
  }
}

export function singlePromise<T extends unknown[], R>(fn: (...args: T) => R, ctx?: unknown): (...args: T) => Promise<R> {
  return function decorate(...args: T) {
    return new Promise((resolve, reject) => {
      if (hasExecuteFn) {
        queue.push({ resolve: resolve as Resolve, reject });
      } else {
        // @ts-ignore
        const p = fn.apply(ctx || this, args);
        hasExecuteFn = true;
        Promise.resolve(p)
          .then((res) => {
            hasExecuteFn = false;
            resolve(res);
            flushQueue("resolve", res);
          })
          .catch((err) => {
            hasExecuteFn = false;
            reject(err);
            flushQueue("reject", err);
          });
      }
    });
  };
}
