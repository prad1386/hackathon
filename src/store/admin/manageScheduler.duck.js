import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { errorGlobal, successGlobal } from "@store/notifications.duck";
import { getHeaderForMiddleware } from "@utils/tools";
import { getApiUrl } from "@config/apiConfig";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";
const { hostname, port } = getApiUrl();

// GET SchedulerGroup
export const getSchedulerGroup = createAsyncThunk(
  "schedulerGroup/getSchedulerGroup",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/schedulerGroups`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// GET ProductTiers
export const getProductTiers = createAsyncThunk(
  "schedulerGroup/getProductTiers",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/schedulerGroups/productTiers`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// POST SchedulerGroup
export const createSchedulerGroup = createAsyncThunk(
  "schedulerGroup/createSchedulerGroup",
  async (data, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { status },
      } = await axios.post(`${hostname}:${port}/schedulerGroups`, data, {
        headers: bearerToken,
      });
      dispatch(successGlobal("Scheduler Group created Successfully."));
      return status;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.status));
      throw error;
    }
  }
);

// Update status of an Scheduler Group(Modify)
export const updateSchedulerGroup = createAsyncThunk(
  "schedulerGroup/updateSchedulerGroup",
  async (request, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      if (request.data.status === "Retired") {
        const response = await axios.put(
          `${hostname}:${port}/schedulerGroups/${request.id}/Retired`,
          request.data,
          {
            headers: bearerToken,
          }
        );
        dispatch(successGlobal(response.data.message));
      } else {
        await axios.put(
          `${hostname}:${port}/schedulerGroups/${request.id}`,
          request.data,
          {
            headers: bearerToken,
          }
        );
        dispatch(successGlobal("Scheduler Group modified Successfully."));
      }

      return true;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

export const manageSchedulerSlice = createSlice({
  name: "schedulerGroup",
  initialState: {
    init_data: {
      scheduler_group: "",
      product_tier1: "",
      product_tier2: "",
      product_tier3: "",
      created_on: "",
      created_by: "",
    },
    loading: false,
    update_loading: false,
    listSchedulerGroups: [],
    allProductTiers: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //GET SchedulerGroup
      .addCase(getSchedulerGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSchedulerGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.listSchedulerGroups = action.payload;
      })
      .addCase(getSchedulerGroup.rejected, (state) => {
        state.loading = false;
      })
      //GET ProductTiers
      .addCase(getProductTiers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductTiers.fulfilled, (state, action) => {
        state.loading = false;

        /**  Tiers Object Structure
             productTiers={tier3:[{tier2:[tier1]}] } */
        let productTiers = {};

        action.payload.forEach((item) => {
          if (item.product_tier3) {
            const tier3 = item.product_tier3;
            const trimmedTier3 = tier3.trim();
            const finalTier3 = trimmedTier3.replaceAll('"', "");

            const tier1 = item.product_tier1;
            const trimmedTier1 = tier1.trim();
            const finalTier1 = trimmedTier1.replaceAll('"', "");

            if (finalTier1 in productTiers) {
              const temp = productTiers[finalTier1];
              let tempArr = [];
              let isPresent = false;
              let presentItem = {};
              temp.forEach((item1) => {
                if (item.product_tier2 in item1) {
                  isPresent = true;
                  presentItem = item1;
                  return;
                }
              });

              if (isPresent) {
                if (presentItem[item.product_tier2][0] === finalTier3) {
                  tempArr.push(...productTiers[finalTier1]);
                } else {
                  const subarray = productTiers[finalTier1].map((item2) => {
                    if (item.product_tier2 in item2) {
                      return {
                        [item.product_tier2]: [
                          ...presentItem[item.product_tier2],
                          item.product_tier3,
                        ],
                      };
                    } else {
                      return item2;
                    }
                  });
                  tempArr = subarray;
                }
              } else {
                tempArr.push(...productTiers[finalTier1], {
                  [item.product_tier2]: [item.product_tier3],
                });
              }

              productTiers[finalTier1] = tempArr;
            } else {
              productTiers[finalTier1] = [
                {
                  [item.product_tier2]: [item.product_tier3],
                },
              ];
            }
          }
        });
        state.allProductTiers = productTiers;
      })
      .addCase(getProductTiers.rejected, (state) => {
        state.loading = false;
      })
      //POST SchedulerGroup
      .addCase(createSchedulerGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSchedulerGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAdded = action.payload;
      })
      .addCase(createSchedulerGroup.rejected, (state) => {
        state.loading = false;
      })
      //Update status of an SchedulerGroup
      .addCase(updateSchedulerGroup.pending, (state) => {
        state.update_loading = true;
      })
      .addCase(updateSchedulerGroup.fulfilled, (state, action) => {
        state.update_loading = false;
      })
      .addCase(updateSchedulerGroup.rejected, (state) => {
        state.update_loading = false;
      });
  },
});

export default manageSchedulerSlice.reducer;
