import {
  Component,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { PlaceHolderDirective } from '../shared/place-holder/place-holder.directive';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent{
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceHolderDirective) alertHost: PlaceHolderDirective;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    let authObr: Observable<AuthResponseData>;
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const confirmPassword = form.value.confirmPassword;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObr = this.authService.login(email, password);
    } else {
      if (password !== confirmPassword) {
        this.isLoading = false;
        this.error = 'Passwords do not match';
      } else {
        authObr = this.authService.signUp(email, password);
      }
    }
    authObr.subscribe(
      (response) => {
        // console.log(response, "akshata");
        this.router.navigate(['/recipes']);
        this.isLoading = false;

      },
      (errorMessage) => {
        // console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
    form.reset();
  }

}
