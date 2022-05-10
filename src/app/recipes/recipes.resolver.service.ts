import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStoreService } from '../shared/data-store-service';
import { RecipeService } from './recipe.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeResolverService implements Resolve<Recipe[]> {
  constructor(
    private dataStorageService: DataStoreService,
    private recipeService: RecipeService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Recipe[] | Observable<Recipe[]> {
    const recipes = this.recipeService.getRecipes();
    if (recipes.length === 0) {
      return this.dataStorageService.fetchRecipe();
    }else{
      return recipes;
    }
  }
}
