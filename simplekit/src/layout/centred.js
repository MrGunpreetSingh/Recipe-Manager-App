"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CentredLayout = void 0;
var settings_1 = require("../settings");
var CentredLayout = /** @class */ (function () {
    function CentredLayout() {
    }
    CentredLayout.prototype.measure = function (elements) {
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
    CentredLayout.prototype.layout = function (width, height, elements) {
        var newBounds = { width: 0, height: 0 };
        // stacks all children in the centre of the container
        elements.forEach(function (el) {
            // elements can fill the width or height of the parent
            var w = el.fillWidth ? width : el.intrinsicWidth;
            var h = el.fillHeight ? height : el.intrinsicHeight;
            // layout the element
            el.layout(w, h);
            // centre element
            el.x = width / 2 - el.layoutWidth / 2;
            el.y = height / 2 - el.layoutHeight / 2;
            // warn if element is outside bounds
            if (settings_1.Settings.layoutWarnings &&
                (el.x < 0 ||
                    el.y < 0 ||
                    el.x + el.layoutWidth > width ||
                    el.y + el.layoutHeight > height)) {
                console.warn("element ".concat(el.toString(), " outside parent bounds"));
            }
            // update bounds that were actually used
            // note, we ignore margins for fixed layout
            newBounds.width = Math.max(newBounds.width, el.layoutWidth);
            newBounds.height = Math.max(newBounds.height, el.layoutHeight);
        });
        return newBounds;
    };
    return CentredLayout;
}());
exports.CentredLayout = CentredLayout;
