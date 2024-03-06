import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Routes";
import "bootstrap/dist/css/bootstrap.min.css";

import { Provider } from "react-redux";
import { store } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Provider store={store}>
      <Router />
    </Provider>
);
