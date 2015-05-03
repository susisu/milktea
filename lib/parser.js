/*
 * milktea : parser.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "tokenize": tokenize,
        "parse"   : parse
    });
}

var lq = require("loquat");

var tokens = require("./parser/tokens.js");
var core   = require("./core.js");

var lexer = makeLexer();

function tokenize(name, source) {
    var result = lq.parse(lexer, name, source);
    if (result.succeeded) {
        return result.value;
    }
    else {
        throw result.error;
    }
}

function makeLexer() {
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
            "True", "False",
            "if", "then", "else",
            "and", "or",
            "let", "in",
            "begin", "end",
            "infix", "infixl", "infixr"
        ],
        ["=", ":", "\\", "->", ".", "#"],
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
            })
        })
        .label("number");

    // string literal
    var stringLiteral = tokenParser.stringLiteral;
    var stringLiteralToken =
        lq.getPosition.bind(function (pos) {
            return stringLiteral.bind(function (str) {
                return lq.pure(new tokens.StringLiteral(pos, str));
            })
        })
        .label("string");

    // bool literal
    var boolLiteral =
        tokenParser.reserved("True").then(lq.pure(true))
        .or(tokenParser.reserved("False").then(lq.pure(false)));
    var boolLiteralToken =
        lq.getPosition.bind(function (pos) {
            return boolLiteral.bind(function (tf) {
                return lq.pure(new tokens.BoolLiteral(pos, tf));
            })
        })
        .label("bool");
    // identifier
    var identifier = tokenParser.identifier;
    var identifierToken =
        lq.getPosition.bind(function (pos) {
            return identifier.bind(function (name) {
                return lq.pure(new tokens.Identifier(pos, name));
            })
        })
        .label("identifier");

    // operator
    var operator = tokenParser.operator;
    var operatorToken =
        lq.getPosition.bind(function (pos) {
            return operator.bind(function (name) {
                return lq.pure(new tokens.Operator(pos, name));
            })
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
            })
        })
        .label("operator");

    // reserved word
    var reservedWord =
        lq.choice(
            [
                "if", "then", "else",
                "and", "or",
                "let", "in",
                "begin", "end",
                "infix", "infixl", "infixr"
            ].map(function (word) {
                return tokenParser.reserved(word).then(lq.pure(word));
            })
        );
    var reservedWordToken =
        lq.getPosition.bind(function (pos) {
            return reservedWord.bind(function (name) {
                return lq.pure(new tokens.ReservedWord(pos, name));
            })
        })
        .label("reserved word");

    // reserved operator
    var reservedOperator =
        lq.choice(
            [
                "=", ":", "\\", "->", ".", "#"
            ].map(function (op) {
                return tokenParser.reservedOp(op).then(lq.pure(op))
            })
        );
    var reservedOperatorToken =
        lq.getPosition.bind(function (pos) {
            return reservedOperator.bind(function (name) {
                return lq.pure(new tokens.ReservedOperator(pos, name));
            })
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
            })
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
            reservedWordToken,
            reservedOperatorToken,
            symbolToken
        ])
        .label("token");

    var lexer =
        tokenParser.whiteSpace
        .then(lq.many(token))
        .left(lq.eof);

    return lexer;
}

function ParserState(operatorsInfo) {
    this.operatorsInfo = operatorsInfo;
}

ParserState.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": ParserState
    },
    "clone": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            var newOperatorsInfo = Object.create(this.operatorsInfo);
            return new ParserState(newOperatorsInfo);
        }
    }
});

function OperatorInfo(assoc, precedence) {
    this.assoc      = assoc;
    this.precedence = precedence;
}

var parser = makeParser();

function parse(name, tokens) {
    var parser = makeParser();
    var state  = new ParserState(
        {
            "@": new OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 9),

            "**": new OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 8),

            "*": new OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 7),
            "/": new OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 7),
            "mod": new OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 7),

            "+": new OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 6),
            "-": new OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 6),

            "==": new OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4),
            "/=": new OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4),
            "<" : new OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4),
            "<=": new OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4),
            ">" : new OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4),
            ">=": new OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4),

            "$": new OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 0)
        }
    );
    var result = lq.parse(parser, name, tokens, state);
    if (result.succeeded) {
        return result.value;
    }
    else {
        throw result.error;
    }
}

function makeParser() {
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
        .label(name);
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
    var tok_colon     = tok_reservedOperator(":");
    var tok_backslash = tok_reservedOperator("\\");
    var tok_arrow     = tok_reservedOperator("->");
    var tok_dot       = tok_reservedOperator(".");
    var tok_hash      = tok_reservedOperator("#");

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

    // utility functions
    function makeClosure(pos, args, body) {
        return args.reduceRight(
            function (f, arg) {
                return new core.Closure(pos, arg.name, f);
            },
            body
        );
    }

    function prefixOperator(name, funcName) {
        return new lq.Operator(
            lq.OperatorType.PREFIX,
            tok_operator(name).bind(function (op) {
                return lq.pure(function (x) {
                    return new core.Application(
                        op.pos,
                        new core.Variable(op.pos, funcName),
                        x
                    )
                });
            })
        );
    }

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
                    prefixOperator("-", "__negate__")
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
                        tok_reservedWord("and").bind(function (op) {
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
                        tok_reservedWord("or").bind(function (op) {
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
    var literal =
        numberLiteral
        .or(stringLiteral)
        .or(boolLiteral)
        .or(unitLiteral)
        .or(arrayLiteral);

    // variables
    var idVariable =
        tok_identifier.bind(function (token) {
            return lq.pure(
                new core.Variable(token.pos, token.name)
            );
        });
    var symVariable =
        lq.try(
            tok_openParen.bind(function (open) {
                return tok_anyOperator.bind(function (op) {
                    return tok_closeParen
                        .then(lq.pure(new core.Variable(open.pos, op.name)));
                });
            })
        );
    var variable =
        idVariable
        .or(symVariable)
        .label("variable");

    var primExpr = literal.or(variable);

    // object accessors
    var dotAccessor =
        tok_dot.bind(function (dot) {
            return tok_identifier.bind(function (id) {
                return lq.pure(function (obj) {
                    return new core.Application(
                        dot.pos,
                        new core.Application(
                            dot.pos,
                            new core.Variable(dot.pos, "__.__"),
                            obj
                        ),
                        new core.Literal(
                            id.pos,
                            new core.Value(core.DataType.STRING, id.name)
                        )
                    )
                });
            });
        });
    var hashAccessor =
        tok_hash.bind(function (hash) {
            return tok_identifier.bind(function (id) {
                return lq.pure(function (obj) {
                    return new core.Application(
                        hash.pos,
                        new core.Application(
                            hash.pos,
                            new core.Variable(hash.pos, "__#__"),
                            obj
                        ),
                        new core.Literal(
                            id.pos,
                            new core.Value(core.DataType.STRING, id.name)
                        )
                    )
                });
            });
        });
    var accessor = dotAccessor.or(hashAccessor);
    var objExpr = primExpr.bind(function (expr) {
        return accessor.many().bind(function (accessors) {
            return lq.pure(accessors.reduce(
                function (obj, accessor) {
                    return accessor(obj);
                },
                expr
            ));
        });
    });

    // object or parened expressions
    var valueExpr =
        objExpr
        .or(expression.between(tok_openParen, tok_closeParen));

    // function applications
    var appExpr =
        valueExpr.bind(function (func) {
            return valueExpr.many().bind(function (args) {
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
            return tok_identifier.many1().bind(function (args) {
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
            variable.bind(function (id) {
                return tok_identifier.many().bind(function (args) {
                    return tok_equal.then(expression).bind(function (expr) {
                        return lq.pure([id.name, makeClosure(id.pos, args, expr)]);
                    });
                }); 
            });
        return tok_let.bind(function (bind) {
            return binding.sepBy1(tok_comma).bind(function (binds) {
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

    // operand of expression
    var operandExpr =
        appExpr
        .or(lambdaExpr)
        .or(condExpr)
        .or(bindExpr)
        .or(procExpr)
        .label("operand");

    // declarations
    // definition
    var definitionDecl = 
        lq.try(
            variable.bind(function (id) {
                return tok_identifier.many().left(tok_equal).bind(function (args) {
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
                                var newState = state.clone();
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
        .left(tok_semicolon.many());
    var program = lq.many(statement).left(lq.eof);

    return program;
}

end_module();
