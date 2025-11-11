"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SKElement = void 0;
var settings_1 = require("../settings");
var utility_1 = require("../utility");
var imperative_mode_1 = require("../imperative-mode");
var layout_1 = require("../layout");
var SKElement = /** @class */ (function () {
    function SKElement(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.id, id = _c === void 0 ? "" : _c, _d = _b.debug, debug = _d === void 0 ? false : _d, _e = _b.x, x = _e === void 0 ? 0 : _e, _f = _b.y, y = _f === void 0 ? 0 : _f, _g = _b.width, width = _g === void 0 ? undefined : _g, _h = _b.height, height = _h === void 0 ? undefined : _h, _j = _b.fill, fill = _j === void 0 ? "" : _j, _k = _b.border, border = _k === void 0 ? "" : _k, _l = _b.padding, padding = _l === void 0 ? 0 : _l, _m = _b.margin, margin = _m === void 0 ? 0 : _m, _o = _b.fillWidth, fillWidth = _o === void 0 ? 0 : _o, _p = _b.fillHeight, fillHeight = _p === void 0 ? 0 : _p;
        // top-left corner of element bounding box
        this._x = 0;
        this._y = 0;
        //#region size and layout calculations
        // size calculation flag
        this.recalculateSize = false;
        this.contentWidth = 0;
        this.contentHeight = 0;
        // intrinsic size of element
        this._intrinsicWidth = 0;
        this._intrinsicHeight = 0;
        // proportion to grow and shrink in some layouts
        // (0 means do not grow or shrink)
        this._fillWidth = 0;
        this._fillHeight = 0;
        // width and height after layout
        this._layoutWidth = 0;
        this._layoutHeight = 0;
        //#endregion
        //#region box model
        // margin
        this._margin = 0;
        // padding
        this._padding = 0;
        //#endregion
        //#region widget event binding
        this.bindingTable = [];
        // for debugging
        this.id = "";
        this.debug = false;
        this.id = id;
        this.debug = debug;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fill = fill;
        this.border = border;
        this.padding = padding;
        this.margin = margin;
        this.fillWidth = fillWidth;
        this.fillHeight = fillHeight;
    }
    Object.defineProperty(SKElement.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
            this.sizeChanged();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKElement.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
            this.sizeChanged();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKElement.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (w) {
            if (w !== this._width) {
                this._width = w;
                this.sizeChanged();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKElement.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (h) {
            if (h !== this._height) {
                this._height = h;
                this.sizeChanged();
            }
        },
        enumerable: false,
        configurable: true
    });
    SKElement.prototype.sizeChanged = function () {
        this.recalculateSize = true;
        (0, imperative_mode_1.invalidateLayout)();
    };
    // some widgets may need to update content size
    // (e.g. to measure text in a button, or size of children after layout)
    SKElement.prototype.updateContentSize = function () {
        if (settings_1.Settings.debugLayout &&
            (this.contentWidth || this.contentHeight))
            console.log("   content '".concat(this.id, "' -> ").concat((0, layout_1.sizeToString)(this.contentWidth, this.contentHeight)));
    };
    Object.defineProperty(SKElement.prototype, "intrinsicWidth", {
        get: function () {
            return this._intrinsicWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKElement.prototype, "intrinsicHeight", {
        get: function () {
            return this._intrinsicHeight;
        },
        enumerable: false,
        configurable: true
    });
    // calculate the intrinsic size of the element
    SKElement.prototype.measure = function () {
        this.updateContentSize();
        // calculate intrinsic size
        if (this.width) {
            this._intrinsicWidth = Math.max(this.width, 2 * this.padding);
        }
        else if (this.contentWidth) {
            this._intrinsicWidth = this.contentWidth + 2 * this.padding;
        }
        else {
            this._intrinsicWidth = 2 * this.padding;
        }
        this._intrinsicWidth += 2 * this.margin;
        if (this.height) {
            this._intrinsicHeight = Math.max(this.height, 2 * this.padding);
        }
        else if (this.contentHeight) {
            this._intrinsicHeight = this.contentHeight + 2 * this.padding;
        }
        else {
            this._intrinsicHeight = 2 * this.padding;
        }
        this._intrinsicHeight += 2 * this.margin;
        if (settings_1.Settings.debugLayout)
            console.log("1\uFE0F\u20E3 measure '".concat(this.id, "' -> ").concat((0, layout_1.sizeToString)(this.intrinsicWidth, this.intrinsicHeight)));
    };
    Object.defineProperty(SKElement.prototype, "fillWidth", {
        get: function () {
            return this._fillWidth;
        },
        set: function (value) {
            this._fillWidth = value;
            (0, imperative_mode_1.invalidateLayout)();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKElement.prototype, "fillHeight", {
        get: function () {
            return this._fillHeight;
        },
        set: function (value) {
            this._fillHeight = value;
            (0, imperative_mode_1.invalidateLayout)();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKElement.prototype, "layoutWidth", {
        get: function () {
            return this._layoutWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKElement.prototype, "layoutHeight", {
        get: function () {
            return this._layoutHeight;
        },
        enumerable: false,
        configurable: true
    });
    SKElement.prototype.layout = function (width, height) {
        if (settings_1.Settings.debugLayout)
            console.log("2\uFE0F\u20E3 layout '".concat(this.id, "' in ").concat((0, layout_1.sizeToString)(width, height)));
        this._layoutWidth = width !== null && width !== void 0 ? width : this.intrinsicWidth;
        this._layoutHeight = height !== null && height !== void 0 ? height : this.intrinsicHeight;
        return { width: this.layoutWidth, height: this.layoutHeight };
    };
    Object.defineProperty(SKElement.prototype, "margin", {
        get: function () {
            return this._margin;
        },
        set: function (m) {
            if (m !== this.margin) {
                m = Math.max(0, m);
                this._margin = m;
                this.sizeChanged();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKElement.prototype, "marginBox", {
        get: function () {
            return {
                width: this.layoutWidth,
                height: this.layoutHeight,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKElement.prototype, "padding", {
        get: function () {
            return this._padding;
        },
        set: function (p) {
            if (p !== this.padding) {
                p = Math.max(0, p);
                this._padding = p;
                this.sizeChanged();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKElement.prototype, "paddingBox", {
        get: function () {
            return {
                width: this.layoutWidth - 2 * this.margin,
                height: this.layoutHeight - 2 * this.margin,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SKElement.prototype, "contentBox", {
        get: function () {
            return {
                width: this.layoutWidth - 2 * this.margin - 2 * this.padding,
                height: this.layoutHeight - 2 * this.margin - 2 * this.padding,
            };
        },
        enumerable: false,
        configurable: true
    });
    // draw box model for debugging
    SKElement.prototype.drawBoxModel = function (gc) {
        gc.save();
        gc.lineWidth = 1;
        // margin
        if (this.margin > 0) {
            gc.strokeStyle = "red";
            gc.setLineDash([2, 2]);
            gc.strokeRect(0, 0, this.layoutWidth, this.layoutHeight);
        }
        // padding
        if (this.padding > 0) {
            gc.strokeStyle = "green";
            gc.setLineDash([2, 2]);
            gc.strokeRect(this.margin, this.margin, this.paddingBox.width, this.paddingBox.height);
        }
        // content
        gc.strokeStyle = "blue";
        gc.setLineDash([2, 2]);
        gc.strokeRect(this.margin + this.padding, this.margin + this.padding, this.contentBox.width, this.contentBox.height);
        gc.restore();
    };
    SKElement.prototype.sendEvent = function (e, capture) {
        if (capture === void 0) { capture = false; }
        var handled = false;
        this.bindingTable.forEach(function (d) {
            if (d.type == e.type && d.capture == capture) {
                handled || (handled = d.handler(e));
            }
        });
        return handled;
    };
    SKElement.prototype.addEventListener = function (type, handler, capture) {
        if (capture === void 0) { capture = false; }
        this.bindingTable.push({ type: type, handler: handler, capture: capture });
    };
    SKElement.prototype.removeEventListener = function (type, handler, capture) {
        if (capture === void 0) { capture = false; }
        this.bindingTable = this.bindingTable.filter(function (d) {
            return !(d.type == type &&
                d.handler == handler &&
                d.capture == capture);
        });
    };
    //#endregion
    //#region event handling
    SKElement.prototype.handleKeyboardEvent = function (ke) {
        return this.sendEvent(ke);
    };
    SKElement.prototype.handleMouseEvent = function (me) {
        if (me.type === "mousedown") {
            (0, imperative_mode_1.requestKeyboardFocus)();
        }
        return this.sendEvent(me);
    };
    SKElement.prototype.handleMouseEventCapture = function (me) {
        return this.sendEvent(me, true);
    };
    //#endregion
    SKElement.prototype.hitTest = function (mx, my) {
        return (0, utility_1.insideHitTestRectangle)(mx, my, this.x + this.margin, this.y + this.margin, this.paddingBox.width, this.paddingBox.height);
    };
    SKElement.prototype.draw = function (gc) {
        if (settings_1.Settings.debug || this.debug) {
            gc.save();
            gc.translate(this.x, this.y);
            // draw the box model visualization
            this.drawBoxModel(gc);
            // display element id
            gc.strokeStyle = "white";
            gc.lineWidth = 2;
            gc.textBaseline = "top";
            gc.textAlign = "left";
            gc.font = "7pt sans-serif";
            gc.strokeText(this.id, 2, 2);
            gc.fillStyle = "black";
            gc.fillText(this.id, 2, 2);
            gc.restore();
        }
    };
    SKElement.prototype.boxModelToString = function () {
        // const s = JSON.stringify({
        //   margin: this.margin,
        //   padding: this.padding,
        //   marginBox: this.marginBox,
        //   paddingBox: this.paddingBox,
        //   contentBox: this.contentBox,
        //   width: this.widthLayout,
        //   this.height
        // }
        return "width:".concat(this._width, " height:").concat(this._height, " margin:").concat(this.margin, " padding:").concat(this.padding, " basis:").concat(this.intrinsicWidth, "x").concat(this.intrinsicHeight, " layout:").concat(this.layoutWidth, "x").concat(this.layoutHeight);
    };
    SKElement.prototype.toString = function () {
        return "SKElement id:".concat(this.id);
    };
    return SKElement;
}());
exports.SKElement = SKElement;
