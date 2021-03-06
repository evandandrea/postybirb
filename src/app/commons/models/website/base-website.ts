import { Website } from '../../interfaces/website.interface';
import { WebsiteStatus } from '../../enums/website-status.enum';
import { Observable } from 'rxjs';
import { WebsiteCoordinatorService } from '../../services/website-coordinator/website-coordinator.service';

export interface PostReport {
  err?: any;
  website: string;
  notify: any;
  msg: string;
  submission?: any;
}

/**
 * @abstract @class BaseWebsite
 */
export class BaseWebsite implements Website {
  public websiteName: string;
  protected baseURL: string;
  protected helper: any; //helpers such as twitter, deviantart, and tumblr bound to window
  protected mapping: any;
  protected info: any;
  protected coordinator: WebsiteCoordinatorService;

  get loginStatus(): WebsiteStatus { return this._loginStatus }
  set loginStatus(status: WebsiteStatus) {
    this._loginStatus = status || WebsiteStatus.Logged_Out;
    if (this.coordinator) {
      this.coordinator.statusUpdated(this.websiteName, status);
    }
  }
  private _loginStatus: WebsiteStatus = WebsiteStatus.Logged_Out;

  constructor(websiteName: string, baseURL: string, helperName?: string) {
    this.websiteName = websiteName;
    this.baseURL = baseURL;
    this.mapping = {};
    this.info = {};

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
      if (this.info.username) resolve(this.info.username);
      else reject(Error(`Not logged in to ${this.websiteName}`));
    });
  }

  public getInfo(): any {
    return this.info;
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

  public post(submission: any): Observable<PostReport> {
    return null;
  }

  public postJournal(data: any): Observable<any> {
    return null;
  }

  protected createError(err: any, submission: any, notify?: string): PostReport {
    return { website: this.websiteName, err, msg: notify, /*submission don't need anymore really,*/ notify: notify ? true : false };
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
