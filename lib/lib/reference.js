/*
 * milktea : lib/reference.js
 * copyright (c) 2015 Susisu
 */

/**
 * @module lib/reference
 */

"use strict";

function end_module() {
    Object.freeze(__Reference__proto__.data);
    Object.freeze(__Reference__.data);

    module.exports = Object.freeze({
        "__Reference__proto__": __Reference__proto__,
        "__Reference__"       : __Reference__,
        "__isReference__"     : __isReference__,
        "__ref__"             : __ref__,
        "__readRef__"         : __readRef__,
        "__writeRef__"        : __writeRef__,
        "__modifyRef__"       : __modifyRef__
    });
}

var core         = require("../core.js"),
    Value        = core.Value,
    DataType     = core.DataType,
    calcTailCall = core.calcTailCall,
    __unit__     = core.__unit__,
    __true__     = core.__true__,
    __false__    = core.__false__;

var utils             = require("./utils.js"),
    assertType        = utils.assertType,
    createObject      = utils.createObject,
    readProperty      = utils.readProperty,
    callMethod        = utils.callMethod,
    writeProperty     = utils.writeProperty,
    referenceToString = utils.referenceToString;

var module_object = require("./object.js");

/**
 * @static
 */
var __Reference__proto__ = createObject(module_object.__Object__proto__);
Object.defineProperties(__Reference__proto__.data, {
    "toString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var ref = readProperty(obj, "value");
                assertType(ref, DataType.REFERENCE);
                return referenceToString(ref, []);
            }
        )
    }
});

/**
 * @static
 */
var __Reference__ = createObject(module_object.__Class__proto__);
Object.defineProperties(__Reference__.data, {
    "proto": {
        "value": __Reference__proto__
    },
    "ctor": {
        "value": new Value(
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
        )
    }
});

/**
 * @static
 */
var __isReference__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return x.type === DataType.REFERENCE ? __true__ : __false__;
        }
    );

/**
 * @static
 */
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

/**
 * @static
 */
var __readRef__ =
    new Value(
        DataType.FUNCTION,
        function (ref) {
            assertType(ref, DataType.REFERENCE);
            return ref.data;
        }
    );

/**
 * @static
 */
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

/**
 * @static
 */
var __modifyRef__ =
    new Value(
        DataType.FUNCTION,
        function (ref) {
            assertType(ref, DataType.REFERENCE);
            return new Value(
                DataType.FUNCTION,
                function (f) {
                    assertType(f, DataType.FUNCTION);
                    ref.data = calcTailCall(f.data(ref.data));
                    return __unit__;
                }
            );
        }
    );

end_module();
