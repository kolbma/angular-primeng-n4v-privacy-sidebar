import { TestBed, async } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { PrivacySidebarModule, CookieService } from '../../lib';
import { Observer } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserAnimationsModule,
        PrivacySidebarModule
      ],
      providers: [CookieService]
    }).compileComponents();
    localStorage.removeItem(CookieService.STORAGE_ACCEPT_KEY);
  }));

  afterEach(() => { TestBed.resetTestingModule(); });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should set styleClass', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.n4v-ui-privacy-sidebar.testclass')).toBeTruthy();
  });

  it('should close on accept cookie', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.n4v-ui-privacy-sidebar')).toBeTruthy();
    compiled.querySelector('button').click();
    expect(compiled.querySelector('div.n4v-ui-privacy-sidebar')).toBeFalsy();
  });

  it('should not be in DOM when accepted', () => {
    localStorage.setItem(CookieService.STORAGE_ACCEPT_KEY, 'true');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.n4v-ui-privacy-sidebar')).toBeFalsy();
  });

  it('should notice the observer', () => {
    try {
      localStorage.removeItem(CookieService.STORAGE_ACCEPT_KEY);
    } catch (err) {
      console.error(err.stack);
    }
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app: AppComponent = fixture.debugElement.componentInstance;
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.n4v-ui-privacy-sidebar')).toBeTruthy();

    let check = 0;
    const observer: Observer<boolean> = {
      complete: () => {
        console.log('cookieService completed');
        check++;
      },
      error: (err: Error) => {
        console.error(err.message, err.stack);
        expect(err).toBeUndefined();
      },
      next: value => {
        console.log('detected a cookieService value change: %s', value.toString());
        expect(value).toBeTruthy();
        check++;
      }
    };
    try {
      app.getCookieService().subscribe(observer);

      compiled.querySelector('button').click();
      expect(compiled.querySelector('div.n4v-ui-privacy-sidebar')).toBeFalsy();
      setTimeout(() => { expect(check).toBe(2, 'check is ' + check); }, 500);
    } catch (err) {
      console.error(err.stack);
    }
  });

});
