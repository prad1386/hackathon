import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import HelperTooltip from "@components/HelperTooltip";
import Table from "@components/Table";
import {
  getMyAssets,
  uncheckAssetAll,
  calendarSelectedDate,
  timeslotSelected,
} from "@store/myAssets.duck";
import Actions from "@pages/MyAssets/Actions";
import SelectedAssets from "@pages/MyAssets/SelectedAssets";
import { constants } from "@constants";
import { TextField, Autocomplete } from "@mui/material";
import CreateException from "@adminPages/ManageExceptions/CreateException";
import DialogBox from "@components/DialogBox";

const menuItems = ["Request Exception"];

const ScheduleAssetsTab = () => {
  const {
    userInfo: { isSuperUser, isScheduler },
  } = useSelector((state) => state.users);

  const {
    assets: { allMyAssets: data, selectedAssets },
    loading,
  } = useSelector((state) => state.myAssets);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterActive, setFilterActive] = useState(false);
  const [activeFilterData, setActiveFilterData] = useState([]);

  const [filteredAssets, setFilteredAssets] = useState([]);
  const [checkboxStatus, setCheckboxStatus] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectValue, setselectValue] = useState("");
  const [clearButtonState, setClearButtonState] = useState(true);

  const COLUMNS = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "campaign Id",
      accessor: "campaign_id",
    },
    {
      Header: "Asset Instance Id",
      accessor: "asset_instance_id",
    },
    {
      Header: "Campaign Assets Page Start Date",
      accessor: "start_date",
    },
    {
      Header: "Campaign Assets Page End Date",
      accessor: "end_date",
    },
    {
      Header: (
        <SelectedAssets
          checkedAsset={filterActive ? activeFilterData : filteredAssets}
          disabled={checkboxStatus}
          selectAll={true}
        />
      ),
      id: "asset-select",
      Cell: ({ row }) => {
        return (
          <SelectedAssets
            checkedAsset={row.values}
            disabled={checkboxStatus}
            selectAll={false}
          />
        );
      },
    },
    {
      Header: constants.TEXT_ASSET_NAME,
      accessor: "asset_name",
      Cell: ({ row }) => (
        <Link
          className="link"
          to={`viewasset/${row.values.asset_instance_id}/cid/${
            row.values.campaign_id
          }/status/${"scheduled"}`}
        >
          {row.values.asset_name}
        </Link>
      ),
    },
    {
      Header: constants.TEXT_PRODUCT_TIER_3,
      accessor: "product_tier3",
      className: "col-pt3",
    },
    {
      Header: constants.TEXT_SERVER_OWNER,
      accessor: "server_owner",
    },
    {
      Header: constants.TEXT_TECHNOLOGY_TYPE,
      accessor: "technology_type",
    },
    {
      Header: constants.TEXT_ENVIRONMENT,
      accessor: "system_environment",
      className: "col-env",
    },
    {
      Header: constants.TEXT_LOCATION,
      accessor: "discovered_location",
    },
    {
      Header: constants.TEXT_CAMPAIGN,
      accessor: "campaign_name",
    },
    {
      Header: constants.TEXT_DEPLOYMENT_TYPE,
      accessor: "manual_campaign",
      Cell: ({ row }) => (
        <>
          {row.original.manual_campaign === true
            ? constants.TEXT_MANUAL_CAMPAIGN_Y
            : constants.TEXT_MANUAL_CAMPAIGN_N}
        </>
      ),
    },
    {
      Header: constants.TEXT_PATCH_STATUS,
      accessor: "patch_status",
      Cell: ({ row }) => <div>Not Scheduled</div>,
    },
  ];

  if (isSuperUser || isScheduler) {
    COLUMNS.push({
      Header: "ACTIONS",
      id: "actions",
      Cell: ({ row }) => (
        <Actions record={row.original} menuItems={menuItems} />
      ),
    });
  }

  // remove duplicate campaign entry for search box
  const uniqueCampaign = [
    ...new Map(data.map((o) => [o.campaign_name, o])).values(),
  ]; //change to data

  const getCampaignVal = (values) => {
    const newFilterAsset = data.filter((val) => {
      //change to data
      return val.campaign_name === values;
    });
    setFilteredAssets(newFilterAsset); // add filtered campaign assets
    setClearButtonState(false); // enable clear button
    setCheckboxStatus(false); // enable all checkbox for selection
  };

  const getAllAssets = () => {
    setselectValue("");
    dispatch(uncheckAssetAll({}));
    setCheckboxStatus(true);
    setClearButtonState(true); // disable clear button
    dispatch(getMyAssets({}))
      .unwrap()
      .then((response) => {
        setFilteredAssets(response);
      });
  };

  useEffect(() => {
    dispatch(getMyAssets({}))
      .unwrap()
      .then((response) => {
        setFilteredAssets(response);
      });
  }, [dispatch]);

  useEffect(() => {
    const timesotEmptyObj = {};
    const selectedDateReset = "";
    dispatch(calendarSelectedDate(selectedDateReset));
    dispatch(timeslotSelected(timesotEmptyObj));
    if (checkboxStatus) {
      dispatch(uncheckAssetAll({}));
    }
  }, [checkboxStatus, dispatch]);

  const handleClearAll = () => {
    dispatch(uncheckAssetAll({}));
  };

  const tableRef = useRef(null);

  const clearFilter = () => {
    setFilterActive(false);
    setActiveFilterData([]);
    tableRef.current.clearAllFilter();
  };

  const filteredData = (data) => {
    dispatch(uncheckAssetAll({}));
    setFilterActive(true);
    setActiveFilterData(data);
  };

  const handleDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="search-section">
        <div className="d-flex flex-row bd-highlight mb-3">
          <div className="search-campaign">
            <label className="col-form-label">
              {constants.TEXT_SELECT_A_CAMPAIGN}
            </label>
            <div className="input-group">
              <Autocomplete
                freeSolo
                name="campaign_search"
                options={uniqueCampaign.map((option) => option.campaign_name)}
                value={selectValue}
                renderInput={(params) => {
                  const InputProps = { ...params.InputProps };
                  InputProps.endAdornment = null;
                  return (
                    <TextField
                      {...params}
                      InputProps={InputProps}
                      size="small"
                      className="form-control"
                      hiddenLabel
                      placeholder="Click here to select a campaign"
                    />
                  );
                }}
                onChange={(event, values, reason) => {
                  setFilterActive(false);
                  setActiveFilterData([]);
                  dispatch(uncheckAssetAll({}));
                  setselectValue(values);
                  return getCampaignVal(values);
                }}
                className="form-control custom-autocomplete autocomplete p-0 border-0"
              />
              <button className="btn btn-secondary btn-search">
                <HelperTooltip text={constants.TEXT_INFO_MESSAGE} info={true} />
              </button>
            </div>
          </div>
          <div className="mx-3 clear-all-container">
            <Button
              variant="outlined"
              className="clear-all-btn"
              disabled={clearButtonState}
              onClick={getAllAssets}
            >
              Clear Selected Campaign
            </Button>
          </div>

          {/* Below link is visible to only Schedulers */}
          {!isSuperUser && isScheduler && (
            <span className="req-exception-text">
              To request an exception for single asset or all assets for Product
              Tier 3
              <button
                className="req-exception-click-here"
                onClick={handleDialog}
              >
                click here
              </button>
            </span>
          )}
        </div>
      </div>

      <div className="filter-section">
        <div className="filters">
          {constants.TEXT_SELECTION} |
          <span className="filter-selection-text">
            {selectedAssets.length} asset(s) selected
          </span>
          <Button
            variant="outlined"
            size="small"
            className="clear-all-btn"
            onClick={handleClearAll}
          >
            {constants.TEXT_CLEAR_SELECTION}
          </Button>
          <Button
            variant="outlined"
            size="small"
            className="clear-all-btn"
            onClick={clearFilter}
          >
            {constants.TEXT_CLEAR_ALL_FILTERS}
          </Button>
        </div>
        {(isSuperUser || isScheduler) && (
          <button
            className="btn btn-primary btn-sm create-new-btn"
            onClick={() => navigate("scheduleassets?action=schedule")}
            disabled={selectedAssets.length > 0 ? false : true}
          >
            {constants.TEXT_SCHEDULE_ASSETS}
          </button>
        )}
      </div>
      <Table
        COLUMNS={COLUMNS}
        DATA={filteredAssets.length > 0 ? filteredAssets : data}
        isLoading={loading}
        ref={tableRef}
        filteredData={filteredData}
        disableColumns={[
          "id",
          "campaign_id",
          "asset_instance_id",
          "schedule_id",
          "start_date",
          "end_date",
        ]}
      />
      <DialogBox
        title={constants.TEXT_NEW_EXCEPTION_FOR_ASSET}
        isOpen={isOpen}
        handleClose={handleDialog}
        maxWidth="sm"
        hideButtons={true}
      >
        <CreateException handleDialog={handleDialog} />
      </DialogBox>
    </>
  );
};

export default ScheduleAssetsTab;
