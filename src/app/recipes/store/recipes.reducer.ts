import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipes.actions'

export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: []
}

export function RecipesReducer(state = initialState, action: RecipesActions.RecipesActions) {
    switch (action.type) {
        case RecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            }
        case RecipesActions.ADD_RECIPES:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            }
        case RecipesActions.UPDATE_RECIPES:
            const updatedRecipe = {
                ...state.recipes[action.payload.index],
                ...action.payload.newRecipe
            };// Single recipes which is updating 

            const updatedRecipes = [...state.recipes];
            updatedRecipes[action.payload.index]=updatedRecipe; // coping new to that index recipes
            return {
                ...state,
                recipes:updatedRecipes
            }
        case RecipesActions.DELETE_RECIPES:
            return{
                ...state,
                recipes:state.recipes.filter((recipe,index)=>{ // return new list
                    return index !== action.payload;
                })
            }
        default:
            return state;
    }
}