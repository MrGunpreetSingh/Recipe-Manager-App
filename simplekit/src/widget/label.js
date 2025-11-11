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
exports.SKLabel = void 0;
var utility_1 = require("../utility");
var element_1 = require("./element");
var style_1 = require("./style");
var dispatch_1 = require("../dispatch");
var SKLabel = /** @class */ (function (_super) {
    __extends(SKLabel, _super);
    function SKLabel(_a) {
        if (_a === void 0) { _a = {}; }
        var _this = this;
        var _b = _a.text, text = _b === void 0 ? "?" : _b, _c = _a.align, align = _c === void 0 ? "centre" : _c, elementProps = __rest(_a, ["text", "align"]);
        _this = _super.call(this, elementProps) || this;
        _this._font = style_1.Style.font;
        _this._text = "";
        _this._radius = 0;
        _this._fontColour = style_1.Style.fontColour;
        _this.padding = style_1.Style.textPadding;
        _this.text = text;
        _this.align = align;
        // defaults
        _this.fill = "";
        _this.border = "";
        return _this;
    }
    Object.defineProperty(SKLabel.prototype, "font", {
        get: function () {
            return this._font;
        },
        set: function (f) {
            this._font = f;
            this.sizeChanged();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKLabel.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (t) {
            this._text = t;
            this.sizeChanged();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKLabel.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        set: function (r) {
            this._radius = r;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKLabel.prototype, "fontColour", {
        get: function () {
            return this._fontColour;
        },
        set: function (c) {
            this._fontColour = c;
        },
        enumerable: false,
        configurable: true
    });
    SKLabel.prototype.updateContentSize = function () {
        if (!this.recalculateSize)
            return;
        var m = (0, utility_1.measureText)(this.text, this.font);
        if (!m) {
            console.warn("measureText failed in SKLabel for ".concat(this.text));
            return;
        }
        this.contentHeight = m.height;
        this.contentWidth = m.width;
        this.recalculateSize = false;
    };
    // no events on a label
    SKLabel.prototype.handleKeyboardEvent = function (ke) {
        return false;
    };
    // no events on a label except for clearing focus
    SKLabel.prototype.handleMouseEvent = function (me) {
        // clear focus
        if (me.type === "mousedown") {
            (0, dispatch_1.requestKeyboardFocus)(null);
        }
        return false;
    };
    // no events on a label
    SKLabel.prototype.handleMouseEventCapture = function (me) {
        return false;
    };
    SKLabel.prototype.addEventListener = function (type, handler, capture) {
        // no events on a label
        console.warn("SKLabel does not support events");
    };
    SKLabel.prototype.draw = function (gc) {
        gc.save();
        var w = this.paddingBox.width;
        var h = this.paddingBox.height;
        //gc.translate(this.x, this.y);
        gc.translate(this.margin, this.margin);
        if (this.fill) {
            gc.beginPath();
            gc.roundRect(this.x, this.y, w, h, this._radius);
            gc.fillStyle = this.fill;
            gc.fill();
        }
        if (this.border) {
            gc.strokeStyle = this.border;
            gc.lineWidth = 1;
            gc.stroke();
        }
        // render text
        gc.font = this.font;
        gc.fillStyle = this._fontColour;
        gc.textBaseline = "middle";
        // // clipping rectangle
        // gc.beginPath();
        // gc.rect(0, 0, w, h);
        // gc.clip();
        switch (this.align) {
            case "left":
                gc.textAlign = "left";
                gc.fillText(this.text, this.x + this.padding, this.y + h / 2);
                break;
            case "centre":
                gc.textAlign = "center";
                gc.fillText(this.text, this.x + w / 2, this.y + h / 2);
                break;
            case "right":
                gc.textAlign = "right";
                gc.fillText(this.text, this.x + w - this.padding, this.y + h / 2);
                break;
        }
        gc.restore();
        // element draws debug viz if flag is set
        _super.prototype.draw.call(this, gc);
    };
    SKLabel.prototype.toString = function () {
        return "SKLabel '".concat(this.text, "'");
    };
    return SKLabel;
}(element_1.SKElement));
exports.SKLabel = SKLabel;
