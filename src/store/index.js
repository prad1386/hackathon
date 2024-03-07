import { configureStore } from "@reduxjs/toolkit";
import UsersReducer from "@store/users.duck";
import NotificationsReducer from "@store/notifications.duck";

import Campaign from "@store/campaign.duck";
import MyAssetsReducer from "@store/myAssets.duck";
import PatchesOperationReducer from "@store/patchesOperation.duck";
import ManageTimeslotsReducer from "@store/admin/manageTimeslots.duck";
import TechnologyTypesReducer from "@store/admin/technologyTypes.duck";
import OperatorGroupReducer from "@store/admin/operatorGroup.duck";
import ManageExceptionsReducer from "@store/admin/manageExceptions.duck";
import ManageSchedulersReducer from "@store/admin/manageScheduler.duck";
import ReportingReducer from "@store/reporting.duck";

export const store = configureStore({
  reducer: {
    users: UsersReducer,
    notifications: NotificationsReducer,
    campaign: Campaign,
    myAssets: MyAssetsReducer,
    patchesOperation: PatchesOperationReducer,
    manageTimeslots: ManageTimeslotsReducer,
    technologyTypes: TechnologyTypesReducer,
    operatorGroup: OperatorGroupReducer,
    manageExceptions: ManageExceptionsReducer,
    manageSchedulers: ManageSchedulersReducer,
    reporting: ReportingReducer,
  },
});
