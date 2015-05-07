/*
 * milktea : prelude.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = prelude;
}

var prim = require("./prelude/prim.js");
var base = require("./prelude/base.js");

var prelude = Object.create(null);

prim.open(prelude);
base.open(prelude);

Object.freeze(prelude)

end_module();
