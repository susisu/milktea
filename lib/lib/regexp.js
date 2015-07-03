/*
 * milktea : lib/regexp.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "__RegExp__proto__": __RegExp__proto__,
        "__RegExp__"       : __RegExp__
    });
}

var core         = require("../core.js"),
    Value        = core.Value,
    DataType     = core.DataType,
    __unit__     = core.__unit__,
    __true__     = core.__true__,
    __false__    = core.__false__;

var errors = require("../errors.js");

var utils         = require("./utils.js"),
    assertType    = utils.assertType,
    createObject  = utils.createObject,
    writeProperty = utils.writeProperty,
    readInternalProperty  = utils.readInternalProperty,
    writeInternalProperty = utils.writeInternalProperty;

var module_object = require("./object.js");

var INTERNAL_KEY = "__regexp__";

function assertRegExp(obj) {
    if (!(obj instanceof RegExp)) {
        throw new errors.RuntimeError([], "require RegExp object");
    }
}

var __RegExp__proto__ = createObject(module_object.__Object__proto__);
Object.defineProperties(__RegExp__proto__.data, {
    "toString": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var regexp = readInternalProperty(obj, INTERNAL_KEY, "regexp");
                assertRegExp(regexp);
                return new Value(
                    DataType.STRING,
                    regexp.source()
                );
            }
        )
    },
    "global": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var regexp = readInternalProperty(obj, INTERNAL_KEY, "regexp");
                assertRegExp(regexp);
                return regexp.global ? __true__ : __false__;
            }
        )
    },
    "ignoreCase": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var regexp = readInternalProperty(obj, INTERNAL_KEY, "regexp");
                assertRegExp(regexp);
                return regexp.ignoreCase ? __true__ : __false__;
            }
        )
    },
    "multiline": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var regexp = readInternalProperty(obj, INTERNAL_KEY, "regexp");
                assertRegExp(regexp);
                return regexp.multiline ? __true__ : __false__;
            }
        )
    },
    "lastIndex": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var regexp = readInternalProperty(obj, INTERNAL_KEY, "regexp");
                assertRegExp(regexp);
                return new Value(
                    DataType.NUMBER,
                    regexp.lastIndex
                );
            }
        )
    },
    "setLastIndex": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var regexp = readInternalProperty(obj, INTERNAL_KEY, "regexp");
                assertRegExp(regexp);
                return new Value(
                    DataType.FUNCTION,
                    function (index) {
                        assertType(index, DataType.NUMBER);
                        regexp.lastIndex = index.data;
                        return __unit__;
                    }
                );
            }
        )
    },
    "exec": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var regexp = readInternalProperty(obj, INTERNAL_KEY, "regexp");
                assertRegExp(regexp);
                return new Value(
                    DataType.FUNCTION,
                    function (str) {
                        assertType(str, DataType.STRING);
                        var res = regexp.exec(str.data);
                        if (res) {
                            var resObj = createObject(module_object.__Object__proto__);
                            writeProperty(resObj, "index",
                                new Value(
                                    DataType.NUMBER,
                                    res.index
                                )
                            );
                            writeProperty(resObj, "input",
                                new Value(
                                    DataType.STRING,
                                    res.input
                                )
                            );
                            writeProperty(resObj, "substrings",
                                new Value(
                                    DataType.ARRAY,
                                    res.map(function (substr) {
                                        return new Value(
                                            DataType.STRING,
                                            substr
                                        );
                                    })
                                )
                            );
                            return resObj;
                        }
                        else {
                            return __unit__;
                        }
                    }
                );
            }
        )
    },
    "test": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                var regexp = readInternalProperty(obj, INTERNAL_KEY, "regexp");
                assertRegExp(regexp);
                return new Value(
                    DataType.FUNCTION,
                    function (str) {
                        assertType(str, DataType.STRING);
                        return regexp.test(str.data) ? __true__ : __false__;
                    }
                )
            }
        )
    }
});

var __RegExp__ = createObject(module_object.__Class__proto__);
Object.defineProperties(__RegExp__.data, {
    "proto": {
        "value": __RegExp__proto__
    },
    "ctor": {
        "value": new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (pattern) {
                        assertType(pattern, DataType.STRING);
                        return new Value(
                            DataType.FUNCTION,
                            function (flags) {
                                assertType(flags, DataType.STRING);
                                writeInternalProperty(obj, INTERNAL_KEY, "regexp",
                                    new RegExp(pattern.data, flags.data));
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