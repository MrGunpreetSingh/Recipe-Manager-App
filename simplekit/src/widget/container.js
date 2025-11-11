"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SKContainer = void 0;
var layout_1 = require("../layout");
var imperative_mode_1 = require("../imperative-mode");
var element_1 = require("./element");
var SKContainer = /** @class */ (function (_super) {
    __extends(SKContainer, _super);
    function SKContainer(_a) {
        if (_a === void 0) { _a = {}; }
        var _this = this;
        var _b = _a.layoutMethod, layoutMethod = _b === void 0 ? "default" : _b, elementProps = __rest(_a, ["layoutMethod"]);
        _this = _super.call(this, elementProps) || this;
        _this._radius = 0;
        //#region managing children
        _this._children = [];
        _this._layoutMethod =
            layoutMethod !== "default"
                ? layoutMethod
                : new layout_1.Layout.FixedLayout();
        return _this;
    }
    Object.defineProperty(SKContainer.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        set: function (r) {
            this._radius = r;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKContainer.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: false,
        configurable: true
    });
    SKContainer.prototype.addChild = function (element) {
        this._children.push(element);
        (0, imperative_mode_1.invalidateLayout)();
    };
    SKContainer.prototype.removeChild = function (element) {
        this._children = this._children.filter(function (el) { return el != element; });
        (0, imperative_mode_1.invalidateLayout)();
    };
    SKContainer.prototype.clearChildren = function () {
        this._children = [];
        (0, imperative_mode_1.invalidateLayout)();
    };
    Object.defineProperty(SKContainer.prototype, "layoutMethod", {
        set: function (method) {
            this._layoutMethod =
                method !== "default" ? method : new layout_1.Layout.FixedLayout();
            (0, imperative_mode_1.invalidateLayout)();
        },
        enumerable: false,
        configurable: true
    });
    SKContainer.prototype.measure = function () {
        if (this._children.length > 0) {
            var size = this._layoutMethod.measure(this._children);
            this.contentWidth = size.width;
            this.contentHeight = size.height;
        }
        _super.prototype.measure.call(this);
    };
    SKContainer.prototype.layout = function (width, height) {
        // first layout the children
        if (this._children.length > 0) {
            // calculate content area of container to layout elements
            var w = width - this.padding * 2 - this.margin * 2;
            var h = height - this.padding * 2 - this.margin * 2;
            // run the layout method
            this._layoutMethod.layout(w, h, this._children);
        }
        // now layout the container itself
        var size = _super.prototype.layout.call(this, width, height);
        return size;
    };
    //#endregion
    SKContainer.prototype.draw = function (gc) {
        gc.save();
        // set coordinate system to padding box
        gc.translate(this.margin, this.margin);
        var w = this.paddingBox.width;
        var h = this.paddingBox.height;
        // draw background colour if set
        if (this.fill) {
            gc.beginPath();
            gc.roundRect(this.x, this.y, w, h, this._radius);
            gc.fillStyle = this.fill;
            gc.fill();
        }
        // draw border if set
        if (this.border) {
            gc.strokeStyle = this.border;
            gc.lineWidth = 1;
            // gc.strokeRect(
            //   0,
            //   0,
            //   this.paddingBox.width,
            //   this.paddingBox.height
            // );
            gc.stroke();
        }
        gc.restore();
        // let element draw debug if flag is set
        _super.prototype.draw.call(this, gc);
        // now draw all the children
        gc.save();
        // set coordinate system to container content box
        gc.translate(this.x, this.y);
        gc.translate(this.margin, this.margin);
        gc.translate(this.padding, this.padding);
        // draw children
        this._children.forEach(function (el) { return el.draw(gc); });
        gc.restore();
    };
    SKContainer.prototype.toString = function (short) {
        if (short === void 0) { short = true; }
        var out = "SKContainer '".concat(this.fill, "'") + (this.id ? " '".concat(this.id, "'") : "");
        if (short) {
            return out;
        }
        else {
            return out + " " + this.boxModelToString();
        }
    };
    return SKContainer;
}(element_1.SKElement));
exports.SKContainer = SKContainer;
