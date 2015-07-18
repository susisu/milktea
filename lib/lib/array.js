/*
 * milktea : lib/array.js
 * copyright (c) 2015 Susisu
 */

/**
 * @module lib/array
 */

"use strict";

function end_module() {
    Object.freeze(__Array__proto__.data);
    Object.freeze(__Array__.data);

    module.exports = Object.freeze({
        "__Array__proto__"     : __Array__proto__,
        "__Array__"            : __Array__,
        "__isArray__"          : __isArray__,
        "__newArray__"         : __newArray__,
        "__readArray__"        : __readArray__,
        "__writeArray__"       : __writeArray__,
        "__pop__"              : __pop__,
        "__push__"             : __push__,
        "__shift__"            : __shift__,
        "__unshift__"          : __unshift__,
        "__head__"             : __head__,
        "__last__"             : __last__,
        "__tail__"             : __tail__,
        "__init__"             : __init__,
        "__fst__"              : __fst__,
        "__snd__"              : __snd__,
        "__length__"           : __length__,
        "__empty__"            : __empty__,
        "__reverse__"          : __reverse__,
        "__concat__"           : __concat__,
        "__join__"             : __join__,
        "__map__"              : __map__,
        "__map$__"             : __map$__,
        "__for__"              : __for__,
        "__for$__"             : __for$__,
        "__foldl__"            : __foldl__,
        "__foldl1__"           : __foldl1__,
        "__foldr__"            : __foldr__,
        "__foldr1__"           : __foldr1__,
        "__all__"              : __all__,
        "__any__"              : __any__,
        "__sum__"              : __sum__,
        "__product__"          : __product__,
        "__maximum__"          : __maximum__,
        "__minimum__"          : __minimum__,
        "__take__"             : __take__,
        "__drop__"             : __drop__,
        "__takeWhile__"        : __takeWhile__,
        "__dropWhile__"        : __dropWhile__,
        "__slice__"            : __slice__,
        "__sortBy__"           : __sortBy__,
        "__sort__"             : __sort__,
        "__sortOn__"           : __sortOn__,
        "__findIndexFrom__"    : __findIndexFrom__,
        "__findIndex__"        : __findIndex__,
        "__findLastIndexFrom__": __findLastIndexFrom__,
        "__findLastIndex__"    : __findLastIndex__,
        "__elemIndexFrom__"    : __elemIndexFrom__,
        "__elemIndex__"        : __elemIndex__,
        "__elemLastIndexFrom__": __elemLastIndexFrom__,
        "__elemLastIndex__"    : __elemLastIndex__,
        "__elem__"             : __elem__,
        "__notElem__"          : __notElem__,
        "__zip__"              : __zip__,
        "__zipWith__"          : __zipWith__,
        "__range__"            : __range__,
        "__range$__"           : __range$__,
        "__replicate__"        : __replicate__,
        "__cycle__"            : __cycle__
    });
}

var core         = require("../core.js"),
    Value        = core.Value,
    DataType     = core.DataType,
    calcTailCall = core.calcTailCall,
    __unit__     = core.__unit__,
    __true__     = core.__true__,
    __false__    = core.__false__;

var errors = require("../errors.js");

var utils         = require("./utils.js"),
    assertType    = utils.assertType,
    createObject  = utils.createObject,
    readProperty  = utils.readProperty,
    callMethod    = utils.callMethod,
    writeProperty = utils.writeProperty,
    arrayToString = utils.arrayToString;

var module_general  = require("./general.js"),
    module_object   = require("./object.js"),
    module_number   = require("./number.js"),
    module_bool     = require("./bool.js"),
    module_function = require("./function.js");

/**
 * @static
 */
var __Array__proto__ = createObject(module_object.__Object__proto__);
Object.defineProperties(__Array__proto__.data, {
    "toString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var arr = readProperty(obj, "value");
                assertType(arr, DataType.ARRAY);
                return arrayToString(arr, []);
            }
        )
    },
    "length": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var arr = readProperty(obj, "value");
                assertType(arr, DataType.ARRAY);
                return new Value(
                    DataType.NUMBER,
                    arr.data.length
                );
            }
        )
    }
});

/**
 * @static
 */
var __Array__ = createObject(module_object.__Class__proto__);
Object.defineProperties(__Array__.data, {
    "proto": {
        "value": __Array__proto__
    },
    "ctor": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (value) {
                        assertType(value, DataType.ARRAY);
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
var __isArray__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return x.type === DataType.ARRAY ? __true__ : __false__;
        }
    );

/**
 * @static
 */
var __newArray__ =
    new Value(
        DataType.FUNCTION,
        function (len) {
            assertType(len, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (x) {
                    var arr = [];
                    for (var i = 0; i < len.data; i++) {
                        arr.push(x);
                    }
                    return new Value(
                        DataType.ARRAY,
                        arr
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __readArray__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            return new Value(
                DataType.FUNCTION,
                function (index) {
                    assertType(index, DataType.NUMBER);
                    var i = index.data | 0;
                    var len = arr.data.length;
                    if (i < 0 || i >= len) {
                        throw errors.outOfRangeError(undefined, i);
                    }
                    return arr.data[i];
                }
            );
        }
    );

/**
 * @static
 */
var __writeArray__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            return new Value(
                DataType.FUNCTION,
                function (index) {
                    assertType(index, DataType.NUMBER);
                    var i = index.data | 0;
                    var len = arr.data.length;
                    if (i < 0 || i >= len) {
                        throw errors.outOfRangeError(undefined, i);
                    }
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            arr.data[i] = x;
                            return __unit__;
                        }
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __pop__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.FUNCTION);
            if (arr.data.length === 0) {
                throw errors.emptyArrayError(undefined);
            }
            return arr.data.pop();
        }
    );

/**
 * @static
 */
var __push__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            return new Value(
                DataType.FUNCTION,
                function (x) {
                    arr.data.push(x);
                    return __unit__;
                }
            );
        }
    );

/**
 * @static
 */
var __shift__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.FUNCTION);
            if (arr.data.length === 0) {
                throw errors.emptyArrayError(undefined);
            }
            return arr.data.shift();
        }
    );

/**
 * @static
 */
var __unshift__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            return new Value(
                DataType.FUNCTION,
                function (x) {
                    arr.data.unshift(x);
                    return __unit__;
                }
            );
        }
    );

/**
 * @static
 */
var __head__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            var len = arr.data.length;
            if (len === 0) {
                throw errors.emptyArrayError(undefined);
            }
            return arr.data[0];
        }
    );

/**
 * @static
 */
var __last__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            var len = arr.data.length;
            if (len === 0) {
                throw errors.emptyArrayError(undefined);
            }
            return arr.data[len - 1];
        }
    );

/**
 * @static
 */
var __tail__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            var len = arr.data.length;
            if (len === 0) {
                throw errors.emptyArrayError(undefined);
            }
            return new Value(
                DataType.ARRAY,
                arr.data.slice(1)
            );
        }
    );

/**
 * @static
 */
var __init__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            var len = arr.data.length;
            if (len === 0) {
                throw errors.emptyArrayError(undefined);
            }
            return new Value(
                DataType.ARRAY,
                arr.data.slice(0, len - 1)
            );
        }
    );

/**
 * @static
 */
var __fst__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            return __readArray__
                .data(arr)
                .data(new Value(DataType.NUMBER, 0));
        }
    );

/**
 * @static
 */
var __snd__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            return __readArray__
                .data(arr)
                .data(new Value(DataType.NUMBER, 1));
        }
    );

/**
 * @static
 */
var __length__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            return new Value(
                DataType.NUMBER,
                arr.data.length
            );
        }
    );

/**
 * @static
 */
var __empty__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            var len = arr.data.length;
            return len === 0 ? __true__ : __false__;
        }
    );

/**
 * @static
 */
var __reverse__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            var rev = arr.data.slice().reverse();
            return new Value(
                DataType.ARRAY,
                rev
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
            assertType(x, DataType.ARRAY);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.ARRAY);
                    return new Value(
                        DataType.ARRAY,
                        x.data.concat(y.data)
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __join__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            return new Value(
                DataType.FUNCTION,
                function (sep) {
                    assertType(sep, DataType.STRING);
                    return new Value(
                        DataType.STRING,
                        arr.data
                            .map(function (elem) {
                                assertType(elem, DataType.STRING);
                                return elem.data;
                            })
                            .join(sep.data)
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __map__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (arr) {
                    assertType(arr, DataType.ARRAY);
                    return new Value(
                        DataType.ARRAY,
                        arr.data.map(function (elem) {
                            return calcTailCall(f.data(elem));
                        })
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __map$__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (arr) {
                    assertType(arr, DataType.ARRAY);
                    arr.data.forEach(function (elem) {
                        calcTailCall(f.data(elem));
                    });
                    return __unit__;
                }
            );
        }
    );

/**
 * @static
 */
var __for__ = calcTailCall(module_function.__flip__.data(__map__));
/**
 * @static
 */
var __for$__ = calcTailCall(module_function.__flip__.data(__map$__));

/**
 * @static
 */
var __foldl__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (init) {
                    return new Value(
                        DataType.FUNCTION,
                        function (arr) {
                            assertType(arr, DataType.ARRAY);
                            return arr.data.reduce(
                                function (accum, elem) {
                                    var g = calcTailCall(f.data(accum));
                                    assertType(g, DataType.FUNCTION);
                                    return calcTailCall(g.data(elem));
                                },
                                init
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
var __foldl1__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (arr) {
                    assertType(arr, DataType.ARRAY);
                    var len = arr.data.length;
                    if (len === 0) {
                        throw errors.emptyArrayError(undefined);
                    }
                    return arr.data.reduce(
                        function (accum, elem) {
                            var g = calcTailCall(f.data(accum));
                            assertType(g, DataType.FUNCTION);
                            return calcTailCall(g.data(elem));
                        }
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __foldr__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (init) {
                    return new Value(
                        DataType.FUNCTION,
                        function (arr) {
                            assertType(arr, DataType.ARRAY);
                            return arr.data.reduceRight(
                                function (accum, elem) {
                                    var g = calcTailCall(f.data(elem));
                                    assertType(g, DataType.FUNCTION);
                                    return calcTailCall(g.data(accum));
                                },
                                init
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
var __foldr1__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (arr) {
                    assertType(arr, DataType.ARRAY);
                    var len = arr.data.length;
                    if (len === 0) {
                        throw errors.emptyArrayError(undefined);
                    }
                    return arr.data.reduceRight(
                        function (accum, elem) {
                            var g = calcTailCall(f.data(elem));
                            assertType(g, DataType.FUNCTION);
                            return calcTailCall(g.data(accum));
                        }
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __all__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (arr) {
                    assertType(arr, DataType.ARRAY);
                    return arr.data.every(
                        function (elem) {
                            var b = calcTailCall(f.data(elem));
                            assertType(b, DataType.BOOL);
                            return b.data;
                        }
                    ) ? __true__ : __false__;
                }
            );
        }
    );

/**
 * @static
 */
var __any__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (arr) {
                    assertType(arr, DataType.ARRAY);
                    return arr.data.some(
                        function (elem) {
                            var b = calcTailCall(f.data(elem));
                            assertType(b, DataType.BOOL);
                            return b.data;
                        }
                    ) ? __true__ : __false__;
                }
            );
        }
    );

/**
 * @static
 */
var __sum__ =
    __foldl__
        .data(module_number.__add__)
        .data(new Value(DataType.NUMBER, 0));

/**
 * @static
 */
var __product__ =
    __foldl__
        .data(module_number.__mul__)
        .data(new Value(DataType.NUMBER, 1));

/**
 * @static
 */
var __maximum__ = __foldl1__.data(module_general.__max__);

/**
 * @static
 */
var __minimum__ = __foldl1__.data(module_general.__min__);

/**
 * @static
 */
var __take__ =
    new Value(
        DataType.FUNCTION,
        function (n) {
            assertType(n, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (arr) {
                    assertType(arr, DataType.ARRAY);
                    return new Value(
                        DataType.ARRAY,
                        arr.data.slice(0, n)
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __drop__ =
    new Value(
        DataType.FUNCTION,
        function (n) {
            assertType(n, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (arr) {
                    assertType(arr, DataType.ARRAY);
                    return new Value(
                        DataType.ARRAY,
                        arr.data.slice(n)
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __takeWhile__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (arr) {
                    assertType(arr, DataType.ARRAY);
                    var end = 0;
                    arr.data.every(function (elem) {
                        var b = calcTailCall(f.data(elem));
                        assertType(b, DataType.BOOL);
                        if (b.data) {
                            end++;
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    return new Value(
                        DataType.ARRAY,
                        arr.data.slice(0, end)
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __dropWhile__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (arr) {
                    assertType(arr, DataType.ARRAY);
                    var begin = 0;
                    arr.data.every(function (elem) {
                        var b = calcTailCall(f.data(elem));
                        assertType(b, DataType.BOOL);
                        if (b.data) {
                            begin++;
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    return new Value(
                        DataType.ARRAY,
                        arr.data.slice(begin)
                    );
                }
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
                        function (arr) {
                            assertType(arr, DataType.ARRAY);
                            return new Value(
                                DataType.ARRAY,
                                arr.data.slice(begin.data, end.data)
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
var __sortBy__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (arr) {
                    assertType(arr, DataType.ARRAY);
                    return new Value(
                        DataType.ARRAY,
                        arr.data.slice().sort(function (x, y) {
                            var g = calcTailCall(f.data(x));
                            assertType(g, DataType.FUNCTION);
                            var ord = calcTailCall(g.data(y));
                            assertType(ord, DataType.NUMBER);
                            return ord.data;
                        })
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __sort__ = __sortBy__.data(module_general.__compare__);

/**
 * @static
 */
var __sortOn__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (arr) {
                    assertType(arr, DataType.ARRAY);
                    return new Value(
                        DataType.ARRAY,
                        arr.data
                            .map(function (elem) {
                                return [calcTailCall(f.data(elem)), elem];
                            })
                            .sort(function (x, y) {
                                var g = calcTailCall(module_general.__compare__.data(x[0]));
                                assertType(g, DataType.FUNCTION);
                                var ord = calcTailCall(g.data(y[0]));
                                assertType(ord, DataType.NUMBER);
                                return ord.data;
                            })
                            .map(function (p) {
                                return p[1];
                            })
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __findIndexFrom__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (from) {
                    assertType(from, DataType.NUMBER);
                    return new Value(
                        DataType.FUNCTION,
                        function (arr) {
                            assertType(arr, DataType.ARRAY);
                            var len = arr.data.length;
                            if (len === 0) {
                                return new Value(
                                    DataType.NUMBER,
                                    -1
                                );
                            }
                            else {
                                var fromIndex = from.data;
                                if (fromIndex < 0) {
                                    fromIndex = 0;
                                }
                                else if (fromIndex >= len) {
                                    return new Value(
                                        DataType.NUMBER,
                                        -1
                                    );
                                }
                                for (var i = fromIndex; i < len; i++) {
                                    var b = calcTailCall(f.data(arr.data[i]));
                                    assertType(b, DataType.BOOL);
                                    if (b.data) {
                                        return new Value(
                                            DataType.NUMBER,
                                            i
                                        );
                                    }
                                }
                                return new Value(
                                    DataType.NUMBER,
                                    -1
                                );
                            }
                        }
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __findIndex__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (arr) {
                    assertType(arr, DataType.ARRAY);
                    var len = arr.data.length;
                    if (len === 0) {
                        return new Value(
                            DataType.NUMBER,
                            -1
                        );
                    }
                    else {
                        for (var i = 0; i < len; i++) {
                            var b = calcTailCall(f.data(arr.data[i]));
                            assertType(b, DataType.BOOL);
                            if (b.data) {
                                return new Value(
                                    DataType.NUMBER,
                                    i
                                );
                            }
                        }
                        return new Value(
                            DataType.NUMBER,
                            -1
                        );
                    }
                }
            );
        }
    );

/**
 * @static
 */
var __findLastIndexFrom__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (from) {
                    assertType(from, DataType.NUMBER);
                    return new Value(
                        DataType.FUNCTION,
                        function (arr) {
                            assertType(arr, DataType.ARRAY);
                            var len = arr.data.length;
                            if (len === 0) {
                                return new Value(
                                    DataType.NUMBER,
                                    -1
                                );
                            }
                            else {
                                var fromIndex = from.data;
                                if (fromIndex < 0) {
                                    return new Value(
                                        DataType.NUMBER,
                                        -1
                                    );
                                }
                                else if (fromIndex >= len) {
                                    fromIndex = len - 1;
                                }
                                for (var i = fromIndex; i >= 0; i--) {
                                    var b = calcTailCall(f.data(arr.data[i]));
                                    assertType(b, DataType.BOOL);
                                    if (b.data) {
                                        return new Value(
                                            DataType.NUMBER,
                                            i
                                        );
                                    }
                                }
                                return new Value(
                                    DataType.NUMBER,
                                    -1
                                );
                            }
                        }
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __findLastIndex__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (arr) {
                    assertType(arr, DataType.ARRAY);
                    var len = arr.data.length;
                    if (len === 0) {
                        return new Value(
                            DataType.NUMBER,
                            -1
                        );
                    }
                    else {
                        for (var i = len - 1; i >= 0; i--) {
                            var b = calcTailCall(f.data(arr.data[i]));
                            assertType(b, DataType.BOOL);
                            if (b.data) {
                                return new Value(
                                    DataType.NUMBER,
                                    i
                                );
                            }
                        }
                        return new Value(
                            DataType.NUMBER,
                            -1
                        );
                    }
                }
            );
        }
    );

/**
 * @static
 */
var __elemIndexFrom__ =
    new Value(
        DataType.FUNCTION,
        function (elem) {
            var f = calcTailCall(module_general.__equalTo__.data(elem));
            return __findIndexFrom__.data(f);
        }
    );

/**
 * @static
 */
var __elemIndex__ =
    new Value(
        DataType.FUNCTION,
        function (elem) {
            var f = calcTailCall(module_general.__equalTo__.data(elem));
            return __findIndex__.data(f);
        }
    );

/**
 * @static
 */
var __elemLastIndexFrom__ =
    new Value(
        DataType.FUNCTION,
        function (elem) {
            var f = calcTailCall(module_general.__equalTo__.data(elem));
            return __findLastIndexFrom__.data(f);
        }
    );

/**
 * @static
 */
var __elemLastIndex__ =
    new Value(
        DataType.FUNCTION,
        function (elem) {
            var f = calcTailCall(module_general.__equalTo__.data(elem));
            return __findLastIndex__.data(f);
        }
    );

/**
 * @static
 */
var __elem__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            var f = calcTailCall(module_general.__equalTo__.data(x));
            return __any__.data(f);
        }
    );

/**
 * @static
 */
var __notElem__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            var f = calcTailCall(module_general.__equalTo__.data(x));
            var g = calcTailCall(module_function.__compose__.data(module_bool.__not__));
            return g.data(__any__.data(f));
        }
    );

/**
 * @static
 */
var __zip__ =
    new Value(
        DataType.FUNCTION,
        function (as) {
            assertType(as, DataType.ARRAY);
            return new Value(
                DataType.FUNCTION,
                function (bs) {
                    assertType(bs, DataType.ARRAY);
                    var cs = [];
                    var len = Math.min(as.data.length, bs.data.length);
                    for (var i = 0; i < len; i++) {
                        cs.push(new Value(DataType.ARRAY, [as.data[i], bs.data[i]]));
                    }
                    return new Value(
                        DataType.ARRAY,
                        cs
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __zipWith__ =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (as) {
                    assertType(as, DataType.ARRAY);
                    return new Value(
                        DataType.FUNCTION,
                        function (bs) {
                            assertType(bs, DataType.ARRAY);
                            var cs = [];
                            var len = Math.min(as.data.length, bs.data.length);
                            for (var i = 0; i < len; i++) {
                                var g = calcTailCall(f.data(as.data[i]));
                                assertType(g, DataType.FUNCTION);
                                cs.push(calcTailCall(g.data(bs.data[i])));
                            }
                            return new Value(
                                DataType.ARRAY,
                                cs
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
var __range__ =
    new Value(
        DataType.FUNCTION,
        function (first) {
            assertType(first, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (last) {
                    assertType(last, DataType.NUMBER);
                    return new Value(
                        DataType.FUNCTION,
                        function (step) {
                            assertType(step, DataType.NUMBER);
                            var arr = [];
                            for (var i = first.data; i <= last.data; i += step.data) {
                                arr.push(new Value(DataType.NUMBER, i));
                            }
                            return new Value(
                                DataType.ARRAY,
                                arr
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
var __range$__ =
    new Value(
        DataType.FUNCTION,
        function (first) {
            assertType(first, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (last) {
                    assertType(last, DataType.NUMBER);
                    var arr = [];
                    for (var i = first.data; i <= last.data; i++) {
                        arr.push(new Value(DataType.NUMBER, i));
                    }
                    return new Value(
                        DataType.ARRAY,
                        arr
                    );
                }
            );
        }
    );

/**
 * @static
 */
var __replicate__ =
    new Value(
        DataType.FUNCTION,
        function (n) {
            assertType(n, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (elem) {
                    var arr = [];
                    for (var i = 0; i < n.data; i++) {
                        arr.push(elem);
                    }
                    return new Value(
                        DataType.ARRAY,
                        arr
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
                function (arr) {
                    assertType(arr, DataType.ARRAY);
                    var len = arr.data.length;
                    var retArr = [];
                    for (var i = 0; i < n.data; i++) {
                        for (var j = 0; j < len; j++) {
                            retArr.push(arr.data[j]);
                        }
                    }
                    return new Value(
                        DataType.ARRAY,
                        retArr
                    );
                }
            );
        }
    );

end_module();
