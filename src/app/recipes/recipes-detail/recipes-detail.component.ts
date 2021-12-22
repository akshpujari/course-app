import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { __param } from 'tslib';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer'
import { map, switchMap } from 'rxjs/operators';
import * as RecipeActions from '../store/recipes.actions'
import * as SlActions from '../../shopping-list/store/shopping-list.action'

@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.component.html',
  styleUrls: ['./recipes-detail.component.css']
})
export class RecipesDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.route.params.pipe(map(params => {
      return +params['id']
    }),
      switchMap(id => {
        this.id = id;
       return this.store.select('recipes');
      }),
      map(recipesState => {
        return recipesState.recipes.find((recipes, index) => {
          return index === this.id
        });
      })
    ).subscribe((recipes) => {
      this.recipe = recipes
    });
  }

  toAddToShoppingList() {
    this.store.dispatch(new SlActions.AddIngredients(this.recipe.ingredients))
    this.router.navigate(['/shopping-list']);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route })
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipeActions.DeleteRecipes(this.id));
    this.store.dispatch(new RecipeActions.StoreRecipe());
    this.router.navigate(['../'], { relativeTo: this.route })
  }

}
