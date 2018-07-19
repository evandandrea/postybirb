import { Website } from '../../interfaces/website.interface';
import { SupportedWebsites } from '../../enums/supported-websites';
import { WebsiteStatus } from '../../enums/website-status.enum';
import { HTMLParser } from '../../helpers/html-parser';
import { Observable } from 'rxjs';

/**
 * @abstract @class BaseWebsite
 */
export class BaseWebsite implements Website {
  protected websiteName: string;
  protected baseURL: string;
  protected loginStatus: WebsiteStatus;
  protected helper: any; //helpers such as twitter, deviantart, and tumblr bound to window
  protected mapping: any;
  protected otherInformation: any;

  constructor(websiteName: string, baseURL: string, helperName?: string) {
    this.websiteName = websiteName;
    this.baseURL = baseURL;
    this.loginStatus = WebsiteStatus.Logged_Out;
    this.mapping = {};
    this.otherInformation = {};

    if (helperName) {
      this.helper = window[helperName];
    }
  }

  public getStatus(): Promise<WebsiteStatus> {
    return new Promise((resolve) => {
      resolve(WebsiteStatus.Logged_Out);
    });
  }

  public getUser(): Promise<string> {
    return new Promise((resolve, reject) => {
      reject(null);
    });
  }

  public getOtherInfo(): any {
    return this.otherInformation;
  }

  public getLoginStatus(): WebsiteStatus {
    return this.loginStatus;
  }

  public unauthorize(): any {
    if (this.helper) {
      this.helper.unauthorize();
      this.loginStatus = WebsiteStatus.Logged_Out;
    }
  }

  public checkAuthorized(): Promise<boolean> {
    return new Promise(function(resolve, reject) {
      if (this.helper) {
        if (this.helper.checkAuthorized) {
          this.helper.checkAuthorized().then(authorized => {
            authorized ? resolve(true) : reject(false);
          });
        } else {
          this.helper.isAuthorized() ? resolve(true) : reject(false);
        }
      } else {
        resolve(true);
      }
    }.bind(this));
  }

  public authorize(authInfo: any): Promise<any> {
    return new Promise(function(resolve, reject) {
      if (this.helper) {
        this.helper.authorize()
          .catch(function(err) {
            reject(err);
          }.bind(this))
          .then(function(res) {
            resolve(res);
          }.bind(this))
      } else {
        reject(null);
      }
    }.bind(this));
  }

  public refresh(): Promise<any> {
    return new Promise(function(resolve, reject) {
      if (this.helper) {
        this.helper.refresh()
          .catch(() => reject(`Unable to refresh ${this.websiteName}`))
          .then(() => resolve(`Refreshed ${this.websiteName}`));
      } else {
        resolve(true);
      }
    }.bind(this));
  }

  public post(submission: any): Observable<any> {
    return null;
  }

  public postJournal(title: string, description: string, options?: any): Observable<any> {
    return null;
  }

  protected createError(err: any, submission: any, reason?: any): object {
    return { website: this.websiteName, err, submission, reason };
  }

  protected getMapping(type: string, value: string): any {
    return this.mapping[type][value];
  }

  protected formatTags(defaultTags: string[] = [], other: string[] = [], spaceReplacer: string = '_'): any {
    const tags = [...defaultTags, ...other];
    return tags.map((tag) => {
      return tag.trim()
        .replace(/\s/gm, spaceReplacer)
        .replace(/(\/|\\)/gm, spaceReplacer);
    });
  }
}
