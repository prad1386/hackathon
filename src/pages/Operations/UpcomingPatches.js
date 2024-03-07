import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Table from "@components/Table";
import { Row, Col } from "react-bootstrap";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import HelperTooltip from "@components/HelperTooltip";
import { getPatches } from "@store/patchesOperation.duck";
import { constants } from "@constants";

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

const UpcomingPatches = () => {
  const { allPatches: data, loading } = useSelector(
    (state) => state.patchesOperation
  );
  const dispatch = useDispatch();
  const [hours, setHours] = useState("");

  useEffect(() => {
    dispatch(getPatches({ status: "upcoming", hours: hours }));
  }, [dispatch, hours]);

  const tableRef = useRef(null);

  const clearFilter = () => {
    tableRef.current.clearAllFilter();
  };

  return (
    <section>
      <Row className="mb-3 patch-filter">
        <Col sm={4}>{constants.TEXT_JOB_SCHEDULED_TO_BEGIN}</Col>
        <Col sm={6}>
          <span>See schedule for next </span>
          <Select
            className="patch-filter-select"
            value={hours}
            displayEmpty
            onChange={(e) => setHours(Number(e.target.value))}
          >
            {[8, 12, 24, 36, 72].map((hours) => (
              <MenuItem key={hours} value={hours}>
                {hours} Hrs
              </MenuItem>
            ))}
            {/* <MenuItem key="5" value="5">
              5 Days
            </MenuItem> */}
          </Select>
        </Col>
      </Row>

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

export default UpcomingPatches;
