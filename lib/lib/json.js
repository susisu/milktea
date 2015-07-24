/*
 * milktea : lib/json.js
 * copyright (c) 2015 Susisu
 */

/**
 * @module lib/json
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

var module_object = require("./object.js"),
    module_maybe  = require("./maybe.js");

function fromJSONValue(value) {
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
                        return fromJSONValue(elem);
                    })
                );
            }
            else {
                var obj = createObject(module_object.__Object__proto__);
                Object.keys(value).forEach(function (key) {
                    writeProperty(obj, key, fromJSONValue(value[key]));
                });
                return obj;
            }
        default:
            throw new errors.RuntimeError([], "inconvertible data");
    }
}

function toJSONValue(value, blackList) {
    if (blackList.indexOf(value) >= 0) {
        throw new errors.RuntimeError([], "circular structure");
    }
    switch (value.type) {
        case DataType.UNIT:
            return null;
        case DataType.NUMBER:
        case DataType.STRING:
        case DataType.BOOL:
            return value.data;
        case DataType.REFERENCE:
            return toJSONValue(value.data, blackList.concat(value));
        case DataType.ARRAY:
            return value.data.map(function (elem) {
                return toJSONValue(elem, blackList.concat(value));
            });
        case DataType.OBJECT:
            var obj = {};
            Object.keys(value.data).forEach(function (key) {
                obj[key] = toJSONValue(value.data[key], blackList.concat(value));
            });
            return obj;
        default:
            throw new errors.RuntimeError([], "inconvertible data");
    }
}

/**
 * @static
 */
var __fromJSON__ =
    new Value(
        DataType.FUNCTION,
        function (json) {
            assertType(json, DataType.STRING);
            try {
                return fromJSONValue(JSON.parse(json.data));
            }
            catch (err) {
                return module_maybe.__nothing__;
            }
        }
    );

/**
 * @static
 */
var __toJSON__ =
    new Value(
        DataType.FUNCTION,
        function (value) {
            try {
                var value = new Value(
                    DataType.STRING,
                    JSON.stringify(toJSONValue(value, []))
                );
                return module_maybe.__just__.data(value);
            }
            catch (err) {
                return module_maybe.__nothing__;
            }
        }
    );

end_module();
