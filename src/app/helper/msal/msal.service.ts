import { Injectable, InjectionToken, Inject } from '@angular/core';
import { MsalConfig } from './msal-config';
import * as Msal from 'msal';

export const MSAL_CONFIG = new InjectionToken<string>('MSAL_CONFIG');

@Injectable()
export class MsalService {

    public error: string;
    private app: Msal.UserAgentApplication;

    constructor(@Inject(MSAL_CONFIG) private config: MsalConfig) {
        // set default values.
        this.config = {
            ...this.config,
            popUp: this.config.popUp ? this.config.popUp : false,
            callback: this.config.callback ? this.config.callback : () => { },
            redirectUrl: this.config.redirectUrl ? this.config.redirectUrl : window.location.href,
            navigateToLoginRequestUrl: this.config.navigateToLoginRequestUrl == null ? this.config.navigateToLoginRequestUrl : false
        } as MsalConfig
        const authority = config.authority;
        this.app = new Msal.UserAgentApplication(config.clientID, authority, config.callback,
            {
                cacheLocation: "localStorage",
                navigateToLoginRequestUrl: this.config.navigateToLoginRequestUrl,
                redirectUri: this.getFullUrl(this.config.redirectUrl)
            });
    }

    public getUser() {
        return this.authenticated.then(isauthenticated => isauthenticated ? this.app.getUser() : {});
    }

    get authenticated() {
        return this.token.then(t => !!t);
    }

    get token() {
        return this.getToken();
    }

    public login() {
        return this.config.popUp ?
            this.loginPopup() :
            this.loginRedirect();
    }

    public getToken(): Promise<string> {
        return this.app.acquireTokenSilent(this.config.graphScopes)
            .then(token => {
                return token;
            }).catch(error => {
                return this.app.acquireTokenPopup(this.config.graphScopes)
                    .then(token => {
                        return Promise.resolve(token);
                    }).catch(innererror => {
                        return Promise.resolve('');
                    });
            });
    }

    public logout() {
        this.app.logout();
    }

    public loginPopup() {
        return this.app.loginPopup(this.config.graphScopes).then((idToken) => {
            this.app.acquireTokenSilent(this.config.graphScopes).then(
                (token: string) => {
                    return Promise.resolve(token);
                }, (error: any) => {
                    this.app.acquireTokenPopup(this.config.graphScopes).then(
                        (token: string) => {
                            return Promise.resolve(token);
                        }, (innererror: any) => {
                            return Promise.resolve('');
                        });
                });
        }, (error: any) => {
            return Promise.resolve('');
        });
    }

    //check if the request url exists in endpoints
    public isMsalEndpoint(url: string) {
        return this.config.endPoints.some(t => url.toLowerCase().startsWith(t.toLowerCase()));
    }

    private loginRedirect() {
        this.app.loginRedirect(this.config.graphScopes);
        return this.getToken().then(() => {
            Promise.resolve(this.app.getUser());
        });
    }

    private getFullUrl(url: string): string {
        // this create a absolute url from a relative one.
        const pat = /^https?:\/\//i;
        return pat.test(url) ? url : this.origin() + url;
    }

    private origin() {
        return (window.location.origin) ? window.location.origin :
            window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }
}
