"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insideHitTestRectangle = insideHitTestRectangle;
exports.edgeHitTestRectangle = edgeHitTestRectangle;
/**
 * Checks if a point (mx, my) is inside a rectangle defined by its top-left corner (x, y) and dimensions (w, h).
 *
 * @param mx - The x-coordinate of the point to test.
 * @param my - The y-coordinate of the point to test.
 * @param x - The x-coordinate of the top-left corner of the rectangle.
 * @param y - The y-coordinate of the top-left corner of the rectangle.
 * @param w - The width of the rectangle.
 * @param h - The height of the rectangle.
 * @returns true if the point is inside the rectangle, false otherwise.
 */
function insideHitTestRectangle(mx, my, x, y, w, h) {
    return mx >= x && mx <= x + w && my >= y && my <= y + h;
}
/**
 * Performs a hit test to determine if a point (mx, my) is on the edge of a rectangle.
 * The edge is defined by the stroke width around the rectangle.
 *
 * @param mx - The x-coordinate of the point to test.
 * @param my - The y-coordinate of the point to test.
 * @param x - The x-coordinate of the top-left corner of the rectangle.
 * @param y - The y-coordinate of the top-left corner of the rectangle.
 * @param w - The width of the rectangle.
 * @param h - The height of the rectangle.
 * @param strokeWidth - The width of the stroke around the rectangle.
 * @returns true if the point is on the edge of the rectangle, false otherwise.
 */
function edgeHitTestRectangle(mx, my, x, y, w, h, strokeWidth) {
    // width of stroke on either side of edges
    var s = strokeWidth / 2;
    // outside rect after adding stroke
    var outer = mx >= x - s && mx <= x + w + s && my >= y - s && my <= y + h + s;
    // but NOT inside rect after subtracting stroke
    var inner = mx > x + s && mx < x + w - s && my > y + s && my < y + h - s;
    return outer && !inner;
}
