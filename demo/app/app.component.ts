import { Component, OnInit } from '@angular/core';
import { CookieService } from '../../lib';
import { Observer } from 'rxjs';

@Component({
  selector: 'n4v-app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css'
  ]
})
export class AppComponent implements OnInit {

  constructor(private cookieService: CookieService) {
    const observer: Observer<boolean> = {
      complete: () => { console.log('cookieService completed'); },
      error: (err: Error) => { console.error(err.stack); },
      next: value => { console.log('detected a cookieService value change: %s', value.toString()); }
    };
    this.cookieService.subscribe(observer);
  }

  getCookieService(): CookieService {
    return this.cookieService;
  }

  ngOnInit(): void {
  }
}
