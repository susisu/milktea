/*
 * milktea : lib/accessor.js
 * copyright (c) 2015 Susisu
 */

/**
 * @module lib/accessor
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "__readProperty__"   : __readProperty__,
        "__callMethod__"     : __callMethod__,
        "__writeProperty__"  : __writeProperty__,
        "__checkProperty__"  : __checkProperty__,
        "__readPropertyOf__" : __readPropertyOf__,
        "__callMethodOf__"   : __callMethodOf__,
        "__writePropertyOf__": __writePropertyOf__,
        "__checkPropertyOf__": __checkPropertyOf__
    });
}

var core         = require("../core.js"),
    Value        = core.Value,
    DataType     = core.DataType,
    calcTailCall = core.calcTailCall,
    __unit__     = core.__unit__,
    __true__     = core.__true__,
    __false__    = core.__false__;

var utils         = require("./utils.js"),
    assertType    = utils.assertType,
    readProperty  = utils.readProperty,
    callMethod    = utils.callMethod,
    writeProperty = utils.writeProperty,
    checkProperty = utils.checkProperty;

var module_object    = require("./object.js"),
    module_unit      = require("./unit.js"),
    module_number    = require("./number.js"),
    module_string    = require("./string.js"),
    module_bool      = require("./bool.js"),
    module_function  = require("./function.js"),
    module_reference = require("./reference.js"),
    module_array     = require("./array.js");


function toObject(value) {
    switch (value.type) {
        case DataType.UNIT:
            return callMethod(module_unit.__Unit__, "new").data(value);
        case DataType.NUMBER:
            return callMethod(module_number.__Number__, "new").data(value);
        case DataType.STRING:
            return callMethod(module_string.__String__, "new").data(value);
        case DataType.BOOL:
            return callMethod(module_bool.__Bool__, "new").data(value);
        case DataType.FUNCTION:
            return callMethod(module_function.__Function__, "new").data(value);
        case DataType.REFERENCE:
            return callMethod(module_reference.__Reference__, "new").data(value);
        case DataType.ARRAY:
            return callMethod(module_array.__Array__, "new").data(value);
        case DataType.OBJECT:
            return value;
    }
}

/**
 * @static
 */
var __readProperty__ =
    new Value(
        DataType.FUNCTION,
        function (ovalue) {
            var obj = toObject(ovalue);
            return new Value(
                DataType.FUNCTION,
                function (name) {
                    assertType(name, DataType.STRING);
                    return readProperty(obj, name.data);
                }
            );
        }
    );

/**
 * @static
 */
var __callMethod__ =
    new Value(
        DataType.FUNCTION,
        function (ovalue) {
            var obj = toObject(ovalue);
            return new Value(
                DataType.FUNCTION,
                function (name) {
                    assertType(name, DataType.STRING);
                    return callMethod(obj, name.data);
                }
            );
        }
    );

/**
 * @static
 */
var __writeProperty__ =
    new Value(
        DataType.FUNCTION,
        function (ovalue) {
            var obj = toObject(ovalue);
            return new Value(
                DataType.FUNCTION,
                function (name) {
                    assertType(name, DataType.STRING);
                    return new Value(
                        DataType.FUNCTION,
                        function (value) {
                            writeProperty(obj, name.data, value);
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
var __checkProperty__ =
    new Value(
        DataType.FUNCTION,
        function (ovalue) {
            var obj = toObject(ovalue);
            return new Value(
                DataType.FUNCTION,
                function (name) {
                    assertType(name, DataType.STRING);
                    return checkProperty(obj, name.data) ? __true__ : __false__;
                }
            );
        }
    );

/**
 * @static
 */
var __readPropertyOf__  = calcTailCall(module_function.__flip__.data(__readProperty__));
/**
 * @static
 */
var __callMethodOf__    = calcTailCall(module_function.__flip__.data(__callMethod__));
/**
 * @static
 */
var __writePropertyOf__ = calcTailCall(module_function.__flip__.data(__writeProperty__));
/**
 * @static
 */
var __checkPropertyOf__ = calcTailCall(module_function.__flip__.data(__checkProperty__));

end_module();
