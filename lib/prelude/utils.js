/*
 * milktea : prelude/utils.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "unboxTailCall"         : unboxTailCall,
        "assertType"            : assertType,
        "assertTypes"           : assertTypes,
        "assertObjectIsWritable": assertObjectIsWritable,
        "getProperty"           : getProperty,
        "callMethod"            : callMethod,
        "createObject"          : createObject
    });
}

var core      = require("../core.js");
var Value     = core.Value;
var DataType  = core.DataType;

var errors = require("../errors.js");

function unboxTailCall(res) {
    while (res instanceof core.TailCall) {
        assertType(res._func, DataType.FUNCTION);
        try {
            res = res._func.data(res._arg);
        }
        catch (err) {
            if (err instanceof errors.RuntimeError) {
                throw err;
            }
            else {
                throw err; // new errors.internalError(undefined, err);
            }
        }
    }
    return res;
}

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

function assertObjectIsWritable(obj, propName) {
    if (obj === null) {
        throw errors.writeNullObjectError(undefined);
    }
    var desc = Object.getOwnPropertyDescriptor(obj, propName);
    if (desc === undefined) {
        if (!Object.isExtensible(obj)) {
            throw errors.cannotWriteError(undefined, propName);
        }
    }
    else {
        if (!desc["writable"]) {
            throw errors.cannotWriteError(undefined, propName);
        }
    }
}

function getProperty(obj, propName) {
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

function createObject(parent) {
    return new Value(
        DataType.OBJECT,
        Object.create(parent.data)
    );
}

end_module();
