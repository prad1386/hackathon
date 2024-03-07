export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENTID,
    authority: process.env.REACT_APP_AUTHORITY,
    redirectUri: process.env.REACT_APP_DOMAIN,
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ["User.Read"],
};

// Add the endpoints here for Microsoft Graph API services.
export const graphConfig = {
  graphGroupsEndpoint: process.env.REACT_APP_GRAPH_GROUPS_ENDPOINT,
};

// Add the endpoints here for Middleware API services.
export const middlewareConfig = {
  middlewareScopeUrl: [process.env.REACT_APP_MIDDLEWARE_SCOPE],
};
