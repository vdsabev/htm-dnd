import { isObject, isPromise, merge } from './utils.js';
export var createStore = function (source, options) {
    var model = {};
    var listeners = [];
    if (!options) {
        options = {};
    }
    if (!options.merge) {
        options.merge = merge;
    }
    var createSetFunction = function (state, action) { return function (changes) {
        options.merge(state, changes, createProxyFunction);
        update(changes, action);
        return changes;
    }; };
    var subscribe = function (listener) {
        listeners.push(listener);
        return function () {
            var indexOfListener = listeners.indexOf(listener);
            if (indexOfListener !== -1) {
                listeners.splice(listeners.indexOf(listener), 1);
            }
        };
    };
    var update = function (changes, action) {
        listeners.forEach(function (subscription) { return subscription(model, changes, action); });
    };
    var createProxyFunction = function (fn, state) {
        var proxyFunction = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var changes = options.callFunction
                ? options.callFunction(fn, state, args)
                : fn.apply(state, args);
            if (isPromise(changes)) {
                return changes.then(set);
            }
            if (isObject(changes)) {
                return set(changes);
            }
            return changes;
        };
        var set = createSetFunction(state, proxyFunction);
        return proxyFunction;
    };
    options.merge(model, source, createProxyFunction);
    return {
        model: model,
        subscribe: subscribe,
        set: createSetFunction(model),
        update: update,
    };
};
