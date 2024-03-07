import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { errorGlobal, successGlobal } from "@store/notifications.duck";
import { getHeaderForMiddleware } from "@utils/tools";
import { getApiUrl } from "@config/apiConfig";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";
const { hostname, port } = getApiUrl();

//GET All Patches
export const getPatches = createAsyncThunk(
  "patchesOperation/getPatches",
  async (filter, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const url = filter.hours
        ? `${hostname}:${port}/operators/${filter.status}/${filter.hours}`
        : `${hostname}:${port}/operators/${filter.status}`;
      const {
        data: { data },
      } = await axios.get(url, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// GET Patch Details
export const viewPatch = createAsyncThunk(
  "patchesOperation/viewPatch",
  async (id, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(
        `${hostname}:${port}/operators/detail/${id.campaign_id}/${id.asset_instance_id}`,
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

// Assign to me
export const assignToMe = createAsyncThunk(
  "patchesOperation/assignToMe",
  async (request, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const response = await axios.get(
        `${hostname}:${port}/operators/assigntome/${request.schedule_id}/${request.asset_instance_id}`,
        {
          headers: bearerToken,
        }
      );

      dispatch(successGlobal(response.data.message));
      return true;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Edit/Update Patch
export const updatePatch = createAsyncThunk(
  "patchesOperation/updatePatch",
  async (request, { dispatch }) => {
    const req_body = {
      PatchStatus: request.patching_status,
      PostCheckStatus: request.postcheck_status,
      PreCheckStatus: request.precheck_status,
      OperatorNotes: request.operator_notes,
    };
    try {
      const bearerToken = await getHeaderForMiddleware();
      const response = await axios.post(
        `${hostname}:${port}/operators/actions/edit/${request.schedule_id}/${request.asset_instance_id}`,
        req_body,
        {
          headers: bearerToken,
        }
      );

      dispatch(successGlobal(response.data.message));
      return true;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

export const patchesOperationSlice = createSlice({
  name: "patchesOperation",
  initialState: {
    patchInfo: {
      asset_name: "",
      patching_status: "",
      product_tier3: "",
      technology_type: "",
      environment: "",
      cr_number: "",
      cr_status: "",
      operator_name: "",
      overall_status: "",
      operator_notes: "",
    },
    loading: false,
    update_loading: false,
    allPatches: [],
    viewPatchDetails: {},
    activityLog: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //GET All Patches
      .addCase(getPatches.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPatches.fulfilled, (state, action) => {
        state.loading = false;
        state.allPatches = action.payload;
      })
      .addCase(getPatches.rejected, (state) => {
        state.loading = false;
      })
      //GET Patch Details
      .addCase(viewPatch.pending, (state) => {
        state.loading = true;
      })
      .addCase(viewPatch.fulfilled, (state, action) => {
        state.loading = false;
        state.viewPatchDetails = action.payload.assetInfo;
        state.activityLog = action.payload.activities;
      })
      .addCase(viewPatch.rejected, (state) => {
        state.loading = false;
      })
      //Assign To Me
      .addCase(assignToMe.pending, (state) => {
        state.update_loading = true;
      })
      .addCase(assignToMe.fulfilled, (state) => {
        state.update_loading = false;
      })
      .addCase(assignToMe.rejected, (state) => {
        state.update_loading = false;
      })
      //Edit/Update Patch
      .addCase(updatePatch.pending, (state) => {
        // state.update_loading = true;
      })
      .addCase(updatePatch.fulfilled, (state, action) => {
        // state.update_loading = false;
      })
      .addCase(updatePatch.rejected, (state) => {
        // state.update_loading = false;
      });
  },
});

export default patchesOperationSlice.reducer;
