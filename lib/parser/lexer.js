/*
 * milktea : parser/lexer.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "lexer": lexer
    });
}

var lq = require("loquat");

var tokens = require("./tokens.js");

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
        "null",
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
    tokenParser.reserved("true").then(lq.pure(true))
    .or(tokenParser.reserved("false").then(lq.pure(false)));
var boolLiteralToken =
    lq.getPosition.bind(function (pos) {
        return boolLiteral.bind(function (tf) {
            return lq.pure(new tokens.BoolLiteral(pos, tf));
        })
    })
    .label("bool");

// null literal
var nullLiteral =
    tokenParser.reserved("null").then(lq.pure(null));
var nullLiteralToken =
    lq.getPosition.bind(function (pos) {
        return nullLiteral.bind(function (n) {
            return lq.pure(new tokens.NullLiteral(pos))
        });
    })
    .label("null");

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
        nullLiteralToken,
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

end_module();
