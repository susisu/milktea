/*
 * milktea : core.js
 * copyright (c) 2015 Susisu
 */

/**
 * @module core
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
        "Statement"            : Statement,
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

/**
 * @static
 * @class Value
 * @param {string} type The type of the value.
 * @param data The data that the value contains. 
 * @classdesc The Value class represents internal representations of values.
 */
function Value(type, data) {
    this.type = type;
    this.data = data;
    if (this.type === DataType.OBJECT) {
        Object.defineProperty(this, "internals", {
            "value": {}
        });
    }
}

Value.prototype = Object.create(Object.prototype, /** @lends module:core.Value.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Value
    },
    /**
     * @function
     * @return {string}
     * @desc Returns the string representation of the value.
     */
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

/**
 * @static
 * @readonly
 * @enum {string}
 * @desc DataType has the type tags of values.
 */
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

/**
 * @static
 * @type {module:core.Value}
 * @desc The unit value.
 */
var __unit__  = new Value(DataType.UNIT, undefined);
/**
 * @static
 * @type {module:core.Value}
 * @desc The true value.
 */
var __true__  = new Value(DataType.BOOL, true);
/**
 * @static
 * @type {module:core.Value}
 * @desc The false value.
 */
var __false__ = new Value(DataType.BOOL, false);


/**
 * @static
 * @class TailCall
 * @param {module:core.Value} _func A function value.
 * @param {module:core.Value} _arg A argument value.
 * @classdesc The TailCall class represents not yet fully evaluated tail calls.
 */
function TailCall(_func, _arg) {
    this._func = _func;
    this._arg  = _arg;
}

/**
 * @static
 * @param {(module:core.Value | module:core.TailCall)} res An evaluated Value object or a not fully evaluated TailCall object.
 * @return {module:core.Value} The fully evaluated Value object.
 * @desc If a Value object is specified, returns the value.
 *  If a TailCall object is specified, evaluates function calls repeatedly and finally returns the evaluated value.
 */
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

/**
 * @static
 * @class Statement
 * @param {loquat.SourcePos} pos The position in the source.
 * @classdesc The Statement class is the base class of statements.
 */
function Statement(pos) {
    this.pos = pos;
}

Statement.prototype = Object.create(Object.prototype, /** @lends module:core.Statement.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Statement
    },
    /**
     * @member
     * @function
     * @param {object} env The environment object in which the statement is evaluated.
     * @return {(void | module:core.Value)} The result of the evaluation.
     */
    "run": {
        "writable"    : true,
        "configurable": true,
        "value": function (env) {
            /* do nothing */
            return undefined;
        }
    }
});

/**
 * @static
 * @class Expression
 * @extends module:core.Statement
 * @param {loquat.SourcePos} pos The position in the source..
 * @classdesc The Expression class is the base class of all expressions.
 */
function Expression(pos) {
    this.pos = pos;
}

Expression.prototype = Object.create(Statement.prototype, /** @lends module:core.Expression.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Expression
    },
    /**
     * @member
     * @function
     * @param {object} env An environment object in which the expression is evaluated.
     * @param {boolean} tailCall Specifies the evaluation is the tail call or not.
     * @return {module:core.Value} The evaluated value.
     * @desc Evaluates the expression.
     */
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            return __unit__;
        }
    },
    /**
     * @member
     * @function
     * @param {object} env An environment object in which the expression is evaluated.
     * @return {(void | module:core.Value)} The evaluated value.
     * @desc Evaluates the expression as a statement.
     */
    "run": {
        "writable"    : true,
        "configurable": true,
        "value": function (env) {
            return this.eval(env, false);
        }
    }
});

/**
 * @static
 * @class Literal
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {module:core.Value} value The value to which the expression to be evaluated.
 * @classdesc The Literal class represents literals.
 */
function Literal(pos, value) {
    Expression.call(this, pos);
    this.value = value;
}

Literal.prototype = Object.create(Expression.prototype, /** @lends module:core.Literal.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Literal
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            return this.value;
        }
    }
});

/**
 * @static
 * @class ArrayLiteral
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {Array.<module:core.Value>} elems The array that contains elements.
 * @classdesc The ArrayLiteral class represents array literals.
 */
function ArrayLiteral(pos, elems) {
    Expression.call(this, pos);
    this.elems = elems;
}

ArrayLiteral.prototype = Object.create(Expression.prototype, /** @lends module:core.ArrayLiteral.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": ArrayLiteral
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class ObjectLiteral
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {Array.<Array>} props An array that contains pairs (arrays).
 *  Each pair should consist of the name and the value.
 * @classdesc The ObjectLiteral class represents object literals.
 */
function ObjectLiteral(pos, props) {
    Expression.call(this, pos);
    this.props = props;
}

ObjectLiteral.prototype = Object.create(Expression.prototype, /** @lends module:core.ObjectLiteral.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": ObjectLiteral
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class Variable
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {string} name The name of the variable.
 * @classdesc The Variable class represents variables.
 */
function Variable(pos, name) {
    Expression.call(this, pos);
    this.name = name;
}

Variable.prototype = Object.create(Expression.prototype, /** @lends module:core.Variable.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Variable
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class Closure
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {Array.<string>} argNames An array that contains the names of the arguments.
 * @param {module:core.Expression} body The body of the closure.
 * @classdesc The Closure class represents closures (functions).
 */
function Closure(pos, argNames, body) {
    Expression.call(this, pos);
    this.argNames = argNames;
    this.body     = body;
}

Closure.prototype = Object.create(Expression.prototype, /** @lends module:core.Closure.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Closure
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
    "eval": {
        "writable"    : true,
        "configurable": true,
        "value": function (env, tailCall) {
            var argNames = this.argNames;
            var numArgs  = this.argNames.length;
            var body     = this.body;
            // This is ugly but I have no idea to make evaluations faster than this.
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

/**
 * @static
 * @class Application
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {module:core.Expression} func The function expression.
 * @param {module:core.Expression} arg The arugment expression.
 * @classdesc The Application class represents function applications.
 */
function Application(pos, func, arg) {
    Expression.call(this, pos);
    this.func = func;
    this.arg  = arg;
}

Application.prototype = Object.create(Expression.prototype, /** @lends module:core.Application.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Application
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class Negation
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {module:core.Expression} expr The expression to be negated.
 * @classdesc The Negation class represents negations (multiple by -1)
 */
function Negation(pos, expr) {
    Expression.call(this, pos);
    this.expr = expr;
}

Negation.prototype = Object.create(Expression.prototype, /** @lends module:core.Negation.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Negation
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class ReadPropertyAccessor
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {module:core.Expression} expr
 * @param {module:core.Expression} name
 */
function ReadPropertyAccessor(pos, expr, name) {
    Expression.call(this, pos);
    this.expr = expr;
    this.name = name;
}

ReadPropertyAccessor.prototype = Object.create(Expression.prototype, /** @lends module:core.ReadPropertyAccessor.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": ReadPropertyAccessor
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class CallMethodAccessor
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {module:core.Expression} expr
 * @param {module:core.Expression} name
 */
function CallMethodAccessor(pos, expr, name) {
    Expression.call(this, pos);
    this.expr = expr;
    this.name = name;
}

CallMethodAccessor.prototype = Object.create(Expression.prototype, /** @lends module:core.CallMethodAccessor.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": CallMethodAccessor
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class WritePropertyAccessor
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {module:core.Expression} expr
 * @param {module:core.Expression} name
 */
function WritePropertyAccessor(pos, expr, name) {
    Expression.call(this, pos);
    this.expr = expr;
    this.name = name;
}

WritePropertyAccessor.prototype = Object.create(Expression.prototype, /** @lends module:core.WritePropertyAccessor.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": WritePropertyAccessor
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class CheckPropertyAccessor
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {module:core.Expression} expr
 * @param {module:core.Expression} name
 */
function CheckPropertyAccessor(pos, expr, name) {
    Expression.call(this, pos);
    this.expr = expr;
    this.name = name;
}

CheckPropertyAccessor.prototype = Object.create(Expression.prototype, /** @lends module:core.CheckPropertyAccessor.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": CheckPropertyAccessor
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class ReadPropertySection
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {module:core.Expression} name
 */
function ReadPropertySection(pos, name) {
    Expression.call(this, pos);
    this.name = name;
}

ReadPropertySection.prototype = Object.create(Expression.prototype, /** @lends module:core.ReadPropertySection.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": ReadPropertySection
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class CallMethodSection
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {module:core.Expression} name
 */
function CallMethodSection(pos, name) {
    Expression.call(this, pos);
    this.name = name;
}

CallMethodSection.prototype = Object.create(Expression.prototype, /** @lends module:core.CallMethodSection.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": CallMethodSection
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class WritePropertySection
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {module:core.Expression} name
 */
function WritePropertySection(pos, name) {
    Expression.call(this, pos);
    this.name = name;
}

WritePropertySection.prototype = Object.create(Expression.prototype, /** @lends module:core.WritePropertySection.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": WritePropertySection
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class CheckPropertySection
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {module:core.Expression} name
 */
function CheckPropertySection(pos, name) {
    Expression.call(this, pos);
    this.name = name;
}

CheckPropertySection.prototype = Object.create(Expression.prototype, /** @lends module:core.CheckPropertySection.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": CheckPropertySection
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class Conditional
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {module:core.Expression} test The test expression.
 * @param {module:core.Expression} conseq An expression to be evaluated when the test is evaluated to true.
 * @param {module:core.Expression} alt An expression to be evaluated when the test is evaluated to false.
 * @classdesc The Conditional class represents conditional (if-then-else) expressions.
 */
function Conditional(pos, test, conseq, alt) {
    Expression.call(this, pos);
    this.test   = test;
    this.conseq = conseq;
    this.alt    = alt;
}

Conditional.prototype = Object.create(Expression.prototype, /** @lends module:core.Conditional.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Conditional
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class CondAnd
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {module:core.Expression} left The first argument expression.
 * @param {module:core.Expression} right The second argument expression.
 * @classdesc The CondAnd class represents boolean 'and' operations with short-circuit evaluations.
 */
function CondAnd(pos, left, right) {
    Expression.call(this, pos);
    this.left  = left;
    this.right = right;
}

CondAnd.prototype = Object.create(Expression.prototype, /** @lends module:core.CondAnd.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": CondAnd
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class CondOr
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {module:core.Expression} left The first argument expression.
 * @param {module:core.Expression} right The second argument expression.
 * @classdesc The CondOr class represents boolean 'or' operations with short-circuit evaluations.
 */
function CondOr(pos, left, right) {
    Expression.call(this, pos);
    this.left  = left;
    this.right = right;
}

CondOr.prototype = Object.create(Expression.prototype, /** @lends module:core.CondOr.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": CondOr
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class Binding
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {Array.<Array>} binds An array that contains pairs (arrays).
 *  Each pair should consist of the name and the expression to be bound.
 * @param {module:core.Expression} expr The expression in which the bindings are effective.
 * @classdesc The Binding class represents let-in bindings.
 */
function Binding(pos, binds, expr) {
    this.pos   = pos;
    this.binds = binds;
    this.expr  = expr;
}

Binding.prototype = Object.create(Expression.prototype, /** @lends module:core.Binding.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Binding
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class Procedure
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {Array.<module:core.Expression>} exprs An array of expressions to be evaluated sequentially.
 * @classdesc The Procedure class represents procedures, i.e. sequential expressions.
 */
function Procedure(pos, exprs) {
    Expression.call(this, pos);
    this.exprs = exprs;
}

Procedure.prototype = Object.create(Expression.prototype, /** @lends module:core.Procedure.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Procedure
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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

/**
 * @static
 * @class Loop
 * @extends module:core.Expression
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {module:core.Expression} test The test expression.
 * @param {module:core.Expression} expr An expression which evaluated repeatedly in the loop.
 * @classdesc The Loop class represents loops.
 */
function Loop(pos, test, expr) {
    Expression.call(this, pos);
    this.test = test;
    this.expr = expr;
}

Loop.prototype = Object.create(Expression.prototype, /** @lends module:core.Loop.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Loop
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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


/**
 * @static
 * @class Empty
 * @extends Statement
 * @param {loquat.SourcePos} pos The position in the source.
 * @classdesc The Empty class represents empty statements.
 */
function Empty(pos) {
    this.pos = pos;
}

Empty.prototype = Object.create(Statement.prototype, /** @lends module:core.Empty.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Empty
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
    "run": {
        "writable"    : true,
        "configurable": true,
        "value": function (env) {
            return undefined;
        }
    }
});

/**
 * @static
 * @class Definition
 * @extends module:core.Statement
 * @param {loquat.SourcePos} pos The position in the source.
 * @param {string} name The name that the value is bound.
 * @param {module:core.Expression} expr The expression to be evaluated and bound.
 * @classdesc The Definition class represents variable and function definitions.
 */
function Definition(pos, name, expr) {
    this.pos  = pos;
    this.name = name;
    this.expr = expr;
}

Definition.prototype = Object.create(Statement.prototype, /** @lends module:core.Definition.prototype */ {
    /**
     * @member
     */
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Definition
    },
    /**
     * @member
     * @function
     * @inheritdoc
     */
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
