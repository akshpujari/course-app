import { Injectable } from "@angular/core";
import * as fromApp from '../store/app.reducer'
import { Store } from "@ngrx/store";
import * as AuthActions from './store/auth.actions'

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    token: string = null;
    private tokenExpirationTimer: any
    constructor(private store: Store<fromApp.AppState>) { }

    setLogoutTimer(expirationDate: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout())
        }, expirationDate)
    }

    clearLogoutTimer() {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}