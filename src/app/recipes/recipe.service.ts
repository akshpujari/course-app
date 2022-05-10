//Recipe Service is not using currently
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    recipeChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [];
    constructor(private slService: ShoppingListService, private http:HttpClient) { }

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }
    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipeChanged.next(this.recipes.slice());
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients)
    }
    addRecipe(newRecipe: Recipe) {
        this.recipes.push(newRecipe);
        this.recipeChanged.next(this.recipes.slice());
    }
    updateRecipe(index: number, updatedRecipe: Recipe) {
        this.recipes[index] = updatedRecipe;
        this.recipeChanged.next(this.recipes.slice());
    }
    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipeChanged.next(this.recipes.slice());
    }
}
