import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "@config/authConfig";

import { errorGlobal } from "@store/notifications.duck";
import { addUserDetails, authRejected, getUserRole } from "@store/users.duck";

const Auth = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const dispatch = useDispatch();

  useEffect(() => {
    const account = accounts[0];

    const getGraphApiAccessToken = async () => {
      const request = {
        ...loginRequest,
        account,
      };

      // Silently acquires an access token which is then attached to a request for Microsoft Graph data
      await instance
        .acquireTokenSilent(request)
        .then((response) => {
          sessionStorage.setItem("GraphApiAccessToken", response.accessToken);
        })
        .catch((e) => {
          instance.acquireTokenPopup(request).then((response) => {
            sessionStorage.setItem("GraphApiAccessToken", response.accessToken);
          });
        });
    };

    const getAccessTokens = async () => {
      await getGraphApiAccessToken();
      dispatch(getUserRole({}));
    };

    if (isAuthenticated) {
      getAccessTokens();
      dispatch(addUserDetails(account));
    }
  }, [dispatch, isAuthenticated, instance, accounts]);

  // Using redirect for login
  instance
    .handleRedirectPromise()
    .then((tokenResponse) => {
      if (!tokenResponse) {
        const accounts = instance.getAllAccounts();
        if (accounts.length === 0) {
          // No user signed in
          instance.loginRedirect();
        }
      }
    })
    .catch((err) => {
      // Handle error
      dispatch(errorGlobal(err));
      dispatch(authRejected(true));
    });

  return null;
};

export default Auth;
