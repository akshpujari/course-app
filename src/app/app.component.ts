import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private authService : AuthService,
    @Inject(PLATFORM_ID) private platformId
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.autologin()
    }
  }
}
