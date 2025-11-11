"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FillRowLayout = void 0;
var settings_1 = require("../settings");
var FillRowLayout = /** @class */ (function () {
    function FillRowLayout(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.gap, gap = _c === void 0 ? 0 : _c;
        this.gap = gap;
    }
    FillRowLayout.prototype.measure = function (elements) {
        // measure all children first
        elements.forEach(function (el) {
            el.measure();
        });
        // min layout width is sum of al element widths
        // with gaps between elements
        var totalWidth = elements.reduce(function (acc, el) { return acc + el.intrinsicWidth; }, 0) +
            (elements.length - 1) * this.gap;
        // height is height of tallest element
        var totalHeight = elements.reduce(function (acc, el) { return Math.max(acc, el.intrinsicHeight); }, 0);
        // return minimum layout size
        return {
            width: totalWidth,
            height: totalHeight,
        };
    };
    FillRowLayout.prototype.layout = function (width, height, elements) {
        var _this = this;
        // get fixed width elements
        var fixedElements = elements.filter(function (el) { return el.fillWidth === 0; });
        // get space used by elements with fixed width
        var fixedElementsWidth = fixedElements.reduce(function (acc, el) { return acc + el.intrinsicWidth; }, 0);
        // calculate space to distribute elements
        var available = width - (elements.length - 1) * this.gap;
        var remaining = available - fixedElementsWidth;
        if (settings_1.Settings.debugLayout) {
            console.log(" FillRowLayout: ".concat(fixedElements.length, " fixed elements need ").concat(fixedElementsWidth, "px, ").concat(elements.length - fixedElements.length, " elements to fill ").concat(remaining, "px"));
        }
        if (settings_1.Settings.layoutWarnings && remaining < 0) {
            console.warn("fillRowLayout: not enough space (container:".concat(width, " < children:").concat(fixedElementsWidth, ") "));
        }
        // get total fill proportion
        var fillTotal = elements.reduce(function (acc, el) { return acc + el.fillWidth; }, 0);
        // first element starts at top left
        var x = 0;
        var y = 0;
        var rowHeight = 0;
        elements.forEach(function (el) {
            // set element position
            el.x = x;
            el.y = y;
            // calculate element size
            var w = el.fillWidth === 0
                ? el.intrinsicWidth
                : (el.fillWidth / fillTotal) * remaining;
            // elements can expand vertically too
            var h = el.fillHeight === 0 ? el.intrinsicHeight : height;
            // layout the element in the allotted space
            el.layout(w, h);
            // update row height
            rowHeight = Math.max(rowHeight, el.layoutHeight);
            // ready for next x position
            x += w + _this.gap;
        });
        // calculate bounds used for layout
        var rightElement = elements.slice(-1)[0];
        return {
            width: rightElement.x + rightElement.layoutWidth,
            height: rowHeight,
        };
    };
    return FillRowLayout;
}());
exports.FillRowLayout = FillRowLayout;
