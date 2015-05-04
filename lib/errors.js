/*
 * milktea : errors.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "RuntimeError": RuntimeError,

        "unknownError"           : unknownError,
        "unboundError"           : unboundError,
        "typeError"              : typeError,
        "multipleDefinitionError": multipleDefinitionError
    });
}

function RuntimeError(positions, message) {
    this.positions = positions;
    this.message   = message;
}

RuntimeError.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": RuntimeError
    },
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
    "addPos": {
        "writable"    : true,
        "configurable": true,
        "value": function (pos) {
            return new RuntimeError(this.positions.concat(pos), this.message);
        }
    }
});

function unknownError(pos) {
    return new RuntimeError(
        pos === undefined ? [] : [pos],
        "unknown internal error"
    );
}
function unboundError(pos, name) {
    return new RuntimeError(
        pos === undefined ? [] : [pos],
        "unbound variable: " + name
    );
}

function typeError(pos, expect, actual) {
    return new RuntimeError(
        pos === undefined ? [] : [pos],
        "type mismatch: expect " + expect + ", actual " + actual
    );
}

function multipleDefinitionError(pos, name) {
    return new RuntimeError(
        pos === undefined ? [] : [pos],
        "multiple definition: " + name
    );
}

end_module();
