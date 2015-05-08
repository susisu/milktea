/*
 * milktea : parser.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "lex"                  : lex,
        "parse"                : parse,
        "parseTokens"          : parseTokens,
        "parseSingleLine"      : parseSingleLine,
        "parseTokensSingleLine": parseTokensSingleLine
    });
}

var lq = require("loquat");

var lexer  = require("./parser/lexer.js");
var parser = require("./parser/parser.js");

var initialParserState =
    new parser.ParserState(
        {
            "!!" : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 9),
            "@"  : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 9),

            "**" : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 8),

            "*"  : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 7),
            "/"  : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 7),
            "mod": new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 7),

            "+"  : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 6),
            "-"  : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 6),

            "++" : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 5),

            "==" : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4),
            "/=" : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4),
            "<"  : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4),
            "<=" : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4),
            ">"  : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4),
            ">=" : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4),

            "$"  : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 0),
            ":=" : new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 0)
        }
    );

function parse(name, source) {
    return parseTokens(name, lex(name, source));
}

function lex(name, source) {
    var result = lq.parse(lexer.lexer, name, source);
    if (result.succeeded) {
        return result.value;
    }
    else {
        throw result.error;
    }
}

function parseTokens(name, tokens) {
    var result = lq.parse(parser.multiLine, name, tokens, initialParserState);
    if (result.succeeded) {
        return result.value;
    }
    else {
        throw result.error;
    }
}

function parseSingleLine(name, source) {
    return parseTokensSingleLine(name, lex(name, source));
}

function parseTokensSingleLine(name, tokens) {
    var result = lq.parse(parser.singleLine, name, tokens, initialParserState);
    if (result.succeeded) {
        return result.value;
    }
    else {
        throw result.error;
    }
}

end_module();
