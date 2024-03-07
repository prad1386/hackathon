import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { errorGlobal, successGlobal } from "@store/notifications.duck";
import { getHeaderForMiddleware } from "@utils/tools";
import { getApiUrl } from "@config/apiConfig";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";
const { hostname, port } = getApiUrl();

// GET OperatorGroup
export const getOperatorGroup = createAsyncThunk(
  "operatorGroup/getOperatorGroup",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/operatorGroups`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// POST OperatorGroup
export const createOperatorGroup = createAsyncThunk(
  "operatorGroup/createOperatorGroup",
  async (data, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { status },
      } = await axios.post(`${hostname}:${port}/operatorGroups`, data, {
        headers: bearerToken,
      });
      dispatch(successGlobal("Operator Group created Successfully."));
      return status;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// Update status of an Operator Group(Modify/Retire)
export const updateOperatorGroup = createAsyncThunk(
  "operatorGroup/updateOperatorGroup",
  async (request, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();

      if (request.data.status === "Retired") {
        await axios.put(
          `${hostname}:${port}/operatorGroups/${request.id}/Retired`,
          request.data,
          {
            headers: bearerToken,
          }
        );
        dispatch(successGlobal("Operator Group Retired Successfully."));
      } else {
        await axios.put(
          `${hostname}:${port}/operatorGroups/${request.id}`,
          request.data,
          {
            headers: bearerToken,
          }
        );
        dispatch(successGlobal("Operator Group modified Successfully."));
      }

      return true;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

export const operatorGroupSlice = createSlice({
  name: "operatorGroup",
  initialState: {
    init_data: {
      operator_group: "",
      technology_type: "",
    },
    loading: false,
    update_loading: false,
    allOperatorGroup: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //GET operatorGroup
      .addCase(getOperatorGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOperatorGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.allOperatorGroup = action.payload;
      })
      .addCase(getOperatorGroup.rejected, (state) => {
        state.loading = false;
      })
      //POST operatorGroup
      .addCase(createOperatorGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOperatorGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAdded = action.payload;
      })
      .addCase(createOperatorGroup.rejected, (state) => {
        state.loading = false;
      })
      //Update status of an OperatorGroup
      .addCase(updateOperatorGroup.pending, (state) => {
        state.update_loading = true;
      })
      .addCase(updateOperatorGroup.fulfilled, (state, action) => {
        state.update_loading = false;
      })
      .addCase(updateOperatorGroup.rejected, (state) => {
        state.update_loading = false;
      });
  },
});

export default operatorGroupSlice.reducer;
