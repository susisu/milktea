/*!
 * milktea 0.1.2
 * copyright (c) 2015 Susisu | MIT License
 * https://github.com/susisu/milktea
 */
var milktea =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : milktea.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @file milktea - a functional object-oriented script language interpreter
     * @copyright (c) 2015 Susisu
     * @license MIT
     */

    "use strict";

    function end_module() {
        module.exports = Object.freeze({
            "core"   : __webpack_require__(1),
            "errors" : __webpack_require__(2),
            "parser" : __webpack_require__(3),
            "lib"    : __webpack_require__(8),
            "prelude": __webpack_require__(22)
        });
    }

    end_module();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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

    var errors = __webpack_require__(2);

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
     * @throws {module:errors.RuntimeError} When a runtime error occurred.
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
         * @throws {module:errors.RuntimeError} When a runtime error occurred.
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
         * @throws {module:errors.RuntimeError} When a runtime error occurred.
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
         * @throws {module:errors.RuntimeError} When a runtime error occurred.
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
     * @extends module:core.Statement
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


/***/ },
/* 2 */
/***/ function(module, exports) {

    /*
     * milktea : errors.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module errors
     */

    "use strict";

    function end_module() {
        module.exports = Object.freeze({
            "RuntimeError": RuntimeError,

            "internalError"             : internalError,
            "unboundError"              : unboundError,
            "typeError"                 : typeError,
            "invalidApplicationError"   : invalidApplicationError,
            "multipleDefinitionError"   : multipleDefinitionError,
            "readNullObjectError"       : readNullObjectError,
            "writeNullObjectError"      : writeNullObjectError,
            "propertyNotFoundError"     : propertyNotFoundError,
            "cannotWriteError"          : cannotWriteError,
            "cannotDeleteError"         : cannotDeleteError,
            "emptyArrayError"           : emptyArrayError,
            "outOfRangeError"           : outOfRangeError,
            "noInternalNamespaceError"  : noInternalNamespaceError,
            "readInternalPropertyError" : readInternalPropertyError,
            "writeInternalPropertyError": writeInternalPropertyError
        });
    }

    /**
     * @static
     * @class RuntimeError
     * @param {Array.<loquat.SourcePos>} positions
     * @param {string} message
     * @classdesc The RuntimeError exception is thrown when some runtime error occurs.
     */
    function RuntimeError(positions, message) {
        this.positions = positions;
        this.message   = message;
    }

    RuntimeError.prototype = Object.create(Object.prototype, /** @lends module:errors.RuntimeError.prototype */ {
        /**
         * @member
         */
        "constructor": {
            "writable"    : true,
            "configurable": true,
            "value": RuntimeError
        },
        /**
         * @member
         * @function
         * @return {string} The string representation of the error.
         */
        "toString": {
            "writable"    : true,
            "configurable": true,
            "value": function () {
                var str = "";
                for (var i = this.positions.length - 1; i >= 0; i--) {
                    str += this.positions[i].toString() + ":\n";
                }
                str += this.message;
                return str;
            }
        },
        /**
         * @member
         * @function
         * @param {loquat.SourcePos} pos The position to be added to the error.
         * @param {module:errors.RuntimeError} A new error object.
         * @desc Adds a position to the error.
         */
        "addPos": {
            "writable"    : true,
            "configurable": true,
            "value": function (pos) {
                return new RuntimeError(this.positions.concat(pos), this.message);
            }
        }
    });

    /**
     * @static
     * @param {(loquat.SourcePos | void)} pos
     * @param {Error} err
     * @return {module:errors.RuntimeError}
     * @desc Creates a new runtime error with the specified error that represents an internal error.
     */
    function internalError(pos, err) {
        return new RuntimeError(
            pos === undefined ? [] : [pos],
            "internal error: " + err.toString()
        );
    }

    /**
     * @static
     * @param {(loquat.SourcePos | void)} pos
     * @param {string} name
     * @return {module:errors.RuntimeError}
     * @desc Creates a new runtime error that is thrown when an unbound variable is found.
     */
    function unboundError(pos, name) {
        return new RuntimeError(
            pos === undefined ? [] : [pos],
            "unbound variable: " + name
        );
    }

    /**
     * @static
     * @param {(loquat.SourcePos | void)} pos
     * @param {string} expect
     * @param {string} actual
     * @return {module:errors.RuntimeError}
     * @desc Creates a new runtime error that is thrown when a type mismatch is occurred.
     */
    function typeError(pos, expect, actual) {
        return new RuntimeError(
            pos === undefined ? [] : [pos],
            "type mismatch: expect " + expect + ", actual " + actual
        );
    }

    /**
     * @static
     * @param {(loquat.SourcePos | void)} pos
     * @return {module:errors.RuntimeError}
     * @desc Creates a new runtime error that is thrown when an application is invalid.
     */
    function invalidApplicationError(pos) {
        return new RuntimeError(
            pos === undefined ? [] : [pos],
            "invalid application"
        );
    }

    /**
     * @static
     * @param {(loquat.SourcePos | void)} pos
     * @param {string} name
     * @return {module:errors.RuntimeError}
     * @desc Creates a new runtime error that is thrown when a definition is duplicate.
     */
    function multipleDefinitionError(pos, name) {
        return new RuntimeError(
            pos === undefined ? [] : [pos],
            "multiple definition: " + name
        );
    }

    /**
     * @static
     * @param {(loquat.SourcePos | void)} pos
     * @return {module:errors.RuntimeError}
     * @desc Creates a new runtime error that thrown when you try to read a property of null object.
     */
    function readNullObjectError(pos) {
        return new RuntimeError(
            pos === undefined ? [] : [pos],
            "cannot read property of null"
        );
    }

    /**
     * @static
     * @param {(loquat.SourcePos | void)} pos
     * @return {module:errors.RuntimeError}
     * @desc Creates a new runtime error that thrown when you try to write a property of null object.
     */
    function writeNullObjectError(pos) {
        return new RuntimeError(
            pos === undefined ? [] : [pos],
            "cannot set property to null"
        );
    }

    /**
     * @static
     * @param {(loquat.SourcePos | void)} pos
     * @param {string} name
     * @return {module:errors.RuntimeError}
     * @desc Creates a new runtime error that thrown when a property is not found.
     */
    function propertyNotFoundError(pos, name) {
        return new RuntimeError(
            pos === undefined ? [] : [pos],
            "property not found: " + name
        );
    }

    /**
     * @static
     * @param {(loquat.SourcePos | void)} pos
     * @param {string} name
     * @return {module:errors.RuntimeError}
     * @desc Creates a new runtime error that thrown when you try to write a property but couldn't.
     */
    function cannotWriteError(pos, name) {
        return new RuntimeError(
            pos === undefined ? [] : [pos],
            "cannot set property: " + name
        );
    }

    /**
     * @static
     * @param {(loquat.SourcePos | void)} pos
     * @param {string} name
     * @return {module:errors.RuntimeError}
     * @desc Creates a new runtime error that thrown when you try to delete a property but couldn't.
     */
    function cannotDeleteError(pos, name) {
        return new RuntimeError(
            pos === undefined ? [] : [pos],
            "cannot delete property: " + name
        );
    }

    /**
     * @static
     * @param {(loquat.SourcePos | void)} pos
     * @return {module:errors.RuntimeError}
     * @desc Creates a new runtime error that thrown when you try to write a property but couldn't.
     */
    function emptyArrayError(pos) {
        return new RuntimeError(
            pos === undefined ? [] : [pos],
            "empty array"
        );
    }

    /**
     * @static
     * @param {(loquat.SourcePos | void)} pos
     * @param {number} index
     * @return {module:errors.RuntimeError}
     * @desc Creates a new runtime error that thrown when an index is out of the range.
     */
    function outOfRangeError(pos, index) {
        return new RuntimeError(
            pos === undefined ? [] : [pos],
            "index out of range: " + index.toString()
        );
    }

    /**
     * @static
     * @param {(loquat.SourcePos | void)} pos
     * @return {module:errors.RuntimeError}
     * @desc Creates a new runtime error that thrown when the internal namespace is not assigned.
     */
    function noInternalNamespaceError(pos) {
        return new RuntimeError(
            pos === undefined ? [] : [pos],
            "internal namespace not assigned"
        );
    }

    /**
     * @static
     * @param {(loquat.SourcePos | void)} pos
     * @param {string} key
     * @param {string} name
     * @return {module:errors.RuntimeError}
     * @desc Creates a new runtime error that thrown when you try to read an internal property but couldn't.
     */
    function readInternalPropertyError(pos, key, name) {
        return new RuntimeError(
            pos === undefined ? [] : [pos],
            "cannnot read internal property: " + key + "::" + name
        );
    }

    /**
     * @static
     * @param {(loquat.SourcePos | void)} pos
     * @param {string} key
     * @param {string} name
     * @return {module:errors.RuntimeError}
     * @desc Creates a new runtime error that thrown when you try to write an internal property but couldn't.
     */
    function writeInternalPropertyError(pos, key, name) {
        return new RuntimeError(
            pos === undefined ? [] : [pos],
            "cannot write internal property: " + key + "::" + name
        );
    }

    end_module();


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : parser.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module parser
     */

    "use strict";

    function end_module() {
        module.exports = Object.freeze({
            "initialOperatorInfo" : initialOperatorInfo,
            "initialParserState"  : initialParserState,
            "lex"                 : lex,
            "lexEx"               : lexEx,
            "parse"               : parse,
            "parseEx"             : parseEx,
            "parseTokens"         : parseTokens,
            "parseWithState"      : parseWithState,
            "parseWithStateEx"    : parseWithStateEx,
            "parseTokensWithState": parseTokensWithState
        });
    }

    var lq = __webpack_require__(4);

    var lexer  = __webpack_require__(5);
    var parser = __webpack_require__(7);

    /**
     * @static
     * @type {object<string, module:parser/parser.OperatorInfo>}
     * @desc The default operator information.
     */
    var initialOperatorInfo = Object.create(null);

    initialOperatorInfo["!!"]      = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT,  9);
    initialOperatorInfo["@"]       = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 9);

    initialOperatorInfo["**"]      = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 8);

    initialOperatorInfo["*"]       = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT,  7);
    initialOperatorInfo["/"]       = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT,  7);
    initialOperatorInfo["mod"]     = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT,  7);

    initialOperatorInfo["+"]       = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT,  6);
    initialOperatorInfo["-"]       = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT,  6);

    initialOperatorInfo["++"]      = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 5);

    initialOperatorInfo["=="]      = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE,  4);
    initialOperatorInfo["/="]      = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE,  4);
    initialOperatorInfo["<"]       = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE,  4);
    initialOperatorInfo["<="]      = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE,  4);
    initialOperatorInfo[">"]       = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE,  4);
    initialOperatorInfo[">="]      = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE,  4);
    initialOperatorInfo["elem"]    = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE,  4);
    initialOperatorInfo["notElem"] = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE,  4);

    initialOperatorInfo["&"]       = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT,  1);

    initialOperatorInfo["on"]      = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT,  0);
    initialOperatorInfo["$"]       = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 0);
    initialOperatorInfo[":="]      = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 0);
    initialOperatorInfo[".."]      = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE,  0);

    /**
     * @static
     * @type {module:parser/parser.ParserState}
     * @desc The default parser state.
     */
    var initialParserState = new parser.ParserState(initialOperatorInfo);

    /**
     * @static
     * @param {string} name The name of the source file.
     * @param {string} source The source string.
     * @return {Array.<module:parser/tokens.Token>}
     * @throws {loquat.ParseError} Syntax error.
     * @desc Tokenizes the source.
     */
    function lex(name, source) {
        var result = lq.parse(lexer.lexer, name, source, 8);
        if (result.succeeded) {
            return result.value;
        }
        else {
            throw result.error;
        }
    }

    /**
     * @static
     * @param {string} name The name of the source file.
     * @param {string} source The source string.
     * @return {Array.<module:parser/tokens.Token>}
     * @throws {loquat.ParseError} Syntax error.
     * @desc Tokenizes the source, ignoring a shebang at the head.
     */
    function lexEx(name, source) {
        var result = lq.parse(lexer.lexerEx, name, source, 8);
        if (result.succeeded) {
            return result.value;
        }
        else {
            throw result.error;
        }
    }

    /**
     * @static
     * @param {string} name The name of the source file.
     * @param {string} source The source string.
     * @return {Array} A pair of {@link Array.<module:core.Statement>} and {@link module:parser/parser.ParserState}.
     * @throws {loquat.ParseError} Syntax error.
     * @desc Parses the source.
     */
    function parse(name, source) {
        return parseTokensWithState(name, lex(name, source), initialParserState);
    }

    /**
     * @static
     * @param {string} name The name of the source file.
     * @param {string} source The source string.
     * @return {Array} A pair of {@link Array.<module:core.Statement>} and {@link module:parser/parser.ParserState}.
     * @throws {loquat.ParseError} Syntax error.
     * @desc Parses the source, ignoring a shebang at the head.
     */
    function parseEx(name, source) {
        return parseTokensWithState(name, lexEx(name, source), initialParserState);
    }

    /**
     * @static
     * @param {string} name The name of the source file.
     * @param {Array.<Token>} tokens The source tokens.
     * @return {Array} A pair of {@link Array.<module:core.Statement>} and {@link module:parser/parser.ParserState}.
     * @throws {loquat.ParseError} Syntax error.
     * @desc Parses the tokens.
     */
    function parseTokens(name, tokens) {
        return parseTokensWithState(name, tokens, initialParserState);
    }

    /**
     * @static
     * @param {string} name The name of the source file.
     * @param {string} source The source string.
     * @param {module:parser/parser.ParserState} state The parser state.
     * @return {Array} A pair of {@link Array.<module:core.Statement>} and {@link module:parser/parser.ParserState}.
     * @throws {loquat.ParseError} Syntax error.
     * @desc Parses the source with the specified state.
     */
    function parseWithState(name, source, state) {
        return parseTokensWithState(name, lex(name, source), state);
    }

    /**
     * @static
     * @param {string} name The name of the source file.
     * @param {string} source The source string.
     * @param {module:parser/parser.ParserState} state The parser state.
     * @return {Array} A pair of {@link Array.<module:core.Statement>} and {@link module:parser/parser.ParserState}.
     * @throws {loquat.ParseError} Syntax error.
     * @desc Parses the source with the specified state, ignoring a shebang at the head.
     */
    function parseWithStateEx(name, source, state) {
        return parseTokensWithState(name, lexEx(name, source), state);
    }

    /**
     * @static
     * @param {string} name The name of the source file.
     * @param {Array.<Token>} tokens The source tokens.
     * @param {module:parser/parser.ParserState} state The parser state.
     * @return {Array} A pair of {@link Array.<module:core.Statement>} and {@link module:parser/parser.ParserState}.
     * @throws {loquat.ParseError} Syntax error.
     * @desc Parses the tokens with the specified state.
     */
    function parseTokensWithState(name, tokens, state) {
        var result = lq.parse(parser.parser, name, tokens, 8, state);
        if (result.succeeded) {
            return result.value;
        }
        else {
            throw result.error;
        }
    }

    end_module();


/***/ },
/* 4 */
/***/ function(module, exports) {

    module.exports = loquat;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : parser/lexer.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module parser/lexer
     */

    "use strict";

    function end_module() {
        module.exports = Object.freeze({
            "lexer"  : lexer,
            "lexerEx": lexerEx
        });
    }

    var lq = __webpack_require__(4);

    var tokens = __webpack_require__(6);

    var langDef = new lq.LanguageDef(
        "{-",
        "-}",
        "--",
        true,
        lq.letter,
        lq.alphaNum.or(lq.oneOf("_'")),
        lq.oneOf(":!#$%&*+./<=>?@\\^|-~"),
        lq.oneOf(":!#$%&*+./<=>?@\\^|-~"),
        [
            "NaN", "Infinity",
            "true", "false",
            "if", "then", "else",
            "and", "or",
            "let", "in",
            "begin", "end",
            "while", "do",
            "infix", "infixl", "infixr"
        ],
        ["=", "\\", "->", ".", ":", "!", "?"],
        true
    );
    var tokenParser = lq.makeTokenParser(langDef);

    // number literal
    var numberLiteralToken =
        lq.getPosition.bind(function (pos) {
            return tokenParser.naturalOrFloat.bind(function (nf) {
                if (nf.length === 1) {
                    // natural
                    return lq.pure(new tokens.NaturalLiteral(pos, nf[0]));
                }
                else {
                    // float
                    return lq.pure(new tokens.FloatLiteral(pos, nf[1]));
                }
            });
        })
        .label("number");
    var specialNumberLiteral =
        tokenParser.reserved("NaN").then(lq.pure(NaN))
        .or(tokenParser.reserved("Infinity").then(lq.pure(Infinity)));
    var specialNumberLiteralToken =
        lq.getPosition.bind(function (pos) {
            return specialNumberLiteral.bind(function (num) {
                return lq.pure(new tokens.FloatLiteral(pos, num));
            });
        })
        .label("number");

    // string literal
    var stringLiteral = tokenParser.stringLiteral;
    var stringLiteralToken =
        lq.getPosition.bind(function (pos) {
            return stringLiteral.bind(function (str) {
                return lq.pure(new tokens.StringLiteral(pos, str));
            });
        })
        .label("string");

    // bool literal
    var boolLiteral =
        tokenParser.reserved("true").then(lq.pure(true))
        .or(tokenParser.reserved("false").then(lq.pure(false)));
    var boolLiteralToken =
        lq.getPosition.bind(function (pos) {
            return boolLiteral.bind(function (tf) {
                return lq.pure(new tokens.BoolLiteral(pos, tf));
            });
        })
        .label("bool");

    // identifier
    var identifier = tokenParser.identifier;
    var identifierToken =
        lq.getPosition.bind(function (pos) {
            return identifier.bind(function (name) {
                return lq.pure(new tokens.Identifier(pos, name));
            });
        })
        .label("identifier");

    // operator
    var operator = tokenParser.operator;
    var operatorToken =
        lq.getPosition.bind(function (pos) {
            return operator.bind(function (name) {
                return lq.pure(new tokens.Operator(pos, name));
            });
        })
        .label("operator");

    var infixIdentifier =
        tokenParser.symbol("`")
        .right(identifier)
        .left(tokenParser.symbol("`"));
    var infixIdentifierToken =
        lq.getPosition.bind(function (pos) {
            return infixIdentifier.bind(function (name) {
                return lq.pure(new tokens.InfixIdentifier(pos, name));
            });
        })
        .label("operator");

    var noBindingPattern = tokenParser.reserved("_");
    var noBindingPatternToken =
        lq.getPosition.bind(function (pos) {
            return noBindingPattern.then(
                lq.pure(new tokens.NoBindingPattern(pos))
            );
        })
        .label("_");

    // reserved word
    var reservedWord =
        lq.choice(
            [
                "if", "then", "else",
                "and", "or",
                "let", "in",
                "begin", "end",
                "while", "do",
                "infix", "infixl", "infixr"
            ].map(function (word) {
                return tokenParser.reserved(word).then(lq.pure(word));
            })
        );
    var reservedWordToken =
        lq.getPosition.bind(function (pos) {
            return reservedWord.bind(function (name) {
                return lq.pure(new tokens.ReservedWord(pos, name));
            });
        })
        .label("reserved word");

    // reserved operator
    var reservedOperator =
        lq.choice(
            [
                "=", "\\", "->", ".", ":", "!", "?"
            ].map(function (op) {
                return tokenParser.reservedOp(op).then(lq.pure(op))
            })
        );
    var reservedOperatorToken =
        lq.getPosition.bind(function (pos) {
            return reservedOperator.bind(function (name) {
                return lq.pure(new tokens.ReservedOperator(pos, name));
            });
        })
        .label("reserved operator");

    // symbols
    var openParen    = tokenParser.symbol("(");
    var closeParen   = tokenParser.symbol(")");
    var openBrace    = tokenParser.symbol("{");
    var closeBrace   = tokenParser.symbol("}");
    var openBracket  = tokenParser.symbol("[");
    var closeBracket = tokenParser.symbol("]");
    var comma        = tokenParser.comma;
    var semicolon    = tokenParser.semi;
    var symbol =
        lq.choice([
            openParen, closeParen,
            openBrace, closeBrace,
            openBracket, closeBracket,
            comma, semicolon
        ]);
    var symbolToken =
        lq.getPosition.bind(function (pos) {
            return symbol.bind(function (name) {
                return lq.pure(new tokens.Symbol(pos, name));
            });
        }).label("symbol");

    var token =
        lq.choice([
            numberLiteralToken,
            specialNumberLiteralToken,
            stringLiteralToken,
            boolLiteralToken,
            identifierToken,
            operatorToken,
            infixIdentifierToken,
            noBindingPatternToken,
            reservedWordToken,
            reservedOperatorToken,
            symbolToken
        ])
        .label("token");

    /**
     * @static
     * @type {loquat.Parser<string, *, Array.<module:parser/tokens.Token>>}
     * @desc The tokenizer that consumers a stream of string.
     */
    var lexer =
        tokenParser.whiteSpace
        .then(token.many())
        .left(lq.eof);

    var shebang =
        lq.optional(
            lq.string("#!")
            .then(lq.noneOf("\r\n").skipMany())
            .then(lq.oneOf("\r\n"))
        );

    /**
     * @static
     * @type {loquat.Parser<string, *, Array.<module:parser/tokens.Token>>}
     * @desc The tokenizer that consumers a stream of string.
     *  A shebang at the head of the stream will be ignored.
     */
    var lexerEx = shebang.then(lexer);

    end_module();


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : parser/tokens.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module parser/tokens
     */

    "use strict";

    function end_module() {
        module.exports = Object.freeze({
            "Token"           : Token,
            "NaturalLiteral"  : NaturalLiteral,
            "FloatLiteral"    : FloatLiteral,
            "StringLiteral"   : StringLiteral,
            "BoolLiteral"     : BoolLiteral,
            "NullLiteral"     : NullLiteral,
            "Identifier"      : Identifier,
            "Operator"        : Operator,
            "InfixIdentifier" : InfixIdentifier,
            "NoBindingPattern": NoBindingPattern,
            "ReservedWord"    : ReservedWord,
            "ReservedOperator": ReservedOperator,
            "Symbol"          : Symbol
        });
    }

    var lq = __webpack_require__(4);

    /**
     * @static
     * @class Token
     * @param {loquat.SourcePos} pos The position in the source.
     */
    function Token(pos) {
        this.pos = pos;
    }

    Token.prototype = Object.create(Object.prototype, /** @lends module:parser/tokens.Token.prototype */ {
        /**
         * @member
         */
        "constructor": {
            "writable"    : true,
            "configurable": true,
            "value": Token
        },
        /**
         * @member
         * @function
         * @return {string} The string representation of the token.
         */
        "toString": {
            "writable"    : true,
            "configurable": true,
            "value": function () {
                return "unknown token";
            }
        }
    });

    /**
     * @static
     * @class NaturalLiteral
     * @extends module:parser/tokens.Token
     * @param {loquat.SourcePos} pos The position in the source.
     * @param {number} value
     */
    function NaturalLiteral(pos, value) {
        Token.call(this, pos);
        this.value = value;
    }

    NaturalLiteral.prototype = Object.create(Token.prototype, /** @lends module:parser/tokens.NaturalLiteral.prototype */ {
        /**
         * @member
         */
        "constructor": {
            "writable"    : true,
            "configurable": true,
            "value": NaturalLiteral
        },
        /**
         * @member
         * @function
         * @return {string} The string representation of the token.
         */
        "toString": {
            "writable"    : true,
            "configurable": true,
            "value": function () {
                return "number " + this.value.toString();
            }
        }
    });

    /**
     * @static
     * @class FloatLiteral
     * @extends module:parser/tokens.Token
     * @param {loquat.SourcePos} pos The position in the source.
     * @param {number} value
     */
    function FloatLiteral(pos, value) {
        Token.call(this, pos);
        this.value = value;
    }

    FloatLiteral.prototype = Object.create(Token.prototype, /** @lends module:parser/tokens.FloatLiteral.prototype */ {
        /**
         * @member
         */
        "constructor": {
            "writable"    : true,
            "configurable": true,
            "value": FloatLiteral
        },
        /**
         * @member
         * @function
         * @return {string} The string representation of the token.
         */
        "toString": {
            "writable"    : true,
            "configurable": true,
            "value": function () {
                return "number " + this.value.toString();
            }
        }
    });

    /**
     * @static
     * @class StringLiteral
     * @extends module:parser/tokens.Token
     * @param {loquat.SourcePos} pos The position in the source.
     * @param {string} value
     */
    function StringLiteral(pos, value) {
        Token.call(this, pos);
        this.value = value;
    }

    StringLiteral.prototype = Object.create(Token.prototype, /** @lends module:parser/tokens.StringLiteral.prototype */ {
        /**
         * @member
         */
        "constructor": {
            "writable"    : true,
            "configurable": true,
            "value": StringLiteral
        },
        /**
         * @member
         * @function
         * @return {string} The string representation of the token.
         */
        "toString": {
            "writable"    : true,
            "configurable": true,
            "value": function () {
                return "string " + lq.show(this.value);
            }
        }
    });

    /**
     * @static
     * @class BoolLiteral
     * @extends module:parser/tokens.Token
     * @param {loquat.SourcePos} pos The position in the source.
     * @param {bool} value
     */
    function BoolLiteral(pos, value) {
        Token.call(this, pos);
        this.value = value;
    }

    BoolLiteral.prototype = Object.create(Token.prototype, /** @lends module:parser/tokens.BoolLiteral.prototype */ {
        /**
         * @member
         */
        "constructor": {
            "writable"    : true,
            "configurable": true,
            "value": BoolLiteral
        },
        /**
         * @member
         * @function
         * @return {string} The string representation of the token.
         */
        "toString": {
            "writable"    : true,
            "configurable": true,
            "value": function () {
                return "bool " + (this.value ? "true" : "false");
            }
        }
    });

    /**
     * @static
     * @class NullLiteral
     * @extends module:parser/tokens.Token
     * @param {loquat.SourcePos} pos The position in the source.
     */
    function NullLiteral(pos) {
        Token.call(this, pos);
    }

    NullLiteral.prototype = Object.create(Token.prototype, /** @lends module:parser/tokens.NullLiteral.prototype */ {
        /**
         * @member
         */
        "constructor": {
            "writable"    : true,
            "configurable": true,
            "value": NullLiteral
        },
        /**
         * @member
         * @function
         * @return {string} The string representation of the token.
         */
        "toString": {
            "writable"    : true,
            "configurable": true,
            "value": function () {
                return "null";
            }
        }
    });

    /**
     * @static
     * @class Identifier
     * @extends module:parser/tokens.Token
     * @param {loquat.SourcePos} pos The position in the source.
     * @param {string} name
     */
    function Identifier(pos, name) {
        Token.call(this, pos);
        this.name = name;
    }

    Identifier.prototype = Object.create(Token.prototype, /** @lends module:parser/tokens.Identifier.prototype */ {
        /**
         * @member
         */
        "constructor": {
            "writable"    : true,
            "configurable": true,
            "value": Identifier
        },
        /**
         * @member
         * @function
         * @return {string} The string representation of the token.
         */
        "toString": {
            "writable"    : true,
            "configurable": true,
            "value": function () {
                return "identifier '" + this.name + "'";
            }
        }
    });

    /**
     * @static
     * @class Operator
     * @extends module:parser/tokens.Token
     * @param {loquat.SourcePos} pos The position in the source.
     * @param {string} name
     */
    function Operator(pos, name) {
        Token.call(this, pos);
        this.name = name;
    }

    Operator.prototype = Object.create(Token.prototype, /** @lends module:parser/tokens.Operator.prototype */ {
        /**
         * @member
         */
        "constructor": {
            "writable"    : true,
            "configurable": true,
            "value": Operator
        },
        /**
         * @member
         * @function
         * @return {string} The string representation of the token.
         */
        "toString": {
            "writable"    : true,
            "configurable": true,
            "value": function () {
                return "operator " + this.name;
            }
        }
    });

    /**
     * @static
     * @class InfixIdentifier
     * @extends module:parser/tokens.Token
     * @param {loquat.SourcePos} pos The position in the source.
     * @param {string} name
     */
    function InfixIdentifier(pos, name) {
        Token.call(this, pos);
        this.name = name;
    }

    InfixIdentifier.prototype = Object.create(Token.prototype, /** @lends module:parser/tokens.InfixIdentifier.prototype */ {
        /**
         * @member
         */
        "constructor": {
            "writable"    : true,
            "configurable": true,
            "value": InfixIdentifier
        },
        /**
         * @member
         * @function
         * @return {string} The string representation of the token.
         */
        "toString": {
            "writable"    : true,
            "configurable": true,
            "value": function () {
                return "operator `" + this.name + "`";
            }
        }
    });

    /**
     * @static
     * @class NoBindingPattern
     * @extends module:parser/tokens.Token
     * @param {loquat.SourcePos} pos The position in the source.
     */
    function NoBindingPattern(pos) {
        Token.call(this, pos);
    }

    NoBindingPattern.prototype = Object.create(Token.prototype, /** @lends module:parser/tokens.NoBindingPattern.prototype */ {
        /**
         * @member
         */
        "constructor": {
            "writable"    : true,
            "configurable": true,
            "value": NoBindingPattern
        },
        /**
         * @member
         * @function
         * @return {string} The string representation of the token.
         */
        "toString": {
            "writable"    : true,
            "configurable": true,
            "value": function () {
                return "_";
            }
        }
    });

    /**
     * @static
     * @class ReservedWord
     * @extends module:parser/tokens.Token
     * @param {loquat.SourcePos} pos The position in the source.
     * @param {string} name
     */
    function ReservedWord(pos, name) {
        Token.call(this, pos);
        this.name = name;
    }

    ReservedWord.prototype = Object.create(Token.prototype, /** @lends module:parser/tokens.ReservedWord.prototype */ {
        /**
         * @member
         */
        "constructor": {
            "writable"    : true,
            "configurable": true,
            "value": ReservedWord
        },
        /**
         * @member
         * @function
         * @return {string} The string representation of the token.
         */
        "toString": {
            "writable"    : true,
            "configurable": true,
            "value": function () {
                return "reserved word '" + this.name + "'";
            }
        }
    });

    /**
     * @static
     * @class ReservedOperator
     * @extends module:parser/tokens.Token
     * @param {loquat.SourcePos} pos The position in the source.
     * @param {string} name
     */
    function ReservedOperator(pos, name) {
        Token.call(this, pos);
        this.name = name;
    }

    ReservedOperator.prototype = Object.create(Token.prototype, /** @lends module:parser/tokens.ReservedOperator.prototype */ {
        /**
         * @member
         */
        "constructor": {
            "writable"    : true,
            "configurable": true,
            "value": ReservedOperator
        },
        /**
         * @member
         * @function
         * @return {string} The string representation of the token.
         */
        "toString": {
            "writable"    : true,
            "configurable": true,
            "value": function () {
                return this.name;
            }
        }
    });

    /**
     * @static
     * @class Symbol
     * @extends module:parser/tokens.Token
     * @param {loquat.SourcePos} pos The position in the source.
     * @param {string} name
     */
    function Symbol(pos, name) {
        Token.call(this, pos);
        this.name = name;
    }

    Symbol.prototype = Object.create(Token.prototype, /** @lends module:parser/tokens.Symbol.prototype */ {
        /**
         * @member
         */
        "constructor": {
            "writable"    : true,
            "configurable": true,
            "value": Symbol
        },
        /**
         * @member
         * @function
         * @return {string} The string representation of the token.
         */
        "toString": {
            "writable"    : true,
            "configurable": true,
            "value": function () {
                return this.name;
            }
        }
    });

    end_module();


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : parser/parser.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module parser/parser
     */

    "use strict";

    function end_module() {
        module.exports = Object.freeze({
            "ParserState" : ParserState,
            "OperatorInfo": OperatorInfo,
            "parser"      : parser
        });
    }

    var lq = __webpack_require__(4);

    var core   = __webpack_require__(1);
    var tokens = __webpack_require__(6);

    /**
     * @static
     * @class ParserState
     * @param {object.<string, module:parser/parser.OperatorInfo>} operatorsInfo
     */
    function ParserState(operatorsInfo) {
        this.operatorsInfo = operatorsInfo;
    }

    ParserState.prototype = Object.create(Object.prototype, /** @lends module:parser/parser.ParserState.prototype */ {
        /**
         * @member
         */
        "constructor": {
            "writable"    : true,
            "configurable": true,
            "value": ParserState
        },
        /**
         * @member
         * @function
         * @return {module:parser/parser.ParserState}
         * @desc Creates a new state that extends the original state.
         */
        "extend": {
            "writable"    : true,
            "configurable": true,
            "value": function () {
                var newOperatorsInfo = Object.create(this.operatorsInfo);
                return new ParserState(newOperatorsInfo);
            }
        }
    });

    /**
     * @static
     * @class OperatorInfo
     * @param {string} assoc
     * @param {number} precedence
     */
    function OperatorInfo(assoc, precedence) {
        this.assoc      = assoc;
        this.precedence = precedence;
    }

    // token parsers
    function token(calcValue) {
        return lq.token(
            function (token) { return token.toString(); },
            calcValue,
            function (token) { return token.pos; }
        );
    }

    function tokenOf(tokenClass) {
        return token(function (token) {
            if (token instanceof tokenClass) {
                return [token];
            }
            else {
                return [];
            }
        });
    }

    // symbols
    function tok_symbol(name) {
        return token(function (token) {
            if (token instanceof tokens.Symbol && token.name === name) {
                return [token];
            }
            else {
                return [];
            }
        })
        .label(name);
    }
    var tok_openParen    = tok_symbol("(");
    var tok_closeParen   = tok_symbol(")");
    var tok_openBrace    = tok_symbol("{");
    var tok_closeBrace   = tok_symbol("}");
    var tok_openBracket  = tok_symbol("[");
    var tok_closeBracket = tok_symbol("]");
    var tok_comma        = tok_symbol(",");
    var tok_semicolon    = tok_symbol(";");

    // literals
    var tok_natural = tokenOf(tokens.NaturalLiteral).label("natural");
    var tok_float   = tokenOf(tokens.FloatLiteral).label("float");
    var tok_number  = tok_natural.or(tok_float).label("number");
    var tok_string  = tokenOf(tokens.StringLiteral).label("string");
    var tok_bool    = tokenOf(tokens.BoolLiteral).label("bool");

    // identifier
    var tok_identifier = tokenOf(tokens.Identifier).label("identifier");

    // operators
    var tok_anyOperator     = tokenOf(tokens.Operator).label("operator");
    var tok_infixIdentifier = tokenOf(tokens.InfixIdentifier).label("operator");
    function tok_operator(name) {
        return token(function (token) {
            if (token instanceof tokens.Operator && token.name === name) {
                return [token];
            }
            else {
                return [];
            }
        })
        .label(name);
    }
    function tok_operatorOf(assoc, precedence) {
        return lq.getUserState.bind(function (state) {
            return token(function (token) {
                if (token instanceof tokens.Operator || token instanceof tokens.InfixIdentifier) {
                    var info = state.operatorsInfo[token.name];
                    var assocInfo =
                        info === undefined
                        ? lq.OperatorAssoc.ASSOC_LEFT
                        : info.assoc; 
                    var precedenceInfo =
                        info === undefined
                        ? 9
                        : info.precedence;
                    if (assocInfo === assoc && precedenceInfo === precedence) {
                        return [token];
                    }
                    else {
                        return [];
                    }
                }
                else {
                    return [];
                }
            });
        });
    }

    // variable
    var tok_variable =
        tok_identifier
        .or(lq.try(
            tok_openParen.bind(function (open) {
                return tok_anyOperator.bind(function (op) {
                    return tok_closeParen
                        .then(lq.pure(new tokens.Identifier(op.pos, op.name)));
                });
            })
        ))
        .label("variable");

    // argument
    var tok_noBindingPattern = tokenOf(tokens.NoBindingPattern).label("_");
    var tok_argument = tok_variable.or(tok_noBindingPattern);

    // reserved words
    function tok_reservedWord(name) {
        return token(function (token) {
            if (token instanceof tokens.ReservedWord && token.name === name) {
                return [token];
            }
            else {
                return [];
            }
        })
        .label("'" + name + "'");
    }
    var tok_if     = tok_reservedWord("if");
    var tok_then   = tok_reservedWord("then");
    var tok_else   = tok_reservedWord("else");
    var tok_and    = tok_reservedWord("and");
    var tok_or     = tok_reservedWord("or");
    var tok_let    = tok_reservedWord("let");
    var tok_in     = tok_reservedWord("in");
    var tok_begin  = tok_reservedWord("begin");
    var tok_end    = tok_reservedWord("end");
    var tok_while  = tok_reservedWord("while");
    var tok_do     = tok_reservedWord("do");
    var tok_infix  = tok_reservedWord("infix");
    var tok_infixl = tok_reservedWord("infixl");
    var tok_infixr = tok_reservedWord("infixr");

    // reserved operators
    function tok_reservedOperator(name) {
        return token(function (token) {
            if (token instanceof tokens.ReservedOperator && token.name === name) {
                return [token];
            }
            else {
                return [];
            }
        })
        .label(name);
    }
    var tok_equal     = tok_reservedOperator("=");
    var tok_backslash = tok_reservedOperator("\\");
    var tok_arrow     = tok_reservedOperator("->");
    var tok_dot       = tok_reservedOperator(".");
    var tok_colon     = tok_reservedOperator(":");
    var tok_bang      = tok_reservedOperator("!");
    var tok_question  = tok_reservedOperator("?");

    // utility functions
    function makeClosure(pos, args, body) {
        if (args.length === 0) {
            return body;
        }
        else {
            var argNames =
                args.map(function (arg) {
                    return arg instanceof tokens.NoBindingPattern ? undefined : arg.name;
                });
            return new core.Closure(pos, argNames, body);
        }
    }

    var prefixNegation =
        new lq.Operator(
            lq.OperatorType.PREFIX,
            tok_operator("-").bind(function (op) {
                return lq.pure(function (x) {
                    return new core.Negation(op.pos, x)
                });
            })
        );

    function infixOperatorOf(assoc, precedence) {
        return new lq.Operator(
            lq.OperatorType.INFIX,
            tok_operatorOf(assoc, precedence).bind(function (op) {
                return lq.pure(function (x, y) {
                    return new core.Application(
                        op.pos,
                        new core.Application(
                            op.pos,
                            new core.Variable(op.pos, op.name),
                            x
                        ),
                        y
                    )
                });
            }),
            assoc
        );
    }

    // expression
    var expression = new lq.LazyParser(function () {
        return lq.buildExpressionParser(
            [
                [
                    prefixNegation
                ],
                [
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_NONE,  9),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_LEFT,  9),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_RIGHT, 9)
                ],
                [
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_NONE,  8),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_LEFT,  8),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_RIGHT, 8)
                ],
                [
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_NONE,  7),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_LEFT,  7),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_RIGHT, 7)
                ],
                [
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_NONE,  6),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_LEFT,  6),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_RIGHT, 6)
                ],
                [
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_NONE,  5),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_LEFT,  5),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_RIGHT, 5)
                ],
                [
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_NONE,  4),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_LEFT,  4),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_RIGHT, 4)
                ],
                [
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_NONE,  3),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_LEFT,  3),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_RIGHT, 3)
                ],
                [
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_NONE,  2),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_LEFT,  2),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_RIGHT, 2)
                ],
                [
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_NONE,  1),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_LEFT,  1),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_RIGHT, 1)
                ],
                [
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_NONE,  0),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_LEFT,  0),
                    infixOperatorOf(lq.OperatorAssoc.ASSOC_RIGHT, 0)
                ],
                [
                    new lq.Operator(
                        lq.OperatorType.INFIX,
                        tok_and.bind(function (op) {
                            return lq.pure(function (x, y) {
                                return new core.CondAnd(op.pos, x, y);
                            })
                        }),
                        lq.OperatorAssoc.ASSOC_RIGHT
                    )
                ],
                [
                    new lq.Operator(
                        lq.OperatorType.INFIX,
                        tok_or.bind(function (op) {
                            return lq.pure(function (x, y) {
                                return new core.CondOr(op.pos, x, y);
                            })
                        }),
                        lq.OperatorAssoc.ASSOC_RIGHT
                    )
                ]
            ],
            operandExpr
        )
        .label("expression");
    });

    // literals
    var numberLiteral =
        tok_number.bind(function (token) {
            return lq.pure(
                new core.Literal(
                    token.pos,
                    new core.Value(core.DataType.NUMBER, token.value)
                )
            )
        })
        .label("number");
    var stringLiteral =
        tok_string.bind(function (token) {
            return lq.pure(
                new core.Literal(
                    token.pos,
                    new core.Value(core.DataType.STRING, token.value)
                )
            )
        })
        .label("string");
    var boolLiteral =
        tok_bool.bind(function (token) {
            return lq.pure(
                new core.Literal(token.pos, token.value ? core.__true__ : core.__false__)
            )
        })
        .label("bool");
    var unitLiteral =
        lq.try(
            tok_openParen.bind(function (open) {
                return tok_closeParen.then(
                    lq.pure(
                        new core.Literal(open.pos, core.__unit__)
                    )
                );
            })
        )
        .label("()");
    var arrayLiteral =
        tok_openBracket.bind(function (open) {
            return expression.sepBy(tok_comma).bind(function (elems) {
                return tok_closeBracket
                    .then(lq.pure(new core.ArrayLiteral(open.pos, elems)));
            });
        })
        .label("array");
    var objectLiteral = (function () {
        var prop =
            tok_identifier.bind(function (name) {
                return tok_colon.then(expression).bind(function (expr) {
                    return lq.pure([name.name, expr]);
                });
            })
            .label("property");
        var propStr =
            tok_string.bind(function (name) {
                return tok_colon.then(expression).bind(function (expr) {
                    return lq.pure([name.value, expr]);
                });
            })
            .label("property");
        return tok_openBrace.bind(function (open) {
            return prop.or(propStr).sepBy(tok_comma).bind(function (props) {
                return tok_closeBrace
                    .then(lq.pure(new core.ObjectLiteral(open.pos, props)));
            });
        })
        .label("object");
    })();
    var literal =
        numberLiteral
        .or(stringLiteral)
        .or(boolLiteral)
        .or(unitLiteral)
        .or(arrayLiteral)
        .or(objectLiteral);

    // variables
    var variable =
        tok_variable.bind(function (token) {
            return lq.pure(
                new core.Variable(token.pos, token.name)
            );
        })
        .label("variable");

    // object accessor sections
    var readPropertySec =
        tok_dot.bind(function (dot) {
            return tok_identifier.bind(function (id) {
                return tok_closeParen
                    .then(lq.pure(
                        new core.ReadPropertySection(
                            dot.pos,
                            new core.Literal(
                                id.pos,
                                new core.Value(core.DataType.STRING, id.name)
                            )
                        )
                    ));
            });
        });
    var callMethodSec =
        tok_colon.bind(function (colon) {
            return tok_identifier.bind(function (id) {
                return tok_closeParen
                    .then(lq.pure(
                        new core.CallMethodSection(
                            colon.pos,
                            new core.Literal(
                                id.pos,
                                new core.Value(core.DataType.STRING, id.name)
                            )
                        )
                    ));
            });
        });
    var writePropertySec =
        tok_bang.bind(function (bang) {
            return tok_identifier.bind(function (id) {
                return tok_closeParen
                    .then(lq.pure(
                        new core.WritePropertySection(
                            bang.pos,
                            new core.Literal(
                                id.pos,
                                new core.Value(core.DataType.STRING, id.name)
                            )
                        )
                    ));
            });
        });
    var checkPropertySec =
        tok_question.bind(function (question) {
            return tok_identifier.bind(function (id) {
                return tok_closeParen
                    .then(lq.pure(
                        new core.CheckPropertySection(
                            question.pos,
                            new core.Literal(
                                id.pos,
                                new core.Value(core.DataType.STRING, id.name)
                            )
                        )
                    ));
            });
        })
    var accessorSec =
        lq.try(
            tok_openParen.then(
                readPropertySec
                    .or(callMethodSec)
                    .or(writePropertySec)
                    .or(checkPropertySec)
            )
        )
        .label("accessor");

    // primitive expressions
    var primExpr =
        literal
        .or(variable)
        .or(accessorSec)
        .or(expression.between(tok_openParen, tok_closeParen))
        .label("");

    // object accessors
    var readPropertyAccessor =
        tok_dot.bind(function (dot) {
            return tok_identifier.bind(function (id) {
                return lq.pure(function (obj) {
                    return new core.ReadPropertyAccessor(
                        dot.pos,
                        obj,
                        new core.Literal(
                            id.pos,
                            new core.Value(core.DataType.STRING, id.name)
                        )
                    );
                });
            });
        });
    var callMethodAccessor =
        tok_colon.bind(function (colon) {
            return tok_identifier.bind(function (id) {
                return lq.pure(function (obj) {
                    return new core.CallMethodAccessor(
                        colon.pos,
                        obj,
                        new core.Literal(
                            id.pos,
                            new core.Value(core.DataType.STRING, id.name)
                        )
                    );
                });
            });
        });
    var writePropertyAccessor =
        tok_bang.bind(function (bang) {
            return tok_identifier.bind(function (id) {
                return lq.pure(function (obj) {
                    return new core.WritePropertyAccessor(
                        bang.pos,
                        obj,
                        new core.Literal(
                            id.pos,
                            new core.Value(core.DataType.STRING, id.name)
                        )
                    );
                });
            });
        });
    var checkPropertyAccessor =
        tok_question.bind(function (question) {
            return tok_identifier.bind(function (id) {
                return lq.pure(function (obj) {
                    return new core.CheckPropertyAccessor(
                        question.pos,
                        obj,
                        new core.Literal(
                            id.pos,
                            new core.Value(core.DataType.STRING, id.name)
                        )
                    );
                });
            });
        });
    var accessor =
        readPropertyAccessor
        .or(callMethodAccessor)
        .or(writePropertyAccessor)
        .or(checkPropertyAccessor);
    var objExpr =
        primExpr.bind(function (expr) {
            return accessor.many().bind(function (accessors) {
                return lq.pure(accessors.reduce(
                    function (obj, acc) {
                        return acc(obj);
                    },
                    expr
                ));
            });
        });

    // function applications
    var appExpr =
        objExpr.bind(function (func) {
            return objExpr.many().bind(function (args) {
                return lq.pure(
                    args.reduce(
                        function (f, arg) {
                            return new core.Application(arg.pos, f, arg);
                        },
                        func
                    )
                );
            });
        });

    // lambda abstraction
    var lambdaExpr =
        tok_backslash.bind(function (lambda) {
            return tok_argument.many1().bind(function (args) {
                return tok_arrow
                    .then(expression)
                    .bind(function (body) {
                        return lq.pure(makeClosure(lambda.pos, args, body));
                    });
            })
        })
        .label("lambda");

    // conditional
    var condExpr =
        tok_if.bind(function (cond) {
            return expression.bind(function (test) {
                return tok_then
                    .then(expression)
                    .bind(function (conseq) {
                        return tok_else
                            .then(expression)
                            .bind(function (alt) {
                                return lq.pure(new core.Conditional(cond.pos, test, conseq, alt));
                            });
                    });
            })
        })
        .label("conditonal");

    // local binding
    var bindExpr = (function () {
        var binding =
            tok_variable.bind(function (id) {
                return tok_argument.many().bind(function (args) {
                    return tok_equal.then(expression).bind(function (expr) {
                        return lq.pure([id.name, makeClosure(id.pos, args, expr)]);
                    });
                }); 
            });
        return tok_let.bind(function (bind) {
            return binding.sepEndBy1(tok_semicolon).bind(function (binds) {
                return tok_in.then(expression).bind(function (expr) {
                    return lq.pure(new core.Binding(bind.pos, binds, expr));
                });
            });
        })
        .label("binding");
    })();

    // procedure
    var procExpr =
        tok_begin.bind(function (proc) {
            return expression.sepEndBy1(tok_semicolon).bind(function (exprs) {
                return tok_end.then(lq.pure(new core.Procedure(proc.pos, exprs)));
            });
        });

    // loop
    var loopExpr =
        tok_while.bind(function (loop) {
            return expression.bind(function (test) {
                return tok_do.then(expression).bind(function (expr) {
                    return lq.pure(new core.Loop(loop.pos, test, expr));
                });
            });
        });

    // operand of expression
    var operandExpr =
        appExpr
        .or(lambdaExpr)
        .or(condExpr)
        .or(bindExpr)
        .or(procExpr)
        .or(loopExpr)
        .label("operand");

    // declarations
    // definition
    var definitionDecl = 
        lq.try(
            tok_variable.bind(function (id) {
                return tok_argument.many().left(tok_equal).bind(function (args) {
                    return lq.pure([id, args]);
                });
            })
        ).bind(function (ids) {
            return expression.bind(function (expr) {
                var id   = ids[0];
                var args = ids[1];
                return lq.pure(
                    new core.Definition(id.pos, id.name, makeClosure(id.pos, args, expr))
                );
            })
        })
        .label("variable definition");

    // fixity declaration
    var fixityDecl = (function () {
        var tok_fixity =
            tok_infix
            .or(tok_infixl)
            .or(tok_infixr)
            .label("fixity");

        function failWithPos(pos, message) {
            return new lq.Parser(function (state, csuc, cerr, esuc, eerr) {
                return eerr(
                    new lq.ParseError(
                        pos,
                        [new lq.ErrorMessage(lq.ErrorMessageType.MESSAGE, message)]
                    )
                );
            });
        }

        return tok_fixity.bind(function (fixity) {
            return tok_natural.bind(function (precedence) {
                if (precedence.value < 0 || 9 < precedence.value) {
                    return failWithPos(
                        precedence.pos,
                        "precedence out of range: " + precedence.value.toString()
                    );
                }
                else {
                    return tok_anyOperator.or(tok_infixIdentifier).bind(function (op) {
                        return lq.getUserState.bind(function (state) {
                            var info = state.operatorsInfo[op.name];
                            if (info === undefined) {
                                var assoc;
                                switch (fixity.name) {
                                    case "infix" :
                                        assoc = lq.OperatorAssoc.ASSOC_NONE;
                                        break;
                                    case "infixl":
                                        assoc = lq.OperatorAssoc.ASSOC_LEFT;
                                        break;
                                    case "infixr":
                                        assoc = lq.OperatorAssoc.ASSOC_RIGHT;
                                        break;
                                }
                                var newState = state.extend();
                                newState.operatorsInfo[op.name] = new OperatorInfo(assoc, precedence.value);
                                return lq.setUserState(newState)
                                    .then(lq.pure(new core.Empty(fixity.pos)));
                            }
                            else {
                                return failWithPos(
                                    op.pos,
                                    "fixity already declared : " + op.name
                                );
                            }
                        });
                    });
                }
            });
        })
        .label("fixity declaration")
    })();

    var statement =
        definitionDecl
        .or(fixityDecl)
        .or(expression)
        .left(tok_semicolon.skipMany());

    var head =
        lq.optional(
            lq.lookAhead(tokenOf(tokens.Token)).bind(function (token) {
                return lq.setPosition(token.pos);
            })
        );

    /**
     * @static
     * @type {loquat.Parser<module:parser/tokens.Token, module:parser/parser.ParserState, Array>}
     * @desc The parser that consumes a stream of {@link module:parser/tokens.Token}.
     *  The result type is pair (array) of {@link Array.<module:core.Statement>} and {@link module:parser/parser.ParserState}.
     */
    var parser =
        head
        .then(tok_semicolon.skipMany().label(""))
        .then(statement.many()).bind(function (stmts) {
            return lq.eof.then(lq.getUserState).bind(function (state) {
                return lq.pure([stmts, state]);
            });
        });

    end_module();


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : lib.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module lib
     */

    "use strict";

    function end_module() {
        module.exports = Object.freeze(/** @lends module:lib */ {
            /**
             * @see module:lib/general
             * @see module:lib/object
             * @see module:lib/unit
             * @see module:lib/number
             * @see module:lib/string
             * @see module:lib/bool
             * @see module:lib/function
             * @see module:lib/reference
             * @see module:lib/array
             * @see module:lib/accessor
             * @see module:lib/date
             * @see module:lib/regexp
             */
            "modules": {
                "general"  : __webpack_require__(9),
                "object"   : __webpack_require__(11),
                "unit"     : __webpack_require__(12),
                "number"   : __webpack_require__(13),
                "string"   : __webpack_require__(14),
                "bool"     : __webpack_require__(15),
                "function" : __webpack_require__(16),
                "reference": __webpack_require__(17),
                "array"    : __webpack_require__(18),
                "accessor" : __webpack_require__(19),
                "date"     : __webpack_require__(20),
                "regexp"   : __webpack_require__(21),
            },
            /**
             * @see module:lib/utils
             */
            "utils": __webpack_require__(10)
        });
    }

    end_module();


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : lib/general.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module lib/general
     */

    "use strict";

    function end_module() {
        module.exports = Object.freeze({
            "__id__"                  : __id__,
            "__const__"               : __const__,
            "__trace__"               : __trace__,
            "__error__"               : __error__,
            "__typeOf__"              : __typeOf__,
            "__max__"                 : __max__,
            "__min__"                 : __min__,
            "__equalTo__"             : __equalTo__,
            "__notEqualTo__"          : __notEqualTo__,
            "__lessThan__"            : __lessThan__,
            "__lessThanOrEqualTo__"   : __lessThanOrEqualTo__,
            "__greaterThan__"         : __greaterThan__,
            "__greaterThanOrEqualTo__": __greaterThanOrEqualTo__,
            "__compare__"             : __compare__
        });
    }

    var core      = __webpack_require__(1),
        Value     = core.Value,
        DataType  = core.DataType,
        __unit__  = core.__unit__,
        __true__  = core.__true__,
        __false__ = core.__false__;

    var errors = __webpack_require__(2);

    var utils       = __webpack_require__(10),
        assertType  = utils.assertType,
        assertTypes = utils.assertTypes;

    /**
     * @static
     * @desc Identity function.
     *     <pre>id x = x</pre>
     */
    var __id__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return x;
            }
        );

    /**
     * @static
     * @desc Constant function.
     *     <pre>const x _ = x</pre>
     */
    var __const__ =
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

    /**
     * @static
     */
    var __trace__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                console.log(x);
                return __unit__;
            }
        );

    /**
     * @static
     */
    var __error__ =
        new Value(
            DataType.FUNCTION,
            function (mes) {
                assertType(mes, DataType.STRING);
                throw new errors.RuntimeError([], mes.data);
                return __unit__;
            }
        );

    /**
     * @static
     */
    var __typeOf__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return new Value(
                    DataType.STRING,
                    x.type
                );
            }
        );

    /**
     * @static
     */
    var __max__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertTypes(x, [DataType.NUMBER, DataType.STRING]);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        assertType(y, x.type);
                        return x.data >= y.data ? x : y;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __min__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertTypes(x, [DataType.NUMBER, DataType.STRING]);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        assertType(y, x.type);
                        return x.data <= y.data ? x : y;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __equalTo__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        assertType(y, x.type);
                        return x.data === y.data ? __true__ : __false__;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __notEqualTo__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        assertType(y, x.type);
                        return x.data !== y.data ? __true__ : __false__;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __lessThan__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertTypes(x, [DataType.NUMBER, DataType.STRING]);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        assertType(y, x.type);
                        return x.data < y.data ? __true__ : __false__;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __lessThanOrEqualTo__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertTypes(x, [DataType.NUMBER, DataType.STRING]);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        assertType(y, x.type);
                        return x.data <= y.data ? __true__ : __false__;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __greaterThan__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertTypes(x, [DataType.NUMBER, DataType.STRING]);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        assertType(y, x.type);
                        return x.data > y.data ? __true__ : __false__;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __greaterThanOrEqualTo__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertTypes(x, [DataType.NUMBER, DataType.STRING]);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        assertType(y, x.type);
                        return x.data >= y.data ? __true__ : __false__;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __compare__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertTypes(x, [DataType.NUMBER, DataType.STRING]);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        assertType(y, x.type);
                        switch (x.type) {
                            case DataType.NUMBER:
                                if (Number.isNaN(x.data)) {
                                    return new Value(
                                        DataType.NUMBER,
                                        1
                                    );
                                }
                                if (Number.isNaN(y.data)) {
                                    return new Value(
                                        DataType.NUMBER,
                                        -1
                                    );
                                }
                                if (__lessThan__.data(x).data(y).data) {
                                    return new Value(
                                        DataType.NUMBER,
                                        -1
                                    );
                                }
                                if (__greaterThan__.data(x).data(y).data) {
                                    return new Value(
                                        DataType.NUMBER,
                                        1
                                    );
                                }
                                return new Value(
                                    DataType.NUMBER,
                                    0
                                );
                            case DataType:STRING:
                                if (__lessThan__.data(x).data(y).data) {
                                    return new Value(
                                        DataType.NUMBER,
                                        -1
                                    );
                                }
                                if (__greaterThan__.data(x).data(y).data) {
                                    return new Value(
                                        DataType.NUMBER,
                                        1
                                    );
                                }
                                return new Value(
                                    DataType.NUMBER,
                                    0
                                );
                        }
                    }
                );
            }
        );

    end_module();


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : lib/utils.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module lib/utils
     */

    "use strict";

    function end_module() {
        module.exports = Object.freeze({
            "assertType"       : assertType,
            "assertTypes"      : assertTypes,
            "createObject"     : createObject,
            "readProperty"     : readProperty,
            "callMethod"       : callMethod,
            "writeProperty"    : writeProperty,
            "checkProperty"    : checkProperty,
            "deleteProperty"   : deleteProperty,
            "referenceToString": referenceToString,
            "arrayToString"    : arrayToString,
            "readInternalProperty" : readInternalProperty,
            "writeInternalProperty": writeInternalProperty
        });
    }

    var core         = __webpack_require__(1),
        Value        = core.Value,
        DataType     = core.DataType,
        calcTailCall = core.calcTailCall;

    var errors = __webpack_require__(2);

    /**
     * @static
     * @param {module:core.Value} value The value to be checked its type.
     * @param {string} type The type that should match that of the value.
     * @throws {module:errors.RuntimeError} The type is mismatched.
     * @desc Asserts that the value has the specified type.
     */
    function assertType(value, type) {
        if (value.type !== type) {
            throw errors.typeError(undefined, type, value.type);
        }
    }

    /**
     * @static
     * @param {module:core.Value} value The value to be checked its type.
     * @param {Array.<string>} types An array of the types that one of those should match that of the value.
     * @throws {module:errors.RuntimeError} The type is mismatched.
     * @desc Asserts that the value has one of the specified types.
     */
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

    /**
     * @static
     * @param {module:core.Value} parent The object value to be the parent of the new object.
     * @return {module:core.Value} A new object value.
     * @desc Creates a new object value with the specified parent.
     */
    function createObject(parent) {
        return new Value(
            DataType.OBJECT,
            Object.create(parent.data)
        );
    }

    /**
     * @static
     * @param {module:core.Value} obj The target object.
     * @param {string} propName The name of the property
     * @return {module:core.Value} The property of the object.
     * @throws {module:errors.RuntimeError} The object is null or the property is not found.
     * @desc Reads a property of the object.
     */
    function readProperty(obj, propName) {
        if (obj.data === null) {
            throw errors.readNullObjectError(undefined);
        }
        var prop = obj.data[propName];
        if (prop === undefined) {
            throw errors.propertyNotFoundError(undefined, propName);
        }
        else {
            return prop;
        }
    }

    /**
     * @static
     * @param {module:core.Value} obj The target object.
     * @param {string} methodName The name of the property.
     * @return {module:core.Value} The result of calling the method.
     * @throws {module:errors.RuntimeError} The object is null or the property is not found.
     * @desc Calls a method of the object.
     */
    function callMethod(obj, methodName) {
        if (obj.data === null) {
            throw errors.readNullObjectError(undefined);
        }
        var prop = obj.data[methodName];
        if (prop === undefined) {
            throw errors.propertyNotFoundError(undefined, methodName);
        }
        else {
            assertType(prop, DataType.FUNCTION);
            return prop.data(obj);
        }
    }

    /**
     * @static
     * @param {module:core.Value} obj The target object
     * @param {string} propName The name of the property
     * @param {module:core.Value} value The value to be written.
     * @throws {module:errors.RuntimeError} The object is null or not writable.
     */
    function writeProperty(obj, propName, value) {
        if (obj.data === null) {
            throw errors.writeNullObjectError(undefined);
        }
        var desc = Object.getOwnPropertyDescriptor(obj.data, propName);
        if (desc === undefined) {
            if (!Object.isExtensible(obj.data)) {
                throw errors.cannotWriteError(undefined, propName);
            }
            Object.defineProperty(obj.data, propName, {
                "writable"    : true,
                "configurable": true,
                "enumerable"  : true,
                "value": value
            });
        }
        else {
            if (!desc["writable"]) {
                throw errors.cannotWriteError(undefined, propName);
            }
            obj.data[propName] = value;
        }
    }

    /**
     * @static
     * @param {module:core.Value} obj The target object.
     * @param {string} propName The name of the property.
     * @return {boolean} A boolean value that describes Whether the object has the property.
     */
    function checkProperty(obj, propName) {
        if (obj.data === null) {
            return false;
        }
        var prop = obj.data[propName];
        if (prop === undefined) {
            return false;
        }
        else {
            return true;
        }
    }

    /**
     * @static
     * @param {module:core.Value} obj The target object.
     * @param {string} propName The name of the property.
     */
    function deleteProperty(obj, propName) {
        try {
            delete obj.data[propName];
        }
        catch (err) {
            throw errors.cannotDeleteError(undefined, propName);
        }
    }

    /**
     * @static
     * @param {module:core.Value} ref The reference value.
     * @param {Array.<module:core.Value>} blackList The list of values to avoid circular reference.
     * @return {module:core.Value} The string value that represents the reference.
     * @throws {module:errors.RuntimeError} Some runtime error occurs.
     */
    function referenceToString(ref, blackList) {
        if (blackList.indexOf(ref) >= 0) {
            return new Value(
                DataType.STRING,
                "<circular>"
            );
        }
        var str;
        switch (ref.data.type) {
            case DataType.OBJECT:
                str = calcTailCall(callMethod(ref.data, "toString"));
                break;
            case DataType.REFERENCE:
                str = referenceToString(ref.data, blackList.concat(ref));
                break;
            case DataType.ARRAY:
                str = arrayToString(ref.data, blackList.concat(ref));
                break;
            default:
                str = new Value(DataType.STRING, ref.data.toString());
        }
        assertType(str, DataType.STRING);
        return new Value(
            DataType.STRING,
            "<ref: " + str.data + ">"
        );
    }

    /**
     * @static
     * @param {module:core.Value} arr The array value.
     * @param {Array.<module:core.Value>} blackList The list of values to avoid circular reference.
     * @return {module:core.Value} The string value that represents the array.
     * @throws {module:errors.RuntimeError} Some runtime error occurs.
     */
    function arrayToString(arr, blackList) {
        var str =
            arr.data.map(function (elem) {
                if (blackList.indexOf(elem) >= 0) {
                    return "<circular>";
                }
                var elemStr;
                switch (elem.type) {
                    case DataType.OBJECT:
                        elemStr = calcTailCall(callMethod(elem, "toString"));
                        break;
                    case DataType.REFERENCE:
                        elemStr = referenceToString(elem, blackList.concat(arr));
                        break;
                    case DataType.ARRAY:
                        elemStr = arrayToString(elem, blackList.concat(arr));
                        break;
                    default:
                        elemStr = new Value(DataType.STRING, elem.toString());
                }
                assertType(elemStr, DataType.STRING);
                return elemStr.data;
            })
            .join(",");
        return new Value(
            DataType.STRING,
            "[" + str + "]"
        );
    }

    /**
     * @static
     * @param {module:core.Value} obj The target object.
     * @param {string} key The key of the internal namespace.
     * @param {string} propName The name of the internal property.
     * @return {module:core.Value} The internal property of the object.
     * @throws {module:errors.RuntimeError} The object has no internal namespace or does not have the proeprty.
     */
    function readInternalProperty(obj, key, propName) {
        if (!obj.hasOwnProperty("internals")) {
            throw errors.noInternalNamespaceError(undefined);
        }
        if (!obj.internals.hasOwnProperty(key)) {
            throw errors.readInternalPropertyError(undefined, key, propName);
        }
        if (!obj.internals[key].hasOwnProperty(propName)) {
            throw errors.readInternalPropertyError(undefined, key, propName);
        }
        else {
            return obj.internals[key][propName];
        }
    }

    /**
     * @static
     * @param {module:core.Value} obj The target object.
     * @param {string} key The key of the internal namespace.
     * @param {string} propName The name of the internal property.
     * @param {module:core.Value} value The value to be written.
     * @throws {module:errors.RuntimeError} The object has no internal namespace.
     */
    function writeInternalProperty(obj, key, propName, value) {
        if (!obj.hasOwnProperty("internals")) {
            throw errors.noInternalNamespaceError(undefined);
        }
        if (!obj.internals.hasOwnProperty(key)) {
            obj.internals[key] = {};
        }
        Object.defineProperty(obj.internals[key], propName, {
            "writable"    : true,
            "configurable": true,
            "enumerable"  : true,
            "value": value
        });
    }

    end_module();


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : lib/object.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module lib/object
     */

    "use strict";

    function end_module() {
        Object.freeze(__Object__proto__.data);
        Object.freeze(__Class__proto__.data);
        Object.freeze(__Object__.data);
        Object.freeze(__Class__.data);

        module.exports = Object.freeze({
            "__createObject__"     : __createObject__,
            "__Object__proto__"    : __Object__proto__,
            "__Class__proto__"     : __Class__proto__,
            "__Object__"           : __Object__,
            "__Class__"            : __Class__,
            "__isObject__"         : __isObject__,
            "__instanceOf__"       : __instanceOf__,
            "__delete__"           : __delete__,
            "__assign__"           : __assign__,
            "__orphan__"           : __orphan__,
            "__keys__"             : __keys__,
            "__preventExtensions__": __preventExtensions__,
            "__seal__"             : __seal__,
            "__freeze__"           : __freeze__,
            "__isExtensible__"     : __isExtensible__,
            "__isSealed__"         : __isSealed__,
            "__isFrozen__"         : __isFrozen__
        });
    }

    var core      = __webpack_require__(1),
        Value     = core.Value,
        DataType  = core.DataType,
        __unit__  = core.__unit__,
        __true__  = core.__true__,
        __false__ = core.__false__;

    var errors = __webpack_require__(2);

    var utils          = __webpack_require__(10),
        assertType     = utils.assertType,
        createObject   = utils.createObject,
        readProperty   = utils.readProperty,
        writeProperty  = utils.writeProperty,
        deleteProperty = utils.deleteProperty;

    var module_general = __webpack_require__(9);

    /**
     * @static
     * @desc Creates a new object.
     */
    var __createObject__ =
        new Value(
            DataType.FUNCTION,
            function (parent) {
                assertType(parent, DataType.OBJECT);
                return createObject(parent);
            }
        );

    /**
     * @static
     * @desc Prototype of Object class.
     */
    var __Object__proto__ = createObject(new Value(DataType.OBJECT, null));
    Object.defineProperties(__Object__proto__.data, {
        "toString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    return new Value(
                        DataType.STRING,
                        obj.toString()
                    );
                }
            )
        }
    });

    /**
     * @statc
     * @desc Prototype of Class class.
     */
    var __Class__proto__ = createObject(__Object__proto__);
    Object.defineProperties(__Class__proto__.data, {
        "proto": {
            "value": createObject(__Object__proto__)
        },
        "ctor": {
            "value": module_general.__id__
        },
        "new": {
            "value": new Value(
                DataType.FUNCTION,
                function (cls) {
                    assertType(cls, DataType.OBJECT);
                    return readProperty(cls, "ctor").data(
                        createObject(readProperty(cls, "proto"))
                    );
                }
            )
        },
        "extends": {
            "value": new Value(
                DataType.FUNCTION,
                function (cls) {
                    assertType(cls, DataType.OBJECT);
                    return new Value(
                        DataType.FUNCTION,
                        function (parent) {
                            assertType(parent, DataType.OBJECT);
                            var proto = createObject(readProperty(parent, "proto"));
                            writeProperty(cls, "proto", proto);
                            return cls;
                        }
                    );
                }
            )
        }
    });

    /**
     * @static
     * @desc Object class.
     */
    var __Object__ = createObject(__Class__proto__);
    Object.defineProperties(__Object__.data, {
        "proto": {
            "value": __Object__proto__
        },
        "ctor": {
            "value": module_general.__id__
        }
    });

    /**
     * @static
     * @desc Class class.
     */
    var __Class__ = createObject(__Class__proto__);
    Object.defineProperties(__Class__.data, {
        "proto": {
            "value": __Class__proto__
        },
        "ctor": {
            "value": new Value(
                DataType.FUNCTION,
                function (cls) {
                    assertType(cls, DataType.OBJECT);
                    writeProperty(cls, "proto", createObject(__Object__proto__));
                    return cls;
                }
            )
        }
    });

    /**
     * @static
     */
    var __isObject__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return x.type === DataType.OBJECT ? __true__ : __false__;
            }
        );

    /**
     * @static
     */
    var __instanceOf__ =
        new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (cls) {
                        assertType(cls, DataType.OBJECT);
                        var proto = readProperty(cls, "proto");
                        assertType(proto, DataType.OBJECT);
                        return Object.prototype.isPrototypeOf.call(proto.data, obj.data)
                            ? __true__
                            : __false__;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __delete__ =
        new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (name) {
                        assertType(name, DataType.STRING);
                        deleteProperty(obj, name.data);
                        return __unit__;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __assign__ =
        new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.FUNCTION,
                    function (values) {
                        assertType(values, DataType.OBJECT);
                        for (var key in values.data) {
                            writeProperty(obj, key, values.data[key]);
                        }
                        return obj;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __orphan__ =
        new Value(
            DataType.FUNCTION,
            function (values) {
                assertType(values, DataType.OBJECT);
                return __assign__
                    .data(createObject(new Value(DataType.OBJECT, null)))
                    .data(values);
            }
        );

    /**
     * @static
     */
    var __keys__ =
        new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return new Value(
                    DataType.ARRAY,
                    Object.keys(obj.data).map(function (key) {
                        return new Value(
                            DataType.STRING,
                            key
                        );
                    })
                );
            }
        );

    /**
     * @static
     */
    var __preventExtensions__ =
        new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                Object.preventExtensions(obj.data);
                return __unit__;
            }
        );

    /**
     * @static
     */
    var __seal__ =
        new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                Object.seal(obj.data);
                return __unit__;
            }
        );

    /**
     * @static
     */
    var __freeze__ =
        new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                Object.freeze(obj.data);
                return __unit__;
            }
        );

    /**
     * @static
     */
    var __isExtensible__ =
        new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return Object.isExtensible(obj.data) ? __true__ : __false__;
            }
        );

    /**
     * @static
     */
    var __isSealed__ =
        new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return Object.isSealed(obj.data) ? __true__ : __false__;
            }
        );

    /**
     * @static
     */
    var __isFrozen__ =
        new Value(
            DataType.FUNCTION,
            function (obj) {
                assertType(obj, DataType.OBJECT);
                return Object.isFrozen(obj.data) ? __true__ : __false__;
            }
        );

    end_module();


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : lib/unit.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module lib/unit
     */

    "use strict";

    function end_module() {
        Object.freeze(__Unit__proto__.data);
        Object.freeze(__Unit__.data);

        module.exports = Object.freeze({
            "__Unit__proto__": __Unit__proto__,
            "__Unit__"       : __Unit__,
            "__isUnit__"     : __isUnit__,
            "__void__"       : __void__
        });
    }

    var core         = __webpack_require__(1),
        Value        = core.Value,
        DataType     = core.DataType,
        calcTailCall = core.calcTailCall,
        __unit__     = core.__unit__,
        __true__     = core.__true__,
        __false__    = core.__false__;

    var utils         = __webpack_require__(10),
        assertType    = utils.assertType,
        createObject  = utils.createObject,
        readProperty  = utils.readProperty,
        writeProperty = utils.writeProperty;

    var module_general = __webpack_require__(9),
        module_object  = __webpack_require__(11);

    /**
     * @static
     */
    var __Unit__proto__ = createObject(module_object.__Object__proto__);
    Object.defineProperties(__Unit__proto__.data, {
        "toString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var unit = readProperty(obj, "value");
                    assertType(unit, DataType.UNIT);
                    return new Value(
                        DataType.STRING,
                        "()"
                    );
                }
            )
        }
    });

    /**
     * @static
     */
    var __Unit__ = createObject(module_object.__Class__proto__);
    Object.defineProperties(__Unit__.data, {
        "proto": {
            "value": __Unit__proto__
        },
        "ctor": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    return new Value(
                        DataType.FUNCTION,
                        function (value) {
                            assertType(value, DataType.UNIT);
                            writeProperty(obj, "value", value);
                            return obj;
                        }
                    );
                }
            )
        }
    });

    /**
     * @static
     */
    var __isUnit__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return x.type === DataType.UNIT ? __true__ : __false__;
            }
        );

    /**
     * @static
     */
    var __void__ = calcTailCall(module_general.__const__.data(__unit__));

    end_module();


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : lib/number.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module lib/number
     */

    "use strict";

    function end_module() {
        Object.freeze(__Number__proto__.data);
        Object.freeze(__Number__.data);

        module.exports = Object.freeze({
            "__Number__proto__": __Number__proto__,
            "__Number__"       : __Number__,
            "__isNumber__"     : __isNumber__,
            "__isNaN__"        : __isNaN__,
            "__isFinite__"     : __isFinite__,
            "__isInteger__"    : __isInteger__,
            "__toInteger__"    : __toInteger__,
            "__parseInt__"     : __parseInt__,
            "__parseFloat__"   : __parseFloat__,
            "__negate__"       : __negate__,
            "__abs__"          : __abs__,
            "__signum__"       : __signum__,
            "__add__"          : __add__,
            "__sub__"          : __sub__,
            "__mul__"          : __mul__,
            "__div__"          : __div__,
            "__mod__"          : __mod__,
            "__pow__"          : __pow__,
            "__round__"        : __round__,
            "__ceiling__"      : __ceiling__,
            "__floor__"        : __floor__,
            "__sqrt__"         : __sqrt__,
            "__exp__"          : __exp__,
            "__log__"          : __log__,
            "__logBase__"      : __logBase__,
            "__sin__"          : __sin__,
            "__cos__"          : __cos__,
            "__tan__"          : __tan__,
            "__asin__"         : __asin__,
            "__acos__"         : __acos__,
            "__atan__"         : __atan__,
            "__atan2__"        : __atan2__,
            "__random__"       : __random__
        });
    }

    var core      = __webpack_require__(1),
        Value     = core.Value,
        DataType  = core.DataType,
        __true__  = core.__true__,
        __false__ = core.__false__;

    var utils         = __webpack_require__(10),
        assertType    = utils.assertType,
        createObject  = utils.createObject,
        readProperty  = utils.readProperty,
        writeProperty = utils.writeProperty;

    var module_object = __webpack_require__(11);

    /**
     * @static
     * @desc Prototype of Number class.
     */
    var __Number__proto__ = createObject(module_object.__Object__proto__);
    Object.defineProperties(__Number__proto__.data, {
        "toString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var num = readProperty(obj, "value");
                    assertType(num, DataType.NUMBER);
                    return new Value(
                        DataType.STRING,
                        num.toString()
                    );
                }
            )
        }
    });

    /**
     * @static
     * @desc Number class.
     */
    var __Number__ = createObject(module_object.__Class__proto__);
    Object.defineProperties(__Number__.data, {
        "proto": {
            "value": __Number__proto__
        },
        "ctor": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    return new Value(
                        DataType.FUNCTION,
                        function (value) {
                            assertType(value, DataType.NUMBER);
                            writeProperty(obj, "value", value);
                            return obj;
                        }
                    );
                }
            )
        }
    });

    var __isNumber__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return x.type === DataType.NUMBER ? __true__ : __false__;
            }
        );

    /**
     * @static
     * @desc Checks a number is NaN or not.
     */
    var __isNaN__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return Number.isNaN(x.data) ? __true__ : __false__;
            }
        );

    /**
     * @static
     * @desc Checks a number is finite or not.
     */
    var __isFinite__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return Number.isFinite(x.data) ? __true__ : __false__;
            }
        );

    /**
     * @static
     * @desc Checks a number is integer or not.
     */
    var __isInteger__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return Number.isInteger(x.data) ? __true__ : __false__;
            }
        );

    /**
     * @static
     * @desc Convert a number to an integer.
     */
    var __toInteger__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Number.toInteger(x.data)
                );
            }
        );

    /**
     * @static
     * @desc Parse a string as integer
     */
    var __parseInt__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.NUMBER,
                    parseInt(str.data)
                );
            }
        );

    /**
     * @static
     * @desc Parse a string as floating point number
     */
    var __parseFloat__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.NUMBER,
                    parseFloat(str.data)
                );
            }
        );

    /**
     * @static
     * @desc Negates a number.
     */
    var __negate__ =
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

    /**
     * @static
     * @desc Returns absolute value of a number.
     */
    var __abs__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.abs(x.data)
                );
            }
        );

    /**
     * @static
     * @desc Returns sign of a number.
     */
    var __signum__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    x.data === 0 ? 0
                    : x.data > 0 ? 1
                    : -1
                );
            }
        );

    /**
     * @static
     */
    var __add__ =
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

    /**
     * @static
     */
    var __sub__ =
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

    /**
     * @static
     */
    var __mul__ =
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

    /**
     * @static
     */
    var __div__ =
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

    /**
     * @static
     */
    var __mod__ =
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

    /**
     * @static
     */
    var __pow__ =
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

    /**
     * @static
     */
    var __round__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.round(x.data)
                );
            }
        );

    /**
     * @static
     */
    var __ceiling__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.ceil(x.data)
                );
            }
        );

    /**
     * @static
     */
    var __floor__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.floor(x.data)
                );
            }
        );

    /**
     * @static
     */
    var __sqrt__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.sqrt(x.data)
                );
            }
        );

    /**
     * @static
     */
    var __exp__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.exp(x.data)
                );
            }
        );

    /**
     * @static
     */
    var __log__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.log(x.data)
                );
            }
        );

    /**
     * @static
     */
    var __logBase__ =
        new Value(
            DataType.FUNCTION,
            function (base) {
                assertType(base, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        return new Value(
                            DataType.NUMBER,
                            Math.log(x.data) / Math.log(base.data)
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __sin__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.sin(x.data)
                );
            }
        );

    /**
     * @static
     */
    var __cos__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.cos(x.data)
                );
            }
        );

    /**
     * @static
     */
    var __tan__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.tan(x.data)
                );
            }
        );

    /**
     * @static
     */
    var __asin__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.asin(x.data)
                );
            }
        );

    /**
     * @static
     */
    var __acos__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.acos(x.data)
                );
            }
        );

    /**
     * @static
     */
    var __atan__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.NUMBER);
                return new Value(
                    DataType.NUMBER,
                    Math.atan(x.data)
                );
            }
        );

    /**
     * @static
     */
    var __atan2__ =
        new Value(
            DataType.FUNCTION,
            function (y) {
                assertType(y, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        assertType(x, DataType.NUMBER);
                        return new Value(
                            DataType.NUMBER,
                            Math.atan2(y.data, x.data)
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __random__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.UNIT);
                return new Value(
                    DataType.NUMBER,
                    Math.random()
                );
            }
        );

    end_module();


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : lib/string.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module lib/string
     */

    "use strict";

    function end_module() {
        Object.freeze(__String__proto__.data);
        Object.freeze(__String__.data);

        module.exports = Object.freeze({
            "__String__proto__"  : __String__proto__,
            "__String__"         : __String__,
            "__isString__"       : __isString__,
            "__charAt__"         : __charAt__,
            "__charCodeAt__"     : __charCodeAt__,
            "__charCode__"       : __charCode__,
            "__fromCharCode__"   : __fromCharCode__,
            "__length__"         : __length__,
            "__empty__"          : __empty__,
            "__toUpperCase__"    : __toUpperCase__,
            "__toLowerCase__"    : __toLowerCase__,
            "__reverse__"        : __reverse__,
            "__concat__"         : __concat__,
            "__split__"          : __split__,
            "__lines__"          : __lines__,
            "__words__"          : __words__,
            "__replace__"        : __replace__,
            "__replaceWith__"    : __replaceWith__,
            "__trim__"           : __trim__,
            "__slice__"          : __slice__,
            "__indexOfFrom__"    : __indexOfFrom__,
            "__indexOf__"        : __indexOf__,
            "__lastIndexOfFrom__": __lastIndexOfFrom__,
            "__lastIndexOf__"    : __lastIndexOf__,
            "__cycle__"          : __cycle__
        });
    }

    var core         = __webpack_require__(1),
        Value        = core.Value,
        DataType     = core.DataType,
        calcTailCall = core.calcTailCall,
        __true__     = core.__true__,
        __false__    = core.__false__;

    var errors = __webpack_require__(2);

    var utils         = __webpack_require__(10),
        assertType    = utils.assertType,
        createObject  = utils.createObject,
        readProperty  = utils.readProperty,
        writeProperty = utils.writeProperty;

    var module_object = __webpack_require__(11);

    /**
     * @static
     */
    var __String__proto__ = createObject(module_object.__Object__proto__);
    Object.defineProperties(__String__proto__.data, {
        "toString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var str = readProperty(obj, "value");
                    assertType(str, DataType.STRING);
                    return new Value(
                        DataType.STRING,
                        str.toString()
                    );
                }
            )
        },
        "length": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var str = readProperty(obj, "value");
                    assertType(str, DataType.STRING);
                    return new Value(
                        DataType.NUMBER,
                        str.data.length
                    );
                }
            )
        }
    });

    /**
     * @static
     */
    var __String__ = createObject(module_object.__Class__proto__);
    Object.defineProperties(__String__.data, {
        "proto": {
            "value": __String__proto__
        },
        "ctor": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    return new Value(
                        DataType.FUNCTION,
                        function (value) {
                            assertType(value, DataType.STRING);
                            writeProperty(obj, "value", value);
                            return obj;
                        }
                    );
                }
            )
        }
    });

    /**
     * @static
     */
    var __isString__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return x.type === DataType.STRING ? __true__ : __false__;
            }
        );

    /**
     * @static
     */
    var __charAt__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.FUNCTION,
                    function (index) {
                        assertType(index, DataType.NUMBER);
                        var i = index.data | 0;
                        var len = str.data.length;
                        if (i < 0 || i >= len) {
                            throw errors.outOfRangeError(undefined, i);
                        }
                        return new Value(
                            DataType.STRING,
                            str.data.charAt(i)
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __charCodeAt__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.FUNCTION,
                    function (index) {
                        assertType(index, DataType.NUMBER);
                        var i = index.data | 0;
                        var len = str.data.length;
                        if (i < 0 || i >= len) {
                            throw errors.outOfRangeError(undefined, i);
                        }
                        return new Value(
                            DataType.NUMBER,
                            str.data.charCodeAt(i)
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __charCode__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                if (str.data == "") {
                    throw errors.outOfRangeError(undefined, 0);
                }
                return new Value(
                    DataType.NUMBER,
                    str.data.charCodeAt(0)
                );
            }
        );

    /**
     * @static
     */
    var __fromCharCode__ =
        new Value(
            DataType.FUNCTION,
            function (n) {
                assertType(n, DataType.NUMBER);
                return new Value(
                    DataType.STRING,
                    String.fromCharCode(n.data)
                );
            }
        );

    /**
     * @static
     */
    var __length__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.NUMBER,
                    str.data.length
                );
            }
        );

    /**
     * @static
     */
    var __empty__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return str.data === "" ? __true__ : __false__;
            }
        );

    /**
     * @static
     */
    var __toUpperCase__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.STRING,
                    str.data.toUpperCase()
                );
            }
        );

    /**
     * @static
     */
    var __toLowerCase__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.STRING,
                    str.data.toLowerCase()
                );
            }
        );

    /**
     * @static
     */
    var __reverse__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.STRING,
                    str.data.split("").reverse().join("")
                );
            }
        );

    /**
     * @static
     */
    var __concat__ =
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

    /**
     * @static
     */
    var __split__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.FUNCTION,
                    function (sep) {
                        assertType(sep, DataType.STRING);
                        return new Value(
                            DataType.ARRAY,
                            str.data.split(sep.data).map(function (elem) {
                                return new Value(
                                    DataType.STRING,
                                    elem
                                );
                            })
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __lines__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                var ls = str.data.split("\n");
                if (ls.length > 0 && ls[ls.length - 1] === "") {
                    ls = ls.slice(0, -1);
                }
                return new Value(
                    DataType.ARRAY,
                    ls.map(function (elem) {
                        return new Value(
                            DataType.STRING,
                            elem
                        );
                    })
                );
            }
        );

    /**
     * @static
     */
    var __words__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                var ws = str.data.split(/\s+/);
                if (ws.length > 0 && ws[ws.length - 1] === "") {
                    ws = ws.slice(0, -1);
                }
                return new Value(
                    DataType.ARRAY,
                    ws.map(function (elem) {
                        return new Value(
                            DataType.STRING,
                            elem
                        );
                    })
                );
            }
        );

    /**
     * @static
     */
    var __replace__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.FUNCTION,
                    function (substr) {
                        assertType(substr, DataType.STRING);
                        return new Value(
                            DataType.FUNCTION,
                            function (newSubstr) {
                                assertType(newSubstr, DataType.STRING);
                                return new Value(
                                    DataType.STRING,
                                    str.data.replace(substr.data, newSubstr.data)
                                );
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __replaceWith__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.FUNCTION,
                    function (substr) {
                        assertType(substr, DataType.STRING);
                        return new Value(
                            DataType.FUNCTION,
                            function (f) {
                                assertType(f, DataType.FUNCTION);
                                return new Value(
                                    DataType.STRING,
                                    str.data.replace(substr.data, function (rep) {
                                        var newSubstr = calcTailCall(f.data(
                                                new Value(DataType.STRING, rep)
                                            ));
                                        assertType(newSubstr, DataType.STRING);
                                        return newSubstr.data;
                                    })
                                );
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __trim__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.STRING,
                    str.data.trim()
                );
            }
        );

    /**
     * @static
     */
    var __slice__ =
        new Value(
            DataType.FUNCTION,
            function (begin) {
                assertType(begin, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (end) {
                        assertType(end, DataType.NUMBER);
                        return new Value(
                            DataType.FUNCTION,
                            function (str) {
                                assertType(str, DataType.STRING);
                                return new Value(
                                    DataType.STRING,
                                    str.data.slice(begin.data, end.data)
                                );
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __indexOfFrom__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.FUNCTION,
                    function (v) {
                        assertType(v, DataType.STRING);
                        return new Value(
                            DataType.FUNCTION,
                            function (from) {
                                assertType(from, DataType.NUMBER);
                                var len = str.data.length;
                                var fromIndex = from.data;
                                if (fromIndex < 0) {
                                    fromIndex = 0;
                                }
                                else if (fromIndex > len) {
                                    fromIndex = len;
                                }
                                return new Value(
                                    DataType.NUMBER,
                                    str.data.indexOf(v.data, fromIndex)
                                );
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __indexOf__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.FUNCTION,
                    function (v) {
                        assertType(v, DataType.STRING);
                        return new Value(
                            DataType.NUMBER,
                            str.data.indexOf(v.data, 0)
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __lastIndexOfFrom__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.FUNCTION,
                    function (v) {
                        assertType(v, DataType.STRING);
                        return new Value(
                            DataType.FUNCTION,
                            function (from) {
                                assertType(from, DataType.NUMBER);
                                var len = str.data.length;
                                var fromIndex = from.data;
                                if (fromIndex < 0) {
                                    fromIndex = 0;
                                }
                                else if (fromIndex > len) {
                                    fromIndex = len;
                                }
                                return new Value(
                                    DataType.NUMBER,
                                    str.data.lastIndexOf(v.data, fromIndex)
                                );
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __lastIndexOf__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.FUNCTION,
                    function (v) {
                        assertType(v, DataType.STRING);
                        var len = str.data.length;
                        return new Value(
                            DataType.NUMBER,
                            str.data.lastIndexOf(v.data, len)
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __cycle__ =
        new Value(
            DataType.FUNCTION,
            function (n) {
                assertType(n, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (str) {
                        assertType(str, DataType.STRING);
                        var newStr = "";
                        for (var i = 0; i < n.data; i++) {
                            newStr += str.data;
                        }
                        return new Value(
                            DataType.STRING,
                            newStr
                        );
                    }
                );
            }
        );

    end_module();


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : lib/bool.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module lib/bool
     */

    "use strict";

    function end_module() {
        Object.freeze(__Bool__proto__.data);
        Object.freeze(__Bool__.data);

        module.exports = Object.freeze({
            "__Bool__proto__": __Bool__proto__,
            "__Bool__"       : __Bool__,
            "__isBool__"     : __isBool__,
            "__not__"        : __not__,
            "__and__"        : __and__,
            "__or__"         : __or__
        });
    }

    var core      = __webpack_require__(1),
        Value     = core.Value,
        DataType  = core.DataType,
        __true__  = core.__true__,
        __false__ = core.__false__;

    var utils         = __webpack_require__(10),
        assertType    = utils.assertType,
        createObject  = utils.createObject,
        readProperty  = utils.readProperty,
        writeProperty = utils.writeProperty;

    var module_object = __webpack_require__(11);

    /**
     * @static
     */
    var __Bool__proto__ = createObject(module_object.__Object__proto__);
    Object.defineProperties(__Bool__proto__.data, {
        "toString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var b = readProperty(obj, "value");
                    assertType(b, DataType.BOOL);
                    return new Value(
                        DataType.STRING,
                        b.toString()
                    );
                }
            )
        }
    });

    /**
     * @static
     */
    var __Bool__ = createObject(module_object.__Class__proto__);
    Object.defineProperties(__Bool__.data, {
        "proto": {
            "value": __Bool__proto__
        },
        "ctor": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    return new Value(
                        DataType.FUNCTION,
                        function (value) {
                            assertType(value, DataType.BOOL);
                            writeProperty(obj, "value", value);
                            return obj;
                        }
                    );
                }
            )
        }
    });

    /**
     * @static
     */
    var __isBool__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return x.type === DataType.BOOL ? __true__ : __false__;
            }
        );

    /**
     * @static
     */
    var __not__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.BOOL);
                return x.data ? __false__ : __true__;
            }
        );

    /**
     * @static
     */
    var __and__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.BOOL);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        assertType(y, DataType.BOOL);
                        return (x.data && y.data) ? __true__ : __false__;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __or__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.BOOL);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        assertType(y, DataType.BOOL);
                        return (x.data || y.data) ? __true__ : __false__;
                    }
                );
            }
        );

    end_module();


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : lib/function.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module lib/function
     */

    "use strict";

    function end_module() {
        Object.freeze(__Function__proto__.data);
        Object.freeze(__Function__.data);

        module.exports = Object.freeze({
            "__Function__proto__": __Function__proto__,
            "__Function__"       : __Function__,
            "__isFunction__"     : __isFunction__,
            "__compose__"        : __compose__,
            "__flip__"           : __flip__,
            "__apply__"          : __apply__,
            "__reverseApply__"   : __reverseApply__,
            "__on__"             : __on__
        });
    }

    var core         = __webpack_require__(1),
        Value        = core.Value,
        DataType     = core.DataType,
        calcTailCall = core.calcTailCall,
        __true__     = core.__true__,
        __false__    = core.__false__;

    var utils         = __webpack_require__(10),
        assertType    = utils.assertType,
        createObject  = utils.createObject,
        readProperty  = utils.readProperty,
        writeProperty = utils.writeProperty;

    var module_object = __webpack_require__(11);

    /**
     * @static
     * @desc Prototype of Function class.
     */
    var __Function__proto__ = createObject(module_object.__Object__proto__);
    Object.defineProperties(__Function__proto__.data, {
        "toString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var func = readProperty(obj, "value");
                    assertType(func, DataType.FUNCTION);
                    return new Value(
                        DataType.STRING,
                        func.toString()
                    );
                }
            )
        }
    });

    /**
     * @static
     * @desc Function class.
     */
    var __Function__ = createObject(module_object.__Class__proto__);
    Object.defineProperties(__Function__.data, {
        "proto": {
            "value": __Function__proto__
        },
        "ctor": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    return new Value(
                        DataType.FUNCTION,
                        function (value) {
                            assertType(value, DataType.FUNCTION);
                            writeProperty(obj, "value", value);
                            return obj;
                        }
                    );
                }
            )
        }
    });

    /**
     * @static
     */
    var __isFunction__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return x.type === DataType.FUNCTION ? __true__ : __false__;
            }
        );

    /**
     * @static
     * @desc Function composition.
     *     <pre> compose g f x = g (f x)</pre>
     */
    var __compose__ =
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
                                return g.data(calcTailCall(f.data(x)));
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     * @desc Flips two arguments.
     *     <pre>flip f x y = f y x</pre>
     */
    var __flip__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        return new Value(
                            DataType.FUNCTION,
                            function (y) {
                                var g = calcTailCall(f.data(y));
                                assertType(g, DataType.FUNCTION);
                                return g.data(x);
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     * @desc Application.
     *     <pre>apply f x = f x</pre>
     */
    var __apply__ =
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

    /**
     * @static
     * @desc Reverse application.
     *     <pre>reverseApply x f = f x</pre>
     */
    var __reverseApply__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return new Value(
                    DataType.FUNCTION,
                    function (f) {
                        assertType(f, DataType.FUNCTION);
                        return f.data(x);
                    }
                );
            }
        );

    /**
     * @static
     */
    var __on__ =
        new Value(
            DataType.FUNCTION,
            function (op) {
                assertType(op, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (f) {
                        assertType(f, DataType.FUNCTION);
                        return new Value(
                            DataType.FUNCTION,
                            function (x) {
                                return new Value(
                                    DataType.FUNCTION,
                                    function (y) {
                                        var u = calcTailCall(f.data(x));
                                        var v = calcTailCall(f.data(y));
                                        var t = calcTailCall(op.data(u));
                                        assertType(t, DataType.FUNCTION);
                                        return t.data(v);
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );

    end_module();


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : lib/reference.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module lib/reference
     */

    "use strict";

    function end_module() {
        Object.freeze(__Reference__proto__.data);
        Object.freeze(__Reference__.data);

        module.exports = Object.freeze({
            "__Reference__proto__": __Reference__proto__,
            "__Reference__"       : __Reference__,
            "__isReference__"     : __isReference__,
            "__ref__"             : __ref__,
            "__readRef__"         : __readRef__,
            "__writeRef__"        : __writeRef__,
            "__modifyRef__"       : __modifyRef__
        });
    }

    var core         = __webpack_require__(1),
        Value        = core.Value,
        DataType     = core.DataType,
        calcTailCall = core.calcTailCall,
        __unit__     = core.__unit__,
        __true__     = core.__true__,
        __false__    = core.__false__;

    var utils             = __webpack_require__(10),
        assertType        = utils.assertType,
        createObject      = utils.createObject,
        readProperty      = utils.readProperty,
        callMethod        = utils.callMethod,
        writeProperty     = utils.writeProperty,
        referenceToString = utils.referenceToString;

    var module_object = __webpack_require__(11);

    /**
     * @static
     */
    var __Reference__proto__ = createObject(module_object.__Object__proto__);
    Object.defineProperties(__Reference__proto__.data, {
        "toString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var ref = readProperty(obj, "value");
                    assertType(ref, DataType.REFERENCE);
                    return referenceToString(ref, []);
                }
            )
        }
    });

    /**
     * @static
     */
    var __Reference__ = createObject(module_object.__Class__proto__);
    Object.defineProperties(__Reference__.data, {
        "proto": {
            "value": __Reference__proto__
        },
        "ctor": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    return new Value(
                        DataType.FUNCTION,
                        function (value) {
                            assertType(value, DataType.REFERENCE);
                            writeProperty(obj, "value", value);
                            return obj;
                        }
                    );
                }
            )
        }
    });

    /**
     * @static
     */
    var __isReference__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return x.type === DataType.REFERENCE ? __true__ : __false__;
            }
        );

    /**
     * @static
     */
    var __ref__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return new Value(
                    DataType.REFERENCE,
                    x
                );
            }
        );

    /**
     * @static
     */
    var __readRef__ =
        new Value(
            DataType.FUNCTION,
            function (ref) {
                assertType(ref, DataType.REFERENCE);
                return ref.data;
            }
        );

    /**
     * @static
     */
    var __writeRef__ =
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

    /**
     * @static
     */
    var __modifyRef__ =
        new Value(
            DataType.FUNCTION,
            function (ref) {
                assertType(ref, DataType.REFERENCE);
                return new Value(
                    DataType.FUNCTION,
                    function (f) {
                        assertType(f, DataType.FUNCTION);
                        ref.data = calcTailCall(f.data(ref.data));
                        return __unit__;
                    }
                );
            }
        );

    end_module();


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : lib/array.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module lib/array
     */

    "use strict";

    function end_module() {
        Object.freeze(__Array__proto__.data);
        Object.freeze(__Array__.data);

        module.exports = Object.freeze({
            "__Array__proto__"     : __Array__proto__,
            "__Array__"            : __Array__,
            "__isArray__"          : __isArray__,
            "__newArray__"         : __newArray__,
            "__readArray__"        : __readArray__,
            "__writeArray__"       : __writeArray__,
            "__pop__"              : __pop__,
            "__push__"             : __push__,
            "__shift__"            : __shift__,
            "__unshift__"          : __unshift__,
            "__insertAt__"         : __insertAt__,
            "__removeAt__"         : __removeAt__,
            "__head__"             : __head__,
            "__last__"             : __last__,
            "__tail__"             : __tail__,
            "__init__"             : __init__,
            "__fst__"              : __fst__,
            "__snd__"              : __snd__,
            "__length__"           : __length__,
            "__empty__"            : __empty__,
            "__reverse__"          : __reverse__,
            "__concat__"           : __concat__,
            "__join__"             : __join__,
            "__map__"              : __map__,
            "__map$__"             : __map$__,
            "__for__"              : __for__,
            "__for$__"             : __for$__,
            "__foldl__"            : __foldl__,
            "__foldl1__"           : __foldl1__,
            "__foldr__"            : __foldr__,
            "__foldr1__"           : __foldr1__,
            "__all__"              : __all__,
            "__any__"              : __any__,
            "__sum__"              : __sum__,
            "__product__"          : __product__,
            "__maximum__"          : __maximum__,
            "__minimum__"          : __minimum__,
            "__take__"             : __take__,
            "__drop__"             : __drop__,
            "__takeWhile__"        : __takeWhile__,
            "__dropWhile__"        : __dropWhile__,
            "__slice__"            : __slice__,
            "__sortBy__"           : __sortBy__,
            "__sort__"             : __sort__,
            "__sortOn__"           : __sortOn__,
            "__findIndexFrom__"    : __findIndexFrom__,
            "__findIndex__"        : __findIndex__,
            "__findLastIndexFrom__": __findLastIndexFrom__,
            "__findLastIndex__"    : __findLastIndex__,
            "__elemIndexFrom__"    : __elemIndexFrom__,
            "__elemIndex__"        : __elemIndex__,
            "__elemLastIndexFrom__": __elemLastIndexFrom__,
            "__elemLastIndex__"    : __elemLastIndex__,
            "__elem__"             : __elem__,
            "__notElem__"          : __notElem__,
            "__zip__"              : __zip__,
            "__zipWith__"          : __zipWith__,
            "__range__"            : __range__,
            "__range$__"           : __range$__,
            "__replicate__"        : __replicate__,
            "__cycle__"            : __cycle__
        });
    }

    var core         = __webpack_require__(1),
        Value        = core.Value,
        DataType     = core.DataType,
        calcTailCall = core.calcTailCall,
        __unit__     = core.__unit__,
        __true__     = core.__true__,
        __false__    = core.__false__;

    var errors = __webpack_require__(2);

    var utils         = __webpack_require__(10),
        assertType    = utils.assertType,
        createObject  = utils.createObject,
        readProperty  = utils.readProperty,
        callMethod    = utils.callMethod,
        writeProperty = utils.writeProperty,
        arrayToString = utils.arrayToString;

    var module_general  = __webpack_require__(9),
        module_object   = __webpack_require__(11),
        module_number   = __webpack_require__(13),
        module_bool     = __webpack_require__(15),
        module_function = __webpack_require__(16);

    /**
     * @static
     */
    var __Array__proto__ = createObject(module_object.__Object__proto__);
    Object.defineProperties(__Array__proto__.data, {
        "toString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var arr = readProperty(obj, "value");
                    assertType(arr, DataType.ARRAY);
                    return arrayToString(arr, []);
                }
            )
        },
        "length": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var arr = readProperty(obj, "value");
                    assertType(arr, DataType.ARRAY);
                    return new Value(
                        DataType.NUMBER,
                        arr.data.length
                    );
                }
            )
        }
    });

    /**
     * @static
     */
    var __Array__ = createObject(module_object.__Class__proto__);
    Object.defineProperties(__Array__.data, {
        "proto": {
            "value": __Array__proto__
        },
        "ctor": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    return new Value(
                        DataType.FUNCTION,
                        function (value) {
                            assertType(value, DataType.ARRAY);
                            writeProperty(obj, "value", value);
                            return obj;
                        }
                    );
                }
            )
        }
    });

    /**
     * @static
     */
    var __isArray__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                return x.type === DataType.ARRAY ? __true__ : __false__;
            }
        );

    /**
     * @static
     */
    var __newArray__ =
        new Value(
            DataType.FUNCTION,
            function (len) {
                assertType(len, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        var arr = [];
                        for (var i = 0; i < len.data; i++) {
                            arr.push(x);
                        }
                        return new Value(
                            DataType.ARRAY,
                            arr
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __readArray__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                return new Value(
                    DataType.FUNCTION,
                    function (index) {
                        assertType(index, DataType.NUMBER);
                        var i = index.data | 0;
                        var len = arr.data.length;
                        if (i < 0 || i >= len) {
                            throw errors.outOfRangeError(undefined, i);
                        }
                        return arr.data[i];
                    }
                );
            }
        );

    /**
     * @static
     */
    var __writeArray__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                return new Value(
                    DataType.FUNCTION,
                    function (index) {
                        assertType(index, DataType.NUMBER);
                        var i = index.data | 0;
                        var len = arr.data.length;
                        if (i < 0 || i >= len) {
                            throw errors.outOfRangeError(undefined, i);
                        }
                        return new Value(
                            DataType.FUNCTION,
                            function (x) {
                                arr.data[i] = x;
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
    var __pop__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.FUNCTION);
                if (arr.data.length === 0) {
                    throw errors.emptyArrayError(undefined);
                }
                return arr.data.pop();
            }
        );

    /**
     * @static
     */
    var __push__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        arr.data.push(x);
                        return __unit__;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __shift__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.FUNCTION);
                if (arr.data.length === 0) {
                    throw errors.emptyArrayError(undefined);
                }
                return arr.data.shift();
            }
        );

    /**
     * @static
     */
    var __unshift__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                return new Value(
                    DataType.FUNCTION,
                    function (x) {
                        arr.data.unshift(x);
                        return __unit__;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __insertAt__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                return new Value(
                    DataType.FUNCTION,
                    function (index) {
                        assertType(index, DataType.NUMBER);
                        var i = index.data | 0;
                        var len = arr.data.length;
                        if (i < 0 || i > len) {
                            throw errors.outOfRangeError(undefined, i);
                        }
                        return new Value(
                            DataType.FUNCTION,
                            function (x) {
                                arr.data.splice(i, 0, x);
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
    var __removeAt__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                return new Value(
                    DataType.FUNCTION,
                    function (index) {
                        assertType(index, DataType.NUMBER);
                        var i = index.data | 0;
                        var len = arr.data.length;
                        if (i < 0 || i >= len) {
                            throw errors.outOfRangeError(undefined, i);
                        }
                        return arr.data.splice(i, 1)[0];
                    }
                );
            }
        );

    /**
     * @static
     */
    var __head__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                var len = arr.data.length;
                if (len === 0) {
                    throw errors.emptyArrayError(undefined);
                }
                return arr.data[0];
            }
        );

    /**
     * @static
     */
    var __last__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                var len = arr.data.length;
                if (len === 0) {
                    throw errors.emptyArrayError(undefined);
                }
                return arr.data[len - 1];
            }
        );

    /**
     * @static
     */
    var __tail__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                var len = arr.data.length;
                if (len === 0) {
                    throw errors.emptyArrayError(undefined);
                }
                return new Value(
                    DataType.ARRAY,
                    arr.data.slice(1)
                );
            }
        );

    /**
     * @static
     */
    var __init__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                var len = arr.data.length;
                if (len === 0) {
                    throw errors.emptyArrayError(undefined);
                }
                return new Value(
                    DataType.ARRAY,
                    arr.data.slice(0, len - 1)
                );
            }
        );

    /**
     * @static
     */
    var __fst__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                return __readArray__
                    .data(arr)
                    .data(new Value(DataType.NUMBER, 0));
            }
        );

    /**
     * @static
     */
    var __snd__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                return __readArray__
                    .data(arr)
                    .data(new Value(DataType.NUMBER, 1));
            }
        );

    /**
     * @static
     */
    var __length__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                return new Value(
                    DataType.NUMBER,
                    arr.data.length
                );
            }
        );

    /**
     * @static
     */
    var __empty__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                var len = arr.data.length;
                return len === 0 ? __true__ : __false__;
            }
        );

    /**
     * @static
     */
    var __reverse__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                var rev = arr.data.slice().reverse();
                return new Value(
                    DataType.ARRAY,
                    rev
                );
            }
        );

    /**
     * @static
     */
    var __concat__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                assertType(x, DataType.ARRAY);
                return new Value(
                    DataType.FUNCTION,
                    function (y) {
                        assertType(y, DataType.ARRAY);
                        return new Value(
                            DataType.ARRAY,
                            x.data.concat(y.data)
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __join__ =
        new Value(
            DataType.FUNCTION,
            function (arr) {
                assertType(arr, DataType.ARRAY);
                return new Value(
                    DataType.FUNCTION,
                    function (sep) {
                        assertType(sep, DataType.STRING);
                        return new Value(
                            DataType.STRING,
                            arr.data
                                .map(function (elem) {
                                    assertType(elem, DataType.STRING);
                                    return elem.data;
                                })
                                .join(sep.data)
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __map__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (arr) {
                        assertType(arr, DataType.ARRAY);
                        return new Value(
                            DataType.ARRAY,
                            arr.data.map(function (elem) {
                                return calcTailCall(f.data(elem));
                            })
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __map$__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (arr) {
                        assertType(arr, DataType.ARRAY);
                        arr.data.forEach(function (elem) {
                            calcTailCall(f.data(elem));
                        });
                        return __unit__;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __for__ = calcTailCall(module_function.__flip__.data(__map__));
    /**
     * @static
     */
    var __for$__ = calcTailCall(module_function.__flip__.data(__map$__));

    /**
     * @static
     */
    var __foldl__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (init) {
                        return new Value(
                            DataType.FUNCTION,
                            function (arr) {
                                assertType(arr, DataType.ARRAY);
                                return arr.data.reduce(
                                    function (accum, elem) {
                                        var g = calcTailCall(f.data(accum));
                                        assertType(g, DataType.FUNCTION);
                                        return calcTailCall(g.data(elem));
                                    },
                                    init
                                );
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __foldl1__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (arr) {
                        assertType(arr, DataType.ARRAY);
                        var len = arr.data.length;
                        if (len === 0) {
                            throw errors.emptyArrayError(undefined);
                        }
                        return arr.data.reduce(
                            function (accum, elem) {
                                var g = calcTailCall(f.data(accum));
                                assertType(g, DataType.FUNCTION);
                                return calcTailCall(g.data(elem));
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __foldr__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (init) {
                        return new Value(
                            DataType.FUNCTION,
                            function (arr) {
                                assertType(arr, DataType.ARRAY);
                                return arr.data.reduceRight(
                                    function (accum, elem) {
                                        var g = calcTailCall(f.data(elem));
                                        assertType(g, DataType.FUNCTION);
                                        return calcTailCall(g.data(accum));
                                    },
                                    init
                                );
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __foldr1__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (arr) {
                        assertType(arr, DataType.ARRAY);
                        var len = arr.data.length;
                        if (len === 0) {
                            throw errors.emptyArrayError(undefined);
                        }
                        return arr.data.reduceRight(
                            function (accum, elem) {
                                var g = calcTailCall(f.data(elem));
                                assertType(g, DataType.FUNCTION);
                                return calcTailCall(g.data(accum));
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __all__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (arr) {
                        assertType(arr, DataType.ARRAY);
                        return arr.data.every(
                            function (elem) {
                                var b = calcTailCall(f.data(elem));
                                assertType(b, DataType.BOOL);
                                return b.data;
                            }
                        ) ? __true__ : __false__;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __any__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (arr) {
                        assertType(arr, DataType.ARRAY);
                        return arr.data.some(
                            function (elem) {
                                var b = calcTailCall(f.data(elem));
                                assertType(b, DataType.BOOL);
                                return b.data;
                            }
                        ) ? __true__ : __false__;
                    }
                );
            }
        );

    /**
     * @static
     */
    var __sum__ =
        __foldl__
            .data(module_number.__add__)
            .data(new Value(DataType.NUMBER, 0));

    /**
     * @static
     */
    var __product__ =
        __foldl__
            .data(module_number.__mul__)
            .data(new Value(DataType.NUMBER, 1));

    /**
     * @static
     */
    var __maximum__ = __foldl1__.data(module_general.__max__);

    /**
     * @static
     */
    var __minimum__ = __foldl1__.data(module_general.__min__);

    /**
     * @static
     */
    var __take__ =
        new Value(
            DataType.FUNCTION,
            function (n) {
                assertType(n, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (arr) {
                        assertType(arr, DataType.ARRAY);
                        return new Value(
                            DataType.ARRAY,
                            arr.data.slice(0, n)
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __drop__ =
        new Value(
            DataType.FUNCTION,
            function (n) {
                assertType(n, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (arr) {
                        assertType(arr, DataType.ARRAY);
                        return new Value(
                            DataType.ARRAY,
                            arr.data.slice(n)
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __takeWhile__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (arr) {
                        assertType(arr, DataType.ARRAY);
                        var end = 0;
                        arr.data.every(function (elem) {
                            var b = calcTailCall(f.data(elem));
                            assertType(b, DataType.BOOL);
                            if (b.data) {
                                end++;
                                return true;
                            }
                            else {
                                return false;
                            }
                        });
                        return new Value(
                            DataType.ARRAY,
                            arr.data.slice(0, end)
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __dropWhile__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (arr) {
                        assertType(arr, DataType.ARRAY);
                        var begin = 0;
                        arr.data.every(function (elem) {
                            var b = calcTailCall(f.data(elem));
                            assertType(b, DataType.BOOL);
                            if (b.data) {
                                begin++;
                                return true;
                            }
                            else {
                                return false;
                            }
                        });
                        return new Value(
                            DataType.ARRAY,
                            arr.data.slice(begin)
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __slice__ =
        new Value(
            DataType.FUNCTION,
            function (begin) {
                assertType(begin, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (end) {
                        assertType(end, DataType.NUMBER);
                        return new Value(
                            DataType.FUNCTION,
                            function (arr) {
                                assertType(arr, DataType.ARRAY);
                                return new Value(
                                    DataType.ARRAY,
                                    arr.data.slice(begin.data, end.data)
                                );
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __sortBy__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (arr) {
                        assertType(arr, DataType.ARRAY);
                        return new Value(
                            DataType.ARRAY,
                            arr.data.slice().sort(function (x, y) {
                                var g = calcTailCall(f.data(x));
                                assertType(g, DataType.FUNCTION);
                                var ord = calcTailCall(g.data(y));
                                assertType(ord, DataType.NUMBER);
                                return ord.data;
                            })
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __sort__ = __sortBy__.data(module_general.__compare__);

    /**
     * @static
     */
    var __sortOn__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (arr) {
                        assertType(arr, DataType.ARRAY);
                        return new Value(
                            DataType.ARRAY,
                            arr.data
                                .map(function (elem) {
                                    return [calcTailCall(f.data(elem)), elem];
                                })
                                .sort(function (x, y) {
                                    var g = calcTailCall(module_general.__compare__.data(x[0]));
                                    assertType(g, DataType.FUNCTION);
                                    var ord = calcTailCall(g.data(y[0]));
                                    assertType(ord, DataType.NUMBER);
                                    return ord.data;
                                })
                                .map(function (p) {
                                    return p[1];
                                })
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __findIndexFrom__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (from) {
                        assertType(from, DataType.NUMBER);
                        return new Value(
                            DataType.FUNCTION,
                            function (arr) {
                                assertType(arr, DataType.ARRAY);
                                var len = arr.data.length;
                                if (len === 0) {
                                    return new Value(
                                        DataType.NUMBER,
                                        -1
                                    );
                                }
                                else {
                                    var fromIndex = from.data;
                                    if (fromIndex < 0) {
                                        fromIndex = 0;
                                    }
                                    else if (fromIndex >= len) {
                                        return new Value(
                                            DataType.NUMBER,
                                            -1
                                        );
                                    }
                                    for (var i = fromIndex; i < len; i++) {
                                        var b = calcTailCall(f.data(arr.data[i]));
                                        assertType(b, DataType.BOOL);
                                        if (b.data) {
                                            return new Value(
                                                DataType.NUMBER,
                                                i
                                            );
                                        }
                                    }
                                    return new Value(
                                        DataType.NUMBER,
                                        -1
                                    );
                                }
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __findIndex__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (arr) {
                        assertType(arr, DataType.ARRAY);
                        var len = arr.data.length;
                        if (len === 0) {
                            return new Value(
                                DataType.NUMBER,
                                -1
                            );
                        }
                        else {
                            for (var i = 0; i < len; i++) {
                                var b = calcTailCall(f.data(arr.data[i]));
                                assertType(b, DataType.BOOL);
                                if (b.data) {
                                    return new Value(
                                        DataType.NUMBER,
                                        i
                                    );
                                }
                            }
                            return new Value(
                                DataType.NUMBER,
                                -1
                            );
                        }
                    }
                );
            }
        );

    /**
     * @static
     */
    var __findLastIndexFrom__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (from) {
                        assertType(from, DataType.NUMBER);
                        return new Value(
                            DataType.FUNCTION,
                            function (arr) {
                                assertType(arr, DataType.ARRAY);
                                var len = arr.data.length;
                                if (len === 0) {
                                    return new Value(
                                        DataType.NUMBER,
                                        -1
                                    );
                                }
                                else {
                                    var fromIndex = from.data;
                                    if (fromIndex < 0) {
                                        return new Value(
                                            DataType.NUMBER,
                                            -1
                                        );
                                    }
                                    else if (fromIndex >= len) {
                                        fromIndex = len - 1;
                                    }
                                    for (var i = fromIndex; i >= 0; i--) {
                                        var b = calcTailCall(f.data(arr.data[i]));
                                        assertType(b, DataType.BOOL);
                                        if (b.data) {
                                            return new Value(
                                                DataType.NUMBER,
                                                i
                                            );
                                        }
                                    }
                                    return new Value(
                                        DataType.NUMBER,
                                        -1
                                    );
                                }
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __findLastIndex__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (arr) {
                        assertType(arr, DataType.ARRAY);
                        var len = arr.data.length;
                        if (len === 0) {
                            return new Value(
                                DataType.NUMBER,
                                -1
                            );
                        }
                        else {
                            for (var i = len - 1; i >= 0; i--) {
                                var b = calcTailCall(f.data(arr.data[i]));
                                assertType(b, DataType.BOOL);
                                if (b.data) {
                                    return new Value(
                                        DataType.NUMBER,
                                        i
                                    );
                                }
                            }
                            return new Value(
                                DataType.NUMBER,
                                -1
                            );
                        }
                    }
                );
            }
        );

    /**
     * @static
     */
    var __elemIndexFrom__ =
        new Value(
            DataType.FUNCTION,
            function (elem) {
                var f = calcTailCall(module_general.__equalTo__.data(elem));
                return __findIndexFrom__.data(f);
            }
        );

    /**
     * @static
     */
    var __elemIndex__ =
        new Value(
            DataType.FUNCTION,
            function (elem) {
                var f = calcTailCall(module_general.__equalTo__.data(elem));
                return __findIndex__.data(f);
            }
        );

    /**
     * @static
     */
    var __elemLastIndexFrom__ =
        new Value(
            DataType.FUNCTION,
            function (elem) {
                var f = calcTailCall(module_general.__equalTo__.data(elem));
                return __findLastIndexFrom__.data(f);
            }
        );

    /**
     * @static
     */
    var __elemLastIndex__ =
        new Value(
            DataType.FUNCTION,
            function (elem) {
                var f = calcTailCall(module_general.__equalTo__.data(elem));
                return __findLastIndex__.data(f);
            }
        );

    /**
     * @static
     */
    var __elem__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                var f = calcTailCall(module_general.__equalTo__.data(x));
                return __any__.data(f);
            }
        );

    /**
     * @static
     */
    var __notElem__ =
        new Value(
            DataType.FUNCTION,
            function (x) {
                var f = calcTailCall(module_general.__equalTo__.data(x));
                var g = calcTailCall(module_function.__compose__.data(module_bool.__not__));
                return g.data(__any__.data(f));
            }
        );

    /**
     * @static
     */
    var __zip__ =
        new Value(
            DataType.FUNCTION,
            function (as) {
                assertType(as, DataType.ARRAY);
                return new Value(
                    DataType.FUNCTION,
                    function (bs) {
                        assertType(bs, DataType.ARRAY);
                        var cs = [];
                        var len = Math.min(as.data.length, bs.data.length);
                        for (var i = 0; i < len; i++) {
                            cs.push(new Value(DataType.ARRAY, [as.data[i], bs.data[i]]));
                        }
                        return new Value(
                            DataType.ARRAY,
                            cs
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __zipWith__ =
        new Value(
            DataType.FUNCTION,
            function (f) {
                assertType(f, DataType.FUNCTION);
                return new Value(
                    DataType.FUNCTION,
                    function (as) {
                        assertType(as, DataType.ARRAY);
                        return new Value(
                            DataType.FUNCTION,
                            function (bs) {
                                assertType(bs, DataType.ARRAY);
                                var cs = [];
                                var len = Math.min(as.data.length, bs.data.length);
                                for (var i = 0; i < len; i++) {
                                    var g = calcTailCall(f.data(as.data[i]));
                                    assertType(g, DataType.FUNCTION);
                                    cs.push(calcTailCall(g.data(bs.data[i])));
                                }
                                return new Value(
                                    DataType.ARRAY,
                                    cs
                                );
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __range__ =
        new Value(
            DataType.FUNCTION,
            function (first) {
                assertType(first, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (last) {
                        assertType(last, DataType.NUMBER);
                        return new Value(
                            DataType.FUNCTION,
                            function (step) {
                                assertType(step, DataType.NUMBER);
                                var arr = [];
                                for (var i = first.data; i <= last.data; i += step.data) {
                                    arr.push(new Value(DataType.NUMBER, i));
                                }
                                return new Value(
                                    DataType.ARRAY,
                                    arr
                                );
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __range$__ =
        new Value(
            DataType.FUNCTION,
            function (first) {
                assertType(first, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (last) {
                        assertType(last, DataType.NUMBER);
                        var arr = [];
                        for (var i = first.data; i <= last.data; i++) {
                            arr.push(new Value(DataType.NUMBER, i));
                        }
                        return new Value(
                            DataType.ARRAY,
                            arr
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __replicate__ =
        new Value(
            DataType.FUNCTION,
            function (n) {
                assertType(n, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (elem) {
                        var arr = [];
                        for (var i = 0; i < n.data; i++) {
                            arr.push(elem);
                        }
                        return new Value(
                            DataType.ARRAY,
                            arr
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __cycle__ =
        new Value(
            DataType.FUNCTION,
            function (n) {
                assertType(n, DataType.NUMBER);
                return new Value(
                    DataType.FUNCTION,
                    function (arr) {
                        assertType(arr, DataType.ARRAY);
                        var len = arr.data.length;
                        var retArr = [];
                        for (var i = 0; i < n.data; i++) {
                            for (var j = 0; j < len; j++) {
                                retArr.push(arr.data[j]);
                            }
                        }
                        return new Value(
                            DataType.ARRAY,
                            retArr
                        );
                    }
                );
            }
        );

    end_module();


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

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

    var core         = __webpack_require__(1),
        Value        = core.Value,
        DataType     = core.DataType,
        calcTailCall = core.calcTailCall,
        __unit__     = core.__unit__,
        __true__     = core.__true__,
        __false__    = core.__false__;

    var utils         = __webpack_require__(10),
        assertType    = utils.assertType,
        readProperty  = utils.readProperty,
        callMethod    = utils.callMethod,
        writeProperty = utils.writeProperty,
        checkProperty = utils.checkProperty;

    var module_object    = __webpack_require__(11),
        module_unit      = __webpack_require__(12),
        module_number    = __webpack_require__(13),
        module_string    = __webpack_require__(14),
        module_bool      = __webpack_require__(15),
        module_function  = __webpack_require__(16),
        module_reference = __webpack_require__(17),
        module_array     = __webpack_require__(18);


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


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : lib/date.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module lib/date
     */

    "use strict";

    function end_module() {
        Object.freeze(__Date__proto__.data);
        Object.freeze(__Date__.data);

        module.exports = Object.freeze({
            "__Date__proto__": __Date__proto__,
            "__Date__"       : __Date__
        });
    }

    var core         = __webpack_require__(1),
        Value        = core.Value,
        DataType     = core.DataType,
        __unit__     = core.__unit__;

    var errors = __webpack_require__(2);

    var utils         = __webpack_require__(10),
        assertType    = utils.assertType,
        createObject  = utils.createObject,
        readInternalProperty  = utils.readInternalProperty,
        writeInternalProperty = utils.writeInternalProperty;

    var module_object = __webpack_require__(11);

    var INTERNAL_KEY = "__date__";

    function assertDate(obj) {
        if (!(obj instanceof Date)) {
            throw new errors.RuntimeError([], "invalid object");
        }
    }

    /**
     * @static
     */
    var __Date__proto__ = createObject(module_object.__Object__proto__);
    Object.defineProperties(__Date__proto__.data, {
        "toString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.STRING,
                        date.toString()
                    );
                }
            )
        },
        "toUTCString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.STRING,
                        date.toUTCString()
                    );
                }
            )
        },
        "toLocaleString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.STRING,
                        date.toLocaleString()
                    );
                }
            )
        },
        "toDateString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.STRING,
                        date.toDateString()
                    );
                }
            )
        },
        "toLocaleDateString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.STRING,
                        date.toLocaleDateString()
                    );
                }
            )
        },
        "toTimeString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.STRING,
                        date.toTimeString()
                    );
                }
            )
        },
        "toLocaleTimeString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.STRING,
                        date.toLocaleTimeString()
                    );
                }
            )
        },
        "getTime": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getTime()
                    );
                }
            )
        },
        "getTimezoneOffset": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getTimezoneOffset()
                    );
                }
            )
        },
        "getFullYear": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getFullYear()
                    );
                }
            )
        },
        "getMonth": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getMonth()
                    );
                }
            )
        },
        "getDate": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getDate()
                    );
                }
            )
        },
        "getDay": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getDay()
                    );
                }
            )
        },
        "getHours": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getHours()
                    );
                }
            )
        },
        "getMinutes": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getMinutes()
                    );
                }
            )
        },
        "getSeconds": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getSeconds()
                    );
                }
            )
        },
        "getMilliseconds": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getMilliseconds()
                    );
                }
            )
        },
        "getUTCFullYear": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getUTCFullYear()
                    );
                }
            )
        },
        "getUTCMonth": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getUTCMonth()
                    );
                }
            )
        },
        "getUTCDate": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getUTCDate()
                    );
                }
            )
        },
        "getUTCDay": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getUTCDay()
                    );
                }
            )
        },
        "getUTCHours": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getUTCHours()
                    );
                }
            )
        },
        "getUTCMinutes": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getUTCMinutes()
                    );
                }
            )
        },
        "getUTCSeconds": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getUTCSeconds()
                    );
                }
            )
        },
        "getUTCMilliseconds": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.NUMBER,
                        date.getUTCMilliseconds()
                    );
                }
            )
        },
        "setFullYear": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            assertType(x, DataType.NUMBER);
                            date.setFullYear(x.data);
                            return __unit__;
                        }
                    );
                }
            )
        },
        "setMonth": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            assertType(x, DataType.NUMBER);
                            date.setMonth(x.data);
                            return __unit__;
                        }
                    );
                }
            )
        },
        "setDate": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            assertType(x, DataType.NUMBER);
                            date.setDate(x.data);
                            return __unit__;
                        }
                    );
                }
            )
        },
        "setHours": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            assertType(x, DataType.NUMBER);
                            date.setHours(x.data);
                            return __unit__;
                        }
                    );
                }
            )
        },
        "setMinutes": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            assertType(x, DataType.NUMBER);
                            date.setMinutes(x.data);
                            return __unit__;
                        }
                    );
                }
            )
        },
        "setSeconds": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            assertType(x, DataType.NUMBER);
                            date.setSeconds(x.data);
                            return __unit__;
                        }
                    );
                }
            )
        },
        "setMilliseconds": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            assertType(x, DataType.NUMBER);
                            date.setMilliseconds(x.data);
                            return __unit__;
                        }
                    );
                }
            )
        },
        "setUTCFullYear": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            assertType(x, DataType.NUMBER);
                            date.setUTCFullYear(x.data);
                            return __unit__;
                        }
                    );
                }
            )
        },
        "setUTCMonth": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            assertType(x, DataType.NUMBER);
                            date.setUTCMonth(x.data);
                            return __unit__;
                        }
                    );
                }
            )
        },
        "setUTCDate": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            assertType(x, DataType.NUMBER);
                            date.setUTCDate(x.data);
                            return __unit__;
                        }
                    );
                }
            )
        },
        "setUTCHours": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            assertType(x, DataType.NUMBER);
                            date.setUTCHours(x.data);
                            return __unit__;
                        }
                    );
                }
            )
        },
        "setUTCMinutes": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            assertType(x, DataType.NUMBER);
                            date.setUTCMinutes(x.data);
                            return __unit__;
                        }
                    );
                }
            )
        },
        "setUTCSeconds": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            assertType(x, DataType.NUMBER);
                            date.setUTCSeconds(x.data);
                            return __unit__;
                        }
                    );
                }
            )
        },
        "setUTCMilliseconds": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var date = readInternalProperty(obj, INTERNAL_KEY, "date");
                    assertDate(date);
                    return new Value(
                        DataType.FUNCTION,
                        function (x) {
                            assertType(x, DataType.NUMBER);
                            date.setUTCMilliseconds(x.data);
                            return __unit__;
                        }
                    );
                }
            )
        }
    });

    /**
     * @static
     */
    var __Date__ = createObject(module_object.__Class__proto__);
    Object.defineProperties(__Date__.data, {
        "proto": {
            "value": __Date__proto__
        },
        "ctor": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    writeInternalProperty(obj, INTERNAL_KEY, "date", new Date());
                    return obj;
                }
            )
        },
        "time": {
            "value": new Value(
                DataType.FUNCTION,
                function (time) {
                    assertType(time, DataType.NUMBER);
                    var obj = createObject(__Date__proto__);
                    writeInternalProperty(obj, INTERNAL_KEY, "date", new Date(time.data));
                    return obj;
                }
            )
        },
        "parse": {
            "value": new Value(
                DataType.FUNCTION,
                function (str) {
                    assertType(str, DataType.STRING);
                    var obj = createObject(__Date__proto__);
                    writeInternalProperty(obj, INTERNAL_KEY, "date", new Date(str.data));
                    return obj;
                }
            )
        },
        "date": {
            "value": new Value(
                DataType.FUNCTION,
                function (year) {
                    assertType(year, DataType.NUMBER);
                    return new Value(
                        DataType.FUNCTION,
                        function (month) {
                            assertType(month, DataType.NUMBER);
                            return new Value(
                                DataType.FUNCTION,
                                function (date) {
                                    assertType(date, DataType.NUMBER);
                                    var obj = createObject(__Date__proto__);
                                    writeInternalProperty(obj, INTERNAL_KEY, "date",
                                        new Date(year.data, month.data, date.data));
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


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : lib/regexp.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module lib/regexp
     */

    "use strict";

    function end_module() {
        Object.freeze(__RegExp__proto__.data);
        Object.freeze(__RegExp__.data);

        module.exports = Object.freeze({
            "__RegExp__proto__": __RegExp__proto__,
            "__RegExp__"       : __RegExp__,
            "__splitRE__"      : __splitRE__,
            "__replaceRE__"    : __replaceRE__,
            "__replaceREWith__": __replaceREWith__
        });
    }

    var core         = __webpack_require__(1),
        Value        = core.Value,
        DataType     = core.DataType,
        calcTailCall = core.calcTailCall,
        __unit__     = core.__unit__,
        __true__     = core.__true__,
        __false__    = core.__false__;

    var errors = __webpack_require__(2);

    var utils         = __webpack_require__(10),
        assertType    = utils.assertType,
        createObject  = utils.createObject,
        readProperty  = utils.readProperty,
        writeProperty = utils.writeProperty,
        readInternalProperty  = utils.readInternalProperty,
        writeInternalProperty = utils.writeInternalProperty;

    var module_object = __webpack_require__(11);

    var INTERNAL_KEY = "__regexp__";

    function assertRegExp(obj) {
        if (!(obj instanceof RegExp)) {
            throw new errors.RuntimeError([], "invalid object");
        }
    }

    /**
     * @static
     */
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
                        regexp.source
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

    /**
     * @static
     */
    var __RegExp__ = createObject(module_object.__Class__proto__);
    Object.defineProperties(__RegExp__.data, {
        "proto": {
            "value": __RegExp__proto__
        },
        "new": {
            "value": new Value(
                DataType.FUNCTION,
                function (cls) {
                    assertType(cls, DataType.OBJECT);
                    return new Value(
                        DataType.FUNCTION,
                        function (pattern) {
                            assertType(pattern, DataType.STRING);
                            return new Value(
                                DataType.FUNCTION,
                                function (flags) {
                                    assertType(flags, DataType.STRING);
                                    var f = calcTailCall(
                                        readProperty(module_object.__Class__proto__, "new").data(cls)
                                    );
                                    assertType(f, DataType.FUNCTION);
                                    var g = calcTailCall(f.data(pattern));
                                    assertType(g, DataType.FUNCTION);
                                    return g.data(flags);
                                }
                            );
                        }
                    );
                }
            )
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

    /**
     * @static
     */
    var __splitRE__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.FUNCTION,
                    function (re) {
                        assertType(re, DataType.OBJECT);
                        var regexp = readInternalProperty(re, INTERNAL_KEY, "regexp");
                        assertRegExp(regexp);
                        return new Value(
                            DataType.ARRAY,
                            str.data.split(regexp).map(function (elem) {
                                return new Value(
                                    DataType.STRING,
                                    elem
                                );
                            })
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __replaceRE__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.FUNCTION,
                    function (re) {
                        assertType(re, DataType.OBJECT);
                        var regexp = readInternalProperty(re, INTERNAL_KEY, "regexp");
                        assertRegExp(regexp);
                        return new Value(
                            DataType.FUNCTION,
                            function (newSubstr) {
                                assertType(newSubstr, DataType.STRING);
                                return new Value(
                                    DataType.STRING,
                                    str.data.replace(regexp, newSubstr.data)
                                );
                            }
                        );
                    }
                );
            }
        );

    /**
     * @static
     */
    var __replaceREWith__ =
        new Value(
            DataType.FUNCTION,
            function (str) {
                assertType(str, DataType.STRING);
                return new Value(
                    DataType.FUNCTION,
                    function (re) {
                        assertType(re, DataType.OBJECT);
                        var regexp = readInternalProperty(re, INTERNAL_KEY, "regexp");
                        assertRegExp(regexp);
                        return new Value(
                            DataType.FUNCTION,
                            function (f) {
                                assertType(f, DataType.FUNCTION);
                                return new Value(
                                    DataType.STRING,
                                    str.data.replace(regexp, function (rep) {
                                        var newSubstr = calcTailCall(f.data(
                                                new Value(DataType.STRING, rep)
                                            ));
                                        assertType(newSubstr, DataType.STRING);
                                        return newSubstr.data;
                                    })
                                );
                            }
                        );
                    }
                );
            }
        );

    end_module();


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : prelude.js
     * copyright (c) 2015 Susisu
     */

    /*
     * @module prelude
     */

    "use strict";

    function end_module() {
        module.exports = Object.freeze(prelude);
    }

    var module_general   = __webpack_require__(9),
        module_object    = __webpack_require__(11),
        module_unit      = __webpack_require__(12),
        module_number    = __webpack_require__(13),
        module_string    = __webpack_require__(14),
        module_bool      = __webpack_require__(15),
        module_function  = __webpack_require__(16),
        module_reference = __webpack_require__(17),
        module_array     = __webpack_require__(18),
        module_accessor  = __webpack_require__(19),
        module_date      = __webpack_require__(20),
        module_regexp    = __webpack_require__(21),
        module_maybe     = __webpack_require__(23),
        module_json      = __webpack_require__(24);

    var prelude = Object.create(null);

    prelude["__negate__"]          = module_number.__negate__;
    prelude["__createObject__"]    = module_object.__createObject__;
    prelude["__Object__proto__"]   = module_object.__Object__proto__;
    prelude["__readProperty__"]    = module_accessor.__readProperty__;
    prelude["__callMethod__"]      = module_accessor.__callMethod__;
    prelude["__writeProperty__"]   = module_accessor.__writeProperty__;
    prelude["__checkProperty__"]   = module_accessor.__checkProperty__;
    prelude["__readPropertyOf__"]  = module_accessor.__readPropertyOf__;
    prelude["__callMethodOf__"]    = module_accessor.__callMethodOf__;
    prelude["__writePropertyOf__"] = module_accessor.__writePropertyOf__;
    prelude["__checkPropertyOf__"] = module_accessor.__checkPropertyOf__;

    prelude["id"]      = module_general.__id__;
    prelude["const"]   = module_general.__const__;
    prelude["trace"]   = module_general.__trace__;
    prelude["error"]   = module_general.__error__;
    prelude["typeOf"]  = module_general.__typeOf__;
    prelude["max"]     = module_general.__max__;
    prelude["min"]     = module_general.__min__;
    prelude["=="]      = module_general.__equalTo__
    prelude["/="]      = module_general.__notEqualTo__
    prelude["<"]       = module_general.__lessThan__
    prelude["<="]      = module_general.__lessThanOrEqualTo__
    prelude[">"]       = module_general.__greaterThan__
    prelude[">="]      = module_general.__greaterThanOrEqualTo__
    prelude["compare"] = module_general.__compare__;

    prelude["createObject"]      = module_object.__createObject__;
    prelude["Object"]            = module_object.__Object__;
    prelude["Class"]             = module_object.__Class__;
    prelude["isObject"]          = module_object.__isObject__;
    prelude["instanceOf"]        = module_object.__instanceOf__;
    prelude["delete"]            = module_object.__delete__;
    prelude["assign"]            = module_object.__assign__;
    prelude["orphan"]            = module_object.__orphan__;
    prelude["keys"]              = module_object.__keys__;
    prelude["preventExtensions"] = module_object.__preventExtensions__;
    prelude["seal"]              = module_object.__seal__;
    prelude["freeze"]            = module_object.__freeze__;
    prelude["isExtensible"]      = module_object.__isExtensible__;
    prelude["isSealed"]          = module_object.__isSealed__;
    prelude["isFrozen"]          = module_object.__isFrozen__;

    prelude["Unit"]   = module_unit.__Unit__;
    prelude["isUnit"] = module_unit.__isUnit__;
    prelude["void"]   = module_unit.__void__;

    prelude["Number"]     = module_number.__Number__;
    prelude["isNumber"]   = module_number.__isNumber__;
    prelude["isNaN"]      = module_number.__isNaN__;
    prelude["isFinite"]   = module_number.__isFinite__;
    prelude["isInteger"]  = module_number.__isInteger__;
    prelude["toInteger"]  = module_number.__toInteger__;
    prelude["parseInt"]   = module_number.__parseInt__;
    prelude["parseFloat"] = module_number.__parseFloat__;
    prelude["negate"]     = module_number.__negate__;
    prelude["add"]        = module_number.__abs__;
    prelude["signum"]     = module_number.__signum__;
    prelude["+"]          = module_number.__add__;
    prelude["-"]          = module_number.__sub__;
    prelude["*"]          = module_number.__mul__;
    prelude["/"]          = module_number.__div__;
    prelude["mod"]        = module_number.__mod__;
    prelude["**"]         = module_number.__pow__;
    prelude["round"]      = module_number.__round__;
    prelude["ceiling"]    = module_number.__ceiling__;
    prelude["floor"]      = module_number.__floor__;
    prelude["sqrt"]       = module_number.__sqrt__;
    prelude["exp"]        = module_number.__exp__;
    prelude["log"]        = module_number.__log__;
    prelude["logBase"]    = module_number.__logBase__;
    prelude["sin"]        = module_number.__sin__;
    prelude["cos"]        = module_number.__cos__;
    prelude["tan"]        = module_number.__tan__;
    prelude["asin"]       = module_number.__asin__;
    prelude["acos"]       = module_number.__acos__;
    prelude["atan"]       = module_number.__atan__;
    prelude["atan2"]      = module_number.__atan2__;
    prelude["random"]     = module_number.__random__;

    prelude["String"]          = module_string.__String__;
    prelude["isString"]        = module_string.__isString__;
    prelude["charAt"]          = module_string.__charAt__;
    prelude["charCodeAt"]      = module_string.__charCodeAt__;
    prelude["charCode"]        = module_string.__charCode__;
    prelude["fromCharCode"]    = module_string.__fromCharCode__;
    prelude["strlen"]          = module_string.__length__;
    prelude["strempty"]        = module_string.__empty__;
    prelude["toUpperCase"]     = module_string.__toUpperCase__;
    prelude["toLowerCase"]     = module_string.__toLowerCase__;
    prelude["strrev"]          = module_string.__reverse__;
    prelude["strcat"]          = module_string.__concat__;
    prelude["++"]              = module_string.__concat__;
    prelude["split"]           = module_string.__split__;
    prelude["lines"]           = module_string.__lines__;
    prelude["words"]           = module_string.__words__;
    prelude["replace"]         = module_string.__replace__;
    prelude["replaceWith"]     = module_string.__replaceWith__;
    prelude["trim"]            = module_string.__trim__;
    prelude["strslice"]        = module_string.__slice__;
    prelude["indexOfFrom"]     = module_string.__indexOfFrom__;
    prelude["indexOf"]         = module_string.__indexOf__;
    prelude["lastIndexOfFrom"] = module_string.__lastIndexOfFrom__;
    prelude["lastIndexOf"]     = module_string.__lastIndexOf__;
    prelude["strcycle"]        = module_string.__cycle__;

    prelude["Bool"]   = module_bool.__Bool__;
    prelude["isBool"] = module_bool.__isBool__;
    prelude["not"]    = module_bool.__not__;
    prelude["&&"]     = module_bool.__and__;
    prelude["||"]     = module_bool.__or__;

    prelude["Function"]   = module_function.__Function__;
    prelude["isFunction"] = module_function.__isFunction__;
    prelude["@"]          = module_function.__compose__;
    prelude["flip"]       = module_function.__flip__;
    prelude["$"]          = module_function.__apply__;
    prelude["&"]          = module_function.__reverseApply__;
    prelude["on"]         = module_function.__on__;

    prelude["Reference"]   = module_reference.__Reference__;
    prelude["isReference"] = module_reference.__isReference__;
    prelude["ref"]         = module_reference.__ref__;
    prelude["readRef"]     = module_reference.__readRef__;
    prelude["writeRef"]    = module_reference.__writeRef__;
    prelude[":="]          = module_reference.__writeRef__;
    prelude["modifyRef"]   = module_reference.__modifyRef__;

    prelude["Array"]             = module_array.__Array__;
    prelude["isArray"]           = module_array.__isArray__;
    prelude["newArray"]          = module_array.__newArray__;
    prelude["readArray"]         = module_array.__readArray__;
    prelude["!!"]                = module_array.__readArray__;
    prelude["writeArray"]        = module_array.__writeArray__;
    prelude["pop"]               = module_array.__pop__;
    prelude["push"]              = module_array.__push__;
    prelude["shift"]             = module_array.__shift__;
    prelude["unshift"]           = module_array.__unshift__;
    prelude["insertAt"]          = module_array.__insertAt__;
    prelude["removeAt"]          = module_array.__removeAt__;
    prelude["head"]              = module_array.__head__;
    prelude["last"]              = module_array.__last__;
    prelude["tail"]              = module_array.__tail__;
    prelude["init"]              = module_array.__init__;
    prelude["fst"]               = module_array.__fst__;
    prelude["snd"]               = module_array.__snd__;
    prelude["length"]            = module_array.__length__;
    prelude["empty"]             = module_array.__empty__;
    prelude["reverse"]           = module_array.__reverse__;
    prelude["concat"]            = module_array.__concat__;
    prelude["join"]              = module_array.__join__;
    prelude["map"]               = module_array.__map__;
    prelude["map_"]              = module_array.__map$__;
    prelude["for"]               = module_array.__for__;
    prelude["for_"]              = module_array.__for$__;
    prelude["foldl"]             = module_array.__foldl__;
    prelude["foldl1"]            = module_array.__foldl1__;
    prelude["foldr"]             = module_array.__foldr__;
    prelude["foldr1"]            = module_array.__foldr1__;
    prelude["all"]               = module_array.__all__;
    prelude["any"]               = module_array.__any__;
    prelude["sum"]               = module_array.__sum__;
    prelude["product"]           = module_array.__product__;
    prelude["maximum"]           = module_array.__maximum__;
    prelude["minimum"]           = module_array.__minimum__;
    prelude["take"]              = module_array.__take__;
    prelude["drop"]              = module_array.__drop__;
    prelude["takeWhile"]         = module_array.__takeWhile__;
    prelude["dropWhile"]         = module_array.__dropWhile__;
    prelude["slice"]             = module_array.__slice__;
    prelude["sortBy"]            = module_array.__sortBy__;
    prelude["sort"]              = module_array.__sort__;
    prelude["sortOn"]            = module_array.__sortOn__;
    prelude["findIndexFrom"]     = module_array.__findIndexFrom__;
    prelude["findIndex"]         = module_array.__findIndex__;
    prelude["findLastIndexFrom"] = module_array.__findLastIndexFrom__;
    prelude["findLastIndex"]     = module_array.__findLastIndex__;
    prelude["elemIndexFrom"]     = module_array.__elemIndexFrom__;
    prelude["elemIndex"]         = module_array.__elemIndex__;
    prelude["elemLastIndexFrom"] = module_array.__elemLastIndexFrom__;
    prelude["elemLastIndex"]     = module_array.__elemLastIndex__;
    prelude["elem"]              = module_array.__elem__;
    prelude["notElem"]           = module_array.__notElem__;
    prelude["zip"]               = module_array.__zip__;
    prelude["zipWith"]           = module_array.__zipWith__;
    prelude["range"]             = module_array.__range__;
    prelude["range'"]            = module_array.__range$__;
    prelude[".."]                = module_array.__range$__;
    prelude["replicate"]         = module_array.__replicate__;
    prelude["cycle"]             = module_array.__cycle__;

    prelude["toObject"]        = module_accessor.__toObject__;
    prelude["readProperty"]    = module_accessor.__readProperty__;
    prelude["callMethod"]      = module_accessor.__callMethod__;
    prelude["writeProperty"]   = module_accessor.__writeProperty__;
    prelude["checkProperty"]   = module_accessor.__checkProperty__;
    prelude["readPropertyOf"]  = module_accessor.__readPropertyOf__;
    prelude["callMethodOf"]    = module_accessor.__callMethodOf__;
    prelude["writePropertyOf"] = module_accessor.__writePropertyOf__;
    prelude["checkPropertyOf"] = module_accessor.__checkPropertyOf__;

    prelude["Date"] = module_date.__Date__;

    prelude["RegExp"]        = module_regexp.__RegExp__;
    prelude["splitRE"]       = module_regexp.__splitRE__;
    prelude["replaceRE"]     = module_regexp.__replaceRE__;
    prelude["replaceREWith"] = module_regexp.__replaceREWith__;

    prelude["Nothing"] = module_maybe.__Nothing__;
    prelude["Just"]    = module_maybe.__Just__;
    prelude["nothing"] = module_maybe.__nothing__;
    prelude["just"]    = module_maybe.__just__;
    prelude["maybe"]   = module_maybe.__maybe__;

    prelude["fromJSON"] = module_json.__fromJSON__;
    prelude["toJSON"]   = module_json.__toJSON__;

    end_module();


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : lib/maybe.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module lib/maybe
     */

    "use strict";

    function end_module() {
        Object.freeze(__Nothing__proto__.data);
        Object.freeze(__Nothing__.data);
        Object.freeze(__Just__proto__.data);
        Object.freeze(__Just__.data);

        module.exports = Object.freeze({
            "__Nothing__proto__": __Nothing__proto__,
            "__Nothing__"       : __Nothing__,
            "__Just__proto__"   : __Just__proto__,
            "__Just__"          : __Just__,
            "__nothing__"       : __nothing__,
            "__just__"          : __just__,
            "__maybe__"         : __maybe__
        });
    }

    var core         = __webpack_require__(1),
        Value        = core.Value,
        DataType     = core.DataType,
        calcTailCall = core.calcTailCall,
        __unit__     = core.__unit__,
        __true__     = core.__true__,
        __false__    = core.__false__;

    var errors = __webpack_require__(2);

    var utils         = __webpack_require__(10),
        assertType    = utils.assertType,
        createObject  = utils.createObject,
        readProperty  = utils.readProperty,
        callMethod    = utils.callMethod,
        readInternalProperty  = utils.readInternalProperty,
        writeInternalProperty = utils.writeInternalProperty;

    var module_object   = __webpack_require__(11),
        module_accessor = __webpack_require__(19);

    var INTERNAL_KEY = "__maybe__";

    /**
     * @static
     */
    var __Nothing__proto__ = createObject(module_object.__Object__proto__);
    Object.defineProperties(__Nothing__proto__.data, {
        "toString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    return new Value(
                        DataType.STRING,
                        "Nothing"
                    );
                }
            )
        },
        "isJust": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    return __false__;
                }
            )
        },
        "isNothing": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    return __true__;
                }
            )
        },
        "fromJust": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    throw new errors.RuntimeError([], "nothing");
                }
            )
        },
        "fromMaybe": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    return new Value(
                        DataType.FUNCTION,
                        function (value) {
                            return value;
                        }
                    );
                }
            )
        },
        "map": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    return new Value(
                        DataType.FUNCTION,
                        function (f) {
                            return __nothing__;
                        }
                    );
                }
            )
        },
        "bind": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    return new Value(
                        DataType.FUNCTION,
                        function (f) {
                            return __nothing__;
                        }
                    );
                }
            )
        }
    });

    /**
     * @static
     */
    var __Nothing__ = createObject(module_object.__Class__proto__);
    Object.defineProperties(__Nothing__.data, {
        "proto": {
            "value": __Nothing__proto__
        },
        "ctor": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    return obj;
                }
            )
        }
    });

    /**
     * @static
     */
    var __Just__proto__ = createObject(module_object.__Object__proto__);
    Object.defineProperties(__Just__proto__.data, {
        "toString": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var value = readInternalProperty(obj, INTERNAL_KEY, "just");
                    var f = calcTailCall(module_accessor.__callMethod__.data(value));
                    assertType(f, DataType.FUNCTION);
                    var str = calcTailCall(f.data(new Value(DataType.STRING, "toString")));
                    assertType(str, DataType.STRING);
                    return new Value(
                        DataType.STRING,
                        "Just " + str.data
                    );
                }
            )
        },
        "isJust": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    return __true__;
                }
            )
        },
        "isNothing": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    return __false__;
                }
            )
        },
        "fromJust": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    return readInternalProperty(obj, INTERNAL_KEY, "just");
                }
            )
        },
        "fromMaybe": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    return new Value(
                        DataType.FUNCTION,
                        function (value) {
                            return readInternalProperty(obj, INTERNAL_KEY, "just");
                        }
                    );
                }
            )
        },
        "map": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var value = readInternalProperty(obj, INTERNAL_KEY, "just");
                    return new Value(
                        DataType.FUNCTION,
                        function (f) {
                            assertType(f, DataType.FUNCTION);
                            var newValue = calcTailCall(f.data(value));
                            return callMethod(__Just__, "new").data(newValue);
                        }
                    );
                }
            )
        },
        "bind": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    var value = readInternalProperty(obj, INTERNAL_KEY, "just");
                    return new Value(
                        DataType.FUNCTION,
                        function (f) {
                            assertType(f, DataType.FUNCTION);
                            return f.data(value);
                        }
                    );
                }
            )
        }
    });

    /**
     * @static
     */
    var __Just__ = createObject(module_object.__Class__proto__);
    Object.defineProperties(__Just__.data, {
        "proto": {
            "value": __Just__proto__
        },
        "new": {
            "value": new Value(
                DataType.FUNCTION,
                function (cls) {
                    assertType(cls, DataType.OBJECT);
                    return new Value(
                        DataType.FUNCTION,
                        function (value) {
                            var f = calcTailCall(
                                readProperty(module_object.__Class__proto__, "new").data(cls)
                            );
                            assertType(f, DataType.FUNCTION);
                            return f.data(value);
                        }
                    );
                }
            )
        },
        "ctor": {
            "value": new Value(
                DataType.FUNCTION,
                function (obj) {
                    assertType(obj, DataType.OBJECT);
                    return new Value(
                        DataType.FUNCTION,
                        function (value) {
                            writeInternalProperty(obj, INTERNAL_KEY, "just", value);
                            return obj;
                        }
                    );
                }
            )
        }
    });

    /**
     * @static
     */
    var __nothing__ = callMethod(__Nothing__, "new");

    /**
     * @static
     */
    var __just__ = callMethod(__Just__, "new");

    /**
     * @static
     */
    var __maybe__ =
        new Value(
            DataType.FUNCTION,
            function (defaultValue) {
                return new Value(
                    DataType.FUNCTION,
                    function (f) {
                        assertType(f, DataType.FUNCTION);
                        return new Value(
                            DataType.FUNCTION,
                            function (maybeValue) {
                                assertType(maybeValue, DataType.OBJECT);
                                var isJust = calcTailCall(callMethod(maybeValue, "isJust"));
                                assertType(isJust, DataType.BOOL);
                                if (isJust.data) {
                                    var value = readInternalProperty(maybeValue, INTERNAL_KEY, "just");
                                    return f.data(value);
                                }
                                else {
                                    return defaultValue;
                                }
                            }
                        );
                    }
                );
            }
        );

    end_module();


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

    /*
     * milktea : lib/json.js
     * copyright (c) 2015 Susisu
     */

    /**
     * @module lib/json
     */

    "use strict";

    function end_module() {
        module.exports = Object.freeze({
            "__fromJSON__": __fromJSON__,
            "__toJSON__"  : __toJSON__
        });
    }

    var core         = __webpack_require__(1),
        Value        = core.Value,
        DataType     = core.DataType,
        __unit__     = core.__unit__,
        __true__     = core.__true__,
        __false__    = core.__false__;

    var errors = __webpack_require__(2);

    var utils         = __webpack_require__(10),
        assertType    = utils.assertType,
        createObject  = utils.createObject,
        writeProperty = utils.writeProperty;

    var module_object = __webpack_require__(11),
        module_maybe  = __webpack_require__(23);

    function fromJSONValue(value) {
        switch (typeof value) {
            case "undefined":
                return __unit__;
            case "number":
                return new Value(
                    DataType.NUMBER,
                    value
                );
            case "string":
                return new Value(
                    DataType.STRING,
                    value
                );
            case "boolean":
                return value ? __true__ : __false__;
            case "object":
                if (value === null) {
                    return __unit__;
                }
                else if (value instanceof Array) {
                    return new Value(
                        DataType.ARRAY,
                        value.map(function (elem) {
                            return fromJSONValue(elem);
                        })
                    );
                }
                else {
                    var obj = createObject(module_object.__Object__proto__);
                    Object.keys(value).forEach(function (key) {
                        writeProperty(obj, key, fromJSONValue(value[key]));
                    });
                    return obj;
                }
            default:
                throw new errors.RuntimeError([], "inconvertible data");
        }
    }

    function toJSONValue(value, blackList) {
        if (blackList.indexOf(value) >= 0) {
            throw new errors.RuntimeError([], "circular structure");
        }
        switch (value.type) {
            case DataType.UNIT:
                return null;
            case DataType.NUMBER:
            case DataType.STRING:
            case DataType.BOOL:
                return value.data;
            case DataType.REFERENCE:
                return toJSONValue(value.data, blackList.concat(value));
            case DataType.ARRAY:
                return value.data.map(function (elem) {
                    return toJSONValue(elem, blackList.concat(value));
                });
            case DataType.OBJECT:
                var obj = {};
                Object.keys(value.data).forEach(function (key) {
                    obj[key] = toJSONValue(value.data[key], blackList.concat(value));
                });
                return obj;
            default:
                throw new errors.RuntimeError([], "inconvertible data");
        }
    }

    /**
     * @static
     */
    var __fromJSON__ =
        new Value(
            DataType.FUNCTION,
            function (json) {
                assertType(json, DataType.STRING);
                try {
                    return fromJSONValue(JSON.parse(json.data));
                }
                catch (err) {
                    return module_maybe.__nothing__;
                }
            }
        );

    /**
     * @static
     */
    var __toJSON__ =
        new Value(
            DataType.FUNCTION,
            function (value) {
                try {
                    var value = new Value(
                        DataType.STRING,
                        JSON.stringify(toJSONValue(value, []))
                    );
                    return module_maybe.__just__.data(value);
                }
                catch (err) {
                    return module_maybe.__nothing__;
                }
            }
        );

    end_module();


/***/ }
/******/ ]);