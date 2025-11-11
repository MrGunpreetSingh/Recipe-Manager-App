"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distance = distance;
exports.random = random;
exports.randomInt = randomInt;
// Euclidean distance
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}
/**
 * returns a random number between a and b, or between 0 and a
 * @param a if b is undefined, a is the upper bound
 * @param b upper bound
 * @returns
 */
function random(a, b) {
    if (b != undefined) {
        return a + Math.random() * (b - a);
    }
    else {
        return Math.random() * a;
    }
}
/**
 * returns a random integer between a and b, or between 0 and a
 * @param a if b is undefined, a is the upper bound
 * @param b upper bound
 * @returns
 */
function randomInt(a, b) {
    if (b != undefined) {
        return Math.floor(a + Math.random() * (b - a));
    }
    else {
        return Math.floor(Math.random() * a);
    }
}
