/*
 * milktea : lib/unit.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    Object.freeze(__Unit__proto__.data);
    Object.freeze(__Unit__.data);

    module.exports = Object.freeze({
        "__Unit__proto__": __Unit__proto__,
        "__Unit__"       : __Unit__,
        "__isUnit__"     : __isUnit__
    });
}

var core      = require("../core.js"),
    Value     = core.Value,
    DataType  = core.DataType,
    __true__  = core.__true__,
    __false__ = core.__false__;

var utils         = require("./utils.js"),
    assertType    = utils.assertType,
    createObject  = utils.createObject,
    readProperty  = utils.readProperty,
    writeProperty = utils.writeProperty;

var module_object = require("./object.js");

var __Unit__proto__ = createObject(module_object.__Object__proto__);
Object.defineProperties(__Unit__proto__.data, {
    "toString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var unit = readProperty(obj, "value");
                assertType(unit, DataType.UNIT);
                return new Value(
                    DataType.STRING,
                    "()"
                );
            }
        )
    }
});

var __Unit__ = createObject(module_object.__Class__proto__);
Object.defineProperties(__Unit__.data, {
    "proto": {
        "value": __Unit__proto__
    },
    "ctor": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (value) {
                        assertType(value, DataType.UNIT);
                        writeProperty(obj, "value", value);
                        return obj;
                    }
                );
            }
        )
    }
});

var __isUnit__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return x.type === DataType.UNIT ? __true__ : __false__;
        }
    );

end_module();
