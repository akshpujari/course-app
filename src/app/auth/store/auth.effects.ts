import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment.prod";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { User } from "../user.model";
import { AuthService } from "../auth.service";
import * as AuthActions from './auth.actions'

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: string;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const userRes = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(userRes));
    return new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
        redirect: true
    });
}

const handleError = (errorRes: any) => {
    let errorMassage = "Unknow error occurred";
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMassage));
    }
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMassage = "Email exists already";
            break;
        case 'EMAIL_NOT_FOUND':
            errorMassage = "Email not found";
            break;
        case 'INVALID_PASSWORD':
            errorMassage = "Invalid password"
            break;
    }
    return of(new AuthActions.AuthenticateFail(errorMassage));
}

@Injectable()
export class AuthEffects {
    authSignup = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.fireBaseAPIKey,
                {
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }).pipe(tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                }), map(resData => {
                    return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);

                }), catchError(errorRes => {
                    return handleError(errorRes)
                }));
        })
    ))

    authLogin = createEffect(() => this.actions$.pipe(  // ngrx will subscribe
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.fireBaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }).pipe(tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                }),
                    map(resData => {
                        return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
                    }
                    ), catchError(errorRes => {
                        return handleError(errorRes)
                    }));
        })
    ))

    authAutoLogin = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string;
                id: string;
                _token: string;
                _tokenExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                return { type: 'DUMMY' };
            }

            const loadedUser = new User(
                userData.email,
                userData.id,
                userData._token,
                new Date(userData._tokenExpirationDate)
            );

            if (loadedUser.token) {
                const expirationDuration =
                    new Date(userData._tokenExpirationDate).getTime() -
                    new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration);
                return new AuthActions.AuthenticateSuccess({
                    email: loadedUser.email,
                    userId: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate),
                    redirect: false
                });
            }
            return { type: 'DUMMY' };
        })
    ));

    authRedirect = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
            if (authSuccessAction.payload.redirect) {
                // console.log("Redirect "+authSuccessAction.payload.redirect)
                this.router.navigate(['/']);
            }

        })), { dispatch: false })


    authLogout = createEffect(() => this.actions$.pipe(ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })), { dispatch: false })

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) { }
}
