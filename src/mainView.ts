import { Recipe, Category, Tag } from "./model";
import { SKContainer, SKLabel, SKButton, SKTextfield, Layout } from "../simplekit/src/imperative-mode";
import type { SKElement } from "../simplekit/src/widget/element";
import type { LayoutMethod, Size } from "../simplekit/src/layout";
import { BackgroundContainer } from "./backgroundContainer";

class HorizontalCenterLayout implements LayoutMethod {
  measure(elements: SKElement[]): Size {
    elements.forEach((el) => el.measure());
    const maxWidth = elements.length > 0 
      ? elements.reduce((acc, el) => Math.max(acc, el.intrinsicWidth), 0)
      : 0;
    const maxHeight = elements.length > 0
      ? elements.reduce((acc, el) => Math.max(acc, el.intrinsicHeight), 0)
      : 0;
    return { width: maxWidth, height: maxHeight };
  }

  layout(width: number, height: number, elements: SKElement[]): Size {
    if (elements.length === 0) {
      return { width: 0, height: 0 };
    }
    
    elements.forEach((el) => {
      // Measure the element first to get intrinsic size
      el.measure();
      
      // Calculate element size
      const w = el.fillWidth > 0 ? width : el.intrinsicWidth;
      const h = el.fillHeight > 0 ? height : el.intrinsicHeight;
      
      // Layout the element to get its actual rendered size
      el.layout(w, h);
      
      const centerX = width / 2;
      const elementCenterX = el.layoutWidth / 2;
      const newX = centerX - elementCenterX;
      
      el.x = newX;
      
    });
    
    return { width, height };
  }
}

export class MainView {
  private root: SKContainer;
  private mainContainer: SKContainer;
  private centeredWrapper: SKContainer;
  
  private titleInput!: SKTextfield;
  private ingredientsInput!: SKTextfield;
  private instructionsInput!: SKTextfield;
  private addButton!: SKButton;
  
  private recipeListContainer!: SKContainer;
  private categories: Category[] = [];
  private tags: Tag[] = [];
  
  public onAddRecipe?: (title: string, ingredients: string, instructions: string) => void;
  public onDeleteRecipe?: (id: number) => void;
  public onStartCooking?: (recipeId?: number) => void;

  constructor() {
    const backgroundImageUrl = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80";
    
    this.root = new BackgroundContainer(backgroundImageUrl, {
      fill: "transparent", // No fill - we only want the background image
      fillWidth: 1,
      fillHeight: 1,
      x: 0,
      y: 0,
      padding: 0,
      margin: 0
    });

    this.mainContainer = new SKContainer({
      fill: "transparent",
      fillWidth: 1,
      fillHeight: 1,
      padding: 0,
      margin: 0,
      layoutMethod: new HorizontalCenterLayout()
    });
    

    this.centeredWrapper = new SKContainer({
      fill: "transparent",
      width: 1000,
      fillHeight: 1,
      padding: 0,
      margin: 0
      // x and y will be set by layout
    });

    this.mainContainer.addChild(this.centeredWrapper);

    this.createHeader();
    this.createForm();
    this.createRecipeList();

    this.root.addChild(this.mainContainer);
  }

  private createHeader() {
    // Wrapper to center the header
    const headerWrapper = new SKContainer({
      fill: "transparent",
      fillWidth: 1,
      height: 110,
      y: 10,
      layoutMethod: new Layout.CentredLayout()
    });
    
    const headerContainer = new SKContainer({
      fill: "transparent", // More opaque for better text readability
      width: 800,
      height: 100,
      layoutMethod: new Layout.CentredLayout()
    });
    headerContainer.radius = 12;
    headerContainer.border = "rgba(92, 158, 173, 0.5)";

    const title = new SKLabel({
      text: "   Recipe Manager- Makes Cooking Easier!",
      fill: "",
      width: 620,
      height: 70
    });
    title.font = "bold 2.3em 'Segoe UI', Arial, sans-serif";
    title.fontColour = "#e07c1fff";
    title.align = "centre";
    headerContainer.addChild(title);
    headerWrapper.addChild(headerContainer);

    this.centeredWrapper.addChild(headerWrapper);
  }

  private createForm() {
    // Wrapper to center the form
    const formWrapper = new SKContainer({
      fill: "transparent",
      fillWidth: 1,
      height: 370,
      y: 130,
      layoutMethod: new Layout.CentredLayout()
    });

    const formContainer = new SKContainer({
      fill: "rgba(255, 255, 255, 0.75)", // More opaque for better text readability
      width: 1000,
      height: 450,
      padding: 20
    });
    formContainer.radius = 12;
    formContainer.border = "rgba(92, 158, 173, 0.3)";

    // Form title
    const formTitle = new SKLabel({
      text: "Add New Recipe",
      fill: "",
      width: undefined,
      height: 35,
      x: 20,
      y: 20
    });
    formTitle.font = "bold 1.5em Arial";
    formTitle.fontColour = "#333";
    formTitle.align = "left";
    formContainer.addChild(formTitle);

    let currentY = 65;

    // Recipe Title
    const titleLabel = new SKLabel({
      text: "Recipe Title:",
      fill: "",
      width: 180,
      height: 28,
      x: 20,
      y: currentY
    });
    titleLabel.font = "bold 1em Arial";
    titleLabel.fontColour = "#1f1e1eff";
    titleLabel.align = "left";
    formContainer.addChild(titleLabel);

    this.titleInput = new SKTextfield({
      text: "",
      width: 500,
      height: 40,
      fill: "white",
      border: "#5c9ead",
      x: 210,
      y: currentY
    });
    this.titleInput.radius = 6;
    this.titleInput.fontColour = "#333";
    formContainer.addChild(this.titleInput);

    currentY += 55;

    // Ingredients (Big Text Box)
    const ingredientsLabel = new SKLabel({
      text: "Ingredients:",
      fill: "",
      width: 180,
      height: 28,
      x: 20,
      y: currentY
    });
    ingredientsLabel.font = "bold 1em Arial";
    ingredientsLabel.fontColour = "#1b1b1bff";
    ingredientsLabel.align = "left";
    formContainer.addChild(ingredientsLabel);

    this.ingredientsInput = new SKTextfield({
      text: "",
      width: 500,
      height: 55,
      fill: "white",
      border: "#5c9ead",
      x: 210,
      y: currentY
    });
    this.ingredientsInput.radius = 6;
    this.ingredientsInput.fontColour = "#333";
    formContainer.addChild(this.ingredientsInput);

    currentY += 95;

    // Instructions (Big Text Box)
    const instructionsLabel = new SKLabel({
      text: "Instructions:",
      fill: "",
      width: 180,
      height: 28,
      x: 20,
      y: currentY
    });
    instructionsLabel.font = "bold 1em Arial";
    instructionsLabel.fontColour = "#1a1919ff";
    instructionsLabel.align = "left";
    formContainer.addChild(instructionsLabel);

    const instructionsHint = new SKLabel({
      text: "(Use bullet points: -, •, * or numbers)",
      fill: "",
      width: 500,
      height: 5,
      x: 210,
      y: currentY - 16
    });
    instructionsHint.font = "italic 0.8em Arial";
    instructionsHint.fontColour = "#474646ff";
    instructionsHint.align = "left";
    formContainer.addChild(instructionsHint);

    this.instructionsInput = new SKTextfield({
      text: "",
      width: 500,
      height: 80,
      fill: "white",
      border: "#5c9ead",
      x: 210,
      y: currentY
    });
    this.instructionsInput.radius = 6;
    this.instructionsInput.fontColour = "#333";
    formContainer.addChild(this.instructionsInput);

    let fakeY = currentY + 95;

const categoryLabel = new SKLabel({
  text: "Category:",
  width: 180,
  height: 28,
  x: 20,
  y: fakeY
});
categoryLabel.font = "bold 1em Arial";
categoryLabel.fontColour = "#0e0e0eff";
categoryLabel.align = "left";
formContainer.addChild(categoryLabel);

const fakeCategoryBox = new SKContainer({
  fill: "#f2f3f4",
  width:300,
  height: 38,
  border: "#ad5c70ff",
  x: 210,
  y: fakeY
});
fakeCategoryBox.radius = 7;
fakeCategoryBox.border = "#bbb";
fakeCategoryBox.addChild(new SKLabel({
  text: "           Lunch ▼", // Or any default/demo
  width: 200,
  height: 38,
  x: 8,
  y: 0,
  //font: "1em Arial"
}));
formContainer.addChild(fakeCategoryBox);

fakeY += 52;

// Fake Tag Select Box
const tagLabel = new SKLabel({
  text: "Tags:",
  width: 180,
  height: 28,
  x: 20,
  y: fakeY
});
tagLabel.font = "bold 1em Arial";
tagLabel.fontColour = "#161616ff";
tagLabel.align = "left";
formContainer.addChild(tagLabel);

const fakeTagBox = new SKContainer({
  fill: "#f2f3f4",
  width: 300,
  height: 38,
  border: "#5c9ead",
  x: 210,
  y: fakeY
});
fakeTagBox.radius = 7;
fakeTagBox.border = "#bbb";
fakeTagBox.addChild(new SKLabel({
  text: "                     Quick, Healthy ▼", // Or any tags you want to show
  width: 200,
  height: 38,
  x: 8,
  y: 0,
  //font: "1em Arial"
}));
formContainer.addChild(fakeTagBox);

    // Add Recipe Button
    this.addButton = new SKButton({
      text: "Add Recipe",
      width: 160,
      height: 45,
      x: 730,
      y: currentY + 135
    });
    this.addButton.fill = "#5c9ead";
    this.addButton.fontColour = "white";
    this.addButton.radius = 8;
    this.addButton.font = "bold 1em Arial";
    this.addButton.addEventListener("action", () => {
      if (this.onAddRecipe && this.titleInput.text.trim()) {
        this.onAddRecipe(
          this.titleInput.text.trim(),
          this.ingredientsInput.text.trim(),
          this.instructionsInput.text.trim()
        );
        this.clearForm();
      }
      return true;
    });
    formContainer.addChild(this.addButton);

    formWrapper.addChild(formContainer);
    this.centeredWrapper.addChild(formWrapper);
  }

  private createRecipeList() {
    // Single wrapper to center the entire recipes section
    const recipesWrapper = new SKContainer({
      fill: "transparent",
      fillWidth: 1,
      fillHeight: 1,
      y: 550,
      layoutMethod: new Layout.CentredLayout()
    });

    // Main recipes container with header and cards
    const recipesContainer = new SKContainer({
      fill: "rgba(255, 255, 255, 0.68)", // More opaque for better text readability
      width: 1000,
      height:300,
      fillHeight: 1,
      padding: 20
    });
    recipesContainer.radius = 12;
    recipesContainer.border = "rgba(92, 158, 173, 0.3)";

    // Header title
    const listTitle = new SKLabel({
      text: "📋 Your Recipes",
      fill: "",
      width: 960,
      height: 50,
      x: 20,
      y: 20
    });
    listTitle.font = "bold 1.6em Arial";
    listTitle.fontColour = "#020202ff";
    listTitle.align = "left";
    recipesContainer.addChild(listTitle);

    // Recipe cards container - positioned below title
    this.recipeListContainer = new SKContainer({
      fill: "transparent",
      layoutMethod: new Layout.WrapRowLayout({ gap: 20 }),
      width: 960,
      fillHeight: 1,
      x: 20,
      y: 80
    });
    
    recipesContainer.addChild(this.recipeListContainer);
    recipesWrapper.addChild(recipesContainer);
    this.centeredWrapper.addChild(recipesWrapper);
  }

  setCategories(categories: Category[]) {
    this.categories = categories;
  }

  setTags(tags: Tag[]) {
    this.tags = tags;
  }

  renderRecipes(recipes: Recipe[]) {
    this.recipeListContainer.clearChildren();

    const cardColors = [
      "rgba(255, 182, 193, 0.4)",
      "rgba(173, 216, 230, 0.4)",
      "rgba(255, 218, 185, 0.4)",
      "rgba(221, 160, 221, 0.4)",
      "rgba(144, 238, 144, 0.4)",
      "rgba(255, 255, 153, 0.4)",
    ];

    recipes.forEach((recipe, index) => {
      const colorIndex = index % cardColors.length;
      
      const card = new SKContainer({
        fill: cardColors[colorIndex],
        width: 300,
        height: 150,
        padding: 0
      });
      card.radius = 10;
      card.border = "rgba(92, 158, 173, 0.5)";

      const titleLabel = new SKLabel({
        text: recipe.title,
        fill: "",
        width: 300,
        height: 35,
        x: 0,
        y: 12
      });
      titleLabel.font = "bold 1.2em Arial";
      titleLabel.fontColour = "#2c3e50";
      titleLabel.align = "centre";
      card.addChild(titleLabel);

      const category = recipe.categoryId ? this.categories.find(c => c.id === recipe.categoryId) : null;
      if (category) {
        const categoryLabel = new SKLabel({
          text: category.name,
          fill: "",
          width: 300,
          height: 18,
          x: 0,
          y: 48
        });
        categoryLabel.font = "0.75em Arial";
        categoryLabel.fontColour = "#666";
        categoryLabel.align = "centre";
        card.addChild(categoryLabel);
      }

      const recipeTags = this.tags.filter(t => recipe.tagIds.includes(t.id));
      if (recipeTags.length > 0) {
        const tagsText = recipeTags.map(t => t.name).join(", ");
        const tagsLabel = new SKLabel({
          text: tagsText,
          fill: "",
          width: 300,
          height: 18,
          x: 0,
          y: 68
        });
        tagsLabel.font = "0.7em Arial";
        tagsLabel.fontColour = "#888";
        tagsLabel.align = "centre";
        card.addChild(tagsLabel);
      }

      const deleteBtn = new SKButton({
        text: "🗑️ Delete",
        width: 135,
        height: 38,
        x: 15,
        y: 100
      });
      deleteBtn.fill = "#e74c3c";
      deleteBtn.fontColour = "white";
      deleteBtn.radius = 6;
      deleteBtn.addEventListener("action", () => {
        if (this.onDeleteRecipe) {
          this.onDeleteRecipe(recipe.id);
        }
        return true;
      });
      card.addChild(deleteBtn);

      const cookBtn = new SKButton({
        text: "👨‍🍳 Cook This",
        width: 135,
        height: 38,
        x: 150,
        y: 100
      });
      cookBtn.fill = "#5c9ead";
      cookBtn.fontColour = "white";
      cookBtn.radius = 6;
      cookBtn.addEventListener("action", () => {
        if (this.onStartCooking) {
          this.onStartCooking(recipe.id);
        }
        return true;
      });
      card.addChild(cookBtn);

      this.recipeListContainer.addChild(card);

      const editBtn = new SKButton({
        text: "✏️ Edit",
        width: 135,
        height: 38,
        x: 95, // adjust horizontally beside Delete (e.g., Delete x: 15, Edit x: 155, Cook This x: 295)
        y: 145
        });
        editBtn.fill = "#f1c40f";      // Yellow for visibility
        editBtn.fontColour = "white";
        editBtn.radius = 6;
        editBtn.addEventListener("action", () => {
        alert("Edit not implemented yet!");
        });
        card.addChild(editBtn);

    });
  }

  clearForm() {
    this.titleInput.text = "";
    this.ingredientsInput.text = "";
    this.instructionsInput.text = "";
  }

  getRoot(): SKContainer {
    return this.root;
  }
}

