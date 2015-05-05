/*
 * milktea : parser/tokens.js
 * copyright (c) 2015 Susisu
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
        "ReservedWord"    : ReservedWord,
        "ReservedOperator": ReservedOperator,
        "Symbol"          : Symbol
    });
}

var lq = require("loquat");

function Token(pos) {
    this.pos = pos;
}

Token.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Token
    },
    "toString": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            return "unknown token";
        }
    }
});

function NaturalLiteral(pos, value) {
    Token.call(this, pos);
    this.value = value;
}

NaturalLiteral.prototype = Object.create(Token.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": NaturalLiteral
    },
    "toString": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            return "number " + this.value.toString();
        }
    }
});

function FloatLiteral(pos, value) {
    Token.call(this, pos);
    this.value = value;
}

FloatLiteral.prototype = Object.create(Token.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": FloatLiteral
    },
    "toString": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            return "number " + this.value.toString();
        }
    }
});

function StringLiteral(pos, value) {
    Token.call(this, pos);
    this.value = value;
}

StringLiteral.prototype = Object.create(Token.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": StringLiteral
    },
    "toString": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            return "string " + lq.show(this.value);
        }
    }
});

function BoolLiteral(pos, value) {
    Token.call(this, pos);
    this.value = value;
}

BoolLiteral.prototype = Object.create(Token.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": BoolLiteral
    },
    "toString": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            return "bool " + (this.value ? "True" : "False");
        }
    }
});

function NullLiteral(pos) {
    Token.call(this, pos);
}

NullLiteral.prototype = Object.create(Token.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": NullLiteral
    },
    "toString": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            return "Null";
        }
    }
});

function Identifier(pos, name) {
    Token.call(this, pos);
    this.name = name;
}

Identifier.prototype = Object.create(Token.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Identifier
    },
    "toString": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            return "identifier '" + this.name + "'";
        }
    }
});

function Operator(pos, name) {
    Token.call(this, pos);
    this.name = name;
}

Operator.prototype = Object.create(Token.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Operator
    },
    "toString": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            return "operator " + this.name;
        }
    }
});

function InfixIdentifier(pos, name) {
    Token.call(this, pos);
    this.name = name;
}

InfixIdentifier.prototype = Object.create(Token.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": InfixIdentifier
    },
    "toString": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            return "operator `" + this.name + "`";
        }
    }
});

function ReservedWord(pos, name) {
    Token.call(this, pos);
    this.name = name;
}

ReservedWord.prototype = Object.create(Token.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": ReservedWord
    },
    "toString": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            return "reserved word '" + this.name + "'";
        }
    }
});

function ReservedOperator(pos, name) {
    Token.call(this, pos);
    this.name = name;
}

ReservedOperator.prototype = Object.create(Token.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": ReservedOperator
    },
    "toString": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            return this.name;
        }
    }
});

function Symbol(pos, name) {
    Token.call(this, pos);
    this.name = name;
}

Symbol.prototype = Object.create(Token.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Symbol
    },
    "toString": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            return this.name;
        }
    }
});

end_module();
