import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Table from "@components/Table";
import HelperTooltip from "@components/HelperTooltip";
import Actions from "./Actions";
import { getPatches } from "@store/patchesOperation.duck";
import { constants } from "@constants";

const menuItems = ["Edit", "Assign to Me"];

const AssetsNeedAttention = () => {
  const {
    userInfo: { isSuperUser, isOperator },
  } = useSelector((state) => state.users);

  const { allPatches: data, loading } = useSelector(
    (state) => state.patchesOperation
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPatches({ status: "failed" }));
  }, [dispatch]);

  const COLUMNS = [
    {
      Header: "ID",
      accessor: "asset_instance_id",
    },
    {
      Header: constants.TEXT_ASSET_NAME,
      accessor: "asset_name",
      Cell: ({ row }) => (
        <Link
          className="link"
          to={`viewpatchdetails/${row.original.campaign_id}/${row.original.asset_instance_id}`}
        >
          {row.original.asset_name}
        </Link>
      ),
    },
    {
      Header: constants.TEXT_PRODUCT_TIER_3,
      accessor: "product_tier3",
      className: "col-pt3",
    },
    {
      Header: constants.TEXT_OVERALL_STATUS,
      accessor: "overall_status",
      className: "col-status",
    },
    {
      Header: constants.TEXT_TECHNOLOGY_TYPE,
      accessor: "technology_type",
      className: "col-tech-type",
    },
    {
      Header: constants.TEXT_ENVIRONMENT,
      accessor: "environment",
      className: "col-env",
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
      Header: constants.TEXT_PATCHING_STATUS,
      accessor: "patching_status",
    },
    {
      Header: constants.TEXT_PRECHECK_STATUS,
      accessor: "patch_precheck",
    },
    {
      Header: constants.TEXT_POSTCHECK_STATUS,
      accessor: "patch_postcheck",
    },
    {
      Header: constants.TEXT_OPERATOR_NAME,
      accessor: "operator_name",
    },
    {
      Header: constants.TEXT_OPERATOR_NOTES,
      accessor: "operator_notes",
      className: "col-status-notes",
      Cell: ({ row }) =>
        row.original.operator_notes && (
          <div style={{ textAlign: "center" }}>
            <HelperTooltip info={true} text={row.original.operator_notes} />
          </div>
        ),
    },
  ];

  if (isSuperUser || isOperator) {
    COLUMNS.push({
      Header: "ACTIONS",
      id: "actions",
      Cell: ({ row }) => <Actions menuItems={menuItems} row={row.original} />,
    });
  }

  const tableRef = useRef(null);

  const clearFilter = () => {
    tableRef.current.clearAllFilter();
  };

  return (
    <section>
      <div className="sub-heading">
        {constants.TEXT_ASSETS_FAILED_PATCH_STATUS}
      </div>
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
        disableColumns={["asset_instance_id"]}
      />
    </section>
  );
};

export default AssetsNeedAttention;
