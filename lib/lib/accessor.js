/*
 * milktea : lib/accessor.js
 * copyright (c) 2015 Susisu
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

var __module__object__    = require("./object.js"),
    __module__unit__      = require("./unit.js"),
    __module__number__    = require("./number.js"),
    __module__string__    = require("./string.js"),
    __module__bool__      = require("./bool.js"),
    __module__function__  = require("./function.js"),
    __module__reference__ = require("./reference.js"),
    __module__array__     = require("./array.js");


function toObject(value) {
    switch (value.type) {
        case DataType.UNIT:
            return callMethod(__module__unit__.__Unit__, "new").data(value);
        case DataType.NUMBER:
            return callMethod(__module__number__.__Number__, "new").data(value);
        case DataType.STRING:
            return callMethod(__module__string__.__String__, "new").data(value);
        case DataType.BOOL:
            return callMethod(__module__bool__.__Bool__, "new").data(value);
        case DataType.FUNCTION:
            return callMethod(__module__function__.__Function__, "new").data(value);
        case DataType.REFERENCE:
            return callMethod(__module__reference__.__Reference__, "new").data(value);
        case DataType.ARRAY:
            return callMethod(__module__array__.__Array__, "new").data(value);
        case DataType.OBJECT:
            return value;
    }
}

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

var __readPropertyOf__  = calcTailCall(__module__function__.__flip__.data(__readProperty__));
var __callMethodOf__    = calcTailCall(__module__function__.__flip__.data(__callMethod__));
var __writePropertyOf__ = calcTailCall(__module__function__.__flip__.data(__writeProperty__));
var __checkPropertyOf__ = calcTailCall(__module__function__.__flip__.data(__checkProperty__));

end_module();
