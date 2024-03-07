import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { errorGlobal, successGlobal } from "@store/notifications.duck";
import { getHeaderForMiddleware } from "@utils/tools";
import { getApiUrl } from "@config/apiConfig";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";
const { hostname, port } = getApiUrl();

// GET Technology Types
export const getTechnologyTypes = createAsyncThunk(
  "technologyTypes/getTechnologyTypes",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/technologyTypes`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// POST TechnologyType
export const createTechnologyType = createAsyncThunk(
  "technologyTypes/createTechnologyType",
  async (data, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { status },
      } = await axios.post(`${hostname}:${port}/technologyTypes`, data, {
        headers: bearerToken,
      });
      dispatch(successGlobal("Technology Type created Successfully."));
      return status;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

export const technologyTypesSlice = createSlice({
  name: "technologyTypes",
  initialState: {
    init_data: {
      technology_type: "",
      operator_group: "",
      status: "",
      created_on: "",
      created_by: "",
    },
    loading: false,
    data: [],
    technologyTypes: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //GET TechnologyTypes
      .addCase(getTechnologyTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTechnologyTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;

        const technologyTypes = action.payload.map((item) => {
          return item.technology_type;
        });
        state.technologyTypes = technologyTypes;
      })
      .addCase(getTechnologyTypes.rejected, (state) => {
        state.loading = false;
      })
      //POST TechnologyType
      .addCase(createTechnologyType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTechnologyType.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAdded = action.payload;
      })
      .addCase(createTechnologyType.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default technologyTypesSlice.reducer;
