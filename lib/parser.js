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

var lq = require("loquat");

var lexer  = require("./parser/lexer.js");
var parser = require("./parser/parser.js");

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
 * @desc Tokenizes the source.
 */
function lex(name, source) {
    var result = lq.parse(lexer.lexer, name, source);
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
 * @desc Tokenizes the source, ignoring a shebang at the head.
 */
function lexEx(name, source) {
    var result = lq.parse(lexer.lexerEx, name, source);
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
 * @desc Parses the tokens with the specified state.
 */
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
