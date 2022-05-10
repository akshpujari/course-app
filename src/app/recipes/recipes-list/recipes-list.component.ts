import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})

export class RecipesListComponent implements OnInit, OnDestroy {
  recipes :Recipe[]
  subcription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recipeService: RecipeService) { }

  ngOnInit() {
    this.subcription = this.recipeService.recipeChanged
    .subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      });
      // this.route.data.subscribe(response => {
      //   // console.log(response);
      // });
      this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route })
  }

  ngOnDestroy() {
    this.subcription.unsubscribe();
  }
}
