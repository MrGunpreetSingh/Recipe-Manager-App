import { Model } from "./model";
import { View } from "./view";

export class Controller {
  constructor(private model: Model, private view: View) {
    this.setupHandlers();
  }

  private setupHandlers() {
    this.view.onAddRecipe = (title: string, ingredients: string, instructions: string) => {
      if (title && ingredients && instructions) {
        this.model.addRecipe(title, ingredients, instructions);
        this.updateRecipeList();
      }
    };

    this.view.onDeleteRecipe = (id: number) => {
      this.model.deleteRecipe(id);
      this.updateRecipeList();
    };

    this.view.onStartCooking = (recipeId?: number) => {
      const recipes = this.model.getRecipes();
      if (recipes.length === 0) return;
      if (recipeId !== undefined) {
        this.startCookingSession(recipeId);
      } else if (recipes.length === 1) {
        this.startCookingSession(recipes[0].id);
      } else {
        this.view.showRecipeSelection(recipes);
      }
    };

    this.view.onNextStep = () => {
      const session = this.model.getCookingSession();
      if (!session) return;
      const recipe = this.model.getRecipeById(session.recipeId);
      if (!recipe) return;
      const steps = this.model.parseSteps(recipe.instructions);
      if (session.currentStepIndex === steps.length - 1) {
        this.model.nextStep();
        this.model.endCooking();
        this.view.hideCookingMode();
        this.updateRecipeList();
      } else {
        this.model.nextStep();
        this.updateCookingView();
      }
    };

    this.view.onPreviousStep = () => {
      this.model.previousStep();
      this.updateCookingView();
    };

    this.view.onShowFullRecipe = () => {
      const session = this.model.getCookingSession();
      if (!session) return;
      const recipe = this.model.getRecipeById(session.recipeId);
      if (!recipe) return;
      const steps = this.model.parseSteps(recipe.instructions);
      this.view.showFullRecipe(recipe, steps, session.completedSteps, session.currentStepIndex);
    };

    this.view.onEndCooking = () => {
      this.model.endCooking();
      this.view.hideCookingMode();
      this.updateRecipeList();
    };

    this.view.onAddCategory = (name: string, color: string) => {
      if (name && color) {
        this.model.addCategory(name, color);
        this.updateRecipeList();
      }
    };

    this.view.onUpdateCategory = (id: number, name: string, color: string) => {
      if (name && color) {
        this.model.updateCategory(id, name, color);
        this.updateRecipeList();
      }
    };

    this.view.onDeleteCategory = (id: number) => {
      this.model.deleteCategory(id);
      this.updateRecipeList();
    };

    this.view.onAddTag = (name: string) => {
      if (name) {
        this.model.addTag(name);
        this.updateRecipeList();
      }
    };

    this.view.onUpdateTag = (id: number, name: string) => {
      if (name) {
        this.model.updateTag(id, name);
        this.updateRecipeList();
      }
    };

    this.view.onDeleteTag = (id: number) => {
      this.model.deleteTag(id);
      this.updateRecipeList();
    };
  }

  private startCookingSession(recipeId: number) {
    this.model.startCooking(recipeId);
    this.updateCookingView();
  }

  private updateCookingView() {
    const session = this.model.getCookingSession();
    if (!session) return;
    const recipe = this.model.getRecipeById(session.recipeId);
    if (!recipe) return;
    const steps = this.model.parseSteps(recipe.instructions);
    const currentStep = steps[session.currentStepIndex];
    this.view.showCookingMode(recipe, currentStep, session.currentStepIndex, steps.length);
  }

  private updateRecipeList() {
    const recipes = this.model.getRecipes();
    this.view.setCategories(this.model.getCategories());
    this.view.setTags(this.model.getTags());
    this.view.renderRecipes(recipes);
  }

  start() {
    this.model.addCategory("Breakfast", "#FFD700");
    this.model.addCategory("Lunch", "#87CEEB");
    this.model.addCategory("Dinner", "#FF6347");
    this.model.addCategory("Dessert", "#FF69B4");

    this.model.addTag("Quick");
    this.model.addTag("Easy");
    this.model.addTag("Vegetarian");
    this.model.addTag("Italian");
    this.model.addTag("Healthy");

    this.model.addRecipe(
      "Spaghetti Carbonara",
      "400g spaghetti, 200g pancetta, 4 eggs, 100g parmesan, black pepper, salt",
      `- Boil water and cook spaghetti according to package directions
- Fry pancetta in a pan until crispy
- Beat eggs with grated parmesan and black pepper
- Drain pasta and mix with pancetta
- Remove from heat and stir in egg mixture
- Serve immediately with extra parmesan`,
      3,
      [4]
    );

    this.model.addRecipe(
      "Chocolate Chip Cookies",
      "2 cups flour, 1 cup butter, 1 cup sugar, 2 eggs, 2 cups chocolate chips, 1 tsp vanilla",
      `• Preheat oven to 350°F (175°C)
• Cream butter and sugar together
• Beat in eggs and vanilla
• Mix in flour gradually
• Fold in chocolate chips
• Drop spoonfuls on baking sheet
• Bake for 10-12 minutes until golden
• Cool on wire rack`,
      4,
      [1, 2]
    );

    this.model.addRecipe(
      "Caesar Salad",
      "1 romaine lettuce, 1/2 cup parmesan, 1 cup croutons, caesar dressing",
      `1. Wash and chop romaine lettuce
2. Add croutons to a large bowl
3. Pour caesar dressing over lettuce
4. Toss everything together
5. Top with shaved parmesan
6. Serve immediately`,
      2,
      [1, 5]
    );

    this.updateRecipeList();
  }
}
