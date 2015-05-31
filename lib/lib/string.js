/*
 * milktea : lib/string.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "__String__proto__": __String__proto__,
        "__String__"       : __String__
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

var __module__object__ = require("./object.js");

var __String__proto__ = createObject(__module__object__.__Object__proto__);
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

var __String__ = createObject(__module__object__.__Class__proto__);
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

end_module();
