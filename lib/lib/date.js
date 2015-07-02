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

var utils         = require("./utils.js"),
    assertType    = utils.assertType,
    createObject  = utils.createObject,
    readInternalProperty  = utils.readInternalProperty,
    writeInternalProperty = utils.writeInternalProperty;

var module_object = require("./object.js");

var INTERNAL_KEY = "__date__";

var __Date__proto__ = createObject(module_object.__Object__proto__);
Object.defineProperties(__Date__proto__.data, {
    "toString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.STRING,
                    readInternalProperty(obj, INTERNAL_KEY, "date").toString()
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
