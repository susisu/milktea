/*
 * milktea : lib/utils.js
 * copyright (c) 2015 Susisu
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
        "arrayToString"    : arrayToString
    });
}

var core         = require("../core.js"),
    Value        = core.Value,
    DataType     = core.DataType,
    calcTailCall = core.calcTailCall;

var errors = require("../errors.js");

function assertType(value, type) {
    if (value.type !== type) {
        throw errors.typeError(undefined, type, value.type);
    }
}

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

function createObject(parent) {
    return new Value(
        DataType.OBJECT,
        Object.create(parent.data)
    );
}

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

function writeProperty(obj, propName, value) {
    if (obj.data === null) {
        throw errors.writeNullObjectError(undefined);
    }
    var desc = Object.getOwnPropertyDescriptor(obj.data, propName);
    if (desc === undefined) {
        if (!Object.isExtensible(obj.data)) {
            throw errors.cannotWriteError(undefined, propName);
        }
    }
    else {
        if (!desc["writable"]) {
            throw errors.cannotWriteError(undefined, propName);
        }
    }
    Object.defineProperty(obj.data, propName, {
        "writable"    : true,
        "configurable": true,
        "enumerable"  : true,
        "value": value
    });
}

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

end_module();
