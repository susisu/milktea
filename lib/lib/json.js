/*
 * milktea : lib/json.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "__fromJSON__": __fromJSON__,
        "__toJSON__"  : __toJSON__
    });
}

var core         = require("../core.js"),
    Value        = core.Value,
    DataType     = core.DataType,
    __unit__     = core.__unit__,
    __true__     = core.__true__,
    __false__    = core.__false__;

var errors = require("../errors.js");

var utils         = require("./utils.js"),
    assertType    = utils.assertType,
    createObject  = utils.createObject,
    writeProperty = utils.writeProperty;

var module_object = require("./object.js");

function fromJSValue(value) {
    switch (typeof value) {
        case "undefined":
            return __unit__;
        case "number":
            return new Value(
                DataType.NUMBER,
                value
            );
        case "string":
            return new Value(
                DataType.STRING,
                value
            );
        case "boolean":
            return value ? __true__ : __false__;
        case "object":
            if (value === null) {
                return __unit__;
            }
            else if (value instanceof Array) {
                return new Value(
                    DataType.ARRAY,
                    value.map(function (elem) {
                        return fromJSValue(elem);
                    })
                );
            }
            else {
                var obj = createObject(module_object.__Object__proto__);
                for (var key in value) {
                    writeProperty(obj, key, fromJSValue(value[key]));
                }
                return obj;
            }
        default:
            throw new errors.RuntimeError([], "inconvertible data");
    }
}

function toJSValue(value) {
    switch (value.type) {
        case DataType.UNIT:
            return null;
        case DataType.NUMBER:
        case DataType.STRING:
        case DataType.BOOL:
            return value.data;
        case DataType.ARRAY:
            return value.data.map(function (elem) { return toJSValue(elem); });
        case DataType.OBJECT:
            var obj = {};
            for (var key in value.data) {
                obj[key] = toJSValue(value.data[key]);
            }
            return obj;
        default:
            throw new errors.RuntimeError([], "inconvertible data");
    }
}

var __fromJSON__ =
    new Value(
        DataType.FUNCTION,
        function (json) {
            assertType(json, DataType.STRING);
            try {
                return fromJSValue(JSON.parse(json.data));
            }
            catch (err) {
                return __unit__;
            }
        }
    );

var __toJSON__ =
    new Value(
        DataType.FUNCTION,
        function (value) {
            try {
                return new Value(
                    DataType.STRING,
                    JSON.stringify(toJSValue(value))
                );
            }
            catch (err) {
                return __unit__;
            }
        }
    );

end_module();
