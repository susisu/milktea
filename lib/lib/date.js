/*
 * milktea : lib/date.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "__Date__proto__": __Date__proto__,
        "__Date__"       : __Date__
    });
}

var core         = require("../core.js"),
    Value        = core.Value,
    DataType     = core.DataType,
    calcTailCall = core.calcTailCall,
    __unit__     = core.__unit__,
    __true__     = core.__true__,
    __false__    = core.__false__;

var errors = require("../errors.js");

var utils         = require("./utils.js"),
    assertType    = utils.assertType,
    createObject  = utils.createObject,
    readInternalProperty  = utils.readInternalProperty,
    writeInternalProperty = utils.writeInternalProperty;

var module_object = require("./object.js");

var INTERNAL_KEY = "__date__";

function assertDate(obj) {
    if (!(obj instanceof Date)) {
        throw new errors.RuntimeError([], "require Date object");
    }
}

var __Date__proto__ = createObject(module_object.__Object__proto__);
Object.defineProperties(__Date__proto__.data, {
    "toString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.STRING,
                    date.toString()
                );
            }
        )
    },
    "getFullYear": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getFullYear()
                );
            }
        )
    },
    "getMonth": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getMonth()
                );
            }
        )
    },
    "getDate": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getDate()
                );
            }
        )
    },
    "getDay": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getDay()
                );
            }
        )
    },
    "getHours": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getHours()
                );
            }
        )
    },
    "getMinutes": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getMinutes()
                );
            }
        )
    },
    "getSeconds": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getSeconds()
                );
            }
        )
    },
    "getMilliseconds": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getMilliseconds()
                );
            }
        )
    },
    "getTime": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getTime()
                );
            }
        )
    },
    "getTimezoneOffset": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getTimezoneOffset()
                );
            }
        )
    },
    "getUTCFullYear": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCFullYear()
                );
            }
        )
    },
    "getUTCMonth": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCMonth()
                );
            }
        )
    },
    "getUTCDate": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCDate()
                );
            }
        )
    },
    "getUTCDay": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCDay()
                );
            }
        )
    },
    "getUTCHours": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCHours()
                );
            }
        )
    },
    "getUTCMinutes": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCMinutes()
                );
            }
        )
    },
    "getUTCSeconds": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCSeconds()
                );
            }
        )
    },
    "getUTCMilliseconds": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCMilliseconds()
                );
            }
        )
    }
});

var __Date__ = createObject(module_object.__Class__proto__);
Object.defineProperties(__Date__.data, {
    "proto": {
        "value": __Date__proto__
    },
    "ctor": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                writeInternalProperty(obj, INTERNAL_KEY, "date", new Date());
                return obj;
            }
        )
    }
});

end_module();
