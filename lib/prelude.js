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
    while (res instanceof core.TailCall) {
        assertType(res._func, DataType.FUNCTION);
        try {
            res = res._func.data(res._arg);
        }
        catch (err) {
            if (err instanceof errors.RuntimeError) {
                throw err;
            }
            else {
                throw err; // new errors.internalError(undefined, err);
            }
        }
    }
    return res;
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
        function (num) {
            assertType(num, DataType.NUMBER);
            return new Value(
                DataType.NUMBER,
                -num.data
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
        function (obj) {
            var obj = toObject(obj);
            return new Value(
                DataType.FUNCTION,
                function (name) {
                    assertType(name, DataType.STRING);
                    var prop = getProperty(obj.data, name.data);
                    return prop;
                }
            );
        }
    );

prelude["__#__"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            var obj = toObject(obj);
            return new Value(
                DataType.FUNCTION,
                function (name) {
                    assertType(name, DataType.STRING);
                    var method = getProperty(obj.data, name.data);
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
prelude["__Object__proto__"].data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.STRING,
                "<object>"
            );
        }
    );

prelude["__Class__proto__"] =
    prelude["__Object__create__"]
    .data(prelude["__Object__proto__"]);
prelude["__Class__proto__"].data["proto"] =
    prelude["__Object__create__"]
    .data(prelude["__Object__proto__"]);
prelude["__Class__proto__"].data["ctor"] = prelude["__id__"];
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

prelude["__Unit__proto__"] =
    prelude["__Object__create__"]
    .data(prelude["__Object__proto__"]);
prelude["__Unit__proto__"].data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            var unit = getProperty(obj.data, "value");
            assertType(unit, DataType.UNIT);
            return new Value(
                DataType.STRING,
                "()"
            );
        }
    );

prelude["__Number__proto__"] =
    prelude["__Object__create__"]
    .data(prelude["__Object__proto__"]);
prelude["__Number__proto__"].data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            var num = getProperty(obj.data, "value");
            assertType(num, DataType.NUMBER);
            return new Value(
                DataType.STRING,
                num.data.toString()
            );
        }
    );

prelude["__String__proto__"] =
    prelude["__Object__create__"]
    .data(prelude["__Object__proto__"]);
prelude["__String__proto__"].data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            var str = getProperty(obj.data, "value");
            assertType(str, DataType.STRING);
            return new Value(
                DataType.STRING,
                str.data
            );
        }
    );

prelude["__Bool__proto__"] =
    prelude["__Object__create__"]
    .data(prelude["__Object__proto__"]);
prelude["__Bool__proto__"].data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            var b = getProperty(obj.data, "value");
            assertType(b, DataType.BOOL);
            return new Value(
                DataType.STRING,
                b.data ? "true" : "false"
            );
        }
    );

prelude["__Function__proto__"] =
    prelude["__Object__create__"]
    .data(prelude["__Object__proto__"]);
prelude["__Function__proto__"].data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            var func = getProperty(obj.data, "value");
            assertType(func, DataType.FUNCTION);
            return new Value(
                DataType.STRING,
                "<function>"
            );
        }
    );

prelude["__Reference__proto__"] =
    prelude["__Object__create__"]
    .data(prelude["__Object__proto__"]);
prelude["__Reference__proto__"].data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            var ref = getProperty(obj.data, "value");
            assertType(ref, DataType.REFERENCE);
            var str =
                prelude["__#__"]
                .data(ref.data)
                .data(new Value(DataType.STRING, "toString"));
            assertType(str, DataType.STRING);
            return new Value(
                DataType.STRING,
                "<ref: " + str.data + ">"
            );
        }
    );

prelude["__Array__proto__"] =
    prelude["__Object__create__"]
    .data(prelude["__Object__proto__"]);
prelude["__Array__proto__"].data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            var arr = getProperty(obj.data, "value");
            assertType(arr, DataType.ARRAY);
            var str =
                arr.data.map(function (elem) {
                    var elemStr =
                        prelude["__#__"]
                        .data(elem)
                        .data(new Value(DataType.STRING, "toString"));
                    assertType(elemStr, DataType.STRING);
                    return elemStr.data;
                })
                .join(",");
            return new Value(
                DataType.STRING,
                "[" + str + "]"
            );
        }
    );

prelude["__Object__"] =
    prelude["__Object__create__"]
    .data(prelude["__Class__proto__"]);
prelude["__Object__"].data["proto"] = prelude["__Object__proto__"];
prelude["__Object__"].data["ctor"] = prelude["__id__"];
prelude["__Object__"].data["create"] = prelude["__Object__create__"];
prelude["__Object__"].data["read"] = prelude["__Object__proto__"].data["read"];
prelude["__Object__"].data["write"] = prelude["__Object__proto__"].data["write"];

prelude["__Class__"] =
    prelude["__Object__create__"]
    .data(prelude["__Class__proto__"]);
prelude["__Class__"].data["proto"] = prelude["__Class__proto__"];

prelude["__Unit__"] =
    prelude["__Object__create__"]
    .data(prelude["__Class__proto__"]);
prelude["__Unit__"].data["proto"] = prelude["__Unit__proto__"];
prelude["__Unit__"].data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    assertType(value, DataType.UNIT);
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

prelude["__Number__"] =
    prelude["__Object__create__"]
    .data(prelude["__Class__proto__"]);
prelude["__Number__"].data["proto"] = prelude["__Number__proto__"];
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
prelude["__Number__"].data["toString"] =
    new Value(
        DataType.FUNCTION,
        function (num) {
            assertType(num, DataType.NUMBER);
            return new Value(
                DataType.STRING,
                num.data.toString()
            );
        }
    );

prelude["__String__"] =
    prelude["__Object__create__"]
    .data(prelude["__Class__proto__"]);
prelude["__String__"].data["proto"] = prelude["__String__proto__"];
prelude["__String__"].data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    assertType(value, DataType.STRING);
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

prelude["__Bool__"] =
    prelude["__Object__create__"]
    .data(prelude["__Class__proto__"]);
prelude["__Bool__"].data["proto"] = prelude["__Bool__proto__"];
prelude["__Bool__"].data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    assertType(value, DataType.BOOL);
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

prelude["__Function__"] =
    prelude["__Object__create__"]
    .data(prelude["__Class__proto__"]);
prelude["__Function__"].data["proto"] = prelude["__Function__proto__"];
prelude["__Function__"].data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    assertType(value, DataType.FUNCTION);
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

prelude["__Reference__"] =
    prelude["__Object__create__"]
    .data(prelude["__Class__proto__"]);
prelude["__Reference__"].data["proto"] = prelude["__Reference__proto__"];
prelude["__Reference__"].data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    assertType(value, DataType.REFERENCE);
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

prelude["__Array__"] =
    prelude["__Object__create__"]
    .data(prelude["__Class__proto__"]);
prelude["__Array__"].data["proto"] = prelude["__Array__proto__"];
prelude["__Array__"].data["ctor"] =
    new Value(
        DataType.FUNCTION,
        function (obj) {
            assertType(obj, DataType.OBJECT);
            return new Value(
                DataType.FUNCTION,
                function (value) {
                    assertType(value, DataType.ARRAY);
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

Object.freeze(prelude["__Object__proto__"].data);
Object.freeze(prelude["__Class__proto__"].data);
Object.freeze(prelude["__Number__proto__"].data);
Object.freeze(prelude["__Object__"].data);
Object.freeze(prelude["__Class__"].data);
Object.freeze(prelude["__Unit__"].data);
Object.freeze(prelude["__Number__"].data);
Object.freeze(prelude["__String__"].data);
Object.freeze(prelude["__Bool__"].data);
Object.freeze(prelude["__Function__"].data);
Object.freeze(prelude["__Reference__"].data);
Object.freeze(prelude["__Array__"].data);

// basic
prelude["trace"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            console.log(x);
            return __unit__;
        }
    );

prelude["error"] =
    new Value(
        DataType.FUNCTION,
        function (mes) {
            assertType(mes, DataType.STRING);
            throw new errors.RuntimeError([], mes.data);
            return __unit__;
        }
    );

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
prelude["Unit"] = prelude["__Unit__"];
prelude["Number"] = prelude["__Number__"];
prelude["String"] = prelude["__String__"];
prelude["Bool"] = prelude["__Bool__"];
prelude["Function"] = prelude["__Function__"];
prelude["Reference"] = prelude["__Reference__"];
prelude["Array"] = prelude["__Array__"];


prelude["ref"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            return new Value(
                DataType.REFERENCE,
                x
            );
        }
    );

prelude["readRef"] =
    new Value(
        DataType.FUNCTION,
        function (ref) {
            assertType(ref, DataType.REFERENCE);
            return ref.data;
        }
    );

prelude["writeRef"] =
    new Value(
        DataType.FUNCTION,
        function (ref) {
            assertType(ref, DataType.REFERENCE);
            return new Value(
                DataType.FUNCTION,
                function (x) {
                    ref.data = x;
                    return __unit__;
                }
            );
        }
    );


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

prelude["++"] =
    new Value(
        DataType.FUNCTION,
        function (x) {
            assertType(x, DataType.STRING);
            return new Value(
                DataType.FUNCTION,
                function (y) {
                    assertType(y, DataType.STRING);
                    return new Value(
                        DataType.STRING,
                        x.data + y.data
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

prelude[":="] = prelude["writeRef"];

end_module();
