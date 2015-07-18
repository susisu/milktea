/*
 * milktea : lib/number.js
 * copyright (c) 2015 Susisu
 */

/**
 * @module lib/number
 */

"use strict";

function end_module() {
    Object.freeze(__Number__proto__.data);
    Object.freeze(__Number__.data);

    module.exports = Object.freeze({
        "__Number__proto__": __Number__proto__,
        "__Number__"       : __Number__,
        "__isNumber__"     : __isNumber__,
        "__isNaN__"        : __isNaN__,
        "__isFinite__"     : __isFinite__,
        "__isInteger__"    : __isInteger__,
        "__toInteger__"    : __toInteger__,
        "__parseInt__"     : __parseInt__,
        "__parseFloat__"   : __parseFloat__,
        "__negate__"       : __negate__,
        "__abs__"          : __abs__,
        "__signum__"       : __signum__,
        "__add__"          : __add__,
        "__sub__"          : __sub__,
        "__mul__"          : __mul__,
        "__div__"          : __div__,
        "__mod__"          : __mod__,
        "__pow__"          : __pow__,
        "__round__"        : __round__,
        "__ceiling__"      : __ceiling__,
        "__floor__"        : __floor__,
        "__sqrt__"         : __sqrt__,
        "__exp__"          : __exp__,
        "__log__"          : __log__,
        "__logBase__"      : __logBase__,
        "__sin__"          : __sin__,
        "__cos__"          : __cos__,
        "__tan__"          : __tan__,
        "__asin__"         : __asin__,
        "__acos__"         : __acos__,
        "__atan__"         : __atan__,
        "__atan2__"        : __atan2__
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

var module_object = require("./object.js");

/**
 * @static
 * @desc Prototype of Number class.
 */
var __Number__proto__ = createObject(module_object.__Object__proto__);
Object.defineProperties(__Number__proto__.data, {
    "toString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var num = readProperty(obj, "value");
                assertType(num, DataType.NUMBER);
                return new Value(
                    DataType.STRING,
                    num.toString()
                );
            }
        )
    }
});

/**
 * @static
 * @desc Number class.
 */
var __Number__ = createObject(module_object.__Class__proto__);
Object.defineProperties(__Number__.data, {
    "proto": {
        "value": __Number__proto__
    },
    "ctor": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (value) {
                        assertType(value, DataType.NUMBER);
                        writeProperty(obj, "value", value);
                        return obj;
                    }
                );
            }
        )
    }
});

var __isNumber__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return x.type === DataType.NUMBER ? __true__ : __false__;
        }
    );

/**
 * @static
 * @desc Checks a number is NaN or not.
 */
var __isNaN__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return Number.isNaN(x.data) ? __true__ : __false__;
        }
    );

/**
 * @static
 * @desc Checks a number is finite or not.
 */
var __isFinite__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return Number.isFinite(x.data) ? __true__ : __false__;
        }
    );

/**
 * @static
 * @desc Checks a number is integer or not.
 */
var __isInteger__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return Number.isInteger(x.data) ? __true__ : __false__;
        }
    );

/**
 * @static
 * @desc Convert a number to an integer.
 */
var __toInteger__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                Number.toInteger(x.data)
            );
        }
    );

/**
 * @static
 * @desc Parse a string as integer
 */
var __parseInt__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.NUMBER,
                parseInt(str.data)
            );
        }
    );

/**
 * @static
 * @desc Parse a string as floating point number
 */
var __parseFloat__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.NUMBER,
                parseFloat(str.data)
            );
        }
    );

/**
 * @static
 * @desc Negates a number.
 */
var __negate__ =
    new Value(
        DataType.FUNCTION,
        function (num) {
            assertType(num, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                -num.data
            );
        }
    );

/**
 * @static
 * @desc Returns absolute value of a number.
 */
var __abs__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                Math.abs(x.data)
            );
        }
    );

/**
 * @static
 * @desc Returns sign of a number.
 */
var __signum__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                x.data === 0 ? 0
                : x.data > 0 ? 1
                : -1
            );
        }
    );

/**
 * @static
 */
var __add__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.NUMBER);
                    return new Value(
                        DataType.NUMBER,
                        x.data + y.data
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __sub__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.NUMBER);
                    return new Value(
                        DataType.NUMBER,
                        x.data - y.data
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __mul__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.NUMBER);
                    return new Value(
                        DataType.NUMBER,
                        x.data * y.data
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __div__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.NUMBER);
                    return new Value(
                        DataType.NUMBER,
                        x.data / y.data
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __mod__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.NUMBER);
                    return new Value(
                        DataType.NUMBER,
                        x.data % y.data
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __pow__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.NUMBER);
                    return new Value(
                        DataType.NUMBER,
                        Math.pow(x.data, y.data)
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __round__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                Math.round(x.data)
            );
        }
    );

/**
 * @static
 */
var __ceiling__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                Math.ceil(x.data)
            );
        }
    );

/**
 * @static
 */
var __floor__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                Math.floor(x.data)
            );
        }
    );

/**
 * @static
 */
var __sqrt__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                Math.sqrt(x.data)
            );
        }
    );

/**
 * @static
 */
var __exp__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                Math.exp(x.data)
            );
        }
    );

/**
 * @static
 */
var __log__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                Math.log(x.data)
            );
        }
    );

/**
 * @static
 */
var __logBase__ =
    new Value(
        DataType.FUNCTION,
        function (base) {
            assertType(base, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (x) {
                    assertType(x, DataType.NUMBER);
                    return new Value(
                        DataType.NUMBER,
                        Math.log(x.data) / Math.log(base.data)
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __sin__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                Math.sin(x.data)
            );
        }
    );

/**
 * @static
 */
var __cos__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                Math.cos(x.data)
            );
        }
    );

/**
 * @static
 */
var __tan__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                Math.tan(x.data)
            );
        }
    );

/**
 * @static
 */
var __asin__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                Math.asin(x.data)
            );
        }
    );

/**
 * @static
 */
var __acos__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                Math.acos(x.data)
            );
        }
    );

/**
 * @static
 */
var __atan__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                Math.atan(x.data)
            );
        }
    );

/**
 * @static
 */
var __atan2__ =
    new Value(
        DataType.FUNCTION,
        function (y) {
            assertType(y, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (x) {
                    assertType(x, DataType.NUMBER);
                    return new Value(
                        DataType.NUMBER,
                        Math.atan2(y.data, x.data)
                    );
                }
            );
        }
    );

end_module();
