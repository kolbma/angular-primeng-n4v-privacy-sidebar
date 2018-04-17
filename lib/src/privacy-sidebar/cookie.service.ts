import { Injectable } from '@angular/core';
import { Observable, Observer, Subscriber, Subscription } from 'rxjs';
import { TeardownLogic } from 'rxjs/Subscription';

/**
 * CookieService is Injectable and can be used to react on cookie accept or decline.
 * Subscribe your Observer object.
 */
@Injectable()
export class CookieService {
  static readonly STORAGE_ACCEPT_KEY = 'cookieAccept';

  private readonly observable: Observable<boolean>;
  private readonly observers: Observer<boolean>[] = [];
  private _closeOnClick = true;
  private _closeOnAccept = true;

  constructor() {
    this.observable = new Observable<boolean>((subscriber: Subscriber<boolean>) => { });
  }

  /**
   * Close privacy-sidebar after user has clicked a button. Default is true.
   *
   * @memberof CookieService
   */
  get closeOnClick(): boolean {
    return this._closeOnClick;
  }

  set closeOnClick(value: boolean) {
    this._closeOnClick = value;
  }

  /**
   * Close privacy-sidebar after user has clicked accept button. Default is true.
   *
   * @memberof CookieService
   */
  get closeOnAccept(): boolean {
    return this._closeOnAccept;
  }

  set closeOnAccept(value: boolean) {
    this._closeOnAccept = value;
  }

  /**
   * Signal that user has accepted cookies.
   *
   * @memberof CookieService
   */
  acceptCookie() {
    localStorage.setItem(CookieService.STORAGE_ACCEPT_KEY, true.toString());
    this.observers.forEach(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  /**
   * Check if user has accepted cookies.
   *
   * @returns true on accepted cookies
   * @memberof CookieService
   */
  isCookieAccepted(): boolean {
    let accepted = false;
    const s = localStorage.getItem(CookieService.STORAGE_ACCEPT_KEY);
    if (s) {
      accepted = s.toLowerCase() === 'true';
    }
    return accepted;
  }

  /**
   * Subscribe your Observer to CookieService Observable to get signaled on value change.
   *
   * @param observer
   * @returns Subscription
   * @memberof CookieService
   */
  subscribe(observer: Observer<boolean>): Subscription {
    if (!observer) {
      console.error('missing observer');
    }
    const subscription = this.observable.subscribe(observer);
    this.observers.push(observer);
    subscription.add(this.subscriptionTeardown(observer));
    return subscription;
  }

  protected subscriptionTeardown(observer: Observer<boolean>): TeardownLogic {
    const o = observer;
    return () => {
      for (let i = 0; i < this.observers.length; i++) {
        if (this.observers[i] === o) {
          this.observers.splice(i, 1);
          break;
        }
      }
    };
  }
}
