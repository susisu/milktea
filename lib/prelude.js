/*
 * milktea : prelude.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze(prelude);
}

var core      = require("./core.js");
var Value     = core.Value;
var DataType  = core.DataType;
var __unit__  = core.__unit__;
var __true__  = core.__true__;
var __false__ = core.__false__;
var __null__  = core.__null__;

var errors = require("./errors.js");

// utility functions
function assertType(value, type) {
    if (value.type !== type) {
        throw errors.typeError(undefined, type, value.type);
    }
}

function assertTypes(value, types) {
    var match = false;
    for (var i = 0; i < types.length; i++) {
        if (value.type === types[i]) {
            match = true;
            break;
        }
    }
    if (!match) {
        var typesStr = types.slice(0, -1).join(", ") + " or " + types[types.length - 1];
        throw errors.typeError(undefined, typesStr, value.type);
    }
}

function getProperty(obj, propName) {
    if (obj === null) {
        throw errors.readNullObjectError(undefined);
    }
    var prop = obj[propName];
    if (prop === undefined) {
        throw errors.propertyNotFoundError(undefined, propName);
    }
    else {
        return prop;
    }
}

function assertObjectWritable(obj, propName) {
    if (obj === null) {
        throw errors.writeNullObjectError(undefined);
    }
    var desc = Object.getOwnPropertyDescriptor(obj, propName);
    if (desc === undefined) {
        if (!Object.isExtensible(obj)) {
            throw errors.cannotWriteError(undefined, propName);
        }
    }
    else {
        if (!desc["writable"]) {
            throw errors.cannotWriteError(undefined, propName);
        }
    }
}

function toObject(value) {
    switch (value.type) {
        case DataType.UNIT:
            return prelude["__#__"]
                .data(prelude["__Unit__"])
                .data(new Value(DataType.STRING, "new"))
                .data(value);
        case DataType.NUMBER:
            return prelude["__#__"]
                .data(prelude["__Number__"])
                .data(new Value(DataType.STRING, "new"))
                .data(value);
        case DataType.STRING:
            return prelude["__#__"]
                .data(prelude["__String__"])
                .data(new Value(DataType.STRING, "new"))
                .data(value);
        case DataType.BOOL:
            return prelude["__#__"]
                .data(prelude["__Bool__"])
                .data(new Value(DataType.STRING, "new"))
                .data(value);
        case DataType.FUNCTION:
            return prelude["__#__"]
                .data(prelude["__Function__"])
                .data(new Value(DataType.STRING, "new"))
                .data(value);
        case DataType.REFERENCE:
            return prelude["__#__"]
                .data(prelude["__Reference__"])
                .data(new Value(DataType.STRING, "new"))
                .data(value);
        case DataType.ARRAY:
            return prelude["__#__"]
                .data(prelude["__Array__"])
                .data(new Value(DataType.STRING, "new"))
                .data(value);
        case DataType.OBJECT:
            return value;
    }
}

function unboxTailCall(res) {
    if (res instanceof core.TailCall) {
        var _func = res._func;
        var _arg  = res._arg;
        while (true) {
            assertType(_func, DataType.FUNCTION);
            try {
                res = _func.data(_arg);
            }
            catch (err) {
                if (err instanceof errors.RuntimeError) {
                    throw err;
                }
                else {
                    throw err; // new errors.unknownError(this.pos);
                }
            }
            if (res instanceof core.TailCall) {
                _func = res._func;
                _arg  = res._arg;
            }
            else {
                return res;
            }
        }
    }
    else {
        return res;
    }
}

var prelude = Object.create(null);

// core
prelude["__id__"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return x;
        }
    );

prelude["__negate__"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                -x.data
            );
        }
    );

prelude["__flip__"] =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            var g = unboxTailCall(f.data(x));
                            assertType(g, DataType.FUNCTION);
                            return g.data(y);
                        }
                    )
                }
            )
        }
    );

prelude["__.__"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            var obj = toObject(x);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.STRING);
                    var prop = getProperty(obj.data, y.data);
                    return prop;
                }
            );
        }
    );

prelude["__#__"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            var obj = toObject(x);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.STRING);
                    var method = getProperty(obj.data, y.data);
                    assertType(method, DataType.FUNCTION);
                    return method.data(obj);
                }
            );
        }
    );

prelude["__prop__"] = prelude["__flip__"].data(prelude["__.__"]);
prelude["__method__"] = prelude["__flip__"].data(prelude["__#__"]);

prelude["__Object__create__"] =
    new Value(
        DataType.FUNCTION,
        function (parent) {
            assertType(parent, DataType.OBJECT);
            return new Value(
                DataType.OBJECT,
                Object.create(parent.data)
            );
        }
    );

prelude["__Object__proto__"] =
    prelude["__Object__create__"]
    .data(__null__);
prelude["__Object__proto__"].data["read"] = prelude["__.__"];
prelude["__Object__proto__"].data["write"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (name) {
                    assertType(name, DataType.STRING);
                    return new Value(
                        DataType.FUNCTION,
                        function (value) {
                            assertObjectWritable(obj.data, name.data);
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

prelude["__Class__proto__"] =
    prelude["__Object__create__"]
    .data(prelude["__Object__proto__"]);
prelude["__Class__proto__"].data["ctor"] = prelude["__id__"];
prelude["__Class__proto__"].data["proto"] =
    prelude["__Object__create__"]
    .data(prelude["__Object__proto__"]);
prelude["__Class__proto__"].data["new"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            return prelude["__.__"]
                .data(obj)
                .data(new Value(DataType.STRING, "ctor"))
                .data(
                    prelude["__Object__create__"]
                    .data(prelude["__.__"]
                        .data(obj)
                        .data(new Value(DataType.STRING, "proto"))
                    )
                );
        }
    );

prelude["__Object__"] =
    prelude["__Object__create__"]
    .data(prelude["__Class__proto__"]);
prelude["__Object__"].data["proto"] = prelude["__Object__proto__"];
prelude["__Object__"].data["create"] = prelude["__Object__create__"];
prelude["__Object__"].data["read"] = prelude["__Object__proto__"].data["read"];
prelude["__Object__"].data["write"] = prelude["__Object__proto__"].data["write"];

prelude["__Class__"] =
    prelude["__Object__create__"]
    .data(prelude["__Class__proto__"]);
prelude["__Class__"].data["proto"] = prelude["__Class__proto__"];

prelude["__Number__"] =
    prelude["__Object__create__"]
    .data(prelude["__Class__proto__"]);
prelude["__Number__"].data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    assertType(value, DataType.NUMBER);
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
prelude["__Number__"].data["proto"] =
    prelude["__Object__create__"]
    .data(prelude["__Object__proto__"]);
prelude["__Number__"].data["proto"].data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            var n = getProperty(x.data, "value");
            assertType(n, DataType.NUMBER);
            return new Value(
                DataType.STRING,
                n.data.toString()
            );
        }
    );

Object.freeze(prelude["__Object__proto__"].data);
Object.freeze(prelude["__Class__proto__"].data);
Object.freeze(prelude["__Object__"].data);
Object.freeze(prelude["__Class__"].data);
Object.freeze(prelude["__Number__"].data);

// basic
prelude["id"]     = prelude["__id__"];
prelude["negate"] = prelude["__negate__"];
prelude["flip"]   = prelude["__flip__"];
prelude["const"]  =
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

prelude["prop"]   = prelude["__prop__"];
prelude["method"] = prelude["__method__"];

prelude["Object"] = prelude["__Object__"];
prelude["Class"]  = prelude["__Class__"];
prelude["Number"] = prelude["__Number__"];

prelude["@"] =
    new Value(
        DataType.FUNCTION,
        function (g) {
            assertType(g, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (f) {
                    assertType(f, DataType.FUNCTION);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            return g.data(unboxTailCall(f.data(x)));
                        }
                    );
                }
            );
        }
    );

prelude["**"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.NUMBER);
                    return new Value(
                        DataType.NUMBER,
                        Math.pow(x.data, y.data)
                    );
                }
            );
        }
    );

prelude["*"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.NUMBER);
                    return new Value(
                        DataType.NUMBER,
                        x.data * y.data
                    );
                }
            );
        }
    );

prelude["/"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.NUMBER);
                    return new Value(
                        DataType.NUMBER,
                        x.data / y.data
                    );
                }
            );
        }
    );

prelude["mod"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.NUMBER);
                    return new Value(
                        DataType.NUMBER,
                        x.data % y.data
                    );
                }
            );
        }
    );

prelude["+"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.NUMBER);
                    return new Value(
                        DataType.NUMBER,
                        x.data + y.data
                    );
                }
            );
        }
    );

prelude["-"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.NUMBER);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.NUMBER);
                    return new Value(
                        DataType.NUMBER,
                        x.data - y.data
                    );
                }
            );
        }
    );

prelude["=="] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, x.type);
                    return new Value(
                        DataType.BOOL,
                        x.data === y.data
                    );
                }
            );
        }
    );

prelude["/="] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, x.type);
                    return new Value(
                        DataType.BOOL,
                        x.data !== y.data
                    );
                }
            );
        }
    );

prelude["<"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertTypes(x, [DataType.NUMBER, DataType.STRING]);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, x.type);
                    return new Value(
                        DataType.BOOL,
                        x.data < y.data
                    );
                }
            );
        }
    );

prelude["<="] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertTypes(x, [DataType.NUMBER, DataType.STRING]);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, x.type);
                    return new Value(
                        DataType.BOOL,
                        x.data <= y.data
                    );
                }
            );
        }
    );

prelude[">"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertTypes(x, [DataType.NUMBER, DataType.STRING]);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, x.type);
                    return new Value(
                        DataType.BOOL,
                        x.data > y.data
                    );
                }
            );
        }
    );

prelude[">="] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertTypes(x, [DataType.NUMBER, DataType.STRING]);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, x.type);
                    return new Value(
                        DataType.BOOL,
                        x.data >= y.data
                    );
                }
            );
        }
    );

prelude["$"] =
    new Value(
        DataType.FUNCTION,
        function (f) {
            assertType(f, DataType.FUNCTION);
            return new Value(
                DataType.FUNCTION,
                function (x) {
                    return f.data(x);
                }
            );
        }
    );

end_module();
