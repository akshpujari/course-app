import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { switchMap, map, withLatestFrom } from "rxjs/operators";
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipes.actions';
import * as fromApp from '../../store/app.reducer'

@Injectable()
export class RecipeEffects {
    fetchRecipes =
        createEffect(() =>
            this.action$.pipe(ofType(RecipesActions.FETCH_RECIPES)
                , switchMap(() => {
                    return this.http.get<Recipe[]>('https://ng-course-app-7eba1-default-rtdb.firebaseio.com/recipe.json')
                }), map(recipes => {
                    if (!recipes) {
                        return [];
                    }
                    return recipes.map(recipe => {
                        return {
                            ...recipe,
                            ingredients: recipe.ingredients ? recipe.ingredients : []
                        }
                    })
                }), map((recipes) => {
                    return new RecipesActions.SetRecipes(recipes);
                }))
        );

    storeRecipes = createEffect(() =>
        this.action$.pipe(ofType(RecipesActions.STORE_RECIPES),
            withLatestFrom(this.store.select('recipes')),
            switchMap(([actionData, recipesState]) => {
                return this.http.put('https://ng-course-app-7eba1-default-rtdb.firebaseio.com/recipe.json', recipesState.recipes);
            })), { dispatch: false }
    );
    constructor(private action$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) { }
}