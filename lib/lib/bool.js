/*
 * milktea : lib/bool.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    Object.freeze(__Bool__proto__.data);
    Object.freeze(__Bool__.data);

    module.exports = Object.freeze({
        "__Bool__proto__": __Bool__proto__,
        "__Bool__"       : __Bool__,
        "__not__"        : __not__
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

var __Bool__proto__ = createObject(module_object.__Object__proto__);
Object.defineProperties(__Bool__proto__.data, {
    "toString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var b = readProperty(obj, "value");
                assertType(b, DataType.BOOL);
                return new Value(
                    DataType.STRING,
                    b.toString()
                );
            }
        )
    }
});

var __Bool__ = createObject(module_object.__Class__proto__);
Object.defineProperties(__Bool__.data, {
    "proto": {
        "value": __Bool__proto__
    },
    "ctor": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (value) {
                        assertType(value, DataType.BOOL);
                        writeProperty(obj, "value", value);
                        return obj;
                    }
                );
            }
        )
    }
});

var __not__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.BOOL);
            return x.data ? __false__ : __true__;
        }
    );

end_module();
