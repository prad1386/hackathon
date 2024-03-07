import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Routes";
import "bootstrap/dist/css/bootstrap.min.css";

import { Provider } from "react-redux";
import { store } from "./store";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./config/authConfig";

export const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <MsalProvider instance={msalInstance}>
    <Provider store={store}>
      <Router />
    </Provider>
  </MsalProvider>
);
