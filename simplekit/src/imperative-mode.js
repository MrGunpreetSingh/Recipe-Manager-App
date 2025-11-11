"use strict";
/**
 * SimpleKit Imperative UI Mode
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestMouseFocus = exports.requestKeyboardFocus = exports.skTime = void 0;
exports.startSimpleKit = startSimpleKit;
exports.setSKEventListener = setSKEventListener;
exports.sendSKEvent = sendSKEvent;
exports.setSKAnimationCallback = setSKAnimationCallback;
exports.setSKDrawCallback = setSKDrawCallback;
exports.addSKEventTranslator = addSKEventTranslator;
exports.setSKRoot = setSKRoot;
exports.invalidateLayout = invalidateLayout;
// events
__exportStar(require("./events"), exports);
var windowing_system_1 = require("./windowing-system");
Object.defineProperty(exports, "skTime", { enumerable: true, get: function () { return windowing_system_1.skTime; } });
// widgets
__exportStar(require("./widget"), exports);
// layout
__exportStar(require("./layout"), exports);
// settings
__exportStar(require("./settings"), exports);
// dispatch
var dispatch_1 = require("./dispatch");
Object.defineProperty(exports, "requestKeyboardFocus", { enumerable: true, get: function () { return dispatch_1.requestKeyboardFocus; } });
Object.defineProperty(exports, "requestMouseFocus", { enumerable: true, get: function () { return dispatch_1.requestMouseFocus; } });
//  - - - - - - - - - - - - - - - - - - - - - - -
var windowing_system_2 = require("./windowing-system");
// simple simulated UI Kit events
var events_1 = require("./events");
// dispatchers
var dispatch_2 = require("./dispatch");
var events_2 = require("./events");
var common_1 = require("./common");
// merges b into a, preserves order of each and puts "a" events first if same time
// assumes a and b are sorted by timestamp prop
function mergeEventQueues(a, b) {
    var result = [];
    var j = 0;
    for (var i = 0; i < a.length; i++) {
        if (a[i].timeStamp <= b[j].timeStamp) {
            result.push(a[i]);
        }
        else {
            while (j < b.length && b[j].timeStamp < a[i].timeStamp) {
                result.push(b[j]);
                j++;
            }
            result.push(a[i]);
        }
    }
    // push any later events still in b
    while (j < b.length) {
        result.push(b[j]);
        j++;
    }
    return result;
}
/**
 * The SimpleKit toolkit run loop (for imperative toolkit mode)
 * @param eventQueue fundamental events from simulated windowing system
 * @param time the windowing system frame time
 */
function runLoop(eventQueue, time) {
    // fundamental event queue coalescing
    (0, windowing_system_2.coalesceEvents)(eventQueue);
    // list of events to dispatch
    var events = [];
    // translate fundamental events
    // if no fundamental events, send  a null event with time for
    // translators that trigger events based on time
    if (eventQueue.length == 0) {
        var nullEvent_1 = {
            type: "null",
            timeStamp: time,
        };
        translators.forEach(function (t) {
            var translatedEvent = t.update(nullEvent_1);
            if (translatedEvent) {
                events.push(translatedEvent);
            }
        });
    }
    // if no fundamental events, push a single "null" fundamental event
    // this is because some translators trigger events based on time
    // (like long press)
    if (eventQueue.length == 0) {
        eventQueue.push({
            type: "null",
            timeStamp: time,
        });
    }
    var _loop_1 = function () {
        var fundamentalEvent = eventQueue.shift();
        if (!fundamentalEvent)
            return "continue";
        translators.forEach(function (t) {
            var translatedEvent = t.update(fundamentalEvent);
            if (translatedEvent) {
                events.push(translatedEvent);
            }
        });
    };
    // use fundamental events to generate SKEvents
    while (eventQueue.length > 0) {
        _loop_1();
    }
    // merge any other events
    // (assumes otherEvents sorted by timeStamp prop)
    events =
        otherEvents.length > 0
            ? mergeEventQueues(events, otherEvents)
            : events;
    // dispatch events
    events.forEach(function (e) {
        // handle resize for layout
        if (e.type == "resize" && uiTreeRoot) {
            invalidateLayout();
        }
        // widget dispatchers
        if (e instanceof events_1.SKMouseEvent && uiTreeRoot) {
            (0, dispatch_2.mouseDispatch)(e, uiTreeRoot);
        }
        if (e instanceof events_1.SKKeyboardEvent) {
            (0, dispatch_2.keyboardDispatch)(e);
        }
        // global app dispatch
        if (eventListener)
            eventListener(e);
    });
    // animation
    if (animateCallback)
        animateCallback(time);
    // draw on canvas
    if (drawCallback)
        drawCallback(gc);
    // if we have a UI tree, layout widgets if needed
    if (uiTreeRoot && layoutRequested) {
        if (settings_1.Settings.debugLayout)
            console.log("*** LAYOUT REQUESTED ***");
        layoutRoot();
        layoutRequested = false;
    }
    // draw UI
    if (uiTreeRoot) {
        gc.clearRect(0, 0, gc.canvas.width, gc.canvas.height);
        uiTreeRoot.draw(gc);
    }
}
// SimpleKit draws everything in this canvas graphics context
var gc;
// standard fundamental event translators
var translators = [
    events_2.fundamentalTranslator,
    events_2.clickTranslator,
    events_2.dblclickTranslator,
    events_2.dragTranslator,
];
/**
 * Adds an fundamental event translator to the list of translators
 * @param translator the translator to add
 */
function addSKEventTranslator(translator) {
    translators.push(translator);
    console.log("added event translator, now ".concat(translators.length, " translators"));
}
/**
 * Sets a global event listener
 * @param listener the event listener callback
 */
function setSKEventListener(listener) {
    eventListener = listener;
}
var eventListener;
/**
 * Sets function to update animations each frame
 * @param animate the animation callback
 */
function setSKAnimationCallback(animate) {
    animateCallback = animate;
}
var animateCallback;
// method to send other events
var otherEvents = [];
function sendSKEvent(e) {
    otherEvents.push(e);
}
/**
 * Sets function to draw graphics each frame
 * @param draw the draw callback
 */
function setSKDrawCallback(draw) {
    if (uiTreeRoot) {
        console.error("No draw callback when widget tree root is set.");
        return;
    }
    console.warn("setSKDrawCallback only for testing or concept demos: use setSKRoot to build an imperative UI.");
    drawCallback = draw;
}
var drawCallback;
// root of the widget tree
var uiTreeRoot;
/**
 * Sets the root of the widget tree that describes the UI.
 * This is typically set once during startup
 * @param root the root widget, usually a SKContainer
 */
function setSKRoot(root) {
    uiTreeRoot = root;
    if (root) {
        invalidateLayout();
        if (drawCallback) {
            drawCallback = null;
            console.warn("Draw callback cleared when setting widget tree root.");
        }
    }
}
// flag to run layout process next frame
var layoutRequested = false;
// widgets call this to trigger layout next frame
function invalidateLayout() {
    layoutRequested = true;
}
function layoutRoot() {
    if (uiTreeRoot && gc) {
        // no margin allowed on root
        if (uiTreeRoot.margin !== 0) {
            console.warn("No margin allowed for root widget, setting margin to 0.");
            uiTreeRoot.margin = 0;
        }
        // 1. calculate ”intrinsic size" of all widgets
        uiTreeRoot.measure();
        // 2. set position and size of all widgets
        uiTreeRoot.layout(gc.canvas.width, gc.canvas.height);
    }
}
var npmPackage = require("../package.json");
var settings_1 = require("./settings");
/**
 * Must be called once to start the SimpleKit run loop. It adds a
 * single canvas to the body for drawing and creates
 * the simulated windowing system to call the SimpleKit run loop
 * @returns true if successful, false otherwise
 */
function startSimpleKit() {
    console.info("\uD83E\uDDF0 SimpleKit v".concat(npmPackage.version, " *Imperative UI Mode* startup"));
    // check the HTML document hosting SimpleKit
    if (!(0, common_1.checkHtml)())
        return false;
    // setup canvas
    var canvas = (0, common_1.setupCanvas)();
    // save graphics context to local module variable
    var graphicsContext = canvas.getContext("2d");
    // this should never happen, but we need to check
    if (!graphicsContext) {
        console.error("Unable to get graphics context from canvas");
        return false;
    }
    gc = graphicsContext;
    // start the toolkit run loop
    (0, windowing_system_2.createWindowingSystem)(runLoop);
    return true;
}
