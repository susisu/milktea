/*
 * milktea : lib/string.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "__String__proto__": __String__proto__,
        "__String__"       : __String__,
        "__length__"       : __length__,
        "__charAt__"       : __charAt__,
        "__charCodeAt__"   : __charCodeAt__,
        "__reverse__"      : __reverse__,
        "__concat__"       : __concat__
    });
}

var core      = require("../core.js"),
    Value     = core.Value,
    DataType  = core.DataType;

var utils         = require("./utils.js"),
    assertType    = utils.assertType,
    createObject  = utils.createObject,
    readProperty  = utils.readProperty,
    writeProperty = utils.writeProperty;

var module_object = require("./object.js");

var __String__proto__ = createObject(module_object.__Object__proto__);
__String__proto__.data["toString"] =
    new Value(
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
    );
__String__proto__.data["length"] =
    new Value(
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
    );

var __String__ = createObject(module_object.__Class__proto__);
__String__.data["proto"] = __String__proto__;
__String__.data["ctor"] =
    new Value(
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
