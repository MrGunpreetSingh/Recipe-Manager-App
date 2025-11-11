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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.SKButton = void 0;
var utility_1 = require("../utility");
var element_1 = require("./element");
var style_1 = require("./style");
var dispatch_1 = require("../dispatch");
var SKButton = /** @class */ (function (_super) {
    __extends(SKButton, _super);
    function SKButton(_a) {
        if (_a === void 0) { _a = {}; }
        var _this = this;
        var _b = _a.text, text = _b === void 0 ? "" : _b, _c = _a.fill, fill = _c === void 0 ? style_1.Style.defaultColour : _c, _d = _a.border, border = _d === void 0 ? "black" : _d, elementProps = __rest(_a, ["text", "fill", "border"]);
        _this = _super.call(this, __assign({ fill: fill, border: border }, elementProps)) || this;
        _this.state = "idle";
        _this._font = style_1.Style.font;
        _this._text = "";
        _this._radius = 4;
        _this._fontColour = style_1.Style.fontColour;
        _this._highlightColour = style_1.Style.highlightColour;
        _this.padding = style_1.Style.textPadding;
        _this.text = text;
        if (!_this.width)
            _this.width = 80;
        return _this;
    }
    Object.defineProperty(SKButton.prototype, "font", {
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
    Object.defineProperty(SKButton.prototype, "text", {
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
    Object.defineProperty(SKButton.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        set: function (r) {
            this._radius = r;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKButton.prototype, "fontColour", {
        get: function () {
            return this._fontColour;
        },
        set: function (c) {
            this._fontColour = c;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKButton.prototype, "highlightColour", {
        get: function () {
            return this._highlightColour;
        },
        set: function (hc) {
            this._highlightColour = hc;
        },
        enumerable: false,
        configurable: true
    });
    SKButton.prototype.updateContentSize = function () {
        if (!this.recalculateSize)
            return;
        var m = (0, utility_1.measureText)(this.text, this._font);
        if (!m) {
            console.warn("measureText failed in SKButton for ".concat(this.text));
            return;
        }
        this.contentHeight = m.height;
        this.contentWidth = m.width;
        this.recalculateSize = false;
    };
    SKButton.prototype.handleMouseEvent = function (me) {
        switch (me.type) {
            case "mousedown":
                this.state = "down";
                (0, dispatch_1.requestMouseFocus)(this);
                // return true;
                break;
            case "mouseup":
                this.state = "hover";
                // return true if a listener was registered
                if (this.sendEvent({
                    source: this,
                    timeStamp: me.timeStamp,
                    type: "action",
                }))
                    return true;
                break;
            case "mouseenter":
                this.state = "hover";
                break;
            case "mouseexit":
                this.state = "idle";
                break;
        }
        if (_super.prototype.handleMouseEvent.call(this, me))
            return true;
        return false;
    };
    SKButton.prototype.draw = function (gc) {
        gc.save();
        // save typing
        var w = this.paddingBox.width;
        var h = this.paddingBox.height;
        gc.translate(this.margin, this.margin);
        // thick highlight rect
        if (this.state == "hover" || this.state == "down") {
            gc.beginPath();
            gc.roundRect(this.x, this.y, w, h, this.radius);
            gc.strokeStyle = this._highlightColour;
            gc.lineWidth = 8;
            gc.stroke();
        }
        // normal background
        gc.beginPath();
        gc.roundRect(this.x, this.y, w, h, this.radius);
        gc.fillStyle =
            this.state == "down" ? this._highlightColour : this.fill;
        gc.strokeStyle = this.border;
        // change fill to show down state
        gc.lineWidth = this.state == "down" ? 4 : 2;
        gc.fill();
        gc.stroke();
        gc.clip(); // clip text if it's wider than text area
        // button label
        gc.font = this._font;
        gc.fillStyle = this._fontColour;
        gc.textAlign = "center";
        gc.textBaseline = "middle";
        gc.fillText(this.text, this.x + w / 2, this.y + h / 2);
        gc.restore();
        // element draws debug viz if flag is set
        _super.prototype.draw.call(this, gc);
    };
    SKButton.prototype.toString = function () {
        return "SKButton '".concat(this.text, "'");
    };
    return SKButton;
}(element_1.SKElement));
exports.SKButton = SKButton;
