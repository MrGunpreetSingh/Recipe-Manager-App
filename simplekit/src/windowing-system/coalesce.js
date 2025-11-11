"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coalesceEvents = coalesceEvents;
/**
 * Coalesces some fundamental events into a single event of the same type
 * @param events the array of events to coalesce (mutates the list)
 */
function coalesceEvents(events, eventTypes) {
    if (eventTypes === void 0) { eventTypes = ["mousemove", "resize"]; }
    var original = __spreadArray([], events, true);
    events.length = 0;
    original.forEach(function (e) {
        if (e.type in eventTypes) {
            var i = events.findIndex(function (ee) { return ee.type in eventTypes; });
            if (i > -1) {
                events[i] = e;
            }
            else {
                events.push(e);
            }
        }
        else {
            events.push(e);
        }
    });
}
//TODO this function implementation could be improved
