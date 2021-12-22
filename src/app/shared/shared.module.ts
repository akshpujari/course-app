import { CommonModule } from "@angular/common";
import { Placeholder } from "@angular/compiler/src/i18n/i18n_ast";
import { NgModule } from "@angular/core";
import { LoadingSpinnerComponent } from "./loading.spinner/loading-spinner.component";
import { PlaceHolderDirective } from "./place-holder/place-holder.directive";

@NgModule({
    declarations:[
        LoadingSpinnerComponent,
        PlaceHolderDirective,

    ],
    imports:[
        CommonModule
    ],
    exports:[
        LoadingSpinnerComponent,
        PlaceHolderDirective,
        CommonModule    
    ]
})
export class SharedModule{

}