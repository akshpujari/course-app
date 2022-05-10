import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';

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
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  token: string = null;
  private tokenExpirationTimer: any;
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBeUTmRDleWfBS7cphbHlBf3oA4ZHybF-I',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            +resData.expiresIn,
            resData.email,
            resData.localId,
            resData.idToken
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBeUTmRDleWfBS7cphbHlBf3oA4ZHybF-I',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            +resData.expiresIn,
            resData.email,
            resData.localId,
            resData.idToken
          );
        })
        );
    }
    autologin() {
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
          this.user.next(loadedUser);
          const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
          this.autoLogout(expirationDuration)
      }
    }
    
    logout() {
        this.user.next(null);
        this.router.navigate(['./auth']);
        localStorage.removeItem('userData');
        this.clearLogoutTimer;
    }

    autoLogout(expirationDate: number) {
      this.tokenExpirationTimer = setTimeout(() => {
        this.logout()
      }, expirationDate);
    }
  
    clearLogoutTimer() {
      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
        this.tokenExpirationTimer = null;
      }
    }
    
    handleError = (errorRes: any) => {
        let errorMassage = 'Unknow error occurred';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMassage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
        errorMassage = 'Email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMassage = 'Email not found';
        break;
      case 'INVALID_PASSWORD':
        errorMassage = 'Invalid password';
        break;
    }
    return throwError(errorMassage);
  };

  handleAuthentication = (
    expiresIn: number,
    email: string,
    userId: string,
    token: string
  ) => {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const userRes = new User(email, userId, token, expirationDate);
    this.user.next(userRes)
    localStorage.setItem('userData', JSON.stringify(userRes));
    this.autoLogout(expiresIn * 1000)
  };
}
