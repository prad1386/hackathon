import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { errorGlobal, successGlobal } from "@store/notifications.duck";
import { getHeaderForMiddleware } from "@utils/tools";
import { getApiUrl } from "@config/apiConfig";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";
const { hostname, port } = getApiUrl();

// GET all Exceptions
export const getExceptions = createAsyncThunk(
  "manageExceptions/getExceptions",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/manageExceptions`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// POST an Exceptions
export const createExceptions = createAsyncThunk(
  "manageExceptions/createExceptions",
  async (data, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { status },
      } = await axios.post(`${hostname}:${port}/manageExceptions`, data, {
        headers: bearerToken,
      });
      dispatch(successGlobal("Exception created Successfully."));
      return status;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// GET all Product Tier3
export const getAllProductTier3 = createAsyncThunk(
  "manageExceptions/getAllProductTier3",
  async ({ dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { data },
      } = await axios.get(`${hostname}:${port}/manageExceptions/pt3`, {
        headers: bearerToken,
      });
      return data;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

// GET assets for Product Tier3
export const getAssetsForPt3 = createAsyncThunk(
  "manageExceptions/getAssetsForPt3",
  async (tier3, { dispatch }) => {
    const tier3_encoded = tier3.replace("/", "%2F");
    try {
      const bearerToken = await getHeaderForMiddleware();
      const { data } = await axios.get(
        `${hostname}:${port}/manageExceptions/pt3/${tier3_encoded}`,
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

// Update status of an Exception(Approve/Deny)
export const updateException = createAsyncThunk(
  "manageExceptions/updateException",
  async (exception, { dispatch }) => {
    try {
      const bearerToken = await getHeaderForMiddleware();
      const {
        data: { status, message },
      } = await axios.put(
        `${hostname}:${port}/manageExceptions/${exception.id}/status/${exception.status}`,
        exception.data,
        {
          headers: bearerToken,
        }
      );
      dispatch(successGlobal(message));
      return status;
    } catch (error) {
      dispatch(errorGlobal(error.response.data.message));
      throw error;
    }
  }
);

export const manageExceptionsSlice = createSlice({
  name: "manageExceptions",
  initialState: {
    init_data: {
      exception_for: "",
      asset_name: "",
      product_tier3: "",
      justification: "",
      additional_info: "",
      end_date: "",
      status: "",
    },
    loading: false,
    data: [],
    product_tier3: [],
    pt3_assets: [],
    scheduled_assets: [],
    assetId_map: {},
    pt3_loading: false,
    assets_loading: false,
    update_loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //GET Exceptions
      .addCase(getExceptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getExceptions.fulfilled, (state, action) => {
        state.loading = false;
        const allExceptions = [];
        action.payload.forEach((item) => {
          const { CmdbAsset } = item;

          if (CmdbAsset != null) {
            allExceptions.push({
              ...item,
              asset_name: CmdbAsset.asset_name,
            });
          } else {
            allExceptions.push({
              ...item,
              asset_name: "All",
            });
          }
        });
        state.data = allExceptions;
      })
      .addCase(getExceptions.rejected, (state) => {
        state.loading = false;
      })
      //POST Exceptions
      .addCase(createExceptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExceptions.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAdded = action.payload;
      })
      .addCase(createExceptions.rejected, (state) => {
        state.loading = false;
      })
      //GET all Product Tier3
      .addCase(getAllProductTier3.pending, (state) => {
        state.pt3_loading = true;
      })
      .addCase(getAllProductTier3.fulfilled, (state, action) => {
        state.pt3_loading = false;
        let pt3 = [];
        action.payload.forEach((item) => {
          if (item.product_tier3) {
            pt3.push(item.product_tier3);
          }
        });
        state.product_tier3 = pt3;
      })
      .addCase(getAllProductTier3.rejected, (state) => {
        state.pt3_loading = false;
      })
      //GET assets for Product Tier3
      .addCase(getAssetsForPt3.pending, (state) => {
        state.assets_loading = true;
      })
      .addCase(getAssetsForPt3.fulfilled, (state, action) => {
        state.assets_loading = false;
        action.payload.data.map(
          (item) =>
            (state.assetId_map[item.asset_name] = item.asset_instance_id)
        );

        const assets = action.payload.data.map((item) => item.asset_name);
        state.pt3_assets = assets;
        state.scheduled_assets = action.payload.scheduledAssets;
      })
      .addCase(getAssetsForPt3.rejected, (state) => {
        state.assets_loading = false;
      })
      //Update status of an Exception
      .addCase(updateException.pending, (state) => {
        state.update_loading = true;
      })
      .addCase(updateException.fulfilled, (state, action) => {
        state.update_loading = false;
      })
      .addCase(updateException.rejected, (state) => {
        state.update_loading = false;
      });
  },
});

export default manageExceptionsSlice.reducer;
