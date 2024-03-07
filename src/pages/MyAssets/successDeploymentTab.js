import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Table from "@components/Table";
import { getSuccessfulDeployment } from "@store/myAssets.duck";
import { constants } from "@constants";

const SuccessDeploymentTab = () => {
  const {
    assets: { allSuccessfulDeployment: data },
    loading,
  } = useSelector((state) => state.myAssets);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSuccessfulDeployment({}));
  }, [dispatch]);

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
      Header: "Schedule Id",
      accessor: "schedule_id",
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
      Header: constants.TEXT_ASSET_NAME,
      accessor: "asset_name",
      Cell: ({ row }) => (
        <Link
          className="link"
          to={`viewasset/${row.values.asset_instance_id}/cid/${
            row.values.campaign_id
          }/status/${"pending"}`}
        >
          {row.values.asset_name}
        </Link>
      ),
    },
    {
      Header: constants.TEXT_CR_NUMBER,
      accessor: "cr_number",
    },
    {
      Header: constants.TEXT_CR_STATUS,
      accessor: "cr_status",
    },
    {
      Header: constants.TEXT_PRODUCT_TIER_3,
      accessor: "product_tier3",
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
          {row.original.manual_campaign
            ? constants.TEXT_MANUAL_CAMPAIGN_Y
            : constants.TEXT_MANUAL_CAMPAIGN_N}
        </>
      ),
    },
    {
      Header: constants.TEXT_PATCH_STATUS,
      accessor: "patch_status",
    },
  ];

  const tableRef = useRef(null);

  const clearFilter = () => {
    tableRef.current.clearAllFilter();
  };

  return (
    <>
      <div className="filter-section">
        <div className="filters">
          <Button
            variant="outlined"
            size="small"
            className="clear-all-btn"
            onClick={clearFilter}
          >
            {constants.TEXT_CLEAR_ALL_FILTERS}
          </Button>
        </div>
      </div>
      <Table
        COLUMNS={COLUMNS}
        DATA={data}
        isLoading={loading}
        ref={tableRef}
        disableColumns={[
          "id",
          "campaign_id",
          "asset_instance_id",
          "schedule_id",
          "start_date",
          "end_date",
        ]}
      />
      {/*  */}
    </>
  );
};

export default SuccessDeploymentTab;
