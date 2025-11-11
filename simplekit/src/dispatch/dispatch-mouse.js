"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.mouseDispatch = mouseDispatch;
exports.requestMouseFocus = requestMouseFocus;
var debug = false;
if (debug)
    console.log("load dispatch-mouse module");
// returns list of elements under mouse (from back to front)
function buildTargetRoute(mx, my, element) {
    var route = [];
    // only SKContainers have children to traverse
    if ("children" in element) {
        element.children.forEach(function (child) {
            return route.push.apply(route, buildTargetRoute(
            // translate to child coord system
            mx - element.x - element.padding - element.margin, my - element.y - element.padding - element.margin, child));
        });
    }
    if (element.hitTest(mx, my)) {
        return __spreadArray([element], route, true);
    }
    else {
        return route;
    }
}
// dispatch mouse events to elements
function mouseDispatch(me, root) {
    // focus dispatch
    if (focusedElement) {
        focusedElement.handleMouseEvent(me);
        if (me.type == "mouseup") {
            if (debug)
                console.log("lost mouse focus ".concat(focusedElement));
            focusedElement = null;
        }
        return;
    }
    // positional dispatch
    var route = buildTargetRoute(me.x, me.y, root);
    // update mouseenter/mouseexit
    if (me.type == "mousemove") {
        var topElement = route.slice(-1)[0];
        updateEnterExit(me, topElement);
    }
    // capture propagation
    var stopPropagation = route.some(function (element) {
        var handled = element.handleMouseEventCapture(me);
        return handled;
    });
    if (stopPropagation)
        return;
    // bubble propagation
    route.reverse().some(function (element) {
        var handled = element.handleMouseEvent(me);
        return handled;
    });
}
// last element entered by mouse
var lastElementEntered;
// dispatch mouseenter/mouseexit with element mouse is on
function updateEnterExit(me, el) {
    if (el != lastElementEntered) {
        if (lastElementEntered) {
            if (debug)
                console.log("exit ".concat(lastElementEntered));
            lastElementEntered.handleMouseEvent(__assign(__assign({}, me), { type: "mouseexit" }));
        }
        if (el) {
            if (debug)
                console.log("enter ".concat(el));
            el.handleMouseEvent(__assign(__assign({}, me), { type: "mouseenter" }));
        }
        lastElementEntered = el;
    }
}
// mouse focus
var focusedElement = null;
function requestMouseFocus(element) {
    if (focusedElement == element)
        return;
    focusedElement = element;
    if (debug)
        console.log("gained mouse focus ".concat(focusedElement));
}
