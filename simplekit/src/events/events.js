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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SKResizeEvent = exports.SKKeyboardEvent = exports.SKMouseEvent = exports.SKEvent = void 0;
var SKEvent = /** @class */ (function () {
    function SKEvent(type, timeStamp, source) {
        this.type = type;
        this.timeStamp = timeStamp;
        this.source = source;
    }
    return SKEvent;
}());
exports.SKEvent = SKEvent;
var SKMouseEvent = /** @class */ (function (_super) {
    __extends(SKMouseEvent, _super);
    function SKMouseEvent(type, timeStamp, x, y, source) {
        var _this = _super.call(this, type, timeStamp, source) || this;
        _this.x = x;
        _this.y = y;
        return _this;
    }
    return SKMouseEvent;
}(SKEvent));
exports.SKMouseEvent = SKMouseEvent;
var SKKeyboardEvent = /** @class */ (function (_super) {
    __extends(SKKeyboardEvent, _super);
    function SKKeyboardEvent(type, timeStamp, key, source) {
        if (key === void 0) { key = null; }
        var _this = _super.call(this, type, timeStamp, source) || this;
        _this.key = key;
        return _this;
    }
    return SKKeyboardEvent;
}(SKEvent));
exports.SKKeyboardEvent = SKKeyboardEvent;
var SKResizeEvent = /** @class */ (function (_super) {
    __extends(SKResizeEvent, _super);
    function SKResizeEvent(type, timeStamp, width, height, source) {
        var _this = _super.call(this, type, timeStamp, source) || this;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    return SKResizeEvent;
}(SKEvent));
exports.SKResizeEvent = SKResizeEvent;
