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

var lq = require("loquat");

var core   = require("../core.js");
var tokens = require("./tokens.js");

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
