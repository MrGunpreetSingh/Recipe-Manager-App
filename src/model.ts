export interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  categoryId?: number;
  tagIds: number[];
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface CookingSession {
  recipeId: number;
  currentStepIndex: number;
  completedSteps: Set<number>;
}

export class Model {
  private recipes: Recipe[] = [];
  private categories: Category[] = [];
  private tags: Tag[] = [];
  private cookingSession: CookingSession | null = null;

  addRecipe(title: string, ingredients: string, instructions: string, categoryId?: number, tagIds: number[] = []) {
    const newId = this.recipes.length > 0
      ? Math.max(...this.recipes.map(r => r.id)) + 1
      : 1;
    this.recipes.push({
      id: newId,
      title,
      ingredients,
      instructions,
      categoryId,
      tagIds
    });
  }

  updateRecipe(id: number, data: Partial<Recipe>) {
    const recipe = this.recipes.find(r => r.id === id);
    if (recipe) {
      Object.assign(recipe, data);
    }
  }

  deleteRecipe(id: number) {
    this.recipes = this.recipes.filter(r => r.id !== id);
  }

  getRecipes(): Recipe[] {
    return [...this.recipes];
  }

  getRecipeById(id: number): Recipe | undefined {
    return this.recipes.find(r => r.id === id);
  }

  // Parse instructions into steps (bullet points)
  parseSteps(instructions: string): string[] {
    const lines = instructions.split('\n');
    const steps: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      // Match bullet points: -, •, *, or numbered lists
      if (trimmed.match(/^[-•*]\s+/) || trimmed.match(/^\d+\.\s+/)) {
        // Remove bullet/number prefix
        const cleanStep = trimmed.replace(/^[-•*]\s+/, '').replace(/^\d+\.\s+/, '');
        if (cleanStep) {
          steps.push(cleanStep);
        }
      }
    }
    
    return steps.length > 0 ? steps : [instructions]; // Fallback to full text if no bullets found
  }

  // Cooking Session Management
  startCooking(recipeId: number) {
    this.cookingSession = {
      recipeId,
      currentStepIndex: 0,
      completedSteps: new Set()
    };
  }

  getCookingSession(): CookingSession | null {
    return this.cookingSession;
  }

  nextStep() {
    if (this.cookingSession) {
      const recipe = this.getRecipeById(this.cookingSession.recipeId);
      if (recipe) {
        const steps = this.parseSteps(recipe.instructions);
        this.cookingSession.completedSteps.add(this.cookingSession.currentStepIndex);
        if (this.cookingSession.currentStepIndex < steps.length - 1) {
          this.cookingSession.currentStepIndex++;
        }
      }
    }
  }

  previousStep() {
    if (this.cookingSession && this.cookingSession.currentStepIndex > 0) {
      this.cookingSession.currentStepIndex--;
    }
  }

  endCooking() {
    this.cookingSession = null;
  }

  isStepCompleted(stepIndex: number): boolean {
    return this.cookingSession?.completedSteps.has(stepIndex) || false;
  }

  addCategory(name: string, color: string) {
    const newId = this.categories.length > 0
      ? Math.max(...this.categories.map(c => c.id)) + 1
      : 1;
    this.categories.push({ id: newId, name, color });
  }

  updateCategory(id: number, name: string, color: string) {
    const category = this.categories.find(c => c.id === id);
    if (category) {
      category.name = name;
      category.color = color;
    }
  }

  deleteCategory(id: number) {
    this.categories = this.categories.filter(c => c.id !== id);
    this.recipes.forEach(recipe => {
      if (recipe.categoryId === id) {
        recipe.categoryId = undefined;
      }
    });
  }

  getCategories(): Category[] {
    return [...this.categories];
  }

  getCategoryById(id: number): Category | undefined {
    return this.categories.find(c => c.id === id);
  }

  addTag(name: string) {
    const newId = this.tags.length > 0
      ? Math.max(...this.tags.map(t => t.id)) + 1
      : 1;
    this.tags.push({ id: newId, name });
  }

  updateTag(id: number, name: string) {
    const tag = this.tags.find(t => t.id === id);
    if (tag) {
      tag.name = name;
    }
  }

  deleteTag(id: number) {
    this.tags = this.tags.filter(t => t.id !== id);
    this.recipes.forEach(recipe => {
      recipe.tagIds = recipe.tagIds.filter(tid => tid !== id);
    });
  }

  getTags(): Tag[] {
    return [...this.tags];
  }

  getTagById(id: number): Tag | undefined {
    return this.tags.find(t => t.id === id);
  }
}

