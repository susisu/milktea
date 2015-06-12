/*
 * milktea : lib/string.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    Object.freeze(__String__proto__.data);
    Object.freeze(__String__.data);

    module.exports = Object.freeze({
        "__String__proto__": __String__proto__,
        "__String__"       : __String__,
        "__isString__"     : __isString__,
        "__charAt__"       : __charAt__,
        "__charCodeAt__"   : __charCodeAt__,
        "__length__"       : __length__,
        "__empty__"        : __empty__,
        "__toUpperCase__"  : __toUpperCase__,
        "__toLowerCase__"  : __toLowerCase__,
        "__reverse__"      : __reverse__,
        "__concat__"       : __concat__
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

var __String__proto__ = createObject(module_object.__Object__proto__);
Object.defineProperties(__String__proto__.data, {
    "toString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var str = readProperty(obj, "value");
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.STRING,
                    str.toString()
                );
            }
        )
    },
    "length": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var str = readProperty(obj, "value");
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.NUMBER,
                    str.data.length
                );
            }
        )
    }
});

var __String__ = createObject(module_object.__Class__proto__);
Object.defineProperties(__String__.data, {
    "proto": {
        "value": __String__proto__
    },
    "ctor": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (value) {
                        assertType(value, DataType.STRING);
                        writeProperty(obj, "value", value);
                        return obj;
                    }
                );
            }
        )
    }
});

var __isString__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return x.type === DataType.STRING ? __true__ : __false__;
        }
    );

var __charAt__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.FUNCTION,
                function (index) {
                    assertType(index, DataType.NUMBER);
                    var len = str.data.length;
                    if (index.data < 0 || index.data >= len) {
                        throw errors.outOfRangeError(undefined, index.data);
                    }
                    return new Value(
                        DataType.STRING,
                        str.data.charAt(index)
                    );
                }
            );
        }
    );

var __charCodeAt__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.FUNCTION,
                function (index) {
                    assertType(index, DataType.NUMBER);
                    var len = str.data.length;
                    if (index.data < 0 || index.data >= len) {
                        throw errors.outOfRangeError(undefined, index.data);
                    }
                    return new Value(
                        DataType.NUMBER,
                        str.data.charCodeAt(index)
                    );
                }
            );
        }
    );

var __length__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.NUMBER,
                str.data.length
            );
        }
    );

var __empty__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return str.data === "" ? __true__ : __false__;
        }
    );

var __toUpperCase__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.STRING,
                str.data.toUpperCase()
            );
        }
    );

var __toLowerCase__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.STRING,
                str.data.toLowerCase()
            );
        }
    );

var __reverse__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.NUMBER,
                str.data.split("").reverse().join("")
            );
        }
    );

var __concat__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.STRING);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.STRING);
                    return new Value(
                        DataType.STRING,
                        x.data + y.data
                    );
                }
            );
        }
    );

end_module();
