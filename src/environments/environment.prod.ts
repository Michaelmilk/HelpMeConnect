import { LoggerLevel } from "../app/core/logger";
import { MsalConfig } from "../app/helper/msal/msal-config";

export const environmentProd = {
    production: true,
    serverBaseUrl: "https://satoriextraction/api",
    msGraphBaseUrl: "https://graph.microsoft.com/v1.0",
    logLevel: LoggerLevel.Error,
    //params detail: https://github.com/azuread/microsoft-authentication-library-for-js/wiki/MSAL-basics
    msalConfig: {
        clientID: '986a27b6-e88e-4471-a0ba-dcd5e33477c5',
        graphScopes: ["Mail.Send", "User.Read", "User.ReadWrite", "User.ReadBasic.All", "User.Read.All", "User.ReadWrite.All", "Directory.Read.All", "Directory.ReadWrite.All", "Directory.AccessAsUser.All"],
        tenant: 'M365x342201.onmicrosoft.com',
        redirectUrl: "https://helpmeconnect.azurewebsites.net",
        endPoints: ["https://graph.microsoft.com/v1.0/"],
        popUp: false,
        navigateToLoginRequestUrl: false
    } as MsalConfig
};