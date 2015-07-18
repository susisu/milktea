/*
 * milktea : lib/general.js
 * copyright (c) 2015 Susisu
 */

/**
 * @module lib/general
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "__id__"                  : __id__,
        "__const__"               : __const__,
        "__trace__"               : __trace__,
        "__error__"               : __error__,
        "__typeOf__"              : __typeOf__,
        "__max__"                 : __max__,
        "__min__"                 : __min__,
        "__equalTo__"             : __equalTo__,
        "__notEqualTo__"          : __notEqualTo__,
        "__lessThan__"            : __lessThan__,
        "__lessThanOrEqualTo__"   : __lessThanOrEqualTo__,
        "__greaterThan__"         : __greaterThan__,
        "__greaterThanOrEqualTo__": __greaterThanOrEqualTo__,
        "__compare__"             : __compare__
    });
}

var core      = require("../core.js"),
    Value     = core.Value,
    DataType  = core.DataType,
    __unit__  = core.__unit__,
    __true__  = core.__true__,
    __false__ = core.__false__;

var errors = require("../errors.js");

var utils       = require("./utils.js"),
    assertType  = utils.assertType,
    assertTypes = utils.assertTypes;

/**
 * @static
 * @desc Identity function.
 *     <pre>id x = x</pre>
 */
var __id__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return x;
        }
    );

/**
 * @static
 * @desc Constant function.
 *     <pre>const x _ = x</pre>
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

/**
 * @static
 */
var __trace__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            console.log(x);
            return __unit__;
        }
    );

/**
 * @static
 */
var __error__ =
    new Value(
        DataType.FUNCTION,
        function (mes) {
            assertType(mes, DataType.STRING);
            throw new errors.RuntimeError([], mes.data);
            return __unit__;
        }
    );

/**
 * @static
 */
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

/**
 * @static
 */
var __max__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertTypes(x, [DataType.NUMBER, DataType.STRING]);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, x.type);
                    return x.data >= y.data ? x : y;
                }
            );
        }
    );

/**
 * @static
 */
var __min__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertTypes(x, [DataType.NUMBER, DataType.STRING]);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, x.type);
                    return x.data <= y.data ? x : y;
                }
            );
        }
    );

/**
 * @static
 */
var __equalTo__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, x.type);
                    return x.data === y.data ? __true__ : __false__;
                }
            );
        }
    );

/**
 * @static
 */
var __notEqualTo__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, x.type);
                    return x.data !== y.data ? __true__ : __false__;
                }
            );
        }
    );

/**
 * @static
 */
var __lessThan__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertTypes(x, [DataType.NUMBER, DataType.STRING]);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, x.type);
                    return x.data < y.data ? __true__ : __false__;
                }
            );
        }
    );

/**
 * @static
 */
var __lessThanOrEqualTo__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertTypes(x, [DataType.NUMBER, DataType.STRING]);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, x.type);
                    return x.data <= y.data ? __true__ : __false__;
                }
            );
        }
    );

/**
 * @static
 */
var __greaterThan__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertTypes(x, [DataType.NUMBER, DataType.STRING]);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, x.type);
                    return x.data > y.data ? __true__ : __false__;
                }
            );
        }
    );

/**
 * @static
 */
var __greaterThanOrEqualTo__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertTypes(x, [DataType.NUMBER, DataType.STRING]);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, x.type);
                    return x.data >= y.data ? __true__ : __false__;
                }
            );
        }
    );

/**
 * @static
 */
var __compare__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertTypes(x, [DataType.NUMBER, DataType.STRING]);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, x.type);
                    switch (x.type) {
                        case DataType.NUMBER:
                            if (Number.isNaN(x.data)) {
                                return new Value(
                                    DataType.NUMBER,
                                    1
                                );
                            }
                            if (Number.isNaN(y.data)) {
                                return new Value(
                                    DataType.NUMBER,
                                    -1
                                );
                            }
                            if (__lessThan__.data(x).data(y).data) {
                                return new Value(
                                    DataType.NUMBER,
                                    -1
                                );
                            }
                            if (__greaterThan__.data(x).data(y).data) {
                                return new Value(
                                    DataType.NUMBER,
                                    1
                                );
                            }
                            return new Value(
                                DataType.NUMBER,
                                0
                            );
                        case DataType:STRING:
                            if (__lessThan__.data(x).data(y).data) {
                                return new Value(
                                    DataType.NUMBER,
                                    -1
                                );
                            }
                            if (__greaterThan__.data(x).data(y).data) {
                                return new Value(
                                    DataType.NUMBER,
                                    1
                                );
                            }
                            return new Value(
                                DataType.NUMBER,
                                0
                            );
                    }
                }
            );
        }
    );

end_module();
