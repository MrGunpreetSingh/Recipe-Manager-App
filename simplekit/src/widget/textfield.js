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
exports.SKTextfield = void 0;
var utility_1 = require("../utility");
var dispatch_1 = require("../dispatch");
var element_1 = require("./element");
var style_1 = require("./style");
var SKTextfield = /** @class */ (function (_super) {
    __extends(SKTextfield, _super);
    function SKTextfield(_a) {
        if (_a === void 0) { _a = {}; }
        var _this = this;
        var _b = _a.text, text = _b === void 0 ? "" : _b, _c = _a.fill, fill = _c === void 0 ? "white" : _c, elementProps = __rest(_a, ["text", "fill"]);
        _this = _super.call(this, elementProps) || this;
        _this.state = "idle";
        _this.focus = false;
        _this._font = style_1.Style.font;
        _this._text = "";
        _this._radius = 0;
        _this._fontColour = style_1.Style.fontColour;
        _this._highlightColour = style_1.Style.highlightColour;
        _this.textWidth = 0;
        _this.padding = style_1.Style.textPadding;
        _this.text = text;
        _this.fill = fill;
        return _this;
    }
    Object.defineProperty(SKTextfield.prototype, "font", {
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
    Object.defineProperty(SKTextfield.prototype, "text", {
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
    Object.defineProperty(SKTextfield.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        set: function (r) {
            this._radius = r;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKTextfield.prototype, "fontColour", {
        get: function () {
            return this._fontColour;
        },
        set: function (c) {
            this._fontColour = c;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKTextfield.prototype, "highlightColour", {
        get: function () {
            return this._highlightColour;
        },
        set: function (hc) {
            this._highlightColour = hc;
        },
        enumerable: false,
        configurable: true
    });
    SKTextfield.prototype.updateContentSize = function () {
        var m = (0, utility_1.measureText)(this.text, this._font);
        if (!m) {
            console.warn("measureText failed in SKTextfield for ".concat(this.text));
            return;
        }
        this.contentHeight = m.height;
        this.contentWidth = m.width;
        this.textWidth = m.width;
    };
    SKTextfield.prototype.applyEdit = function (text, key) {
        if (key == "Backspace") {
            return text.slice(0, -1);
        }
        else if (key.length == 1) {
            return text + key;
        }
        else
            return text;
    };
    SKTextfield.prototype.handleKeyboardEvent = function (ke) {
        switch (ke.type) {
            case "focusout":
                this.focus = false;
                break;
            case "focusin":
                this.focus = true;
                break;
            case "keydown":
                if (this.focus && ke.key) {
                    this.text = this.applyEdit(this.text, ke.key);
                }
                if (this.sendEvent({
                    source: this,
                    timeStamp: ke.timeStamp,
                    type: "textchanged",
                }))
                    return true;
                break;
        }
        if (_super.prototype.handleKeyboardEvent.call(this, ke))
            return true;
        return false;
    };
    SKTextfield.prototype.handleMouseEvent = function (me) {
        switch (me.type) {
            case "mouseenter":
                this.state = "hover";
                break;
            case "mouseexit":
                this.state = "idle";
                break;
            case "click":
                break;
            case "mousedown":
                (0, dispatch_1.requestKeyboardFocus)(this);
                return true;
                break;
            case "mouseup":
                break;
        }
        if (_super.prototype.handleMouseEvent.call(this, me))
            return true;
        return false;
    };
    SKTextfield.prototype.draw = function (gc) {
        var w = this.paddingBox.width;
        var h = this.paddingBox.height;
        gc.save();
        gc.translate(this.x, this.y);
        gc.translate(this.margin, this.margin);
        // thick highlight rect
        if (this.state == "hover") {
            gc.beginPath();
            gc.roundRect(0, 0, w, h, this._radius);
            gc.strokeStyle = this._highlightColour;
            gc.lineWidth = 8;
            gc.stroke();
        }
        // border
        gc.beginPath();
        gc.roundRect(0, 0, w, h, this._radius);
        gc.fillStyle = this.fill;
        gc.fill();
        gc.lineWidth = 1;
        gc.strokeStyle = this.focus ? "mediumblue" : this.border;
        gc.stroke();
        // clip text if it's wider than text area
        // TODO: could scroll text if it's wider than text area
        gc.clip();
        // text
        gc.font = this.font;
        gc.fillStyle = this._fontColour;
        gc.textBaseline = "middle";
        gc.textAlign = "left";
        gc.fillText(this.text, this.padding, h / 2);
        // simple cursor
        if (this.focus) {
            var cursorX = this.padding + this.textWidth + 1;
            var cursorHeight = h - style_1.Style.textPadding;
            gc.beginPath();
            gc.moveTo(cursorX, style_1.Style.textPadding / 2);
            gc.lineTo(cursorX, cursorHeight);
            gc.lineWidth = 1;
            gc.strokeStyle = "black";
            gc.stroke();
        }
        gc.restore();
        // element draws debug viz if flag is set
        _super.prototype.draw.call(this, gc);
    };
    SKTextfield.prototype.toString = function () {
        return "SKTextfield '".concat(this.text, "'");
    };
    return SKTextfield;
}(element_1.SKElement));
exports.SKTextfield = SKTextfield;
