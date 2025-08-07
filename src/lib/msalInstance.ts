import { Configuration, PublicClientApplication, PopupRequest } from '@azure/msal-browser';

// Use the working version's domain for redirect URI
const redirectUri = 'https://ewa-web-app-vl9z.vercel.app/';

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

// Simple MSAL instance creation - let Next.js handle SSR
export const msalInstance = new PublicClientApplication(msalConfig);

// Login request configuration
export const loginRequest: PopupRequest = {
  scopes: ['User.Read', 'Sites.Read.All', 'Files.Read.All']
};
