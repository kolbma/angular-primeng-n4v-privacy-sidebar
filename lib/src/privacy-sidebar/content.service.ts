import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * ContentService gets injected into the PrivacySidebarComponents.
 * It is responsible for retrieving the JSON file best matching the users browser language.
 * The filenames are lowercase based on the locale (e.g. en.json or en-us.json or en_us.json).
 * They are looked for in the ContentService.ASSETS_DIR.
 *
 * @export
 * @class ContentService
 */
@Injectable()
export class ContentService {
  static readonly HEADER_KEY = 'header';
  static readonly CONTENT_KEY = 'content';
  static readonly FOOTER_KEY = 'footer';
  static readonly ACCEPT_KEY = 'accept';
  static readonly DECLINE_KEY = 'decline';
  static readonly URL_KEY = 'url';
  static readonly LINK_REPLACEMENT = '{{LINK}}';
  static readonly ASSETS_DIR = 'assets/n4v-privacy-sidebar/';
  static readonly DEFAULT_LANG = 'en';

  static readonly REGEX = new RegExp(ContentService.LINK_REPLACEMENT + '(.+?)' + ContentService.LINK_REPLACEMENT, 'g');

  static readonly CACHE = new Map<string, Promise<void | object>>();

  /**
   * Does a string replacement for the placeholder
   *
   * @param src the src string
   * @param linkUrl the url to input in the replacement
   * @returns the string with replaced link
   * @memberof ContentService
   */
  static replaceLink(src: string, linkUrl: string): string {
    return src.replace(ContentService.REGEX, '<a href="' + linkUrl + '">$1</a>');
  }

  constructor(private http: HttpClient) {
  }

  /**
   * Retrieve the full JSON object
   *
   * @returns Promise<void | object>
   * @memberof ContentService
   */
  getJSON(): Promise<void | object> {
    for (let i = 0; i < navigator.languages.length; i++) {
      const lang = navigator.languages[i].toLowerCase();
      if (ContentService.CACHE[lang]) {
        return ContentService.CACHE[lang];
      }
      if (lang.indexOf('-') >= 0 || lang.indexOf('_') >= 0) {
        const cl = lang.substr(0, 2);
        if (ContentService.CACHE[cl]) {
          return ContentService.CACHE[cl];
        }
      }
    }

    const langs: string[] = [];
    for (let i = 0; i < navigator.languages.length; i++) {
      const lang = navigator.languages[i].toLowerCase();
      if (!langs.includes(lang)) {
        langs.push(lang);
      }
      if (lang.indexOf('-') >= 0 || lang.indexOf('_') >= 0) {
        const cl = lang.substr(0, 2);
        if (!langs.includes(cl)) {
          langs.push(cl);
        }
      }
    }
    if (!langs.includes(ContentService.DEFAULT_LANG)) {
      langs.push(ContentService.DEFAULT_LANG);
    }

    const caller = this;
    function lookup(i: number): Promise<void | object> {
      return caller.http.get(ContentService.ASSETS_DIR + langs[i] + '.json').toPromise()
        .then(o => {
          ContentService.CACHE[langs[i]] = o;
          return o;
        })
        .catch(err => {
          if ((i + 1) < langs.length) {
            return lookup(i + 1);
          } else {
            console.error('language lookup failed');
          }
        });
    }
    return lookup(0);
  }

}
