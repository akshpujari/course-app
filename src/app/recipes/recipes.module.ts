import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipesDetailComponent } from "./recipes-detail/recipes-detail.component";
import { RecipeItemComponent } from "./recipes-list/recipe-item/recipe-item.component";
import { RecipesListComponent } from "./recipes-list/recipes-list.component";
import { RecipeRoutingModule } from "./recipes-routing.module";
import { RecipesStartComponent } from "./recipes-start/recipes-start.component";
import { RecipesComponent } from "./recipes.component";

@NgModule({
    declarations: [
        RecipesComponent,
        RecipesListComponent,
        RecipesDetailComponent,
        RecipeItemComponent,
        RecipesStartComponent,
        RecipeEditComponent
    ],
    imports: [
        RouterModule,
        ReactiveFormsModule,
        RecipeRoutingModule,
        SharedModule
    ]
})
export class RecipesModule {

}