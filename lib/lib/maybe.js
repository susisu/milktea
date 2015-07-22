/*
 * milktea : lib/maybe.js
 * copyright (c) 2015 Susisu
 */

/**
 * @module lib/maybe
 */

"use strict";

function end_module() {
    Object.freeze(__Nothing__proto__.data);
    Object.freeze(__Nothing__.data);
    Object.freeze(__Just__proto__.data);
    Object.freeze(__Just__.data);

    module.exports = Object.freeze({
        "__Nothing__proto__": __Nothing__proto__,
        "__Nothing__"       : __Nothing__,
        "__Just__proto__"   : __Just__proto__,
        "__Just__"          : __Just__
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
    readInternalProperty  = utils.readInternalProperty,
    writeInternalProperty = utils.writeInternalProperty;

var module_object   = require("./object.js"),
    module_accessor = require("./accessor.js");

var INTERNAL_KEY = "__maybe__";

/**
 * @static
 */
var __Nothing__proto__ = createObject(module_object.__Object__proto__);
Object.defineProperties(__Nothing__proto__.data, {
    "toString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                return new Value(
                    DataType.STRING,
                    "Nothing"
                );
            }
        )
    },
    "isJust": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                return __false__;
            }
        )
    },
    "isNothing": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                return __true__;
            }
        )
    },
    "fromJust": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                throw new errors.RuntimeError([], "nothing");
            }
        )
    },
    "fromMaybe": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                return new Value(
                    DataType.FUNCTION,
                    function (value) {
                        return value;
                    }
                );
            }
        )
    },
    "map": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                return new Value(
                    DataType.FUNCTION,
                    function (f) {
                        return callMethod(__Nothing__, "new");
                    }
                );
            }
        )
    },
    "bind": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                return new Value(
                    DataType.FUNCTION,
                    function (f) {
                        return callMethod(__Nothing__, "new");
                    }
                );
            }
        )
    }
});

/**
 * @static
 */
var __Nothing__ = createObject(module_object.__Class__proto__);
Object.defineProperties(__Nothing__.data, {
    "proto": {
        "value": __Nothing__proto__
    },
    "ctor": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return obj;
            }
        )
    }
});

/**
 * @static
 */
var __Just__proto__ = createObject(module_object.__Object__proto__);
Object.defineProperties(__Just__proto__.data, {
    "toString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var value = readInternalProperty(obj, INTERNAL_KEY, "just");
                var f = calcTailCall(module_accessor.__callMethod__.data(value));
                assertType(f, DataType.FUNCTION);
                var str = calcTailCall(f.data(new Value(DataType.STRING, "toString")));
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.STRING,
                    "Just " + str.data
                );
            }
        )
    },
    "isJust": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                return __true__;
            }
        )
    },
    "isNothing": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                return __false__;
            }
        )
    },
    "fromJust": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return readInternalProperty(obj, INTERNAL_KEY, "just");
            }
        )
    },
    "fromMaybe": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (value) {
                        return readInternalProperty(obj, INTERNAL_KEY, "just");
                    }
                );
            }
        )
    },
    "map": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var value = readInternalProperty(obj, INTERNAL_KEY, "just");
                return new Value(
                    DataType.FUNCTION,
                    function (f) {
                        assertType(f, DataType.FUNCTION);
                        var newValue = calcTailCall(f.data(value));
                        return callMethod(__Just__, "new").data(newValue);
                    }
                );
            }
        )
    },
    "bind": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var value = readInternalProperty(obj, INTERNAL_KEY, "just");
                return new Value(
                    DataType.FUNCTION,
                    function (f) {
                        assertType(f, DataType.FUNCTION);
                        return f.data(value);
                    }
                );
            }
        )
    }
});

/**
 * @static
 */
var __Just__ = createObject(module_object.__Class__proto__);
Object.defineProperties(__Just__.data, {
    "proto": {
        "value": __Just__proto__
    },
    "new": {
        "value": new Value(
            DataType.FUNCTION,
            function (cls) {
                assertType(cls, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (value) {
                        var f = calcTailCall(
                            readProperty(module_object.__Class__proto__, "new").data(cls)
                        );
                        assertType(f, DataType.FUNCTION);
                        return f.data(value);
                    }
                );
            }
        )
    },
    "ctor": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (value) {
                        writeInternalProperty(obj, INTERNAL_KEY, "just", value);
                        return obj;
                    }
                );
            }
        )
    }
});

end_module();
