/*
 * milktea : lib.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "modules": {
            "general"  : require("./lib/general.js"),
            "object"   : require("./lib/object.js"),
            "unit"     : require("./lib/unit.js"),
            "number"   : require("./lib/number.js"),
            "string"   : require("./lib/string.js"),
            "bool"     : require("./lib/bool.js"),
            "function" : require("./lib/function.js"),
            "reference": require("./lib/reference.js"),
            "array"    : require("./lib/array.js"),
            "accessor" : require("./lib/accessor.js"),
            "date"     : require("./lib/date.js"),
            "regexp"   : require("./lib/regexp.js"),
        },
        "utils": require("./lib/utils.js")
    });
}

end_module();
