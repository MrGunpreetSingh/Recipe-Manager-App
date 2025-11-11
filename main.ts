import { SKContainer, SKLabel, SKButton, SKTextfield, Layout } from "./simplekit/src/imperative-mode";
import { startSimpleKit } from "./simplekit/src/imperative-mode";
import { setSKRoot } from "./simplekit/src/imperative-mode";

console.log('Loaded main.js');

const app = new SKContainer();

const title = new SKLabel({ text: "Recipe Manager" });

// Create the menu sidebar
const menu = new SKContainer();
menu.addChild(new SKButton({ text: "All Recipes" }));
menu.addChild(new SKButton({ text: "Categories" }));
menu.addChild(new SKButton({ text: "Ingredients" }));
menu.addChild(new SKButton({ text: "Add Recipe" }));

// Create the main display area
const mainArea = new SKContainer();
mainArea.addChild(new SKLabel({ text: "Welcome! Select an option from the left." }));

// Layout: Row containing menu and main area
const contentRow = new SKContainer();
contentRow.addChild(menu);
contentRow.addChild(mainArea);

// Add title and layout to the app
app.addChild(title);
app.addChild(contentRow);

// Start the SimpleKit UI system
setSKRoot(app);
startSimpleKit();
