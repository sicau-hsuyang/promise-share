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

export function sharePromise<T extends unknown[], R>(fn: (...args: T) => R, ctx: unknown, ...args: T): Promise<R> {
  return new Promise((resolve, reject) => {
    if (hasExecuteFn) {
      queue.push({ resolve: resolve as Resolve, reject });
    } else {
      const p = fn.apply(ctx, args);
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
}
