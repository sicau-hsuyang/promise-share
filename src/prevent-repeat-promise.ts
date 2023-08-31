export function preventRepeatPromise<T extends unknown[], R>(fn: (...args: T) => R, ctx?: unknown): (...args: T) => Promise<R> {
  let prevent = false;
  return function decorate(...args: T) {
    if (prevent) {
      return Promise.resolve(null as R);
    }
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const p = fn.apply(ctx || this, args);
      prevent = true;
      Promise.resolve(p)
        .then((res) => {
          prevent = false;
          resolve(res);
        })
        .catch((err) => {
          prevent = false;
          reject(err);
        });
    });
  };
}
