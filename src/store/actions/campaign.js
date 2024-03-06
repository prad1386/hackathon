import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorGlobal, successGlobal } from "../reducers/notifications";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

export const addCampaign = createAsyncThunk(
  "campaign/addCampaign",
  async (campaign, { dispatch }) => {
    dispatch(errorGlobal("API not integrated"));
    // try {
    //   const request = await axios.post("/api/campaign", campaign);
    //   dispatch(successGlobal("Successfully Created!!"));
    //   return request.data;
    // } catch (error) {
    //   dispatch(errorGlobal(error.response.data.message));
    //   throw error;
    // }
  }
);
