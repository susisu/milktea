/*
 * milktea : lib/bool.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
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

var __module__object__ = require("./object.js");

var __Bool__proto__ = createObject(__module__object__.__Object__proto__);
__Bool__proto__.data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            var b = readProperty(obj, "value");
            assertType(b, DataType.BOOL);
            return new Value(
                DataType.STRING,
                b.data ? "true" : "false"
            );
        }
    );

var __Bool__ = createObject(__module__object__.__Class__proto__);
__Bool__.data["proto"] = __Bool__proto__;
__Bool__.data["ctor"] =
    new Value(
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
    );

var __not__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.BOOL);
            return x.data ? __false__ : __true__;
        }
    );

end_module();
