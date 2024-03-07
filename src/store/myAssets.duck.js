import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { errorGlobal, successGlobal } from "@store/notifications.duck";
import { getHeaderForMiddleware } from "@utils/tools";
import { getApiUrl } from "@config/apiConfig";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";
const { hostname, port } = getApiUrl();

// Get all assets
export const getMyAssets = createAsyncThunk(
  "myAssets/getMyAssets",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/myAssets/tab/scheduled`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// pendingDeployment Assets
export const getpendingDeployment = createAsyncThunk(
  "myAssets/getpendingDeployment",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/myAssets/tab/pending`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Successful Deployment
export const getSuccessfulDeployment = createAsyncThunk(
  "myAssets/getSuccessfulDeployment",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/myAssets/tab/successful`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Get all scheduled assets
export const getMyScheduledAssets = createAsyncThunk(
  "myAssets/getMyScheduledAssets",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/myAssets`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Get asset details based on {id} of a asset
export const viewAsset = createAsyncThunk(
  "myAssets/viewAsset",
  async (assets, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(
        `${hostname}:${port}/myAssets/${assets.asset_instance_id}/cid/${assets.campaign_id}/status/${assets.view}`,
        {
          headers: bearerToken,
        }
      );
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Schedules (Deployment Assets POST)
export const postAssetDeployment = createAsyncThunk(
  "myAssets/postAssetDeployment",
  async (deploymentAssetList, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.post(
        `${hostname}:${port}/schedules`,
        deploymentAssetList,
        { headers: bearerToken }
      );
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Schedules (Deployment Assets POST)
export const updateAssetDeployment = createAsyncThunk(
  "myAssets/updateAssetDeployment",
  async (deploymentAssetList, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.put(
        `${hostname}:${port}/schedules`,
        deploymentAssetList,
        { headers: bearerToken }
      );
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Schedules (Deployment Assets POST)
export const cancelScheduledAsset = createAsyncThunk(
  "myAssets/cancelScheduledAsset",
  async (scheduleid, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { status, message },
      } = await axios.delete(
        `${hostname}:${port}/myAssets/cancelschedule/${scheduleid}`,
        { headers: bearerToken }
      );

      status === "success"
        ? dispatch(successGlobal("Cancel Request Submitted Successfully."))
        : dispatch(errorGlobal(message));
      return status;
    } catch (error) {
      dispatch(errorGlobal(error.response.status.message));
      throw error;
    }
  }
);

// Get timeslot on sending the start and end date
export const getTimeslotSchedule = createAsyncThunk(
  "myAssets/getTimeslotSchedule",
  async (timeslots, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(
        `${hostname}:${port}/timeslots/${timeslots.assets[0].campaign_id}/${timeslots.startDate}/${timeslots.endDate}`,
        { headers: bearerToken }
      );
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

export const myAssetsSlice = createSlice({
  name: "myAssets",
  initialState: {
    loading: false,
    assets: {
      id: "",
      asset_instance_id: "",
      asset_name: "",
      campaign_id: "",
      asset_status: "",
      product_tier3: "",
      server_owner: "",
      technology_type: "",
      environment: "",
      location: "",
      campaign: "",
      manual_campaign: false,
      overall_status: "",
      scheduled_name: "",
      scheduled_date: "",
      scheduled_time: "",
      start_date: "",
      end_date: "",
      allMyAssets: [],
      allMyScheduledAssets: [],
      allpendingDeploymentAssets: [],
      allSuccessfulDeployment: [],
      viewAsset: {},
      activityLog: [],
      selectedAssets: [],
      assetDeployment: [],
      updatingAssetDeployment: {},
      schedulingSelectedDate: "",
    },
    timeslots: {
      name: "",
      remaining_assets: "",
      max_no_of_assets: "",
      start_time: "",
      end_time: "",
      date: "",
      plp: "",
      allTimeslots: [],
      selectedTimeslot: {},
    },
  },
  reducers: {
    checkAsset: (state, action) => {
      if (action.payload.selectAll === true) {
        state.assets.selectedAssets = action.payload.checkedAsset;
      } else {
        const tmpState = [...state.assets.selectedAssets];
        const uniqueAssets = tmpState.filter(
          (item) => item.id !== action.payload.checkedAsset.id
        );

        const listofAssets = [...uniqueAssets, ...action.payload.checkedAsset];
        state.assets.selectedAssets = listofAssets;
      }
    },
    uncheckAsset: (state, action) => {
      const tmpState = [...state.assets.selectedAssets];
      const listofAssets = tmpState.filter(
        (item) => item.id !== action.payload.checkedAsset[0].id
      );
      state.assets.selectedAssets = listofAssets;
    },
    uncheckAssetAll: (state) => {
      state.assets.selectedAssets = [];
    },
    calendarSelectedDate: (state, action) => {
      state.assets.schedulingSelectedDate = action.payload;
    },
    timeslotSelected: (state, action) => {
      state.timeslots.selectedTimeslot = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      //GET All Assets
      .addCase(getMyAssets.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.assets.allMyAssets = action.payload;
      })
      .addCase(getMyAssets.rejected, (state) => {
        state.loading = false;
      })
      //GET All Pending Deployment Assets
      .addCase(getpendingDeployment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getpendingDeployment.fulfilled, (state, action) => {
        state.loading = false;
        state.assets.allpendingDeploymentAssets = action.payload;
      })
      .addCase(getpendingDeployment.rejected, (state) => {
        state.loading = false;
      })
      //GET All Successful Deployment
      .addCase(getSuccessfulDeployment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSuccessfulDeployment.fulfilled, (state, action) => {
        state.loading = false;
        state.assets.allSuccessfulDeployment = action.payload;
      })
      .addCase(getSuccessfulDeployment.rejected, (state) => {
        state.loading = false;
      })
      //GET All Scheduled Assets
      .addCase(getMyScheduledAssets.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyScheduledAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.assets.allMyScheduledAssets = action.payload;
      })
      .addCase(getMyScheduledAssets.rejected, (state) => {
        state.loading = false;
      })
      //POST AssetDeployment
      .addCase(postAssetDeployment.pending, (state) => {
        state.loading = true;
      })
      .addCase(postAssetDeployment.fulfilled, (state, action) => {
        state.loading = false;
        state.assets.assetDeployment = action.payload;
      })
      .addCase(postAssetDeployment.rejected, (state) => {
        state.loading = false;
      })
      //Put AssetDeployment
      .addCase(updateAssetDeployment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAssetDeployment.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateAssetDeployment.rejected, (state) => {
        state.loading = false;
      })
      //DELETE scheduled asset
      .addCase(cancelScheduledAsset.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelScheduledAsset.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(cancelScheduledAsset.rejected, (state) => {
        state.loading = false;
      })
      //GET Asset Details
      .addCase(viewAsset.pending, (state) => {
        state.loading = true;
      })
      .addCase(viewAsset.fulfilled, (state, action) => {
        state.loading = false;
        state.assets.viewAsset = action.payload.assetInfo;
        state.assets.activityLog = action.payload.activities;
      })
      .addCase(viewAsset.rejected, (state) => {
        state.loading = false;
      })
      //Get Timeslots for date range
      .addCase(getTimeslotSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTimeslotSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.timeslots.allTimeslots = action.payload;
      })
      .addCase(getTimeslotSchedule.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  checkAsset,
  uncheckAsset,
  uncheckAssetAll,
  calendarSelectedDate,
  timeslotSelected,
} = myAssetsSlice.actions;
export default myAssetsSlice.reducer;
