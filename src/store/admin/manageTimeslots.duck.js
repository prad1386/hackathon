import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { errorGlobal, successGlobal } from "@store/notifications.duck";
import { getHeaderForMiddleware } from "@utils/tools";
import { getApiUrl } from "@config/apiConfig";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";
const { hostname, port } = getApiUrl();

// GET Timeslots
export const getTimeslots = createAsyncThunk(
  "timeslots/getTimeslots",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/timeslots`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// POST Timeslot
export const createTimeslot = createAsyncThunk(
  "timeslots/createTimeslot",
  async (data, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { status },
      } = await axios.post(`${hostname}:${port}/timeslots`, data, {
        headers: bearerToken,
      });
      dispatch(successGlobal("Timeslot created Successfully"));
      return status;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
    }
  }
);

export const manageTimeslotsSlice = createSlice({
  name: "timeslots",
  initialState: {
    init_data: {
      timeslot_name: "",
      day_of_week: "",
      status: "",
      start_time: "",
      end_time: "",
      max_assets: 50,
      created_date: "",
      created_by: "",
    },
    loading: false,
    allTimeslots: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //GET timeslots
      .addCase(getTimeslots.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTimeslots.fulfilled, (state, action) => {
        state.loading = false;
        state.allTimeslots = action.payload;
      })
      .addCase(getTimeslots.rejected, (state) => {
        state.loading = false;
      })
      //POST timeslot
      .addCase(createTimeslot.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTimeslot.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAdded = action.payload;
      })
      .addCase(createTimeslot.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default manageTimeslotsSlice.reducer;
