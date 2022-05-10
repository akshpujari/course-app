import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LoadingSpinnerComponent } from "./loading.spinner/loading-spinner.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { PlaceHolderDirective } from "./place-holder/place-holder.directive";

@NgModule({
    declarations:[
        LoadingSpinnerComponent,
        PlaceHolderDirective,
        NotFoundComponent

    ],
    imports:[
        CommonModule
    ],
    exports:[
        LoadingSpinnerComponent,
        PlaceHolderDirective,
        CommonModule,
        NotFoundComponent   
    ]
})
export class SharedModule{

}