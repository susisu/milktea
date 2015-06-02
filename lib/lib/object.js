/*
 * milktea : lib/object.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "__createObject__" : __createObject__,
        "__Object__proto__": __Object__proto__,
        "__Class__proto__" : __Class__proto__,
        "__Object__"       : __Object__,
        "__Class__"        : __Class__,
        "__instanceOf__"   : __instanceOf__,
        "__extends__"      : __extends__
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

var module_general = require("./general.js");

/**
 * Creates a new object.
 */
var __createObject__ =
    new Value(
        DataType.FUNCTION,
        function (parent) {
            assertType(parent, DataType.OBJECT);
            return createObject(parent);
        }
    );

/**
 * Prototype of Object class.
 */
var __Object__proto__ = createObject(new Value(DataType.OBJECT, null));
__Object__proto__.data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.STRING,
                obj.toString()
            );
        }
    );

/**
 * Prototype of Class class.
 */
var __Class__proto__ = createObject(__Object__proto__);
__Class__proto__.data["proto"] = createObject(__Object__proto__);
__Class__proto__.data["ctor"] = module_general.__id__;
__Class__proto__.data["new"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return readProperty(obj, "ctor").data(
                createObject(readProperty(obj, "proto"))
            );
        }
    );

/**
 * Object class.
 */
var __Object__ = createObject(__Class__proto__);
__Object__.data["proto"] = __Object__proto__;
__Object__.data["ctor"] = module_general.__id__;

/**
 * Class class.
 */
var __Class__ = createObject(__Class__proto__);
__Class__.data["proto"] = __Class__proto__;
__Class__.data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (cls) {
            assertType(cls, DataType.OBJECT);
            writeProperty(cls, "proto", createObject(__Object__proto__));
            return cls;
        }
    );

var __instanceOf__ =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (cls) {
                    assertType(cls, DataType.OBJECT);
                    var proto = readProperty(cls, "proto");
                    assertType(proto, DataType.OBJECT);
                    return Object.prototype.isPrototypeOf.call(proto.data, obj.data)
                        ? __true__
                        : __false__;
                }
            );
        }
    );

var __extends__ =
    new Value(
        DataType.FUNCTION,
        function (cls) {
            assertType(cls, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (parent) {
                    assertType(parent, DataType.OBJECT);
                    var proto = createObject(readProperty(parent, "proto"));
                    writeProperty(cls, "proto", proto);
                    return cls;
                }
            );
        }
    );

end_module();