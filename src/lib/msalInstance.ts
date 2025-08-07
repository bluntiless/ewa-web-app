import { Configuration, PublicClientApplication, PopupRequest } from '@azure/msal-browser';

// Static redirect URI for production - this avoids SSR issues
const redirectUri = 'https://ewa-web-app-vqh2-f5cplzp51-wayne-anthony-wrights-projects.vercel.app/';

export const msalConfig: Configuration = {
  auth: {
    clientId: '4dee2fb0-16a8-417e-99e0-182238406716',
    authority: 'https://login.microsoftonline.com/f06bb1fd-4f8d-4dd6-bed9-8ae702c632b9',
    redirectUri: redirectUri
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case 0: // LogLevel.Error
            console.error(message);
            return;
          case 1: // LogLevel.Warning
            console.warn(message);
            return;
          case 2: // LogLevel.Info
            console.info(message);
            return;
          case 3: // LogLevel.Verbose
            console.debug(message);
            return;
        }
      }
    }
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Login request configuration
export const loginRequest: PopupRequest = {
  scopes: ['User.Read', 'Sites.Read.All', 'Files.Read.All']
};
