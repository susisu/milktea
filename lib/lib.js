/*
 * milktea : lib.js
 * copyright (c) 2015 Susisu
 */

/**
 * @module lib
 */

"use strict";

function end_module() {
    module.exports = Object.freeze(/** @lends module:lib */ {
        /**
         * @see module:lib/general
         * @see module:lib/object
         * @see module:lib/unit
         * @see module:lib/number
         * @see module:lib/string
         * @see module:lib/bool
         * @see module:lib/function
         * @see module:lib/reference
         * @see module:lib/array
         * @see module:lib/accessor
         * @see module:lib/date
         * @see module:lib/regexp
         */
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
        /**
         * @see module:lib/utils
         */
        "utils": require("./lib/utils.js")
    });
}

end_module();
