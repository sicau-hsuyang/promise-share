var hasExecuteFn = false;
var queue = [];
function flushQueue(exec, val) {
    while (queue.length) {
        var node = queue.shift();
        var executor = node[exec];
        executor(val);
    }
}
export function sharePromise(fn, ctx) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return new Promise(function (resolve, reject) {
        if (hasExecuteFn) {
            queue.push({ resolve: resolve, reject: reject });
        }
        else {
            var p = fn.apply(ctx, args);
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
}
