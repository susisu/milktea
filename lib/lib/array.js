/*
 * milktea : lib/array.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    Object.freeze(__Array__proto__.data);
    Object.freeze(__Array__.data);

    module.exports = Object.freeze({
        "__Array__proto__": __Array__proto__,
        "__Array__"       : __Array__,
        "__newArray__"    : __newArray__,
        "__readArray__"   : __readArray__,
        "__writeArray__"  : __writeArray__,
        "__pop__"         : __pop__,
        "__push__"        : __push__,
        "__shift__"       : __shift__,
        "__unshift__"     : __unshift__,
        "__head__"        : __head__,
        "__last__"        : __last__,
        "__tail__"        : __tail__,
        "__init__"        : __init__,
        "__length__"      : __length__,
        "__empty__"       : __empty__,
        "__reverse__"     : __reverse__,
        "__concat__"      : __concat__,
        "__map__"         : __map__,
        "__map$__"        : __map$__,
        "__foldl__"       : __foldl__,
        "__foldl1__"      : __foldl1__,
        "__foldr__"       : __foldr__,
        "__foldr1__"      : __foldr1__
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

var module_object = require("./object.js");

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

var __readArray__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            return new Value(
                DataType.FUNCTION,
                function (index) {
                    assertType(index, DataType.NUMBER);
                    var len = arr.data.length;
                    if (index.data < 0 || index.data >= len) {
                        throw errors.outOfRangeError(undefined, index.data);
                    }
                    return arr.data[index.data];
                }
            );
        }
    );

var __writeArray__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            return new Value(
                DataType.FUNCTION,
                function (index) {
                    assertType(index, DataType.NUMBER);
                    var len = arr.data.length;
                    if (index.data < 0 || index.data >= len) {
                        throw errors.outOfRangeError(undefined, index.data);
                    }
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            arr.data[index.data] = x;
                            return __unit__;
                        }
                    );
                }
            );
        }
    );

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

var __empty__ =
    new Value(
        DataType.FUNCTION,
        function (arr) {
            assertType(arr, DataType.ARRAY);
            var len = arr.data.length;
            return len === 0 ? __true__ : __false__;
        }
    );

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

end_module();
