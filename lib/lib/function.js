/*
 * milktea : lib/function.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "__Function__proto__": __Function__proto__,
        "__Function__"       : __Function__,
        "__compose__"        : __compose__,
        "__flip__"           : __flip__,
        "__apply__"          : __apply__,
        "__reverseApply__"   : __reverseApply__,
        "__on__"             : __on__
    });
}

var core         = require("../core.js"),
    Value        = core.Value,
    DataType     = core.DataType,
    calcTailCall = core.calcTailCall;

var utils         = require("./utils.js"),
    assertType    = utils.assertType,
    createObject  = utils.createObject,
    readProperty  = utils.readProperty,
    writeProperty = utils.writeProperty;

var module_object = require("./object.js");

/**
 * Prototype of Function class.
 */
var __Function__proto__ = createObject(module_object.__Object__proto__);
__Function__proto__.data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            var func = readProperty(obj, "value");
            assertType(func, DataType.FUNCTION);
            return new Value(
                DataType.STRING,
                func.toString()
            );
        }
    );

/**
 * Function class.
 */
var __Function__ = createObject(module_object.__Class__proto__);
__Function__.data["proto"] = __Function__proto__;
__Function__.data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    assertType(value, DataType.FUNCTION);
                    writeProperty(obj, "value", value);
                    return obj;
                }
            );
        }
    );

/**
 * Function composition.
 * <pre> compose g f x = g (f x)</pre>
 */
var __compose__ =
    new Value(
        DataType.FUNCTION,
        function (g) {
            assertType(g, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (f) {
                    assertType(f, DataType.FUNCTION);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            return g.data(calcTailCall(f.data(x)));
                        }
                    );
                }
            );
        }
    );

/**
 * Flips two arguments.
 * <pre>flip f x y = f y x</pre>
 */
var __flip__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (x) {
                    return new Value(
                        DataType.FUNCTION,
                        function (y) {
                            var g = calcTailCall(f.data(y));
                            assertType(g, DataType.FUNCTION);
                            return g.data(x);
                        }
                    );
                }
            );
        }
    );

/**
 * Application.
 * <pre>apply f x = f x</pre>
 */
var __apply__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (x) {
                    return f.data(x);
                }
            );
        }
    );

/**
 * Reverse application.
 * <pre>reverseApply x f = f x</pre>
 */
var __reverseApply__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return new Value(
                DataType.FUNCTION,
                function (f) {
                    assertType(f, DataType.FUNCTION);
                    return f.data(x);
                }
            );
        }
    );

var __on__ =
    new Value(
        DataType.FUNCTION,
        function (op) {
            assertType(op, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (f) {
                    assertType(f, DataType.FUNCTION);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            return new Value(
                                DataType.FUNCTION,
                                function (y) {
                                    var u = calcTailCall(f.data(x));
                                    var v = calcTailCall(f.data(y));
                                    var t = calcTailCall(op.data(u));
                                    assertType(t, DataType.FUNCTION);
                                    return t.data(v);
                                }
                            );
                        }
                    );
                }
            );
        }
    );

end_module();
