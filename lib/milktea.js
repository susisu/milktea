/*
 * milktea : milktea.js
 * copyright (c) 2015 Susisu
 */

/**
 * @file milktea - a functional object-oriented script language interpreter
 * @copyright (c) 2015 Susisu
 * @license MIT
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "core"   : require("./core.js"),
        "errors" : require("./errors.js"),
        "parser" : require("./parser.js"),
        "lib"    : require("./lib.js"),
        "prelude": require("./prelude.js")
    });
}

end_module();
