var hasExecuteFn = false;
var queue = [];
function flushQueue(exec, val) {
    while (queue.length) {
        var node = queue.shift();
        var executor = node[exec];
        executor(val);
    }
}
export function singlePromise(fn, ctx) {
    return function decorate() {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            if (hasExecuteFn) {
                queue.push({ resolve: resolve, reject: reject });
            }
            else {
                // @ts-ignore
                var p = fn.apply(ctx || _this, args);
                hasExecuteFn = true;
                Promise.resolve(p)
                    .then(function (res) {
                    hasExecuteFn = false;
                    resolve(res);
                    flushQueue("resolve", res);
                })
                    .catch(function (err) {
                    hasExecuteFn = false;
                    reject(err);
                    flushQueue("reject", err);
                });
            }
        });
    };
}
