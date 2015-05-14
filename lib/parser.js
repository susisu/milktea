/*
 * milktea : parser.js
 * copyright (c) 2015 Susisu
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

var lq = require("loquat");

var lexer  = require("./parser/lexer.js");
var parser = require("./parser/parser.js");

var initialOperatorInfo = Object.create(null);

initialOperatorInfo["!!"]  = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 9);
initialOperatorInfo["@"]   = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 9);

initialOperatorInfo["**"]  = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 8);

initialOperatorInfo["*"]   = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 7);
initialOperatorInfo["/"]   = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 7);
initialOperatorInfo["mod"] = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 7);

initialOperatorInfo["+"]   = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 6);
initialOperatorInfo["-"]   = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_LEFT, 6);

initialOperatorInfo["++"]  = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 5);

initialOperatorInfo["=="]  = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4);
initialOperatorInfo["/="]  = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4);
initialOperatorInfo["<"]   = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4);
initialOperatorInfo["<="]  = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4);
initialOperatorInfo[">"]   = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4);
initialOperatorInfo[">="]  = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_NONE, 4);

initialOperatorInfo["$"]   = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 0);
initialOperatorInfo[":="]  = new parser.OperatorInfo(lq.OperatorAssoc.ASSOC_RIGHT, 0);

var initialParserState = new parser.ParserState(initialOperatorInfo);

function lex(name, source) {
    var result = lq.parse(lexer.lexer, name, source);
    if (result.succeeded) {
        return result.value;
    }
    else {
        throw result.error;
    }
}

function lexEx(name, source) {
    var result = lq.parse(lexer.lexerEx, name, source);
    if (result.succeeded) {
        return result.value;
    }
    else {
        throw result.error;
    }
}

function parse(name, source) {
    return parseTokensWithState(name, lex(name, source), initialParserState);
}

function parseEx(name, source) {
    return parseTokensWithState(name, lexEx(name, source), initialParserState);
}

function parseTokens(name, tokens) {
    return parseTokensWithState(name, tokens, initialParserState);
}

function parseWithState(name, source, state) {
    return parseTokensWithState(name, lex(name, source), state);
}

function parseWithStateEx(name, source, state) {
    return parseTokensWithState(name, lexEx(name, source), state);
}

function parseTokensWithState(name, tokens, state) {
    var result = lq.parse(parser.parser, name, tokens, state);
    if (result.succeeded) {
        return result.value;
    }
    else {
        throw result.error;
    }
}

end_module();
