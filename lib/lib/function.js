/*
 * milktea : lib/function.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "__id__"          : __id__,
        "__const__"       : __const__,
        "__compose__"     : __compose__,
        "__flip__"        : __flip__,
        "__apply__"       : __apply__,
        "__reverseApply__": __reverseApply__
    });
}

var __id__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return x;
        }
    );

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

var __compose__ =
    new Value(
        DataType.FUNCTION,
        function (g) {
            utils.assertType(g, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (f) {
                    utils.assertType(f, DataType.FUNCTION);
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

var __flip__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            utils.assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (x) {
                    return new Value(
                        DataType.FUNCTION,
                        function (y) {
                            var g = calcTailCall(f.data(y));
                            utils.assertType(g, DataType.FUNCTION);
                            return g.data(x);
                        }
                    );
                }
            );
        }
    );

var __apply__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            utils.assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (x) {
                    return f.data(x);
                }
            );
        }
    );

var __reverseApply__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return new Value(
                DataType.FUNCTION,
                function (f) {
                    utils.assertType(f, DataType.FUNCTION);
                    return f.data(x);
                }
            );
        }
    );

end_module();
