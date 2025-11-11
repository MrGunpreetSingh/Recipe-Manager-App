"use strict";
/**
 * Creates a simulated window system event loop
 * @module create-loop
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.skTime = void 0;
exports.createWindowingSystem = createWindowingSystem;
// TODO: FundamentalEvent type could better
function createFundamentalEvent(domEvent) {
    if (domEvent.type == "resize") {
        return {
            type: domEvent.type,
            timeStamp: domEvent.timeStamp,
            width: document.body.clientWidth,
            height: document.body.clientHeight,
        };
    }
    else if (domEvent.type == "mouseup" ||
        domEvent.type == "mousedown" ||
        domEvent.type == "mousemove") {
        var me = domEvent;
        return {
            type: domEvent.type,
            timeStamp: domEvent.timeStamp,
            x: me.x,
            y: me.y,
        };
    }
    else if (domEvent.type == "keyup" || domEvent.type == "keydown") {
        var ke = domEvent;
        if (ke.repeat)
            return; // filter out key repeats
        return {
            type: domEvent.type,
            timeStamp: domEvent.timeStamp,
            key: ke.key,
        };
    }
    else {
        console.warn("event ".concat(domEvent.type, " not supported as FundamentalEvent"));
        return;
    }
}
/**
 * Creates a simulated windowing system event loop
 * @param {RunLoopHandler} runLoop - Callback function for UI toolkit run loop
 */
function createWindowingSystem(runLoop) {
    // create the fundamental event queue
    // the toolkit run loop must process these events and remove them from
    // this shared queue
    var eventQueue = [];
    // callback used for all events we want to add to the queue
    function saveEvent(domEvent) {
        var fundamentalEvent = createFundamentalEvent(domEvent);
        if (!fundamentalEvent)
            return;
        eventQueue.push(fundamentalEvent);
    }
    // listen for "fundamental events" to simulate a low-level
    // system event queue in a windowing system
    window.addEventListener("mousedown", saveEvent);
    window.addEventListener("mouseup", saveEvent);
    window.addEventListener("mousemove", saveEvent);
    window.addEventListener("keydown", saveEvent);
    window.addEventListener("keyup", saveEvent);
    window.addEventListener("resize", saveEvent);
    // push a resize event to send on first frame of run loop
    var initialResizeEvent = createFundamentalEvent(new Event("resize"));
    if (initialResizeEvent)
        eventQueue.push(initialResizeEvent);
    // the simulated windowing system event loop
    function loop(time) {
        exports.skTime = time;
        runLoop(eventQueue, time);
        // schedule to run again
        window.requestAnimationFrame(loop);
    }
    // start it
    window.requestAnimationFrame(loop);
}
/**
 * Global time from windowing system
 * (when possible, use time from events or animation callback)
 */
exports.skTime = 0;
