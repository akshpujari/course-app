import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthInterceptorsService } from "./auth/auth.interceptors";

@NgModule({
    providers:[
    {
      provide:
        HTTP_INTERCEPTORS,
        useClass: AuthInterceptorsService,
        multi: true
    }
    ]
})
export class CoreModule{

}