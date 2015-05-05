/*
 * milktea : milktea.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "core"   : require("./core.js"),
        "errors" : require("./errors.js"),
        "parser" : require("./parser.js"),
        "prelude": require("./prelude.js")
    });
}

end_module();
