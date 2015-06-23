/*
 * milktea : core.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "Value"                : Value,
        "DataType"             : DataType,
        "__unit__"             : __unit__,
        "__true__"             : __true__,
        "__false__"            : __false__,
        "TailCall"             : TailCall,
        "calcTailCall"         : calcTailCall,
        "Expression"           : Expression,
        "Literal"              : Literal,
        "ArrayLiteral"         : ArrayLiteral,
        "ObjectLiteral"        : ObjectLiteral,
        "Variable"             : Variable,
        "Closure"              : Closure,
        "Application"          : Application,
        "Negation"             : Negation,
        "ReadPropertyAccessor" : ReadPropertyAccessor,
        "CallMethodAccessor"   : CallMethodAccessor,
        "WritePropertyAccessor": WritePropertyAccessor,
        "CheckPropertyAccessor": CheckPropertyAccessor,
        "ReadPropertySection"  : ReadPropertySection,
        "CallMethodSection"    : CallMethodSection,
        "WritePropertySection" : WritePropertySection,
        "CheckPropertySection" : CheckPropertySection,
        "Conditional"          : Conditional,
        "CondAnd"              : CondAnd,
        "CondOr"               : CondOr,
        "Binding"              : Binding,
        "Procedure"            : Procedure,
        "Loop"                 : Loop,
        "Empty"                : Empty,
        "Definition"           : Definition
    });
}

var errors = require("./errors.js");

function Value(type, data) {
    this.type = type;
    this.data = data;
}

Value.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Value
    },
    "toString": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            switch (this.type) {
                case DataType.UNIT:
                    return "()";
                case DataType.NUMBER:
                    return this.data.toString();
                case DataType.STRING:
                    return this.data;
                case DataType.BOOL:
                    return this.data ? "true": "false";
                case DataType.FUNCTION:
                    return "<function>";
                case DataType.REFERENCE:
                    return "<reference>";
                case DataType.ARRAY:
                    return "<array>";
                case DataType.OBJECT:
                    return "<object>";
            }
        }
    }
});

var DataType = Object.freeze({
    "UNIT"     : "unit",
    "NUMBER"   : "number",
    "STRING"   : "string",
    "BOOL"     : "bool",
    "FUNCTION" : "function",
    "REFERENCE": "reference",
    "ARRAY"    : "array",
    "OBJECT"   : "object"
});

var __unit__  = new Value(DataType.UNIT, undefined);
var __true__  = new Value(DataType.BOOL, true);
var __false__ = new Value(DataType.BOOL, false);

function TailCall(_func, _arg) {
    this._func = _func;
    this._arg  = _arg;
}

function calcTailCall(res) {
    while (res instanceof TailCall) {
        if (res._func.type === DataType.FUNCTION) {
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
        else {
            throw new errors.invalidApplicationError(undefined);
        }
    }
    return res;
}

function Expression(pos) {
    this.pos = pos;
}

Expression.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Expression
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            return __unit__;
        }
    },
    "run": {
        "writable"    : true,
        "configurable": true,
        "value": function (env) {
            return this.eval(env, false);
        }
    }
});

function Literal(pos, value) {
    Expression.call(this, pos);
    this.value = value;
}

Literal.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Literal
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            return this.value;
        }
    }
});

function ArrayLiteral(pos, elems) {
    Expression.call(this, pos);
    this.elems = elems;
}

ArrayLiteral.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": ArrayLiteral
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            return new Value(
                DataType.ARRAY,
                this.elems.map(function (elem) {
                    return elem.eval(env, false);
                })
            );
        }
    }
});

function ObjectLiteral(pos, props) {
    Expression.call(this, pos);
    this.props = props;
}

ObjectLiteral.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": ObjectLiteral
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            var obj =
                new Application(
                    this.pos,
                    new Variable(this.pos, "__createObject__"),
                    new Variable(this.pos, "__Object__proto__")
                ).eval(env, false);
            this.props.forEach(function (prop) {
                Object.defineProperty(obj.data, prop[0], {
                    "writable"    : true,
                    "configurable": true,
                    "enumerable"  : true,
                    "value": prop[1].eval(env, false)
                });
            });
            return obj;
        }
    }
});

function Variable(pos, name) {
    Expression.call(this, pos);
    this.name = name;
}

Variable.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Variable
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            if (env[this.name] !== undefined) {
                return env[this.name];
            }
            else {
                throw new errors.unboundError(this.pos, this.name);
            }
        }
    }
});

function Closure(pos, argNames, body) {
    Expression.call(this, pos);
    this.argNames = argNames;
    this.body     = body;
}

Closure.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Closure
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            var argNames = this.argNames;
            var numArgs  = this.argNames.length;
            var body     = this.body;
            switch (numArgs) {
                case 1:
                    return new Value(
                        DataType.FUNCTION,
                        function (arg0) {
                            var local = Object.create(env);
                            if (argNames[0] !== undefined) {
                                local[argNames[0]] = arg0;
                            }
                            return body.eval(local, true);
                        }
                    );
                case 2:
                    return new Value(
                        DataType.FUNCTION,
                        function (arg0) {
                            return new Value(
                                DataType.FUNCTION,
                                function (arg1) {
                                    var local = Object.create(env);
                                    if (argNames[0] !== undefined) {
                                        local[argNames[0]] = arg0;
                                    }
                                    if (argNames[1] !== undefined) {
                                        local[argNames[1]] = arg1;
                                    }
                                    return body.eval(local, true);
                                }
                            );
                        }
                    );
                case 3:
                    return new Value(
                        DataType.FUNCTION,
                        function (arg0) {
                            return new Value(
                                DataType.FUNCTION,
                                function (arg1) {
                                    return new Value(
                                        DataType.FUNCTION,
                                        function (arg2) {
                                            var local = Object.create(env);
                                            if (argNames[0] !== undefined) {
                                                local[argNames[0]] = arg0;
                                            }
                                            if (argNames[1] !== undefined) {
                                                local[argNames[1]] = arg1;
                                            }
                                            if (argNames[2] !== undefined) {
                                                local[argNames[2]] = arg2;
                                            }
                                            return body.eval(local, true);
                                        }
                                    );
                                }
                            );
                        }
                    );
                case 4:
                    return new Value(
                        DataType.FUNCTION,
                        function (arg0) {
                            return new Value(
                                DataType.FUNCTION,
                                function (arg1) {
                                    return new Value(
                                        DataType.FUNCTION,
                                        function (arg2) {
                                            return new Value(
                                                DataType.FUNCTION,
                                                function (arg3) {
                                                    var local = Object.create(env);
                                                    if (argNames[0] !== undefined) {
                                                        local[argNames[0]] = arg0;
                                                    }
                                                    if (argNames[1] !== undefined) {
                                                        local[argNames[1]] = arg1;
                                                    }
                                                    if (argNames[2] !== undefined) {
                                                        local[argNames[2]] = arg2;
                                                    }
                                                    if (argNames[3] !== undefined) {
                                                        local[argNames[3]] = arg3;
                                                    }
                                                    return body.eval(local, true);
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                case 5:
                    return new Value(
                        DataType.FUNCTION,
                        function (arg0) {
                            return new Value(
                                DataType.FUNCTION,
                                function (arg1) {
                                    return new Value(
                                        DataType.FUNCTION,
                                        function (arg2) {
                                            return new Value(
                                                DataType.FUNCTION,
                                                function (arg3) {
                                                    return new Value(
                                                        DataType.FUNCTION,
                                                        function (arg4) {
                                                            var local = Object.create(env);
                                                            if (argNames[0] !== undefined) {
                                                                local[argNames[0]] = arg0;
                                                            }
                                                            if (argNames[1] !== undefined) {
                                                                local[argNames[1]] = arg1;
                                                            }
                                                            if (argNames[2] !== undefined) {
                                                                local[argNames[2]] = arg2;
                                                            }
                                                            if (argNames[3] !== undefined) {
                                                                local[argNames[3]] = arg3;
                                                            }
                                                            if (argNames[4] !== undefined) {
                                                                local[argNames[4]] = arg4;
                                                            }
                                                            return body.eval(local, true);
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                case 6:
                    return new Value(
                        DataType.FUNCTION,
                        function (arg0) {
                            return new Value(
                                DataType.FUNCTION,
                                function (arg1) {
                                    return new Value(
                                        DataType.FUNCTION,
                                        function (arg2) {
                                            return new Value(
                                                DataType.FUNCTION,
                                                function (arg3) {
                                                    return new Value(
                                                        DataType.FUNCTION,
                                                        function (arg4) {
                                                            return new Value(
                                                                DataType.FUNCTION,
                                                                function (arg5) {
                                                                    var local = Object.create(env);
                                                                    if (argNames[0] !== undefined) {
                                                                        local[argNames[0]] = arg0;
                                                                    }
                                                                    if (argNames[1] !== undefined) {
                                                                        local[argNames[1]] = arg1;
                                                                    }
                                                                    if (argNames[2] !== undefined) {
                                                                        local[argNames[2]] = arg2;
                                                                    }
                                                                    if (argNames[3] !== undefined) {
                                                                        local[argNames[3]] = arg3;
                                                                    }
                                                                    if (argNames[4] !== undefined) {
                                                                        local[argNames[4]] = arg4;
                                                                    }
                                                                    if (argNames[5] !== undefined) {
                                                                        local[argNames[5]] = arg5;
                                                                    }
                                                                    return body.eval(local, true);
                                                                }
                                                            );
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                case 7:
                    return new Value(
                        DataType.FUNCTION,
                        function (arg0) {
                            return new Value(
                                DataType.FUNCTION,
                                function (arg1) {
                                    return new Value(
                                        DataType.FUNCTION,
                                        function (arg2) {
                                            return new Value(
                                                DataType.FUNCTION,
                                                function (arg3) {
                                                    return new Value(
                                                        DataType.FUNCTION,
                                                        function (arg4) {
                                                            return new Value(
                                                                DataType.FUNCTION,
                                                                function (arg5) {
                                                                    return new Value(
                                                                        DataType.FUNCTION,
                                                                        function (arg6) {
                                                                            var local = Object.create(env);
                                                                            if (argNames[0] !== undefined) {
                                                                                local[argNames[0]] = arg0;
                                                                            }
                                                                            if (argNames[1] !== undefined) {
                                                                                local[argNames[1]] = arg1;
                                                                            }
                                                                            if (argNames[2] !== undefined) {
                                                                                local[argNames[2]] = arg2;
                                                                            }
                                                                            if (argNames[3] !== undefined) {
                                                                                local[argNames[3]] = arg3;
                                                                            }
                                                                            if (argNames[4] !== undefined) {
                                                                                local[argNames[4]] = arg4;
                                                                            }
                                                                            if (argNames[5] !== undefined) {
                                                                                local[argNames[5]] = arg5;
                                                                            }
                                                                            if (argNames[6] !== undefined) {
                                                                                local[argNames[6]] = arg6;
                                                                            }
                                                                            return body.eval(local, true);
                                                                        }
                                                                    );
                                                                }
                                                            );
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                case 8:
                    return new Value(
                        DataType.FUNCTION,
                        function (arg0) {
                            return new Value(
                                DataType.FUNCTION,
                                function (arg1) {
                                    return new Value(
                                        DataType.FUNCTION,
                                        function (arg2) {
                                            return new Value(
                                                DataType.FUNCTION,
                                                function (arg3) {
                                                    return new Value(
                                                        DataType.FUNCTION,
                                                        function (arg4) {
                                                            return new Value(
                                                                DataType.FUNCTION,
                                                                function (arg5) {
                                                                    return new Value(
                                                                        DataType.FUNCTION,
                                                                        function (arg6) {
                                                                            return new Value(
                                                                                DataType.FUNCTION,
                                                                                function (arg7) {
                                                                                    var local = Object.create(env);
                                                                                    if (argNames[0] !== undefined) {
                                                                                        local[argNames[0]] = arg0;
                                                                                    }
                                                                                    if (argNames[1] !== undefined) {
                                                                                        local[argNames[1]] = arg1;
                                                                                    }
                                                                                    if (argNames[2] !== undefined) {
                                                                                        local[argNames[2]] = arg2;
                                                                                    }
                                                                                    if (argNames[3] !== undefined) {
                                                                                        local[argNames[3]] = arg3;
                                                                                    }
                                                                                    if (argNames[4] !== undefined) {
                                                                                        local[argNames[4]] = arg4;
                                                                                    }
                                                                                    if (argNames[5] !== undefined) {
                                                                                        local[argNames[5]] = arg5;
                                                                                    }
                                                                                    if (argNames[6] !== undefined) {
                                                                                        local[argNames[6]] = arg6;
                                                                                    }
                                                                                    if (argNames[7] !== undefined) {
                                                                                        local[argNames[7]] = arg7;
                                                                                    }
                                                                                    return body.eval(local, true);
                                                                                }
                                                                            );
                                                                        }
                                                                    );
                                                                }
                                                            );
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                default:
                    return nextValue(Object.create(null), 0);
            }
            function nextValue(args, argsCount) {
                return new Value(
                    DataType.FUNCTION,
                    function (arg) {
                        if (argsCount + 1 === numArgs) {
                            var local = Object.create(env);
                            for (var name in args) {
                                local[name] = args[name];
                            }
                            if (argNames[argsCount] !== undefined) {
                                local[argNames[argsCount]] = arg;
                            }
                            return body.eval(local, true);
                        }
                        else {
                            var nextArgs;
                            if (argNames[argsCount] !== undefined) {
                                nextArgs = Object.create(args);
                                nextArgs[argNames[argsCount]] = arg;
                            }
                            else {
                                nextArgs = args;
                            }
                            return nextValue(nextArgs, argsCount + 1);
                        }
                    }
                );
            }
        }
    }
});

function Application(pos, func, arg) {
    Expression.call(this, pos);
    this.func = func;
    this.arg  = arg;
}

Application.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Application
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            var _func = this.func.eval(env, false);
            var _arg  = this.arg.eval(env, false);
            if (tailCall) {
                if (_func.type === DataType.FUNCTION) {
                    return new TailCall(_func, _arg);
                }
                else {
                    throw new errors.invalidApplicationError(this.pos);
                }
            }
            else {
                while (true) {
                    if (_func.type === DataType.FUNCTION) {
                        var res;
                        try {
                            res = _func.data(_arg);
                        }
                        catch (err) {
                            if (err instanceof errors.RuntimeError) {
                                throw err.addPos(this.pos);
                            }
                            else {
                                throw err; // new errors.internalError(this.pos, err);
                            }
                        }
                        if (res instanceof TailCall) {
                            _func = res._func;
                            _arg  = res._arg;
                        }
                        else {
                            return res;
                        }
                    }
                    else {
                        throw new errors.invalidApplicationError(this.pos);
                    }
                }
            }
        }
    }
});

function Negation(pos, expr) {
    Expression.call(this, pos);
    this.expr = expr;
}

Negation.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Negation
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            return new Application(
                this.pos,
                new Variable(this.pos, "__negate__"),
                this.expr
            ).eval(env, tailCall);
        }
    }
});

function ReadPropertyAccessor(pos, expr, name) {
    Expression.call(this, pos);
    this.expr = expr;
    this.name = name;
}

ReadPropertyAccessor.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": ReadPropertyAccessor
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            return new Application(
                this.pos,
                new Application(
                    this.pos,
                    new Variable(this.pos, "__readProperty__"),
                    this.expr
                ),
                this.name
            ).eval(env, tailCall);
        }
    }
});

function CallMethodAccessor(pos, expr, name) {
    Expression.call(this, pos);
    this.expr = expr;
    this.name = name;
}

CallMethodAccessor.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": CallMethodAccessor
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            return new Application(
                this.pos,
                new Application(
                    this.pos,
                    new Variable(this.pos, "__callMethod__"),
                    this.expr
                ),
                this.name
            ).eval(env, tailCall);
        }
    }
});

function WritePropertyAccessor(pos, expr, name) {
    Expression.call(this, pos);
    this.expr = expr;
    this.name = name;
}

WritePropertyAccessor.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": WritePropertyAccessor
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            return new Application(
                this.pos,
                new Application(
                    this.pos,
                    new Variable(this.pos, "__writeProperty__"),
                    this.expr
                ),
                this.name
            ).eval(env, tailCall);
        }
    }
});

function CheckPropertyAccessor(pos, expr, name) {
    Expression.call(this, pos);
    this.expr = expr;
    this.name = name;
}

CheckPropertyAccessor.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": CheckPropertyAccessor
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            return new Application(
                this.pos,
                new Application(
                    this.pos,
                    new Variable(this.pos, "__checkProperty__"),
                    this.expr
                ),
                this.name
            ).eval(env, tailCall);
        }
    }
});

function ReadPropertySection(pos, name) {
    Expression.call(this, pos);
    this.name = name;
}

ReadPropertySection.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": ReadPropertySection
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            return new Application(
                this.pos,
                new Variable(this.pos, "__readPropertyOf__"),
                this.name
            ).eval(env, tailCall);
        }
    }
});

function CallMethodSection(pos, name) {
    Expression.call(this, pos);
    this.name = name;
}

CallMethodSection.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": CallMethodSection
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            return new Application(
                this.pos,
                new Variable(this.pos, "__callMethodOf__"),
                this.name
            ).eval(env, tailCall);
        }
    }
});

function WritePropertySection(pos, name) {
    Expression.call(this, pos);
    this.name = name;
}

WritePropertySection.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": WritePropertySection
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            return new Application(
                this.pos,
                new Variable(this.pos, "__writePropertyOf__"),
                this.name
            ).eval(env, tailCall);
        }
    }
});

function CheckPropertySection(pos, name) {
    Expression.call(this, pos);
    this.name = name;
}

CheckPropertySection.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": CheckPropertySection
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            return new Application(
                this.pos,
                new Variable(this.pos, "__checkPropertyOf__"),
                this.name
            ).eval(env, tailCall);
        }
    }
});

function Conditional(pos, test, conseq, alt) {
    Expression.call(this, pos);
    this.test   = test;
    this.conseq = conseq;
    this.alt    = alt;
}

Conditional.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Conditional
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            var _test = this.test.eval(env, false);
            if (_test.type === DataType.BOOL) {
                if (_test.data === false) {
                    return this.alt.eval(env, tailCall);
                }
                else {
                    return this.conseq.eval(env, tailCall);
                }
            }
            else {
                throw new errors.typeError(this.pos, DataType.BOOL, _test.type);
            }
        }
    }
});

function CondAnd(pos, left, right) {
    Expression.call(this, pos);
    this.left  = left;
    this.right = right;
}

CondAnd.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": CondAnd
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            var _left  = this.left.eval(env, false);
            if (_left.type === DataType.BOOL) {
                if (_left.data) {
                    var _right = this.right.eval(env, false);
                    if (_right.type === DataType.BOOL) {
                        return _right;
                    }
                    else {
                        throw new errors.typeError(this.pos, DataType.BOOL, _right.type);
                    }
                }
                else {
                    return _left;
                }
            }
            else {
                throw new errors.typeError(this.pos, DataType.BOOL, _left.type);
            }
        }
    }
});

function CondOr(pos, left, right) {
    Expression.call(this, pos);
    this.left  = left;
    this.right = right;
}

CondOr.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": CondOr
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            var _left  = this.left.eval(env, false);
            if (_left.type === DataType.BOOL) {
                if (_left.data) {
                    return _left;
                }
                else {
                    var _right = this.right.eval(env, false);
                    if (_right.type === DataType.BOOL) {
                        return _right;
                    }
                    else {
                        throw new errors.typeError(this.pos, DataType.BOOL, _right.type);
                    }
                }
            }
            else {
                throw new errors.typeError(this.pos, DataType.BOOL, _left.type);
            }
        }
    }
});

function Binding(pos, binds, expr) {
    this.pos   = pos;
    this.binds = binds;
    this.expr  = expr;
}

Binding.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Binding
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            var local = Object.create(env);
            this.binds.forEach(function (bind) {
                local[bind[0]] = bind[1].eval(local, false);
            });
            return this.expr.eval(local, tailCall);
        }
    }
});

function Procedure(pos, exprs) {
    Expression.call(this, pos);
    this.exprs = exprs;
}

Procedure.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Procedure
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            var numExprs = this.exprs.length;
            if (numExprs > 0) {
                for (var i = 0; i < numExprs - 1; i++) {
                    this.exprs[i].eval(env, false);
                }
                return this.exprs[numExprs - 1].eval(env, tailCall);
            }
            else {
                return _void;
            }
        }
    }
});

function Loop(pos, test, expr) {
    Expression.call(this, pos);
    this.test = test;
    this.expr = expr;
}

Loop.prototype = Object.create(Expression.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Loop
    },
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            while (true) {
                var _test = this.test.eval(env, false);
                if (_test.type === DataType.BOOL) {
                    if (_test.data === false) {
                        return __unit__;
                    }
                    else {
                        this.expr.eval(env, false);
                    }
                }
                else {
                    throw new errors.typeError(this.pos, DataType.BOOL, _test.type);
                }
            }
        }
    }
});


function Empty(pos) {
    this.pos = pos;
}

Empty.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Empty
    },
    "run": {
        "writable"    : true,
        "configurable": true,
        "value": function (env) {
            /* do nothing */
            return undefined;
        }
    }
});

function Definition(pos, name, expr) {
    this.pos  = pos;
    this.name = name;
    this.expr = expr;
}

Definition.prototype = Object.create(Empty.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Definition
    },
    "run": {
        "writable"    : true,
        "configurable": true,
        "value": function (env) {
            if (Object.hasOwnProperty.call(env, this.name)) {
                throw new errors.multipleDefinitionError(this.pos, this.name);
            }
            else {
                Object.defineProperty(env, this.name, {
                    "writable"    : true,
                    "configurable": true,
                    "enumerable"  : true,
                    "value": this.expr.eval(env, false)
                });
            }
            return undefined;
        }
    }
});

end_module();
