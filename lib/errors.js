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
