/*
 * milktea : core.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "Value"       : Value,
        "DataType"    : DataType,
        "__unit__"    : __unit__,
        "__true__"    : __true__,
        "__false__"   : __false__,
        "Expression"  : Expression,
        "Literal"     : Literal,
        "ArrayLiteral": ArrayLiteral,
        "Variable"    : Variable,
        "Closure"     : Closure,
        "Application" : Application,
        "Conditional" : Conditional,
        "CondAnd"     : CondAnd,
        "CondOr"      : CondOr,
        "Binding"     : Binding,
        "Procedure"   : Procedure,
        "Empty"       : Empty,
        "Definition"  : Definition
    });
}

var errors = require("./errors.js");

function Value(type, data) {
    this.type = type;
    this.data = data;
}

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

function Closure(pos, argName, body) {
    Expression.call(this, pos);
    this.argName = argName;
    this.body    = body;
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
            var argName = this.argName;
            var body    = this.body;
            return new Value(
                DataType.FUNCTION,
                function (arg) {
                    var local = Object.create(env);
                    local[argName] = arg;
                    return body.eval(local, true);
                }
            );
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
                    throw new errors.typeError(this.pos, DataType.FUNCTION, _func.type);
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
                                throw new errors.unknownError(this.pos);
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
                        throw new errors.typeError(this.pos, DataType.FUNCTION, _func.type);
                    }
                }
            }
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
                local[bind[0]] = bind[1].eval(env, false);
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
            if (env.hasOwnProperty(this.name)) {
                throw new errors.multipleDefinitionError(this.pos, this.name);
            }
            else {
                env[this.name] = this.expr.eval(env, false);
            }
            return undefined;
        }
    }
});

end_module();
