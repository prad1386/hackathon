import { createSlice } from "@reduxjs/toolkit";
import { addCampaign } from "../actions/campaign";

export const campaignSlice = createSlice({
  name: "campaign",
  initialState: {
    campaignName: "",
    campaignDescription: "",
    technologyType: "",
    startDate: "",
    endDate: "",
    emailDistribution: "",
    emailNotification: "",
    assetUrl: "",
    manual: false,
    notes: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ADD Campaign
      .addCase(addCampaign.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAdded = action.payload;
      })
      .addCase(addCampaign.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default campaignSlice.reducer;
