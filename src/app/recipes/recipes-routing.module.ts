import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipesDetailComponent } from "./recipes-detail/recipes-detail.component";
import { RecipesStartComponent } from "./recipes-start/recipes-start.component";
import { RecipesComponent } from "./recipes.component";
import { RecipeResolverService } from "./recipes.resolver.service";

const routes: Routes = [
    {
        path: '', component: RecipesComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: RecipesStartComponent, resolve: [RecipeResolverService] },
            { path: 'new', component: RecipeEditComponent },
            { path: ':id', component: RecipesDetailComponent, resolve: [RecipeResolverService] },
            { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipeResolverService] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipeRoutingModule {

}