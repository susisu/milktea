/*
 * milktea : lib/general.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "__id__"    : __id__,
        "__const__" : __const__,
        "__trace__" : __trace__,
        "__error__" : __error__,
        "__typeOf__": __typeOf__
    });
}

var core     = require("../core.js"),
    Value    = core.Value,
    DataType = core.DataType,
    __unit__ = core.__unit__;

var errors = require("../errors.js");

var utils      = require("./utils.js"),
    assertType = utils.assertType;

/**
 * Identity function.
 * <pre>id x = x</pre>
 */
var __id__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return x;
        }
    );

/**
 * Constant function.
 * <pre>const x _ = x</pre>
 */
var __const__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    return x;
                }
            );
        }
    );

var __trace__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            console.log(x);
            return __unit__;
        }
    );

var __error__ =
    new Value(
        DataType.FUNCTION,
        function (mes) {
            assertType(mes, DataType.STRING);
            throw new errors.RuntimeError([], mes.data);
            return __unit__;
        }
    );

var __typeOf__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return new Value(
                DataType.STRING,
                x.type
            );
        }
    );

end_module();
