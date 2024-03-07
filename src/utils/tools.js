import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { msalInstance } from "../index";
import { middlewareConfig } from "@config/authConfig";
import "react-toastify/dist/ReactToastify.css";

export const getHeaderForGraphApi = (accessToken) => {
  const headers = new Headers();
  let Token = null;

  if (window.sessionStorage.getItem("GraphApiAccessToken")) {
    Token = window.sessionStorage.getItem("GraphApiAccessToken");
  }

  if (accessToken) {
    Token = accessToken;
  }

  headers.append("Authorization", `Bearer ${Token}`);
  headers.append("ConsistencyLevel", "eventual");
  return headers;
};

const getMiddlewareToken = async () => {
  const accounts = msalInstance.getAllAccounts();

  if (!accounts[0]) {
    throw Error(
      "No active account! Verify a user has been signed in and setActiveAccount has been called."
    );
  }

  if (accounts.length > 0) {
    try {
      // Silently acquires an access token which is then attached to a request for Middleware API
      const response = await msalInstance.acquireTokenSilent({
        account: accounts[0],
        scopes: [...middlewareConfig.middlewareScopeUrl],
      });
      return response.accessToken;
    } catch (e) {
      console.log(e);
    }
  }
};

export const getHeaderForMiddleware = async () => {
  const accessToken = await getMiddlewareToken();
  const bearerToken = { Authorization: `Bearer ${accessToken}` };
  return bearerToken;
};

export const Loader = ({ size }) => (
  <div className="root_loader">
    <CircularProgress size={size} />
  </div>
);

export const showToast = (type, msg) => {
  switch (type) {
    case "SUCCESS":
      toast.success(msg, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
        hideProgressBar: true,
      });
      break;
    case "ERROR":
      toast.error(msg, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
        hideProgressBar: true,
      });
      break;
    default:
      return false;
  }
};
