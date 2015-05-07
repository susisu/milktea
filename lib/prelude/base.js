/*
 * milktea : prelude/base.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "open": open
    });
}

var core      = require("../core.js");
var Value     = core.Value;
var DataType  = core.DataType;
var __unit__  = core.__unit__;
var __true__  = core.__true__;
var __false__ = core.__false__;
var __null__  = core.__null__;

var errors = require("../errors.js");

var prim  = require("./prim.js");
var utils = require("./utils.js");

function open(target) {
    target["trace"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                console.log(x);
                return __unit__;
            }
        );
    target["error"] =
        new Value(
            DataType.FUNCTION,
            function (mes) {
                utils.assertType(mes, DataType.STRING);
                throw new errors.RuntimeError([], mes.data);
                return __unit__;
            }
        );
    target["typeOf"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return new Value(
                    DataType.STRING,
                    x.type
                );
            }
        );

    target["id"]     = prim.__id__;

    target["flip"]   = prim.__flip__;
    target["const"]  =
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

    target["isNaN"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return Number.isNaN(x.data) ? __true__ : __false__;
            }
        );
    target["isFinite"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return Number.isFinite(x.data) ? __true__ : __false__;
            }
        );
    target["isInteger"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return Number.isInteger(x.data) ? __true__ : __false__;
            }
        );
    target["toInteger"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Number.toInteger(x.data)
                );
            }
        );
    target["negate"] = prim.__negate__;
    target["abs"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.abs(x.data)
                );
            }
        );
    target["signum"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    x.data === 0 ? 0
                    : x.data > 0 ? 1
                    : -1
                );
            }
        );
    target["round"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.round(x.data)
                );
            }
        );
    target["ceiling"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.ceil(x.data)
                );
            }
        );
    target["floor"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.floor(x.data)
                );
            }
        );
    target["sqrt"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.sqrt(x.data)
                );
            }
        );
    target["exp"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.exp(x.data)
                );
            }
        );
    target["log"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.log(x.data)
                );
            }
        );
    target["logBase"] =
        new Value(
            DataType.FUNCTION,
            function (base) {
                utils.assertType(base, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        utils.assertType(x, DataType.NUMBER);
                        return new Value(
                            DataType.NUMBER,
                            Math.log(x.data) / Math.log(base.data)
                        );
                    }
                );
            }
        );
    target["sin"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.sin(x.data)
                );
            }
        );
    target["cos"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.cos(x.data)
                );
            }
        );
    target["tan"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.tan(x.data)
                );
            }
        );
    target["asin"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.asin(x.data)
                );
            }
        );
    target["acos"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.acos(x.data)
                );
            }
        );
    target["atan"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.atan(x.data)
                );
            }
        );
    target["atan2"] =
        new Value(
            DataType.FUNCTION,
            function (y) {
                utils.assertType(y, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        utils.assertType(x, DataType.NUMBER);
                        return new Value(
                            DataType.NUMBER,
                            Math.atan2(y.data, x.data)
                        );
                    }
                );
            }
        );

    target["not"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.BOOL);
                return x.data ? __false__ : __true__;
            }
        );
    target["max"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertTypes(x, [DataType.NUMBER, DataType.STRING]);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        utils.assertType(y, x.type);
                        return x.data >= y.data ? x : y;
                    }
                );
            }
        );
    target["min"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertTypes(x, [DataType.NUMBER, DataType.STRING]);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        utils.assertType(y, x.type);
                        return x.data <= y.data ? x : y;
                    }
                );
            }
        );

    target["prop"]   = prim.__prop__;
    target["method"] = prim.__method__;
    target["instanceOf"] =
        new Value(
            DataType.FUNCTION,
            function (obj) {
                utils.assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (cls) {
                        utils.assertType(cls, DataType.OBJECT);
                        var proto = utils.getProperty(cls, "proto");
                        utils.assertType(proto, DataType.OBJECT);
                        return Object.prototype.isPrototypeOf.call(proto.data, obj.data)
                            ? __true__
                            : __false__;
                    }
                );
            }
        );

    target["Object"]    = prim.__Object__;
    target["Class"]     = prim.__Class__;
    target["Unit"]      = prim.__Unit__;
    target["Number"]    = prim.__Number__;
    target["String"]    = prim.__String__;
    target["Bool"]      = prim.__Bool__;
    target["Function"]  = prim.__Function__;
    target["Reference"] = prim.__Reference__;
    target["Array"]     = prim.__Array__;

    target["extends"] =
        new Value(
            DataType.FUNCTION,
            function (cls) {
                utils.assertType(cls, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (parent) {
                        utils.assertType(parent, DataType.OBJECT);
                        var proto = utils.createObject(utils.getProperty(parent, "proto"));
                        Object.defineProperty(cls.data, "proto", {
                            "writable"    : true,
                            "configurable": true,
                            "enumerable"  : true,
                            "value": proto
                        });
                        return cls;
                    }
                );
            }
        );

    target["constructs"] =
        new Value(
            DataType.FUNCTION,
            function (cls) {
                utils.assertType(cls, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (ctor) {
                        utils.assertType(ctor, DataType.FUNCTION);
                        Object.defineProperty(cls.data, "ctor", {
                            "writable"    : true,
                            "configurable": true,
                            "enumerable"  : true,
                            "value": ctor
                        });
                        return cls;
                    }
                );
            }
        );

    target["ref"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return new Value(
                    DataType.REFERENCE,
                    x
                );
            }
        );

    target["readRef"] =
        new Value(
            DataType.FUNCTION,
            function (ref) {
                utils.assertType(ref, DataType.REFERENCE);
                return ref.data;
            }
        );

    target["@"] =
        new Value(
            DataType.FUNCTION,
            function (g) {
                utils.assertType(g, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (f) {
                        utils.assertType(f, DataType.FUNCTION);
                        return new Value(
                            DataType.FUNCTION,
                            function (x) {
                                return g.data(utils.unboxTailCall(f.data(x)));
                            }
                        );
                    }
                );
            }
        );

    target["**"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        utils.assertType(y, DataType.NUMBER);
                        return new Value(
                            DataType.NUMBER,
                            Math.pow(x.data, y.data)
                        );
                    }
                );
            }
        );

    target["*"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        utils.assertType(y, DataType.NUMBER);
                        return new Value(
                            DataType.NUMBER,
                            x.data * y.data
                        );
                    }
                );
            }
        );

    target["/"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        utils.assertType(y, DataType.NUMBER);
                        return new Value(
                            DataType.NUMBER,
                            x.data / y.data
                        );
                    }
                );
            }
        );

    target["mod"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        utils.assertType(y, DataType.NUMBER);
                        return new Value(
                            DataType.NUMBER,
                            x.data % y.data
                        );
                    }
                );
            }
        );

    target["+"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        utils.assertType(y, DataType.NUMBER);
                        return new Value(
                            DataType.NUMBER,
                            x.data + y.data
                        );
                    }
                );
            }
        );

    target["-"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        utils.assertType(y, DataType.NUMBER);
                        return new Value(
                            DataType.NUMBER,
                            x.data - y.data
                        );
                    }
                );
            }
        );

    target["++"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertType(x, DataType.STRING);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        utils.assertType(y, DataType.STRING);
                        return new Value(
                            DataType.STRING,
                            x.data + y.data
                        );
                    }
                );
            }
        );

    target["=="] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        utils.assertType(y, x.type);
                        return x.data === y.data ? __true__ : __false__;
                    }
                );
            }
        );

    target["/="] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        utils.assertType(y, x.type);
                        return x.data !== y.data ? __true__ : __false__;
                    }
                );
            }
        );

    target["<"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertTypes(x, [DataType.NUMBER, DataType.STRING]);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        utils.assertType(y, x.type);
                        return x.data < y.data ? __true__ : __false__;
                    }
                );
            }
        );

    target["<="] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertTypes(x, [DataType.NUMBER, DataType.STRING]);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        utils.assertType(y, x.type);
                        return x.data <= y.data ? __true__ : __false__;
                    }
                );
            }
        );

    target[">"] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertTypes(x, [DataType.NUMBER, DataType.STRING]);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        utils.assertType(y, x.type);
                        return x.data > y.data ? __true__ : __false__;
                    }
                );
            }
        );

    target[">="] =
        new Value(
            DataType.FUNCTION,
            function (x) {
                utils.assertTypes(x, [DataType.NUMBER, DataType.STRING]);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        utils.assertType(y, x.type);
                        return x.data >= y.data ? __true__ : __false__;
                    }
                );
            }
        );

    target["$"] =
        new Value(
            DataType.FUNCTION,
            function (f) {
                utils.assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        return f.data(x);
                    }
                );
            }
        );

    target[":="] = target["writeRef"] =
        new Value(
            DataType.FUNCTION,
            function (ref) {
                utils.assertType(ref, DataType.REFERENCE);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        ref.data = x;
                        return __unit__;
                    }
                );
            }
        );
}

end_module();
