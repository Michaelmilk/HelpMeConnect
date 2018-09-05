import { tokenReceivedCallback } from 'msal/lib-commonjs/UserAgentApplication';

export class MsalConfig {
    public clientID: string;
    public graphScopes: string[];
    public redirectUrl?= window.location.href;
    public endPoints?: string[] = [];
    public authority?: string = 'https://login.microsoftonline.com/common/';
    public popUp?= true;
    public navigateToLoginRequestUrl?= false;
    public callback?: tokenReceivedCallback =
        (errorDesc: any, token: any, error: any, tokenType: any) => {
            if (error) {
                console.error(`${error} ${errorDesc}`);
            }
        };
    public signUpSignInPolicy?: '';
}
