"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrapRowLayout = void 0;
var settings_1 = require("../settings");
var WrapRowLayout = /** @class */ (function () {
    function WrapRowLayout(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.gap, gap = _c === void 0 ? 0 : _c;
        this.gap = gap;
    }
    WrapRowLayout.prototype.measure = function (elements) {
        // measure all children first
        elements.forEach(function (el) {
            el.measure();
        });
        // find the widest element
        var minWidth = elements.reduce(function (acc, el) { return Math.max(acc, el.intrinsicWidth); }, 0);
        // find the tallest element
        var minHeight = elements.reduce(function (acc, el) { return Math.max(acc, el.intrinsicHeight); }, 0);
        // return minimum layout size
        return {
            width: minWidth,
            height: minHeight,
        };
    };
    WrapRowLayout.prototype.layout = function (width, height, elements) {
        var _this = this;
        var newBounds = { width: 0, height: 0 };
        var x = 0;
        var y = 0;
        var rowHeight = 0;
        elements.forEach(function (el) {
            // layout the element
            el.layout(el.intrinsicWidth, el.intrinsicHeight);
            if (settings_1.Settings.layoutWarnings && el.intrinsicWidth > width) {
                // warn if element overflows
                console.warn("element ".concat(el.toString(), " horizontal overflow"));
            }
            else if (x + el.intrinsicWidth > width) {
                // wrap to next row and clear rowHeight
                x = 0;
                y += rowHeight + _this.gap;
                rowHeight = 0;
            }
            // set the element position
            el.x = x;
            el.y = y;
            // update the row height
            rowHeight = Math.max(rowHeight, el.intrinsicHeight);
            // get x ready for next element
            x += el.intrinsicWidth + _this.gap;
            // update bounds that were actually used
            newBounds.width = Math.max(newBounds.width, el.intrinsicWidth);
            newBounds.height = Math.max(newBounds.height, y + rowHeight);
        });
        // warn if rows of elements overflow
        if (settings_1.Settings.layoutWarnings && newBounds.height > height) {
            console.warn("".concat((newBounds.height - height).toFixed(1), " vertical overflow"));
        }
        return newBounds;
    };
    return WrapRowLayout;
}());
exports.WrapRowLayout = WrapRowLayout;
