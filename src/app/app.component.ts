import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import * as AuthActions from './auth/store/auth.actions';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer'
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<fromApp.AppState>,
    @Inject(PLATFORM_ID) private platformId
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(new AuthActions.AuthLogin());
    }
  }
}
