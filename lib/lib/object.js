/*
 * milktea : lib/object.js
 * copyright (c) 2015 Susisu
 */

/**
 * @module lib/object
 */

"use strict";

function end_module() {
    Object.freeze(__Object__proto__.data);
    Object.freeze(__Class__proto__.data);
    Object.freeze(__Object__.data);
    Object.freeze(__Class__.data);

    module.exports = Object.freeze({
        "__createObject__"     : __createObject__,
        "__Object__proto__"    : __Object__proto__,
        "__Class__proto__"     : __Class__proto__,
        "__Object__"           : __Object__,
        "__Class__"            : __Class__,
        "__isObject__"         : __isObject__,
        "__instanceOf__"       : __instanceOf__,
        "__delete__"           : __delete__,
        "__assign__"           : __assign__,
        "__orphan__"           : __orphan__,
        "__keys__"             : __keys__,
        "__preventExtensions__": __preventExtensions__,
        "__seal__"             : __seal__,
        "__freeze__"           : __freeze__,
        "__isExtensible__"     : __isExtensible__,
        "__isSealed__"         : __isSealed__,
        "__isFrozen__"         : __isFrozen__
    });
}

var core      = require("../core.js"),
    Value     = core.Value,
    DataType  = core.DataType,
    __unit__  = core.__unit__,
    __true__  = core.__true__,
    __false__ = core.__false__;

var errors = require("../errors.js");

var utils          = require("./utils.js"),
    assertType     = utils.assertType,
    createObject   = utils.createObject,
    readProperty   = utils.readProperty,
    writeProperty  = utils.writeProperty,
    deleteProperty = utils.deleteProperty;

var module_general = require("./general.js");

/**
 * @static
 * @desc Creates a new object.
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
 * @static
 * @desc Prototype of Object class.
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
 * @statc
 * @desc Prototype of Class class.
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
            function (cls) {
                assertType(cls, DataType.OBJECT);
                return readProperty(cls, "ctor").data(
                    createObject(readProperty(cls, "proto"))
                );
            }
        )
    },
    "extends": {
        "value": new Value(
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
        )
    }
});

/**
 * @static
 * @desc Object class.
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
 * @static
 * @desc Class class.
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

/**
 * @static
 */
var __isObject__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return x.type === DataType.OBJECT ? __true__ : __false__;
        }
    );

/**
 * @static
 */
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

/**
 * @static
 */
var __delete__ =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (name) {
                    assertType(name, DataType.STRING);
                    deleteProperty(obj, name.data);
                    return __unit__;
                }
            );
        }
    );

/**
 * @static
 */
var __assign__ =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (values) {
                    assertType(values, DataType.OBJECT);
                    for (var key in values.data) {
                        writeProperty(obj, key, values.data[key]);
                    }
                    return obj;
                }
            );
        }
    );

/**
 * @static
 */
var __orphan__ =
    new Value(
        DataType.FUNCTION,
        function (values) {
            assertType(values, DataType.OBJECT);
            return __assign__
                .data(createObject(new Value(DataType.OBJECT, null)))
                .data(values);
        }
    );

/**
 * @static
 */
var __keys__ =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.ARRAY,
                Object.keys(obj.data).map(function (key) {
                    return new Value(
                        DataType.STRING,
                        key
                    );
                })
            );
        }
    );

/**
 * @static
 */
var __preventExtensions__ =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            Object.preventExtensions(obj.data);
            return __unit__;
        }
    );

/**
 * @static
 */
var __seal__ =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            Object.seal(obj.data);
            return __unit__;
        }
    );

/**
 * @static
 */
var __freeze__ =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            Object.freeze(obj.data);
            return __unit__;
        }
    );

/**
 * @static
 */
var __isExtensible__ =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return Object.isExtensible(obj.data) ? __true__ : __false__;
        }
    );

/**
 * @static
 */
var __isSealed__ =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return Object.isSealed(obj.data) ? __true__ : __false__;
        }
    );

/**
 * @static
 */
var __isFrozen__ =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return Object.isFrozen(obj.data) ? __true__ : __false__;
        }
    );

end_module();
