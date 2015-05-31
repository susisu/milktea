/*
 * milktea : lib/reference.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "__Reference__proto__": __Reference__proto__,
        "__Reference__"       : __Reference__,
        "__ref__"             : __ref__,
        "__readRef__"         : __readRef__,
        "__writeRef__"        : __writeRef__
    });
}

var core         = require("../core.js"),
    Value        = core.Value,
    DataType     = core.DataType,
    calcTailCall = core.calcTailCall,
    __unit__     = core.__unit__;

var utils             = require("./utils.js"),
    assertType        = utils.assertType,
    createObject      = utils.createObject,
    readProperty      = utils.readProperty,
    callMethod        = utils.callMethod,
    writeProperty     = utils.writeProperty,
    referenceToString = utils.referenceToString;

var __module__object__ = require("./object.js");

var __Reference__proto__ = createObject(__module__object__.__Object__proto__);
__Reference__proto__.data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            var ref = readProperty(obj, "value");
            assertType(ref, DataType.REFERENCE);
            return referenceToString(ref, []);
        }
    );

var __Reference__ = createObject(__module__object__.__Class__proto__);
__Reference__.data["proto"] = __Reference__proto__;
__Reference__.data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    assertType(value, DataType.REFERENCE);
                    writeProperty(obj, "value", value);
                    return obj;
                }
            );
        }
    );

var __ref__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return new Value(
                DataType.REFERENCE,
                x
            );
        }
    );

var __readRef__ =
    new Value(
        DataType.FUNCTION,
        function (ref) {
            assertType(ref, DataType.REFERENCE);
            return ref.data;
        }
    );

var __writeRef__ =
    new Value(
        DataType.FUNCTION,
        function (ref) {
            assertType(ref, DataType.REFERENCE);
            return new Value(
                DataType.FUNCTION,
                function (x) {
                    ref.data = x;
                    return __unit__;
                }
            );
        }
    );

end_module();
