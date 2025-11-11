"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = void 0;
exports.sizeToString = sizeToString;
var fixed_1 = require("./fixed");
var centred_1 = require("./centred");
var wrapRow_1 = require("./wrapRow");
var fillRow_1 = require("./fillRow");
// keep layout methods in one place
exports.Layout = {
    FixedLayout: fixed_1.FixedLayout,
    CentredLayout: centred_1.CentredLayout,
    WrapRowLayout: wrapRow_1.WrapRowLayout,
    FillRowLayout: fillRow_1.FillRowLayout,
};
function sizeToString(w, h) {
    return "".concat(w ? Math.round(w * 10) / 10 : w, " x ").concat(h ? Math.round(h * 10) / 10 : h);
}
