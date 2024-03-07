import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { errorGlobal } from "@store/notifications.duck";
import { getHeaderForMiddleware } from "@utils/tools";
import { getApiUrl } from "@config/apiConfig";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";
const { hostname, port } = getApiUrl();

export const getReports = createAsyncThunk(
  "reporting/getReports",
  async ({ dispatch }) => {
    try {
      let response = await axios.get("./reporting.json");
      return response.data.data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Get list of asset report
export const getAssetReports = createAsyncThunk(
  "reporting/getAssetReports",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/assetReport`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Get list of Campaign Report
export const getCampaignReports = createAsyncThunk(
  "reporting/getCampaignReports",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/campaignReport`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Get list of Campaign Report
export const getCampaignPatchFailureReports = createAsyncThunk(
  "reporting/getCampaignPatchFailureReports",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/campaignPatchFailure`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Get list of Campaign Report
export const patchWithManualIntervention = createAsyncThunk(
  "reporting/patchWithManualIntervention",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/patchWithManualIntervention`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Get Individual Asset Report
export const getIndividualAssetReport = createAsyncThunk(
  "reporting/assetReport",
  async (id, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(
        `${hostname}:${port}/assetReport/${id}`,
        { headers: bearerToken }
      );
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Get Individual Campaign Report
export const getIndividualCampaignReport = createAsyncThunk(
  "reporting/campaignReport",
  async (id, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(
        `${hostname}:${port}/campaignReport/${id}`,
        { headers: bearerToken }
      );
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);


// Get Individual Asset Report
export const getIndividualCampaignPatchFailure = createAsyncThunk(
  "reporting/getCampaignPatchFailure",
  async (id, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(
        `${hostname}:${port}/campaignPatchFailure/${id}`,
        { headers: bearerToken }
      );
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Get Individual Asset Report
export const getIndividualPatchWithManualIntervention = createAsyncThunk(
  "reporting/getPatchWithManualIntervention",
  async (id, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(
        `${hostname}:${port}/patchWithManualIntervention/${id}`,
        { headers: bearerToken }
      );
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);
export const reportingSlice = createSlice({
  name: "reporting",
  initialState: {
    loading: false,
    data: [],
    assetReport: [],
    campaignReport: [],
    campaignPatchFailureReport:[],
    patchWithManualInterventionReport: [],
    individualAssetReport:[],
    individualCampaignReport:[],
    individualCampaignPatchFailure:[],
    individualPatchWithManualIntervention:[]
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //GET Reports
      .addCase(getReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getReports.rejected, (state) => {
        state.loading = false;
      })
      //GET Asset Reports
      .addCase(getAssetReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAssetReports.fulfilled, (state, action) => {
        state.loading = false;
        state.assetReport = action.payload;
      })
      .addCase(getAssetReports.rejected, (state) => {
        state.loading = false;
      })
      //GET Campaign Reports
      .addCase(getCampaignReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCampaignReports.fulfilled, (state, action) => {
        state.loading = false;
        state.campaignReport = action.payload;
      })
      .addCase(getCampaignReports.rejected, (state) => {
        state.loading = false;
      })
       //GET Campaign Patch Failure Reports
       .addCase(getCampaignPatchFailureReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCampaignPatchFailureReports.fulfilled, (state, action) => {
        state.loading = false;
        state.campaignPatchFailureReport = action.payload;
      })
      .addCase(getCampaignPatchFailureReports.rejected, (state) => {
        state.loading = false;
      })
        //GET Patch with manual Intervention Reports
        .addCase(patchWithManualIntervention.pending, (state) => {
          state.loading = false;
        })
        .addCase(patchWithManualIntervention.fulfilled, (state, action) => {
          state.loading = false;
          state.patchWithManualInterventionReport = action.payload;
        })
        .addCase(patchWithManualIntervention.rejected, (state) => {
          state.loading = false;
        })
         //GET Individual Asset Report
        .addCase(getIndividualAssetReport.fulfilled, (state, action) => {
          state.individualAssetReport = action.payload;
        })
        .addCase(getIndividualAssetReport.rejected, (state) => {
          state.loading = false;
        })
        .addCase(getIndividualCampaignReport.fulfilled, (state, action) => {
          state.individualCampaignReport = action.payload;
        })
        .addCase(getIndividualCampaignReport.rejected, (state) => {
          state.loading = false;
        })
        .addCase(getIndividualCampaignPatchFailure.fulfilled, (state, action) => {
          state.individualCampaignPatchFailure = action.payload;
        })
        .addCase(getIndividualCampaignPatchFailure.rejected, (state) => {
          state.loading = false;
        })
        .addCase(getIndividualPatchWithManualIntervention.fulfilled, (state, action) => {
          state.individualPatchWithManualIntervention = action.payload;
        })
        .addCase(getIndividualPatchWithManualIntervention.rejected, (state) => {
          state.loading = false;
        });
  },
});

export default reportingSlice.reducer;
