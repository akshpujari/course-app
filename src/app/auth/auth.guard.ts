import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map } from "rxjs/operators";
import *as fromApp from '../store/app.reducer'
import { Store } from "@ngrx/store";
import * as AuthActions from "./store/auth.actions";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) { }

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
        return this.store.select('auth').pipe(
            map(authState => {
                if (authState.initialUser) {
                    return authState.initialUser; //select gives object not user data so need to map
                } else {
                    // Try local storage
                    this.store.dispatch(new AuthActions.AuthLogin());
                }
            }),
            map(user => {
                const isAuth = !!user;
                if (isAuth) {
                    return true;
                }
                return this.router.createUrlTree(['/auth']);

            }));
    }
}