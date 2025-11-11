"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.measureText = measureText;
// cached canvas for measuring text
var canvasBuffer;
/**
 * Measures the size of a text string using the given font.
 * @param text
 * @param font in CSS format (e.g. "12px Arial")
 * @returns width and height in pixels or null if failed to measure
 */
function measureText(text, font) {
    if (!canvasBuffer)
        canvasBuffer = document.createElement("canvas");
    var gc = canvasBuffer.getContext("2d");
    if (!gc)
        return null;
    // do the measurement
    gc.font = font;
    var m = gc.measureText(text);
    if (!m)
        return null;
    // calculate height from font metrics
    var height = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
    return { width: m.width, height: height };
}
