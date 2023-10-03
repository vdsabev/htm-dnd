export var isFunction = function (value) { return typeof value === 'function'; };
export var isObject = function (value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
};
export var isPromise = function (promise) {
    return promise != null && isFunction(promise.then);
};
// TODO: For class instances, perhaps proxy methods from `model.constructor.prototype`
/**
 * Recursively merges a source object into a target object.
 * Optionally, functions can be proxied, e.g. to update the store when called.
 */
export var merge = function (target, source, createProxyFunction) {
    if (!isObject(target)) {
        throw new Error("Invalid merge target, expected an object, got " + JSON.stringify(target, null, 2));
    }
    if (source != null) {
        getAllProps(source).forEach(function (key) {
            // TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed
            // on strict mode functions or the arguments objects for calls to them
            if ((isFunction(source) && key === 'caller') || key === 'callee' || key === 'arguments')
                return;
            var sourceValue = source[key];
            // We need to go deeper.jpg
            if (isObject(sourceValue)) {
                if (!target[key]) {
                    target[key] = {};
                }
                merge(target[key], source[key], createProxyFunction);
            }
            else if (isFunction(sourceValue) && isFunction(createProxyFunction)) {
                target[key] = createProxyFunction(sourceValue, target);
            }
            else {
                // Set value
                target[key] = sourceValue;
            }
        });
    }
    return target;
};
/**
 * Gets all properties of an object, including inherited from prototype
 * @see https://stackoverflow.com/questions/30881632/es6-iterate-over-class-methods
 */
export var getAllProps = function (x) {
    return (x != null &&
        x !== Object.prototype && Object.getOwnPropertyNames(x).filter(notConstructor).concat(getAllProps(Object.getPrototypeOf(x)))) ||
        [];
};
var notConstructor = function (key) { return key !== 'constructor' && key !== 'prototype'; };
