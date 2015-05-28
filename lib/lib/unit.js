/*
 * milktea : lib/unit.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "__Unit__proto__": __Unit__proto__,
        "__Unit__"       : __Unit__
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

var __Unit__proto__ = createObject(__module__object__.__Object__proto__);
__Unit__proto__.data["toString"] =
    new Value(
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
    );

var __Unit__ = createObject(__module__object__.__Class__proto__);
__Unit__.data["proto"] = __Unit__proto__;
__Unit__.data["ctor"] =
    new Value(
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
    );

end_module();
