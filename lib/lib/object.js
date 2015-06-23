/*
 * milktea : lib/object.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    Object.freeze(__Object__proto__.data);
    Object.freeze(__Class__proto__.data);
    Object.freeze(__Object__.data);
    Object.freeze(__Class__.data);

    module.exports = Object.freeze({
        "__createObject__" : __createObject__,
        "__Object__proto__": __Object__proto__,
        "__Class__proto__" : __Class__proto__,
        "__Object__"       : __Object__,
        "__Class__"        : __Class__,
        "__isObject__"     : __isObject__,
        "__instanceOf__"   : __instanceOf__,
        "__extends__"      : __extends__,
        "__delete__"       : __delete__
    });
}

var core      = require("../core.js"),
    Value     = core.Value,
    DataType  = core.DataType,
    __unit__  = core.__unit__,
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
Object.defineProperties(__Object__proto__.data, {
    "toString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.STRING,
                    obj.toString()
                );
            }
        )
    }
});

/**
 * Prototype of Class class.
 */
var __Class__proto__ = createObject(__Object__proto__);
Object.defineProperties(__Class__proto__.data, {
    "proto": {
        "value": createObject(__Object__proto__)
    },
    "ctor": {
        "value": module_general.__id__
    },
    "new": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return readProperty(obj, "ctor").data(
                    createObject(readProperty(obj, "proto"))
                );
            }
        )
    }
});

/**
 * Object class.
 */
var __Object__ = createObject(__Class__proto__);
Object.defineProperties(__Object__.data, {
    "proto": {
        "value": __Object__proto__
    },
    "ctor": {
        "value": module_general.__id__
    }
});
/**
 * Class class.
 */
var __Class__ = createObject(__Class__proto__);
Object.defineProperties(__Class__.data, {
    "proto": {
        "value": __Class__proto__
    },
    "ctor": {
        "value": new Value(
            DataType.FUNCTION,
            function (cls) {
                assertType(cls, DataType.OBJECT);
                writeProperty(cls, "proto", createObject(__Object__proto__));
                return cls;
            }
        )
    }
});

var __isObject__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return x.type === DataType.OBJECT ? __true__ : __false__;
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

var __delete__ =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (name) {
                    assertType(name, DataType.STRING);
                    delete obj.data[name.data];
                    return __unit__;
                }
            );
        }
    );

end_module();
