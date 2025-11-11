"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestKeyboardFocus = requestKeyboardFocus;
exports.keyboardDispatch = keyboardDispatch;
var debug = false;
if (debug)
    console.log("load dispatch-keyboard module");
var focusedElement = null;
function requestKeyboardFocus(element) {
    // console.log(
    //   `requestKeyboardFocus ${element}, was ${focusedElement}`
    // );
    if (element === void 0) { element = null; }
    // nothing to do if already focused
    if (focusedElement == element)
        return;
    // if send focusout to old element if there was one
    if (focusedElement) {
        focusedElement.handleKeyboardEvent({
            type: "focusout",
            timeStamp: performance.now(),
            key: null,
        });
        if (debug)
            console.log("lost keyboard focus ".concat(focusedElement));
    }
    // send focus in to new element
    if (element) {
        element.handleKeyboardEvent({
            type: "focusin",
            timeStamp: performance.now(),
            key: null,
        });
        if (debug)
            console.log("gained keyboard focus ".concat(focusedElement));
    }
    focusedElement = element;
}
/**
 * Dispatch keyboard event to focused element
 * @param ke event to dispatch
 */
function keyboardDispatch(ke) {
    if (debug)
        console.log("keyboardDispatch ".concat(ke, " ").concat(focusedElement || "no focus"));
    focusedElement === null || focusedElement === void 0 ? void 0 : focusedElement.handleKeyboardEvent(ke);
}
