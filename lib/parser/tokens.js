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

var lq = require("loquat");

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
