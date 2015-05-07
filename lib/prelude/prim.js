/*
 * milktea : prelude/prim.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "__id__"    : __id__,
        "__negate__": __negate__,
        "__flip__"  : __flip__,
        "__dot__"   : __dot__,
        "__hash__"  : __hash__,
        "__prop__"  : __prop__,
        "__method__": __method__,

        "__Object__proto__"   : __Object__proto__,
        "__Class__proto__"    : __Class__proto__,
        "__Unit__proto__"     : __Unit__proto__,
        "__Number__proto__"   : __Number__proto__,
        "__String__proto__"   : __String__proto__,
        "__Bool__proto__"     : __Bool__proto__,
        "__Function__proto__" : __Function__proto__,
        "__Reference__proto__": __Reference__proto__,
        "__Array__proto__"    : __Array__proto__,

        "__Object__"   : __Object__,
        "__Class__"    : __Class__,
        "__Unit__"     : __Unit__,
        "__Number__"   : __Number__,
        "__String__"   : __String__,
        "__Bool__"     : __Bool__,
        "__Function__" : __Function__,
        "__Reference__": __Reference__,
        "__Array__"    : __Array__,

        "toObject": toObject,
        "open"    : open
    });
}

var core      = require("../core.js");
var Value     = core.Value;
var DataType  = core.DataType;
var __unit__  = core.__unit__;
var __true__  = core.__true__;
var __false__ = core.__false__;
var __null__  = core.__null__;

var utils = require("./utils.js");

var __id__ =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return x;
        }
    );

var __negate__ =
    new Value(
        DataType.FUNCTION,
        function (num) {
            utils.assertType(num, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                -num.data
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
                            var g = utils.unboxTailCall(f.data(y));
                            utils.assertType(g, DataType.FUNCTION);
                            return g.data(x);
                        }
                    )
                }
            )
        }
    );

var __dot__ =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            var obj = toObject(obj);
            return new Value(
                DataType.FUNCTION,
                function (name) {
                    utils.assertType(name, DataType.STRING);
                    return utils.getProperty(obj, name.data);
                }
            );
        }
    );

var __hash__ =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            var obj = toObject(obj);
            return new Value(
                DataType.FUNCTION,
                function (name) {
                    utils.assertType(name, DataType.STRING);
                    return utils.callMethod(obj, name.data);
                }
            );
        }
    );

var __prop__ = __flip__.data(__dot__);
var __method__ = __flip__.data(__hash__);

var __Object__proto__ = utils.createObject(__null__);
__Object__proto__.data["read"] = __dot__;
__Object__proto__.data["write"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (name) {
                    utils.assertType(name, DataType.STRING);
                    return new Value(
                        DataType.FUNCTION,
                        function (value) {
                            utils.assertObjectIsWritable(obj.data, name.data);
                            Object.defineProperty(obj.data, name.data, {
                                "writable"    : true,
                                "configurable": true,
                                "enumerable"  : true,
                                "value": value
                            });
                            return __unit__;
                        }
                    );
                }
            );
        }
    );
__Object__proto__.data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.STRING,
                "<object>"
            );
        }
    );

var __Class__proto__ = utils.createObject(__Object__proto__);
__Class__proto__.data["proto"] = utils.createObject(__Object__proto__);
__Class__proto__.data["ctor"] = __id__;
__Class__proto__.data["new"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            return utils.getProperty(obj, "ctor").data(
                utils.createObject(utils.getProperty(obj, "proto"))
            );
        }
    );

var __Unit__proto__ = utils.createObject(__Object__proto__);
__Unit__proto__.data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            var unit = utils.getProperty(obj, "value");
            utils.assertType(unit, DataType.UNIT);
            return new Value(
                DataType.STRING,
                "()"
            );
        }
    );

var __Number__proto__ = utils.createObject(__Object__proto__);
__Number__proto__.data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            var num = utils.getProperty(obj, "value");
            utils.assertType(num, DataType.NUMBER);
            return new Value(
                DataType.STRING,
                num.data.toString()
            );
        }
    );

var __String__proto__ = utils.createObject(__Object__proto__);
__String__proto__.data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            var str = utils.getProperty(obj, "value");
            utils.assertType(str, DataType.STRING);
            return new Value(
                DataType.STRING,
                str.data
            );
        }
    );

var __Bool__proto__ = utils.createObject(__Object__proto__);
__Bool__proto__.data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            var b = utils.getProperty(obj, "value");
            utils.assertType(b, DataType.BOOL);
            return new Value(
                DataType.STRING,
                b.data ? "true" : "false"
            );
        }
    );

var __Function__proto__ = utils.createObject(__Object__proto__);
__Function__proto__.data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            var func = utils.getProperty(obj, "value");
            utils.assertType(func, DataType.FUNCTION);
            return new Value(
                DataType.STRING,
                "<function>"
            );
        }
    );

var __Reference__proto__ = utils.createObject(__Object__proto__);
__Reference__proto__.data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            var ref = utils.getProperty(obj, "value");
            utils.assertType(ref, DataType.REFERENCE);
            var str = utils.unboxTailCall(utils.callMethod(toObject(ref.data), "toString"));
            utils.assertType(str, DataType.STRING);
            return new Value(
                DataType.STRING,
                "<ref: " + str.data + ">"
            );
        }
    );

var __Array__proto__ = utils.createObject(__Object__proto__);
__Array__proto__.data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            var arr = utils.getProperty(obj, "value");
            utils.assertType(arr, DataType.ARRAY);
            var str =
                arr.data.map(function (elem) {
                    var elemStr = utils.unboxTailCall(utils.callMethod(toObject(elem), "toString"));
                    utils.assertType(elemStr, DataType.STRING);
                    return elemStr.data;
                })
                .join(",");
            return new Value(
                DataType.STRING,
                "[" + str + "]"
            );
        }
    );

var __Object__ = utils.createObject(__Class__proto__);
__Object__.data["proto"] = __Object__proto__;
__Object__.data["ctor"] = __id__;
__Object__.data["create"] =
    new Value(
        DataType.FUNCTION,
        function (parent) {
            utils.assertType(parent, DataType.OBJECT);
            return utils.createObject(parent);
        }
    );
__Object__.data["read"] = __Object__proto__.data["read"];
__Object__.data["write"] = __Object__proto__.data["write"];

var __Class__ = utils.createObject(__Class__proto__);
__Class__.data["proto"] = __Class__proto__;
__Class__.data["ctor"] = __id__;

var __Unit__ = utils.createObject(__Class__proto__);
__Unit__.data["proto"] = __Unit__proto__;
__Unit__.data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    utils.assertType(value, DataType.UNIT);
                    Object.defineProperty(obj.data, "value", {
                        "writable"    : true,
                        "configurable": true,
                        "enumerable"  : true,
                        "value": value
                    });
                    return obj;
                }
            );
        }
    );

var __Number__ = utils.createObject(__Class__proto__);
__Number__.data["proto"] = __Number__proto__;
__Number__.data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    utils.assertType(value, DataType.NUMBER);
                    Object.defineProperty(obj.data, "value", {
                        "writable"    : true,
                        "configurable": true,
                        "enumerable"  : true,
                        "value": value
                    });
                    return obj;
                }
            );
        }
    );
__Number__.data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (num) {
            utils.assertType(num, DataType.NUMBER);
            return new Value(
                DataType.STRING,
                num.data.toString()
            );
        }
    );

var __String__ = utils.createObject(__Class__proto__);
__String__.data["proto"] = __String__proto__;
__String__.data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    utils.assertType(value, DataType.STRING);
                    Object.defineProperty(obj.data, "value", {
                        "writable"    : true,
                        "configurable": true,
                        "enumerable"  : true,
                        "value": value
                    });
                    return obj;
                }
            );
        }
    );

var __Bool__ = utils.createObject(__Class__proto__);
__Bool__.data["proto"] = __Bool__proto__;
__Bool__.data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    utils.assertType(value, DataType.BOOL);
                    Object.defineProperty(obj.data, "value", {
                        "writable"    : true,
                        "configurable": true,
                        "enumerable"  : true,
                        "value": value
                    });
                    return obj;
                }
            );
        }
    );

var __Function__ = utils.createObject(__Class__proto__);
__Function__.data["proto"] = __Function__proto__;
__Function__.data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    utils.assertType(value, DataType.FUNCTION);
                    Object.defineProperty(obj.data, "value", {
                        "writable"    : true,
                        "configurable": true,
                        "enumerable"  : true,
                        "value": value
                    });
                    return obj;
                }
            );
        }
    );

var __Reference__ = utils.createObject(__Class__proto__);
__Reference__.data["proto"] = __Reference__proto__;
__Reference__.data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    utils.assertType(value, DataType.REFERENCE);
                    Object.defineProperty(obj.data, "value", {
                        "writable"    : true,
                        "configurable": true,
                        "enumerable"  : true,
                        "value": value
                    });
                    return obj;
                }
            );
        }
    );

var __Array__ = utils.createObject(__Class__proto__);
__Array__.data["proto"] = __Array__proto__;
__Array__.data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            utils.assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    utils.assertType(value, DataType.ARRAY);
                    Object.defineProperty(obj.data, "value", {
                        "writable"    : true,
                        "configurable": true,
                        "enumerable"  : true,
                        "value": value
                    });
                    return obj;
                }
            );
        }
    );

Object.freeze(__Object__proto__.data);
Object.freeze(__Class__proto__.data);
Object.freeze(__Unit__proto__.data);
Object.freeze(__Number__proto__.data);
Object.freeze(__String__proto__.data);
Object.freeze(__Bool__proto__.data);
Object.freeze(__Function__proto__.data);
Object.freeze(__Reference__proto__.data);
Object.freeze(__Array__proto__.data);

Object.freeze(__Object__.data);
Object.freeze(__Class__.data);
Object.freeze(__Unit__.data);
Object.freeze(__Number__.data);
Object.freeze(__String__.data);
Object.freeze(__Bool__.data);
Object.freeze(__Function__.data);
Object.freeze(__Reference__.data);
Object.freeze(__Array__.data);

function toObject(value) {
    switch (value.type) {
        case DataType.UNIT:
            return utils.callMethod(__Unit__, "new").data(value);
        case DataType.NUMBER:
            return utils.callMethod(__Number__, "new").data(value);
        case DataType.STRING:
            return utils.callMethod(__String__, "new").data(value);
        case DataType.BOOL:
            return utils.callMethod(__Bool__, "new").data(value);
        case DataType.FUNCTION:
            return utils.callMethod(__Function__, "new").data(value);
        case DataType.REFERENCE:
            return utils.callMethod(__Reference__, "new").data(value);
        case DataType.ARRAY:
            return utils.callMethod(__Array__, "new").data(value);
        case DataType.OBJECT:
            return value;
    }
}

function open(target) {
    // target["__id__"]     = __id__;
    target["__negate__"] = __negate__;
    // target["__flip__"]   = __flip__;
    target["__.__"]      = __dot__;
    target["__#__"]      = __hash__;
    target["__prop__"]   = __prop__;
    target["__method__"] = __method__;

    // target["__Object__proto__"]    = __Object__proto__;
    // target["__Class__proto__"]     = __Class__proto__;
    // target["__Unit__proto__"]      = __Unit__proto__;
    // target["__Number__proto__"]    = __Number__proto__;
    // target["__String__proto__"]    = __String__proto__;
    // target["__Bool__proto__"]      = __Bool__proto__;
    // target["__Function__proto__"]  = __Function__proto__;
    // target["__Reference__proto__"] = __Reference__proto__;
    // target["__Array__proto__"]     = __Array__proto__;

    // target["__Object__"]    = __Object__;
    // target["__Class__"]     = __Class__;
    // target["__Unit__"]      = __Unit__;
    // target["__Number__"]    = __Number__;
    // target["__String__"]    = __String__;
    // target["__Bool__"]      = __Bool__;
    // target["__Function__"]  = __Function__;
    // target["__Reference__"] = __Reference__;
    // target["__Array__"]     = __Array__;
}

end_module();
