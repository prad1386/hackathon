import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { errorGlobal } from "@store/notifications.duck";
import { graphConfig } from "@config/authConfig";
import { getHeaderForGraphApi } from "@utils/tools";
import { getHeaderForMiddleware } from "@utils/tools";
import { getApiUrl } from "@config/apiConfig";
import { constants } from "@constants";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";
const { hostname, port } = getApiUrl();

// Get All Groups at Org level
export const getAllOrgGroups = createAsyncThunk(
  "users/getAllOrgGroups",
  async (string, { dispatch }) => {
    try {
      const options = {
        method: "GET",
        headers: getHeaderForGraphApi(),
      };
      return fetch(
        `${graphConfig.graphGroupsEndpoint}?$search="displayName:${string}"&$select=displayName&$count=true`,
        options
      )
        .then((response) => response.json())
        .catch((error) => console.log(error));
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Get User Role
export const getUserRole = createAsyncThunk(
  "users/getUserRole",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/roles`, {
        headers: bearerToken,
      });

      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

let DEFAULT_USER_STATE = {
  userInfo: {
    id: null,
    email: "",
    name: "",
    roles: [],
    isSuperUser: false,
    isScheduler: false,
    isOperator: false,
    isReadOnly: false,
  },
  allOrgGroups: [],
  authRejected: false,
  isRoleFetched: false,
  groupsLoading: false,
  selectedAssetsTab: 0,
  selectedOperatorTab: 0,
  selectedTechtypeTab: 0,
};

export const usersSlice = createSlice({
  name: "users",
  initialState: DEFAULT_USER_STATE,
  reducers: {
    addUserDetails: (state, action) => {
      state.userInfo.id = action.payload.localAccountId;
      state.userInfo.email = action.payload.username;
      state.userInfo.name = action.payload.name;
    },
    authRejected: (state, action) => {
      state.authRejected = action.payload;
    },
    tabSelected: (state, action) => {
      if (action.payload.tab === constants.TEXT_SCHEDULE_ASSETS) {
        state.selectedAssetsTab = action.payload.value;
      }
      if (action.payload.tab === constants.TEXT_TAB_LABEL_NEED_ATTENTION) {
        state.selectedOperatorTab = action.payload.value;
      }
      if (action.payload.tab === constants.TEXT_TAB_LABEL_TECH_TYPES) {
        state.selectedTechtypeTab = action.payload.value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //GET Org level groups
      .addCase(getAllOrgGroups.pending, (state) => {
        state.groupsLoading = true;
      })
      .addCase(getAllOrgGroups.fulfilled, (state, action) => {
        let allOrgGroups = [];
        action.payload.value.forEach((group) => {
          //Push only unique names
          if (!allOrgGroups.includes(group.displayName)) {
            allOrgGroups.push(group.displayName);
          }
        });

        state.allOrgGroups = allOrgGroups;
        state.groupsLoading = false;
      })
      .addCase(getAllOrgGroups.rejected, (state) => {
        state.groupsLoading = false;
      })
      //GET User Role
      .addCase(getUserRole.pending, (state) => {
        state.isRoleFetched = false;
      })
      .addCase(getUserRole.fulfilled, (state, action) => {
        state.isRoleFetched = true;
        const roles = action.payload.roles;
        state.userInfo.roles = roles;
        state.userInfo.isSuperUser = !!~roles.indexOf("SuperUser");
        state.userInfo.isScheduler = !!~roles.indexOf("Scheduler");
        state.userInfo.isReadOnly = !!~roles.indexOf("ReadonlyUser");
        state.userInfo.isOperator = !!~roles.indexOf("Operator");
      })
      .addCase(getUserRole.rejected, (state) => {
        state.isRoleFetched = false;
      });
  },
});

export const { addUserDetails, authRejected, tabSelected } = usersSlice.actions;
export default usersSlice.reducer;
