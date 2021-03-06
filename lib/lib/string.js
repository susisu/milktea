/*
 * milktea : lib/string.js
 * copyright (c) 2015 Susisu
 */

/**
 * @module lib/string
 */

"use strict";

function end_module() {
    Object.freeze(__String__proto__.data);
    Object.freeze(__String__.data);

    module.exports = Object.freeze({
        "__String__proto__"  : __String__proto__,
        "__String__"         : __String__,
        "__isString__"       : __isString__,
        "__charAt__"         : __charAt__,
        "__charCodeAt__"     : __charCodeAt__,
        "__charCode__"       : __charCode__,
        "__fromCharCode__"   : __fromCharCode__,
        "__length__"         : __length__,
        "__empty__"          : __empty__,
        "__toUpperCase__"    : __toUpperCase__,
        "__toLowerCase__"    : __toLowerCase__,
        "__reverse__"        : __reverse__,
        "__concat__"         : __concat__,
        "__split__"          : __split__,
        "__lines__"          : __lines__,
        "__words__"          : __words__,
        "__replace__"        : __replace__,
        "__replaceWith__"    : __replaceWith__,
        "__trim__"           : __trim__,
        "__slice__"          : __slice__,
        "__indexOfFrom__"    : __indexOfFrom__,
        "__indexOf__"        : __indexOf__,
        "__lastIndexOfFrom__": __lastIndexOfFrom__,
        "__lastIndexOf__"    : __lastIndexOf__,
        "__cycle__"          : __cycle__
    });
}

var core         = require("../core.js"),
    Value        = core.Value,
    DataType     = core.DataType,
    calcTailCall = core.calcTailCall,
    __true__     = core.__true__,
    __false__    = core.__false__;

var errors = require("../errors.js");

var utils         = require("./utils.js"),
    assertType    = utils.assertType,
    createObject  = utils.createObject,
    readProperty  = utils.readProperty,
    writeProperty = utils.writeProperty;

var module_object = require("./object.js");

/**
 * @static
 */
var __String__proto__ = createObject(module_object.__Object__proto__);
Object.defineProperties(__String__proto__.data, {
    "toString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var str = readProperty(obj, "value");
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.STRING,
                    str.toString()
                );
            }
        )
    },
    "length": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var str = readProperty(obj, "value");
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.NUMBER,
                    str.data.length
                );
            }
        )
    }
});

/**
 * @static
 */
var __String__ = createObject(module_object.__Class__proto__);
Object.defineProperties(__String__.data, {
    "proto": {
        "value": __String__proto__
    },
    "ctor": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (value) {
                        assertType(value, DataType.STRING);
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
var __isString__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return x.type === DataType.STRING ? __true__ : __false__;
        }
    );

/**
 * @static
 */
var __charAt__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.FUNCTION,
                function (index) {
                    assertType(index, DataType.NUMBER);
                    var i = index.data | 0;
                    var len = str.data.length;
                    if (i < 0 || i >= len) {
                        throw errors.outOfRangeError(undefined, i);
                    }
                    return new Value(
                        DataType.STRING,
                        str.data.charAt(i)
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __charCodeAt__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.FUNCTION,
                function (index) {
                    assertType(index, DataType.NUMBER);
                    var i = index.data | 0;
                    var len = str.data.length;
                    if (i < 0 || i >= len) {
                        throw errors.outOfRangeError(undefined, i);
                    }
                    return new Value(
                        DataType.NUMBER,
                        str.data.charCodeAt(i)
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __charCode__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            if (str.data == "") {
                throw errors.outOfRangeError(undefined, 0);
            }
            return new Value(
                DataType.NUMBER,
                str.data.charCodeAt(0)
            );
        }
    );

/**
 * @static
 */
var __fromCharCode__ =
    new Value(
        DataType.FUNCTION,
        function (n) {
            assertType(n, DataType.NUMBER);
            return new Value(
                DataType.STRING,
                String.fromCharCode(n.data)
            );
        }
    );

/**
 * @static
 */
var __length__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.NUMBER,
                str.data.length
            );
        }
    );

/**
 * @static
 */
var __empty__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return str.data === "" ? __true__ : __false__;
        }
    );

/**
 * @static
 */
var __toUpperCase__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.STRING,
                str.data.toUpperCase()
            );
        }
    );

/**
 * @static
 */
var __toLowerCase__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.STRING,
                str.data.toLowerCase()
            );
        }
    );

/**
 * @static
 */
var __reverse__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.STRING,
                str.data.split("").reverse().join("")
            );
        }
    );

/**
 * @static
 */
var __concat__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.STRING);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.STRING);
                    return new Value(
                        DataType.STRING,
                        x.data + y.data
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __split__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.FUNCTION,
                function (sep) {
                    assertType(sep, DataType.STRING);
                    return new Value(
                        DataType.ARRAY,
                        str.data.split(sep.data).map(function (elem) {
                            return new Value(
                                DataType.STRING,
                                elem
                            );
                        })
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __lines__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            var ls = str.data.split("\n");
            if (ls.length > 0 && ls[ls.length - 1] === "") {
                ls = ls.slice(0, -1);
            }
            return new Value(
                DataType.ARRAY,
                ls.map(function (elem) {
                    return new Value(
                        DataType.STRING,
                        elem
                    );
                })
            );
        }
    );

/**
 * @static
 */
var __words__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            var ws = str.data.split(/\s+/);
            if (ws.length > 0 && ws[ws.length - 1] === "") {
                ws = ws.slice(0, -1);
            }
            return new Value(
                DataType.ARRAY,
                ws.map(function (elem) {
                    return new Value(
                        DataType.STRING,
                        elem
                    );
                })
            );
        }
    );

/**
 * @static
 */
var __replace__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.FUNCTION,
                function (substr) {
                    assertType(substr, DataType.STRING);
                    return new Value(
                        DataType.FUNCTION,
                        function (newSubstr) {
                            assertType(newSubstr, DataType.STRING);
                            return new Value(
                                DataType.STRING,
                                str.data.replace(substr.data, newSubstr.data)
                            );
                        }
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __replaceWith__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.FUNCTION,
                function (substr) {
                    assertType(substr, DataType.STRING);
                    return new Value(
                        DataType.FUNCTION,
                        function (f) {
                            assertType(f, DataType.FUNCTION);
                            return new Value(
                                DataType.STRING,
                                str.data.replace(substr.data, function (rep) {
                                    var newSubstr = calcTailCall(f.data(
                                            new Value(DataType.STRING, rep)
                                        ));
                                    assertType(newSubstr, DataType.STRING);
                                    return newSubstr.data;
                                })
                            );
                        }
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __trim__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.STRING,
                str.data.trim()
            );
        }
    );

/**
 * @static
 */
var __slice__ =
    new Value(
        DataType.FUNCTION,
        function (begin) {
            assertType(begin, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (end) {
                    assertType(end, DataType.NUMBER);
                    return new Value(
                        DataType.FUNCTION,
                        function (str) {
                            assertType(str, DataType.STRING);
                            return new Value(
                                DataType.STRING,
                                str.data.slice(begin.data, end.data)
                            );
                        }
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __indexOfFrom__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.FUNCTION,
                function (v) {
                    assertType(v, DataType.STRING);
                    return new Value(
                        DataType.FUNCTION,
                        function (from) {
                            assertType(from, DataType.NUMBER);
                            var len = str.data.length;
                            var fromIndex = from.data;
                            if (fromIndex < 0) {
                                fromIndex = 0;
                            }
                            else if (fromIndex > len) {
                                fromIndex = len;
                            }
                            return new Value(
                                DataType.NUMBER,
                                str.data.indexOf(v.data, fromIndex)
                            );
                        }
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __indexOf__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.FUNCTION,
                function (v) {
                    assertType(v, DataType.STRING);
                    return new Value(
                        DataType.NUMBER,
                        str.data.indexOf(v.data, 0)
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __lastIndexOfFrom__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.FUNCTION,
                function (v) {
                    assertType(v, DataType.STRING);
                    return new Value(
                        DataType.FUNCTION,
                        function (from) {
                            assertType(from, DataType.NUMBER);
                            var len = str.data.length;
                            var fromIndex = from.data;
                            if (fromIndex < 0) {
                                fromIndex = 0;
                            }
                            else if (fromIndex > len) {
                                fromIndex = len;
                            }
                            return new Value(
                                DataType.NUMBER,
                                str.data.lastIndexOf(v.data, fromIndex)
                            );
                        }
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __lastIndexOf__ =
    new Value(
        DataType.FUNCTION,
        function (str) {
            assertType(str, DataType.STRING);
            return new Value(
                DataType.FUNCTION,
                function (v) {
                    assertType(v, DataType.STRING);
                    var len = str.data.length;
                    return new Value(
                        DataType.NUMBER,
                        str.data.lastIndexOf(v.data, len)
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __cycle__ =
    new Value(
        DataType.FUNCTION,
        function (n) {
            assertType(n, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (str) {
                    assertType(str, DataType.STRING);
                    var newStr = "";
                    for (var i = 0; i < n.data; i++) {
                        newStr += str.data;
                    }
                    return new Value(
                        DataType.STRING,
                        newStr
                    );
                }
            );
        }
    );

end_module();
