import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { __param } from 'tslib';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import { RecipeService } from '../recipe.service';
import { DataStoreService } from 'src/app/shared/data-store-service';

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
    private recipeService:RecipeService,
    private dataStorageService:DataStoreService) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
      this.id = +params['id'];
      this.recipe = this.recipeService.getRecipe(this.id)
    })
  }

  toAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients)
    this.router.navigate(['/shopping-list']);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route })
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.dataStorageService.storeRecipes()
    this.router.navigate(['../'], { relativeTo: this.route })
  }

}
