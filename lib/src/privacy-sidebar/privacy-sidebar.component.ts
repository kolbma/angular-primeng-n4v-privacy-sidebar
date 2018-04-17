import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { ContentService } from './content.service';
import { CookieService } from './cookie.service';

/**
 * A finished component which displays a bottom sidebar with information about privacy policy.
 *
 * The selector accepts multiple overwrite possibilities:
 *
 * styleClass: append your class to the css class attributes
 *
 * privacyUrl: the url for linking to the privacy policy
 *
 * sidebarContent: provide a fixed content
 *
 * sidebarHeader: provide a fixed header
 *
 * sidebarFooter: provide a fixed header (with {{LINK}}Privacy Policy Link Text{{LINK}} it is possible to include the url)
 *
 * acceptCookies: provide a fixed button label
 *
 * declineCookies: provide a fixed button label
 *
 */
@Component({
  selector: 'n4v-privacy-sidebar',
  templateUrl: './privacy-sidebar.component.html',
  styleUrls: ['./privacy-sidebar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PrivacySidebarComponent implements OnInit {
  @Input() styleClass = '';
  @Input() privacyUrl = '';
  @Input() sidebarContent = '';
  @Input() sidebarHeader = '';
  @Input() sidebarFooter = '';
  @Input() acceptCookies = '';
  @Input() declineCookies = '';

  protected visible = true;
  protected customClass = '';

  constructor(private element: ElementRef, private contentService: ContentService, private cookieService: CookieService) {
  }

  ngOnInit() {
    if (this.hasAcceptedCookies() && this.cookieService.closeOnAccept) {
      this.element.nativeElement.remove();
    } else {
      if (this.styleClass.length > 0) {
        this.customClass = this.styleClass.startsWith(' ') ? this.styleClass : ' ' + this.styleClass;
      }
      if (this.sidebarContent.length !== 0 && this.sidebarFooter.length !== 0 && this.sidebarHeader.length !== 0
        && this.acceptCookies.length !== 0 && this.declineCookies.length !== 0 && this.privacyUrl.length !== 0) {
        console.log('all values provided no lookup required');
        this.sidebarFooter = ContentService.replaceLink(this.sidebarFooter, this.privacyUrl);
      } else {
        this.contentService.getJSON()
          .then(json => {
            if (this.sidebarHeader.length === 0) {
              this.sidebarHeader = json[ContentService.HEADER_KEY];
            }
            if (this.sidebarContent.length === 0) {
              this.sidebarContent = json[ContentService.CONTENT_KEY];
            }
            if (this.sidebarFooter.length === 0) {
              this.sidebarFooter = json[ContentService.FOOTER_KEY];
            }
            if (this.privacyUrl.length === 0) {
              this.privacyUrl = json[ContentService.URL_KEY];
            }
            if (this.acceptCookies.length === 0) {
              this.acceptCookies = json[ContentService.ACCEPT_KEY];
            }
            if (this.declineCookies.length === 0) {
              this.declineCookies = json[ContentService.DECLINE_KEY];
            }
            this.sidebarFooter = ContentService.replaceLink(this.sidebarFooter, this.privacyUrl);
          })
          .catch((err: Error) => { console.error('getJSON failed: %s', err.stack); });
      }
      localStorage.removeItem(CookieService.STORAGE_ACCEPT_KEY);
    }
  }

  protected hasAcceptedCookies(): boolean {
    return this.cookieService.isCookieAccepted();
  }

  /**
   * Event handler for accept and decline buttons
   *
   * @param evt the handler got called from
   * @param action argument passed by Event call
   * @memberof PrivacySidebarComponent
   */
  onClick(evt: Event, action: string) {
    if (action === 'accept') {
      this.cookieService.acceptCookie();
    }
    if (this.cookieService.closeOnClick || (action === 'accept' && this.cookieService.closeOnAccept)) {
      this.visible = false;
      this.element.nativeElement.remove();
    }
  }
}
