/*
 * milktea : lib/utils.js
 * copyright (c) 2015 Susisu
 */

/**
 * @module lib/utils
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "assertType"       : assertType,
        "assertTypes"      : assertTypes,
        "createObject"     : createObject,
        "readProperty"     : readProperty,
        "callMethod"       : callMethod,
        "writeProperty"    : writeProperty,
        "checkProperty"    : checkProperty,
        "referenceToString": referenceToString,
        "arrayToString"    : arrayToString,
        "readInternalProperty" : readInternalProperty,
        "writeInternalProperty": writeInternalProperty
    });
}

var core         = require("../core.js"),
    Value        = core.Value,
    DataType     = core.DataType,
    calcTailCall = core.calcTailCall;

var errors = require("../errors.js");

/**
 * @static
 * @param {module:core.Value} value The value to be checked its type.
 * @param {string} type The type that should match that of the value.
 * @throws {module:errors.RuntimeError} The type is mismatched.
 * @desc Asserts that the value has the specified type.
 */
function assertType(value, type) {
    if (value.type !== type) {
        throw errors.typeError(undefined, type, value.type);
    }
}

/**
 * @static
 * @param {module:core.Value} value The value to be checked its type.
 * @param {Array.<string>} types An array of the types that one of those should match that of the value.
 * @throws {module:errors.RuntimeError} The type is mismatched.
 * @desc Asserts that the value has one of the specified types.
 */
function assertTypes(value, types) {
    var match = false;
    for (var i = 0; i < types.length; i++) {
        if (value.type === types[i]) {
            match = true;
            break;
        }
    }
    if (!match) {
        var typesStr = types.slice(0, -1).join(", ") + " or " + types[types.length - 1];
        throw errors.typeError(undefined, typesStr, value.type);
    }
}

/**
 * @static
 * @param {module:core.Value} parent The object value to be the parent of the new object.
 * @return {module:core.Value} A new object value.
 * @desc Creates a new object value with the specified parent.
 */
function createObject(parent) {
    return new Value(
        DataType.OBJECT,
        Object.create(parent.data)
    );
}

/**
 * @static
 * @param {module:core.Value} obj The target object.
 * @param {string} propName The name of the property
 * @return {module:core.Value} The property of the object.
 * @throws {module:errors.RuntimeError} The object is null or the property is not found.
 * @desc Reads a property of the object.
 */
function readProperty(obj, propName) {
    if (obj.data === null) {
        throw errors.readNullObjectError(undefined);
    }
    var prop = obj.data[propName];
    if (prop === undefined) {
        throw errors.propertyNotFoundError(undefined, propName);
    }
    else {
        return prop;
    }
}

/**
 * @static
 * @param {module:core.Value} obj The target object.
 * @param {string} methodName The name of the property.
 * @return {module:core.Value} The result of calling the method.
 * @throws {module:errors.RuntimeError} The object is null or the property is not found.
 * @desc Calls a method of the object.
 */
function callMethod(obj, methodName) {
    if (obj.data === null) {
        throw errors.readNullObjectError(undefined);
    }
    var prop = obj.data[methodName];
    if (prop === undefined) {
        throw errors.propertyNotFoundError(undefined, methodName);
    }
    else {
        assertType(prop, DataType.FUNCTION);
        return prop.data(obj);
    }
}

/**
 * @static
 * @param {module:core.Value} obj The target object
 * @param {string} propName The name of the property
 * @param {module:core.Value} value The value to be written.
 * @throws {module:errors.RuntimeError} The object is null or not writable.
 */
function writeProperty(obj, propName, value) {
    if (obj.data === null) {
        throw errors.writeNullObjectError(undefined);
    }
    var desc = Object.getOwnPropertyDescriptor(obj.data, propName);
    if (desc === undefined) {
        if (!Object.isExtensible(obj.data)) {
            throw errors.cannotWriteError(undefined, propName);
        }
        Object.defineProperty(obj.data, propName, {
            "writable"    : true,
            "configurable": true,
            "enumerable"  : true,
            "value": value
        });
    }
    else {
        if (!desc["writable"]) {
            throw errors.cannotWriteError(undefined, propName);
        }
        obj.data[propName] = value;
    }
}

/**
 * @static
 * @param {module:core.Value} obj The target object.
 * @param {string} propName The name of the property.
 * @return {boolean} A boolean value that describes Whether the object has the property.
 */
function checkProperty(obj, propName) {
    if (obj.data === null) {
        return false;
    }
    var prop = obj.data[propName];
    if (prop === undefined) {
        return false;
    }
    else {
        return true;
    }
}

/**
 * @static
 * @param {module:core.Value} ref The reference value.
 * @param {Array.<module:core.Value>} blackList The list of values to avoid circular reference.
 * @return {module:core.Value} The string value that represents the reference.
 * @throws {module:errors.RuntimeError} Some runtime error occurs.
 */
function referenceToString(ref, blackList) {
    if (blackList.indexOf(ref) >= 0) {
        return new Value(
            DataType.STRING,
            "<circular>"
        );
    }
    var str;
    switch (ref.data.type) {
        case DataType.OBJECT:
            str = calcTailCall(callMethod(ref.data, "toString"));
            break;
        case DataType.REFERENCE:
            str = referenceToString(ref.data, blackList.concat(ref));
            break;
        case DataType.ARRAY:
            str = arrayToString(ref.data, blackList.concat(ref));
            break;
        default:
            str = new Value(DataType.STRING, ref.data.toString());
    }
    assertType(str, DataType.STRING);
    return new Value(
        DataType.STRING,
        "<ref: " + str.data + ">"
    );
}

/**
 * @static
 * @param {module:core.Value} arr The array value.
 * @param {Array.<module:core.Value>} blackList The list of values to avoid circular reference.
 * @return {module:core.Value} The string value that represents the array.
 * @throws {module:errors.RuntimeError} Some runtime error occurs.
 */
function arrayToString(arr, blackList) {
    var str =
        arr.data.map(function (elem) {
            if (blackList.indexOf(elem) >= 0) {
                return "<circular>";
            }
            var elemStr;
            switch (elem.type) {
                case DataType.OBJECT:
                    elemStr = calcTailCall(callMethod(elem, "toString"));
                    break;
                case DataType.REFERENCE:
                    elemStr = referenceToString(elem, blackList.concat(arr));
                    break;
                case DataType.ARRAY:
                    elemStr = arrayToString(elem, blackList.concat(arr));
                    break;
                default:
                    elemStr = new Value(DataType.STRING, elem.toString());
            }
            assertType(elemStr, DataType.STRING);
            return elemStr.data;
        })
        .join(",");
    return new Value(
        DataType.STRING,
        "[" + str + "]"
    );
}

/**
 * @static
 * @param {module:core.Value} obj The target object.
 * @param {string} key The key of the internal namespace.
 * @param {string} propName The name of the internal property.
 * @return {module:core.Value} The internal property of the object.
 * @throws {module:errors.RuntimeError} The object has no internal namespace or does not have the proeprty.
 */
function readInternalProperty(obj, key, propName) {
    if (!obj.hasOwnProperty("internals")) {
        throw errors.noInternalNamespaceError(undefined);
    }
    if (!obj.internals.hasOwnProperty(key)) {
        throw errors.readInternalPropertyError(undefined, key, propName);
    }
    if (!obj.internals[key].hasOwnProperty(propName)) {
        throw errors.readInternalPropertyError(undefined, key, propName);
    }
    else {
        return obj.internals[key][propName];
    }
}

/**
 * @static
 * @param {module:core.Value} obj The target object.
 * @param {string} key The key of the internal namespace.
 * @param {string} propName The name of the internal property.
 * @param {module:core.Value} value The value to be written.
 * @throws {module:errors.RuntimeError} The object has no internal namespace.
 */
function writeInternalProperty(obj, key, propName, value) {
    if (!obj.hasOwnProperty("internals")) {
        throw errors.noInternalNamespaceError(undefined);
    }
    if (!obj.internals.hasOwnProperty(key)) {
        obj.internals[key] = {};
    }
    Object.defineProperty(obj.internals[key], propName, {
        "writable"    : true,
        "configurable": true,
        "enumerable"  : true,
        "value": value
    });
}

end_module();
