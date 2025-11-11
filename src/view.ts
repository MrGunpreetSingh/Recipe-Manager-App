import { Recipe } from "./model";
import { SKContainer, SKLabel, SKButton, Layout } from "../simplekit/src/imperative-mode";
import { MainView } from "./mainView";
import { CookingView } from "./cookingView";

export class View {
  private root: SKContainer;
  private mainView: MainView;
  private cookingView: CookingView;
  
  // Callbacks
  public onAddRecipe?: (title: string, ingredients: string, instructions: string) => void;
  public onDeleteRecipe?: (id: number) => void;
  public onStartCooking?: (recipeId?: number) => void;
  public onNextStep?: () => void;
  public onPreviousStep?: () => void;
  public onShowFullRecipe?: () => void;
  public onEndCooking?: () => void;
  public onAddCategory?: (name: string, color: string) => void;
  public onUpdateCategory?: (id: number, name: string, color: string) => void;
  public onDeleteCategory?: (id: number) => void;
  public onAddTag?: (name: string) => void;
  public onUpdateTag?: (id: number, name: string) => void;
  public onDeleteTag?: (id: number) => void;

  constructor() {
    // Create a root container
    this.root = new SKContainer({
      fill: "transparent",
      fillWidth: 1,
      fillHeight: 1
    });

    // Initialize both views
    this.mainView = new MainView();
    this.cookingView = new CookingView();

    // Wire up main view callbacks
    this.mainView.onAddRecipe = (title, ingredients, instructions) => {
      if (this.onAddRecipe) {
        this.onAddRecipe(title, ingredients, instructions);
      }
    };

    this.mainView.onDeleteRecipe = (id) => {
      if (this.onDeleteRecipe) {
        this.onDeleteRecipe(id);
      }
    };

    this.mainView.onStartCooking = (recipeId) => {
      if (this.onStartCooking) {
        this.onStartCooking(recipeId);
      }
    };
    
    // Wire up cooking view callbacks
    this.cookingView.onNextStep = () => {
      if (this.onNextStep) {
        this.onNextStep();
      }
    };

    this.cookingView.onPreviousStep = () => {
      if (this.onPreviousStep) {
        this.onPreviousStep();
      }
    };

    this.cookingView.onShowFullRecipe = () => {
      if (this.onShowFullRecipe) {
        this.onShowFullRecipe();
      }
    };

    this.cookingView.onFinish = () => {
      // Finish button clicked - return to main view
      if (this.onEndCooking) {
        this.onEndCooking();
      }
      this.showMainView();
    };

    // Start with main view
    this.showMainView();
  }

  private showMainView() {
    // Clear root and show main view
    this.root.clearChildren();
    this.root.addChild(this.mainView.getRoot());
  }

  private showCookingView() {
    // Clear root and show cooking view
    this.root.clearChildren();
    this.root.addChild(this.cookingView.getRoot());
  }

  setCategories(categories: any[]) {
    this.mainView.setCategories(categories);
  }

  setTags(tags: any[]) {
    this.mainView.setTags(tags);
  }

  renderRecipes(recipes: Recipe[]) {
    this.mainView.renderRecipes(recipes);
  }

  showRecipeSelection(recipes: Recipe[]) {
    // Create modal for recipe selection overlay on main view
    const modal = new SKContainer({
      fill: "rgba(0, 0, 0, 0.7)",
      fillWidth: 1,
      fillHeight: 1,
      layoutMethod: new Layout.CentredLayout()
    });

    const selectionBox = new SKContainer({
      fill: "white",
      width: 600,
      height: 500,
      padding: 30
    });
    selectionBox.radius = 15;

    const title = new SKLabel({
      text: "Select a Recipe to Cook",
      fill: "",
      width: 540,
      height: 50,
      x: 30,
      y: 30
    });
    title.font = "bold 1.8em Arial";
    title.fontColour = "#2c3e50";
    title.align = "centre";
    selectionBox.addChild(title);

    // Recipe buttons
    let currentY = 100;
    recipes.forEach(recipe => {
      const recipeBtn = new SKButton({
        text: recipe.title,
        width: 540,
        height: 60,
        x: 30,
        y: currentY
      });
      recipeBtn.fill = "#667eea";
      recipeBtn.fontColour = "white";
      recipeBtn.radius = 10;
      recipeBtn.font = "bold 1.2em Arial";
      recipeBtn.addEventListener("action", () => {
        this.mainView.getRoot().removeChild(modal);
        if (this.onStartCooking) {
          this.onStartCooking(recipe.id);
      }
      return true;
    });
      selectionBox.addChild(recipeBtn);
      currentY += 75;
    });

    // Cancel button
    const cancelBtn = new SKButton({
      text: "Cancel",
      width: 540,
      height: 50,
      x: 30,
      y: 420
    });
    cancelBtn.fill = "#95a5a6";
    cancelBtn.fontColour = "white";
    cancelBtn.radius = 10;
    cancelBtn.addEventListener("action", () => {
      this.mainView.getRoot().removeChild(modal);
      return true;
    });
    selectionBox.addChild(cancelBtn);

    modal.addChild(selectionBox);
    this.mainView.getRoot().addChild(modal);
  }

  showCookingMode(recipe: Recipe, currentStep: string, stepIndex: number, totalSteps: number) {
    this.showCookingView();
    this.cookingView.render(recipe, currentStep, stepIndex, totalSteps);
  }

  showFullRecipe(recipe: Recipe, steps: string[], completedSteps: Set<number>, currentStepIndex: number) {
    const modal = new SKContainer({
      fill: "rgba(0, 0, 0, 0.8)",
      fillWidth: 1,
      fillHeight: 1,
      layoutMethod: new Layout.CentredLayout()
    });

    const fullRecipeBox = new SKContainer({
      fill: "white",
      width: 800,
      height: 700,
      padding: 30
    });
    fullRecipeBox.radius = 15;

    // Title
    const title = new SKLabel({
      text: `📋 ${recipe.title} - Full Recipe`,
      fill: "",
      width: 740,
      height: 50,
      x: 30,
      y: 30
    });
    title.font = "bold 1.8em Arial";
    title.fontColour = "#2c3e50";
    title.align = "centre";
    fullRecipeBox.addChild(title);

    // Ingredients
    const ingredientsLabel = new SKLabel({
      text: `Ingredients:\n${recipe.ingredients}`,
      fill: "",
      width: 740,
      height: 100,
      x: 30,
      y: 90
    });
    ingredientsLabel.font = "1em Arial";
    ingredientsLabel.fontColour = "#555";
    ingredientsLabel.align = "left";
    fullRecipeBox.addChild(ingredientsLabel);

    // Steps with checkmarks
    const stepsTitle = new SKLabel({
      text: "Steps:",
      fill: "",
      width: 740,
      height: 30,
      x: 30,
      y: 200
    });
    stepsTitle.font = "bold 1.2em Arial";
    stepsTitle.fontColour = "#2c3e50";
    stepsTitle.align = "left";
    fullRecipeBox.addChild(stepsTitle);

    let currentY = 240;
    steps.forEach((step, index) => {
      const isCompleted = completedSteps.has(index);
      const isCurrent = index === currentStepIndex;
      
      const checkmark = isCompleted ? "✓" : (isCurrent ? "▶" : "○");
      const color = isCompleted ? "#27ae60" : (isCurrent ? "#667eea" : "#999");
      
      const stepLabel = new SKLabel({
        text: `${checkmark} ${index + 1}. ${step}`,
        fill: "",
        width: 740,
        height: 35,
        x: 30,
        y: currentY
      });
      stepLabel.font = isCompleted ? "bold 1em Arial" : "1em Arial";
      stepLabel.fontColour = color;
      stepLabel.align = "left";
      fullRecipeBox.addChild(stepLabel);
    currentY += 40;

      if (currentY > 600) return; // Prevent overflow
    });

    // Close button
    const closeBtn = new SKButton({
      text: "Close",
      width: 740,
      height: 50,
      x: 30,
      y: 630
    });
    closeBtn.fill = "#667eea";
    closeBtn.fontColour = "white";
    closeBtn.radius = 10;
    closeBtn.font = "bold 1.1em Arial";
    closeBtn.addEventListener("action", () => {
      this.cookingView.getRoot().removeChild(modal);
      return true;
    });
    fullRecipeBox.addChild(closeBtn);

    modal.addChild(fullRecipeBox);
    this.cookingView.getRoot().addChild(modal);
  }

  hideCookingMode() {
    this.showMainView();
  }

  getRoot(): SKContainer {
    return this.root;
  }
}
