/*
 * milktea : prelude.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze(prelude);
}

var module_general   = require("./lib/general.js"),
    module_object    = require("./lib/object.js"),
    module_unit      = require("./lib/unit.js"),
    module_number    = require("./lib/number.js"),
    module_string    = require("./lib/string.js"),
    module_bool      = require("./lib/bool.js"),
    module_function  = require("./lib/function.js"),
    module_reference = require("./lib/reference.js"),
    module_array     = require("./lib/array.js"),
    module_accessor  = require("./lib/accessor.js");

var prelude = Object.create(null);

prelude["__negate__"]          = module_number.__negate__;
prelude["__createObject__"]    = module_object.__createObject__;
prelude["__Object__proto__"]   = module_object.__Object__proto__;
prelude["__readProperty__"]    = module_accessor.__readProperty__;
prelude["__callMethod__"]      = module_accessor.__callMethod__;
prelude["__writeProperty__"]   = module_accessor.__writeProperty__;
prelude["__checkProperty__"]   = module_accessor.__checkProperty__;
prelude["__readPropertyOf__"]  = module_accessor.__readPropertyOf__;
prelude["__callMethodOf__"]    = module_accessor.__callMethodOf__;
prelude["__writePropertyOf__"] = module_accessor.__writePropertyOf__;
prelude["__checkPropertyOf__"] = module_accessor.__checkPropertyOf__;

prelude["id"]     = module_general.__id__;
prelude["const"]  = module_general.__const__;
prelude["trace"]  = module_general.__trace__;
prelude["error"]  = module_general.__error__;
prelude["typeOf"] = module_general.__typeOf__;
prelude["max"]    = module_general.__max__;
prelude["min"]    = module_general.__min__;
prelude["=="]     = module_general.__equalTo__
prelude["/="]     = module_general.__notEqualTo__
prelude["<"]      = module_general.__lessThan__
prelude["<="]     = module_general.__lessThanOrEqualTo__
prelude[">"]      = module_general.__greaterThan__
prelude[">="]     = module_general.__greaterThanOrEqualTo__

prelude["createObject"] = module_object.__createObject__;
prelude["Object"]       = module_object.__Object__;
prelude["Class"]        = module_object.__Class__;
prelude["isObject"]     = module_object.__isObject__;
prelude["instanceOf"]   = module_object.__instanceOf__;
prelude["extends"]      = module_object.__extends__;

prelude["Unit"]   = module_unit.__Unit__;
prelude["isUnit"] = module_unit.__isUnit__;

prelude["Number"]    = module_number.__Number__;
prelude["isNumber"]  = module_number.__isNumber__;
prelude["isNaN"]     = module_number.__isNaN__;
prelude["isFinite"]  = module_number.__isFinite__;
prelude["isInteger"] = module_number.__isInteger__;
prelude["toInteger"] = module_number.__toInteger__;
prelude["negate"]    = module_number.__negate__;
prelude["add"]       = module_number.__abs__;
prelude["signum"]    = module_number.__signum__;
prelude["+"]         = module_number.__add__;
prelude["-"]         = module_number.__sub__;
prelude["*"]         = module_number.__mul__;
prelude["/"]         = module_number.__div__;
prelude["mod"]       = module_number.__mod__;
prelude["**"]        = module_number.__pow__;
prelude["round"]     = module_number.__round__;
prelude["ceiling"]   = module_number.__ceiling__;
prelude["floor"]     = module_number.__floor__;
prelude["sqrt"]      = module_number.__sqrt__;
prelude["exp"]       = module_number.__exp__;
prelude["log"]       = module_number.__log__;
prelude["logBase"]   = module_number.__logBase__;
prelude["sin"]       = module_number.__sin__;
prelude["cos"]       = module_number.__cos__;
prelude["tan"]       = module_number.__tan__;
prelude["asin"]      = module_number.__asin__;
prelude["acos"]      = module_number.__acos__;
prelude["atan"]      = module_number.__atan__;
prelude["atan2"]     = module_number.__atan2__;

prelude["String"]     = module_string.__String__;
prelude["isString"]   = module_string.__isString__;
prelude["charAt"]     = module_string.__charAt__;
prelude["charCodeAt"] = module_string.__charCodeAt__;
prelude["strlen"]     = module_string.__length__;
prelude["strempty"]   = module_string.__empty__;
prelude["strrev"]     = module_string.__reverse__;
prelude["strcat"]     = module_string.__concat__;
prelude["++"]         = module_string.__concat__;

prelude["Bool"]   = module_bool.__Bool__;
prelude["isBool"] = module_bool.__isBool__;
prelude["not"]    = module_bool.__not__;
prelude["&&"]     = module_bool.__and__;
prelude["||"]     = module_bool.__or__;

prelude["Function"]   = module_function.__Function__;
prelude["isFunction"] = module_function.__isFunction__;
prelude["@"]          = module_function.__compose__;
prelude["flip"]       = module_function.__flip__;
prelude["$"]          = module_function.__apply__;
prelude["&"]          = module_function.__reverseApply__;
prelude["on"]         = module_function.__on__;

prelude["Reference"]   = module_reference.__Reference__;
prelude["isReference"] = module_reference.__isReference__;
prelude["ref"]         = module_reference.__ref__;
prelude["readRef"]     = module_reference.__readRef__;
prelude["writeRef"]    = module_reference.__writeRef__;
prelude[":="]          = module_reference.__writeRef__;

prelude["Array"]      = module_array.__Array__;
prelude["isArray"]    = module_array.__isArray__;
prelude["newArray"]   = module_array.__newArray__;
prelude["readArray"]  = module_array.__readArray__;
prelude["!!"]         = module_array.__readArray__;
prelude["writeArray"] = module_array.__writeArray__;
prelude["pop"]        = module_array.__pop__;
prelude["push"]       = module_array.__push__;
prelude["shift"]      = module_array.__shift__;
prelude["unshift"]    = module_array.__unshift__;
prelude["head"]       = module_array.__head__;
prelude["last"]       = module_array.__last__;
prelude["tail"]       = module_array.__tail__;
prelude["init"]       = module_array.__init__;
prelude["length"]     = module_array.__length__;
prelude["empty"]      = module_array.__empty__;
prelude["reverse"]    = module_array.__reverse__;
prelude["concat"]     = module_array.__concat__;
prelude["map"]        = module_array.__map__;
prelude["map_"]       = module_array.__map$__;
prelude["foldl"]      = module_array.__foldl__;
prelude["foldl1"]     = module_array.__foldl1__;
prelude["foldr"]      = module_array.__foldr__;
prelude["foldr1"]     = module_array.__foldr1__;
prelude["all"]        = module_array.__all__;
prelude["any"]        = module_array.__any__;
prelude["sum"]        = module_array.__sum__;
prelude["product"]    = module_array.__product__;
prelude["maximum"]    = module_array.__maximum__;
prelude["minimum"]    = module_array.__minimum__;

prelude["toObject"]        = module_accessor.__toObject__;
prelude["readProperty"]    = module_accessor.__readProperty__;
prelude["callMethod"]      = module_accessor.__callMethod__;
prelude["writeProperty"]   = module_accessor.__writeProperty__;
prelude["checkProperty"]   = module_accessor.__checkProperty__;
prelude["readPropertyOf"]  = module_accessor.__readPropertyOf__;
prelude["callMethodOf"]    = module_accessor.__callMethodOf__;
prelude["writePropertyOf"] = module_accessor.__writePropertyOf__;
prelude["checkPropertyOf"] = module_accessor.__checkPropertyOf__;

end_module();
