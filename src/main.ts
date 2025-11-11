// src/main.ts
import { startSimpleKit, setSKRoot } from "../simplekit/src/imperative-mode";
import { Model } from "./model";
import { View } from "./view";
import { Controller } from "./controller";

console.log("Recipe Manager: Initializing...");

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

// Initialize SimpleKit and set the root
console.log("Setting root container...");
setSKRoot(view.getRoot());
console.log("Starting SimpleKit...");
const started = startSimpleKit();
if (!started) {
  console.error("Failed to start SimpleKit!");
} else {
  console.log("SimpleKit started successfully!");
}

// Start the app with demo data
controller.start();
console.log("Recipe Manager: Initialization complete!");
