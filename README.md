# easy-single-promise

这个库是一个对`Promise`的增强，您传入你一个函数 A，得到一个新函数，若这个函数 A 返回值是一个`Promise`，在这个promise的状态没有发生变更的期间，再次调用新函数都不会真正再执行函数 A，并且这一期间对新函数调用得到的都是 A 函数执行那一次的结果。

## 安装

```bash
$ npm i easy-single-promise -S
```

## 使用

```js
import { singlePromise } from "easy-single-promise";

function getServerData() {
  return new Promise((resolve) => {
    console.log("我被执行啦~");
    setTimeout(() => {
      resolve(1);
    }, 1000);
  });
}

const singleGetServerData = singlePromise(getServerData);

// 立即打印一次“我被执行啦”，并且只会打印一次

const pList = [singleGetServerData(), singleGetServerData(), singleGetServerData()];
setTimeout(() => {
  singleGetServerData().then(console.log);
  // 在1S后打印1，和后面的[1,1,1]一起输出
}, 400);

Promise.all(pList).then((res) => {
  console.log(res);
  // 在1S后打印[1, 1, 1]，和前面的1一起输出
});

setTimeout(() => {
  singleGetServerData().then((res) => {
    console.log(res);
    // 在4S后打印“我被执行啦”
    // 在5S后打印1
  });
}, 4000);
```

## API

```ts
export declare function singlePromise<T extends unknown[], R>(fn: (...args: T) => R, ctx?: unknown): (...args: T) => Promise<R>;
```
