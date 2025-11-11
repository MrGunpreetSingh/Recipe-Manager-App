import { Recipe } from "./model";
import { SKContainer, SKLabel, SKButton, Layout } from "../simplekit/src/imperative-mode";

export class CookingView {
  private root: SKContainer;
  
  // Callbacks
  public onNextStep?: () => void;
  public onPreviousStep?: () => void;
  public onShowFullRecipe?: () => void;
  public onFinish?: () => void;

  constructor() {
    // White background
    this.root = new SKContainer({
      fill: "white",
      fillWidth: 1,
      fillHeight: 1
    });
  }

  render(recipe: Recipe, currentStep: string, stepIndex: number, totalSteps: number) {
    // Clear any existing content
    this.root.clearChildren();

    // Centered layout container
    const overlay = new SKContainer({
      fill: "transparent",
      fillWidth: 1,
      fillHeight: 1,
      padding: 0,
      margin: 0,
      layoutMethod: new Layout.CentredLayout()
    });

    // CENTERED cooking card container
    const cookingCard = new SKContainer({
      fill: "white",
      width: 900,
      height: 650,
      padding: 0,
      margin: 0,
      border: "rgba(92, 158, 173, 0.5)"
    });
    cookingCard.radius = 20;

    // Header - centered within card
    const recipeTitle = new SKLabel({
      text: `👨‍🍳 ${recipe.title}`,
      fill: "",
      width: 900,
      height: 60,
      x: 0,
      y: 30
    });
    recipeTitle.font = "bold 2.2em Arial";
    recipeTitle.fontColour = "#2c3e50";
    recipeTitle.align = "centre";
    cookingCard.addChild(recipeTitle);

    // Step counter - centered
    const stepCounter = new SKLabel({
      text: `Step ${stepIndex + 1} of ${totalSteps}`,
      fill: "",
      width: 900,
      height: 40,
      x: 0,
      y: 100
    });
    stepCounter.font = "bold 1.3em Arial";
    stepCounter.fontColour = "#5c9ead";
    stepCounter.align = "centre";
    cookingCard.addChild(stepCounter);

    // Current step card - centered wrapper
    const stepCardWrapper = new SKContainer({
      fill: "transparent",
      width: 900,
      height: 270,
      x: 0,
      y: 155,
      layoutMethod: new Layout.CentredLayout()
    });

    const stepCard = new SKContainer({
      fill: "#f8f9fa",
      width: 820,
      height: 250,
      padding: 30,
      layoutMethod: new Layout.CentredLayout()
    });
    stepCard.radius = 15;
    stepCard.border = "#5c9ead";

    const stepText = new SKLabel({
      text: currentStep,
      fill: "",
      width: 760,
      height: 190
    });
    stepText.font = "1.4em Arial";
    stepText.fontColour = "#2c3e50";
    stepText.align = "centre";
    stepCard.addChild(stepText);
    stepCardWrapper.addChild(stepCard);
    cookingCard.addChild(stepCardWrapper);

    // Navigation buttons - centered wrapper
    const navWrapper = new SKContainer({
      fill: "transparent",
      width: 900,
      height: 85,
      x: 0,
      y: 435,
      layoutMethod: new Layout.CentredLayout()
    });

    const navContainer = new SKContainer({
      fill: "transparent",
      layoutMethod: new Layout.FillRowLayout({ gap: 20 }),
      width: 820,
      height: 70
    });

    // Previous button
    const prevBtn = new SKButton({
      text: "← Previous",
      width: 200,
      height: 65
    });
    prevBtn.fill = stepIndex > 0 ? "#95a5a6" : "rgba(221, 221, 221, 0.8)";
    prevBtn.fontColour = "white";
    prevBtn.radius = 10;
    prevBtn.font = "bold 1.2em Arial";
    if (stepIndex > 0) {
      prevBtn.addEventListener("action", () => {
        if (this.onPreviousStep) {
          this.onPreviousStep();
        }
        return true;
      });
    }
    navContainer.addChild(prevBtn);

    // Next button (or Finish button on last step)
    const nextBtn = new SKButton({
      text: stepIndex < totalSteps - 1 ? "Next →" : "✓ Finish",
      width: 200,
      height: 65
    });
    nextBtn.fill = "#5c9ead";
    nextBtn.fontColour = "white";
    nextBtn.radius = 10;
    nextBtn.font = "bold 1.2em Arial";
    nextBtn.addEventListener("action", () => {
      if (stepIndex < totalSteps - 1) {
        // Not the last step - go to next
        if (this.onNextStep) {
          this.onNextStep();
        }
      } else {
        // Last step - finish cooking
        if (this.onFinish) {
          this.onFinish();
        }
      }
      return true;
    });
    navContainer.addChild(nextBtn);

    // Show full recipe button
    const fullRecipeBtn = new SKButton({
      text: "📋 Show Full Recipe",
      width: 250,
      height: 65
    });
    fullRecipeBtn.fill = "#ff6b6b";
    fullRecipeBtn.fontColour = "white";
    fullRecipeBtn.radius = 10;
    fullRecipeBtn.font = "bold 1.1em Arial";
    fullRecipeBtn.addEventListener("action", () => {
      if (this.onShowFullRecipe) {
        this.onShowFullRecipe();
      }
      return true;
    });
    navContainer.addChild(fullRecipeBtn);

    navWrapper.addChild(navContainer);
    cookingCard.addChild(navWrapper);

    // Ingredients - centered wrapper
    const ingredientsWrapper = new SKContainer({
      fill: "transparent",
      width: 900,
      height: 105,
      x: 0,
      y: 530,
      layoutMethod: new Layout.CentredLayout()
    });

    const ingredientsBox = new SKContainer({
      fill: "#e8f4f8",
      width: 820,
      height: 90,
      padding: 15
    });
    ingredientsBox.radius = 10;

    const ingredientsLabel = new SKLabel({
      text: `📝 Ingredients: ${recipe.ingredients}`,
      fill: "",
      width: 790,
      height: 60
    });
    ingredientsLabel.font = "0.95em Arial";
    ingredientsLabel.fontColour = "#2c3e50";
    ingredientsLabel.align = "left";
    ingredientsBox.addChild(ingredientsLabel);
    ingredientsWrapper.addChild(ingredientsBox);
    cookingCard.addChild(ingredientsWrapper);

    // Add card to overlay, overlay to root
    overlay.addChild(cookingCard);
    this.root.addChild(overlay);
  }

  getRoot(): SKContainer {
    return this.root;
  }
}

