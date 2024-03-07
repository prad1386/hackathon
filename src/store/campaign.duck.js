import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { errorGlobal, successGlobal } from "@store/notifications.duck";
import { getHeaderForMiddleware } from "@utils/tools";
import { getApiUrl } from "@config/apiConfig";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";
const { hostname, port } = getApiUrl();

// Create new campaign
export const addCampaign = createAsyncThunk(
  "campaign/addCampaign",
  async (campaign, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { status },
      } = await axios.post(`${hostname}:${port}/campaigns`, campaign, {
        headers: bearerToken,
      });
      dispatch(successGlobal("Campaign posted Successfully."));
      return status;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      if (error.response.data.data) {
        return error.response.data;
      }
      throw error;
    }
  }
);

// Validate Assets
export const validateAssets = createAsyncThunk(
  "campaign/validateAssets",
  async (assetsList, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const { data } = await axios.post(
        `${hostname}:${port}/cmdb-assets/validate`,
        assetsList,
        {
          headers: bearerToken,
        }
      );
      dispatch(successGlobal("Assets posted for Validation."));
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Get list of all campaigns
export const getCampaigns = createAsyncThunk(
  "campaign/getCampaigns",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/campaigns`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Get details based on {id} of a campaign
export const viewCampaign = createAsyncThunk(
  "campaign/viewCampaign",
  async (id, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/campaigns/${id}`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Get timeslot on sending the start and end date
export const downaloadAssets = createAsyncThunk(
  "myAssets/downloadAssets",
  async (id, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/campaigns/${id}/assets`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Campaign Actions
export const assetActions = createAsyncThunk(
  "campaign/assetActions",
  async ({ formData, id, action_type }, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      let data = {};
      if (action_type === "clone") {
        data = await axios.post(
          `${hostname}:${port}/campaigns/cloneCampaign`,
          formData,
          {
            headers: bearerToken,
          }
        );
      } else {
        data = await axios.put(
          `${hostname}:${port}/campaigns/${id}`,
          formData,
          {
            headers: bearerToken,
          }
        );
      }

      data.data
        ? dispatch(successGlobal(data.data.message))
        : dispatch(successGlobal("Success!"));

      return data.data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

export const campaignSlice = createSlice({
  name: "campaign",
  initialState: {
    campaign_init: {
      campaign_name: "",
      campaign_description: "",
      technology_type: "",
      start_date: "",
      end_date: "",
      email_distribution: "",
      email_notification: "",
      assets: "",
      manual_campaign: "false",
      notes: "",
      campaign_status: "",
    },
    loading: false,
    postDataLoading: false,
    viewCampaignLoading: false,
    downloading: false,
    allCampaigns: [],
    viewCampaign: {},
    actionCampaignRowData: {},
    actionStatus: {},
    validateAssetsRes: {
      allFailedAssets: [],
    },
    downaloadAllAssets: [],
  },
  reducers: {
    modifyCampaignRowSelected: (state, action) => {
      state.actionCampaignRowData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // (POST) validate assets
      .addCase(validateAssets.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.validateAssetsRes.allFailedAssets = action.payload;
      })
      .addCase(validateAssets.rejected, (state) => {
        state.loading = false;
      })
      // POST a new Campaign
      .addCase(addCampaign.pending, (state) => {
        state.postDataLoading = true;
      })
      .addCase(addCampaign.fulfilled, (state, action) => {
        state.postDataLoading = false;
        state.lastAdded = action.payload;
      })
      .addCase(addCampaign.rejected, (state) => {
        state.postDataLoading = false;
      })
      //GET All Campaigns
      .addCase(getCampaigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        const campaigns = [];
        action.payload.forEach((item) => {
          campaigns.push({
            ...item,
            campaign_status: item.CampaignStatuses[0].campaign_status,
          });
        });
        state.allCampaigns = campaigns;
      })
      .addCase(getCampaigns.rejected, (state) => {
        state.loading = false;
      })
      //GET Campaign Details
      .addCase(viewCampaign.pending, (state) => {
        state.viewCampaignLoading = true;
        state.viewCampaign = {};
      })
      .addCase(viewCampaign.fulfilled, (state, action) => {
        state.viewCampaignLoading = false;
        const campaign = action.payload;
        const {
          CampaignStatuses: [{ campaign_status }],
        } = action.payload;

        campaign["campaign_status"] = campaign_status;
        state.viewCampaign = campaign;
      })
      .addCase(viewCampaign.rejected, (state) => {
        state.viewCampaignLoading = false;
      })
      //Download Assets
      .addCase(downaloadAssets.pending, (state) => {
        state.downloading = true;
      })
      .addCase(downaloadAssets.fulfilled, (state, action) => {
        state.downloading = false;
        state.downaloadAllAssets = action.payload;
      })
      .addCase(downaloadAssets.rejected, (state) => {
        state.downloading = false;
      })
      // PUT Campaign Actions
      .addCase(assetActions.pending, (state) => {
        state.postDataLoading = true;
      })
      .addCase(assetActions.fulfilled, (state, action) => {
        state.postDataLoading = false;
        state.actionStatus = action.payload;
      })
      .addCase(assetActions.rejected, (state) => {
        state.postDataLoading = false;
      });
  },
});

export const { modifyCampaignRowSelected } = campaignSlice.actions;
export default campaignSlice.reducer;
