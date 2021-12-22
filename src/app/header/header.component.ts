import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions'
import * as RecipesActions from '../recipes/store/recipes.actions'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userSub: Subscription;
  isAuthenticated = false;
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.userSub = this.store.select('auth').pipe(map(authState => authState.initialUser)).subscribe(user => { //select gives object not user so need to map
      this.isAuthenticated = !!user;
      // console.log(!user); true
      // console.log(!!user); false
    });
  }

  onSaveData() {
    this.store.dispatch(new RecipesActions.StoreRecipe());
  }

  onFetchData() {
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }

  onlogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
