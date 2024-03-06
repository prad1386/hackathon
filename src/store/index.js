import { configureStore } from "@reduxjs/toolkit";
import UsersReducer from "./reducers/users";
import NotificationsReducer from "./reducers/notifications";
import Campaign from "./reducers/campaign";

export const store = configureStore({
  reducer: {
    users: UsersReducer,
    notifications: NotificationsReducer,
    campaign: Campaign,
  },
});
