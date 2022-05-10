import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataStoreService } from '../shared/data-store-service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userSub: Subscription;
  isAuthenticated = false;
  constructor( private dataStorageService:DataStoreService, private authService:AuthService) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => { //select gives object not user so need to map
      this.isAuthenticated = !!user;
      // console.log(!user); true
      // console.log(!!user); false
    });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes()
  }

  onFetchData() {
    this.dataStorageService.fetchRecipe();
  }

  onlogout() {
    this.authService.logout()
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
