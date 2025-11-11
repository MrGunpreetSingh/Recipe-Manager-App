"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedLayout = void 0;
var settings_1 = require("../settings");
var FixedLayout = /** @class */ (function () {
    function FixedLayout() {
    }
    FixedLayout.prototype.measure = function (elements) {
        var newBounds = { width: 0, height: 0 };
        // measure all children and calculate new bounds
        elements.forEach(function (el) {
            el.measure();
            // bounds that's needed to fit all elements
            newBounds.width = Math.max(newBounds.width, el.x + el.intrinsicWidth);
            newBounds.height = Math.max(newBounds.height, el.y + el.intrinsicHeight);
        });
        return newBounds;
    };
    FixedLayout.prototype.layout = function (width, height, elements) {
        var newBounds = { width: 0, height: 0 };
        // layout all children and calculate new bounds
        elements.forEach(function (el) {
            el.layout(el.intrinsicWidth, el.intrinsicHeight);
            // warn if element is outside bounds
            if (settings_1.Settings.layoutWarnings &&
                (el.x < 0 ||
                    el.y < 0 ||
                    el.x + el.layoutWidth > width ||
                    el.y + el.layoutHeight > height)) {
                console.warn("element ".concat(el.toString(), " outside parent bounds"));
            }
            // bounds that were actually used
            newBounds.width = Math.max(newBounds.width, el.x + el.layoutWidth);
            newBounds.height = Math.max(newBounds.height, el.y + el.layoutHeight);
        });
        return newBounds;
    };
    return FixedLayout;
}());
exports.FixedLayout = FixedLayout;
