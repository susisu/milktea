/*
 * milktea : lib/date.js
 * copyright (c) 2015 Susisu
 */

/**
 * @module lib/date
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "__Date__proto__": __Date__proto__,
        "__Date__"       : __Date__
    });
}

var core         = require("../core.js"),
    Value        = core.Value,
    DataType     = core.DataType,
    __unit__     = core.__unit__;

var errors = require("../errors.js");

var utils         = require("./utils.js"),
    assertType    = utils.assertType,
    createObject  = utils.createObject,
    readInternalProperty  = utils.readInternalProperty,
    writeInternalProperty = utils.writeInternalProperty;

var module_object = require("./object.js");

var INTERNAL_KEY = "__date__";

function assertDate(obj) {
    if (!(obj instanceof Date)) {
        throw new errors.RuntimeError([], "invalid object");
    }
}

/**
 * @static
 */
var __Date__proto__ = createObject(module_object.__Object__proto__);
Object.defineProperties(__Date__proto__.data, {
    "toString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.STRING,
                    date.toString()
                );
            }
        )
    },
    "toUTCString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.STRING,
                    date.toUTCString()
                );
            }
        )
    },
    "toLocaleString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.STRING,
                    date.toLocaleString()
                );
            }
        )
    },
    "toDateString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.STRING,
                    date.toDateString()
                );
            }
        )
    },
    "toLocaleDateString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.STRING,
                    date.toLocaleDateString()
                );
            }
        )
    },
    "toTimeString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.STRING,
                    date.toTimeString()
                );
            }
        )
    },
    "toLocaleTimeString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.STRING,
                    date.toLocaleTimeString()
                );
            }
        )
    },
    "getTime": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getTime()
                );
            }
        )
    },
    "getTimezoneOffset": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getTimezoneOffset()
                );
            }
        )
    },
    "getFullYear": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getFullYear()
                );
            }
        )
    },
    "getMonth": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getMonth()
                );
            }
        )
    },
    "getDate": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getDate()
                );
            }
        )
    },
    "getDay": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getDay()
                );
            }
        )
    },
    "getHours": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getHours()
                );
            }
        )
    },
    "getMinutes": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getMinutes()
                );
            }
        )
    },
    "getSeconds": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getSeconds()
                );
            }
        )
    },
    "getMilliseconds": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getMilliseconds()
                );
            }
        )
    },
    "getUTCFullYear": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCFullYear()
                );
            }
        )
    },
    "getUTCMonth": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCMonth()
                );
            }
        )
    },
    "getUTCDate": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCDate()
                );
            }
        )
    },
    "getUTCDay": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCDay()
                );
            }
        )
    },
    "getUTCHours": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCHours()
                );
            }
        )
    },
    "getUTCMinutes": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCMinutes()
                );
            }
        )
    },
    "getUTCSeconds": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCSeconds()
                );
            }
        )
    },
    "getUTCMilliseconds": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.NUMBER,
                    date.getUTCMilliseconds()
                );
            }
        )
    },
    "setFullYear": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        date.setFullYear(x.data);
                        return __unit__;
                    }
                );
            }
        )
    },
    "setMonth": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        date.setMonth(x.data);
                        return __unit__;
                    }
                );
            }
        )
    },
    "setDate": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        date.setDate(x.data);
                        return __unit__;
                    }
                );
            }
        )
    },
    "setHours": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        date.setHours(x.data);
                        return __unit__;
                    }
                );
            }
        )
    },
    "setMinutes": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        date.setMinutes(x.data);
                        return __unit__;
                    }
                );
            }
        )
    },
    "setSeconds": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        date.setSeconds(x.data);
                        return __unit__;
                    }
                );
            }
        )
    },
    "setMilliseconds": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        date.setMilliseconds(x.data);
                        return __unit__;
                    }
                );
            }
        )
    },
    "setUTCFullYear": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        date.setUTCFullYear(x.data);
                        return __unit__;
                    }
                );
            }
        )
    },
    "setUTCMonth": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        date.setUTCMonth(x.data);
                        return __unit__;
                    }
                );
            }
        )
    },
    "setUTCDate": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        date.setUTCDate(x.data);
                        return __unit__;
                    }
                );
            }
        )
    },
    "setUTCHours": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        date.setUTCHours(x.data);
                        return __unit__;
                    }
                );
            }
        )
    },
    "setUTCMinutes": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        date.setUTCMinutes(x.data);
                        return __unit__;
                    }
                );
            }
        )
    },
    "setUTCSeconds": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        date.setUTCSeconds(x.data);
                        return __unit__;
                    }
                );
            }
        )
    },
    "setUTCMilliseconds": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                assertDate(date);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        date.setUTCMilliseconds(x.data);
                        return __unit__;
                    }
                );
            }
        )
    }
});

/**
 * @static
 */
var __Date__ = createObject(module_object.__Class__proto__);
Object.defineProperties(__Date__.data, {
    "proto": {
        "value": __Date__proto__
    },
    "ctor": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                writeInternalProperty(obj, INTERNAL_KEY, "date", new Date());
                return obj;
            }
        )
    },
    "time": {
        "value": new Value(
            DataType.FUNCTION,
            function (time) {
                assertType(time, DataType.NUMBER);
                var obj = createObject(__Date__proto__);
                writeInternalProperty(obj, INTERNAL_KEY, "date", new Date(time.data));
                return obj;
            }
        )
    },
    "parse": {
        "value": new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                var obj = createObject(__Date__proto__);
                writeInternalProperty(obj, INTERNAL_KEY, "date", new Date(str.data));
                return obj;
            }
        )
    },
    "date": {
        "value": new Value(
            DataType.FUNCTION,
            function (year) {
                assertType(year, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (month) {
                        assertType(month, DataType.NUMBER);
                        return new Value(
                            DataType.FUNCTION,
                            function (date) {
                                assertType(date, DataType.NUMBER);
                                var obj = createObject(__Date__proto__);
                                writeInternalProperty(obj, INTERNAL_KEY, "date",
                                    new Date(year.data, month.data, date.data));
                                return obj;
                            }
                        );
                    }
                );
            }
        )
    }
});

end_module();
