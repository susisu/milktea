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
    module_accessor  = require("./lib/accessor.js"),
    module_date      = require("./lib/date.js"),
    module_regexp    = require("./lib/regexp.js");

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

prelude["id"]      = module_general.__id__;
prelude["const"]   = module_general.__const__;
prelude["trace"]   = module_general.__trace__;
prelude["error"]   = module_general.__error__;
prelude["typeOf"]  = module_general.__typeOf__;
prelude["max"]     = module_general.__max__;
prelude["min"]     = module_general.__min__;
prelude["=="]      = module_general.__equalTo__
prelude["/="]      = module_general.__notEqualTo__
prelude["<"]       = module_general.__lessThan__
prelude["<="]      = module_general.__lessThanOrEqualTo__
prelude[">"]       = module_general.__greaterThan__
prelude[">="]      = module_general.__greaterThanOrEqualTo__
prelude["compare"] = module_general.__compare__;

prelude["createObject"] = module_object.__createObject__;
prelude["Object"]       = module_object.__Object__;
prelude["Class"]        = module_object.__Class__;
prelude["isObject"]     = module_object.__isObject__;
prelude["instanceOf"]   = module_object.__instanceOf__;
prelude["delete"]       = module_object.__delete__;
prelude["assign"]       = module_object.__assign__;
prelude["orphan"]       = module_object.__orphan__;

prelude["Unit"]   = module_unit.__Unit__;
prelude["isUnit"] = module_unit.__isUnit__;
prelude["void"]   = module_unit.__void__;

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

prelude["String"]          = module_string.__String__;
prelude["isString"]        = module_string.__isString__;
prelude["charAt"]          = module_string.__charAt__;
prelude["charCodeAt"]      = module_string.__charCodeAt__;
prelude["charCode"]        = module_string.__charCode__;
prelude["fromCharCode"]    = module_string.__fromCharCode__;
prelude["strlen"]          = module_string.__length__;
prelude["strempty"]        = module_string.__empty__;
prelude["toUpperCase"]     = module_string.__toUpperCase__;
prelude["toLowerCase"]     = module_string.__toLowerCase__;
prelude["strrev"]          = module_string.__reverse__;
prelude["strcat"]          = module_string.__concat__;
prelude["++"]              = module_string.__concat__;
prelude["split"]           = module_string.__split__;
prelude["lines"]           = module_string.__lines__;
prelude["words"]           = module_string.__words__;
prelude["trim"]            = module_string.__trim__;
prelude["strslice"]        = module_string.__slice__;
prelude["indexOfFrom"]     = module_string.__indexOfFrom__;
prelude["indexOf"]         = module_string.__indexOf__;
prelude["lastIndexOfFrom"] = module_string.__lastIndexOfFrom__;
prelude["lastIndexOf"]     = module_string.__lastIndexOf__;

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
prelude["modifyRef"]   = module_reference.__modifyRef__;

prelude["Array"]             = module_array.__Array__;
prelude["isArray"]           = module_array.__isArray__;
prelude["newArray"]          = module_array.__newArray__;
prelude["readArray"]         = module_array.__readArray__;
prelude["!!"]                = module_array.__readArray__;
prelude["writeArray"]        = module_array.__writeArray__;
prelude["pop"]               = module_array.__pop__;
prelude["push"]              = module_array.__push__;
prelude["shift"]             = module_array.__shift__;
prelude["unshift"]           = module_array.__unshift__;
prelude["head"]              = module_array.__head__;
prelude["last"]              = module_array.__last__;
prelude["tail"]              = module_array.__tail__;
prelude["init"]              = module_array.__init__;
prelude["fst"]               = module_array.__fst__;
prelude["snd"]               = module_array.__snd__;
prelude["length"]            = module_array.__length__;
prelude["empty"]             = module_array.__empty__;
prelude["reverse"]           = module_array.__reverse__;
prelude["concat"]            = module_array.__concat__;
prelude["join"]              = module_array.__join__;
prelude["map"]               = module_array.__map__;
prelude["map_"]              = module_array.__map$__;
prelude["for"]               = module_array.__for__;
prelude["for_"]              = module_array.__for$__;
prelude["foldl"]             = module_array.__foldl__;
prelude["foldl1"]            = module_array.__foldl1__;
prelude["foldr"]             = module_array.__foldr__;
prelude["foldr1"]            = module_array.__foldr1__;
prelude["all"]               = module_array.__all__;
prelude["any"]               = module_array.__any__;
prelude["sum"]               = module_array.__sum__;
prelude["product"]           = module_array.__product__;
prelude["maximum"]           = module_array.__maximum__;
prelude["minimum"]           = module_array.__minimum__;
prelude["take"]              = module_array.__take__;
prelude["drop"]              = module_array.__drop__;
prelude["takeWhile"]         = module_array.__takeWhile__;
prelude["dropWhile"]         = module_array.__dropWhile__;
prelude["slice"]             = module_array.__slice__;
prelude["sortBy"]            = module_array.__sortBy__;
prelude["sort"]              = module_array.__sort__;
prelude["sortOn"]            = module_array.__sortOn__;
prelude["findIndexFrom"]     = module_array.__findIndexFrom__;
prelude["findIndex"]         = module_array.__findIndex__;
prelude["findLastIndexFrom"] = module_array.__findLastIndexFrom__;
prelude["findLastIndex"]     = module_array.__findLastIndex__;
prelude["elemIndexFrom"]     = module_array.__elemIndexFrom__;
prelude["elemIndex"]         = module_array.__elemIndex__;
prelude["elemLastIndexFrom"] = module_array.__elemLastIndexFrom__;
prelude["elemLastIndex"]     = module_array.__elemLastIndex__;
prelude["elem"]              = module_array.__elem__;
prelude["notElem"]           = module_array.__notElem__;
prelude["zip"]               = module_array.__zip__;
prelude["zipWith"]           = module_array.__zipWith__;

prelude["toObject"]        = module_accessor.__toObject__;
prelude["readProperty"]    = module_accessor.__readProperty__;
prelude["callMethod"]      = module_accessor.__callMethod__;
prelude["writeProperty"]   = module_accessor.__writeProperty__;
prelude["checkProperty"]   = module_accessor.__checkProperty__;
prelude["readPropertyOf"]  = module_accessor.__readPropertyOf__;
prelude["callMethodOf"]    = module_accessor.__callMethodOf__;
prelude["writePropertyOf"] = module_accessor.__writePropertyOf__;
prelude["checkPropertyOf"] = module_accessor.__checkPropertyOf__;

prelude["Date"] = module_date.__Date__;

prelude["RegExp"]        = module_regexp.__RegExp__;
prelude["splitRE"]       = module_regexp.__splitRE__;
prelude["replaceRE"]     = module_regexp.__replaceRE__;
prelude["replaceREWith"] = module_regexp.__replaceREWith__;

end_module();
