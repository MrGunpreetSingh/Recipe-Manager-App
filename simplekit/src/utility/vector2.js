"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector2 = exports.Point2 = void 0;
exports.point = point;
exports.vector = vector;
var Point2 = /** @class */ (function () {
    function Point2(x, y) {
        this.x = x;
        this.y = y;
    }
    Point2.prototype.add = function (v) {
        return new Point2(this.x + v.x, this.y + v.y);
    };
    Point2.prototype.subtract = function (other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    };
    Point2.prototype.clone = function () {
        return new Point2(this.x, this.y);
    };
    return Point2;
}());
exports.Point2 = Point2;
function point(x, y) {
    return new Point2(x, y);
}
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.normalize = function () {
        var v = new Vector2(this.x, this.y);
        var m = v.magnitude();
        if (m == 0)
            return v;
        v.x /= m;
        v.y /= m;
        return v;
    };
    Vector2.prototype.magnitude = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector2.prototype.dot = function (other) {
        return this.x * other.x + this.y * other.y;
    };
    Vector2.prototype.cross = function (other) {
        return this.x * other.y - this.y * other.x;
    };
    Vector2.prototype.multiply = function (scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    };
    Vector2.prototype.add = function (other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    };
    Vector2.prototype.subtract = function (other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    };
    Vector2.prototype.clone = function () {
        return new Vector2(this.x, this.y);
    };
    return Vector2;
}());
exports.Vector2 = Vector2;
function vector(x, y) {
    return new Vector2(x, y);
}
