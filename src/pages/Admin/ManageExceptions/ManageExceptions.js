import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Button from "@mui/material/Button";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Table from "@components/Table";
import moment from "moment";
import HelperTooltip from "@components/HelperTooltip";
import { getExceptions } from "@store/admin/manageExceptions.duck";
import CreateException from "./CreateException";
import DialogBox from "@components/DialogBox";
import Actions from "./Actions";
import { constants } from "@constants";

const menuItems = ["Approve", "Deny"];

const COLUMNS = [
  {
    Header: "ID",
    id: "id",
  },
  {
    Header: constants.TEXT_ASSET_NAME,
    accessor: "asset_name",
  },
  {
    Header: constants.TEXT_PRODUCT_TIER_3,
    accessor: "product_tier3",
    className: "col-pt3",
  },
  {
    Header: constants.TEXT_JUSTIFICATION,
    accessor: "justification",
  },
  {
    Header: constants.TEXT_ADDITIONAL_INFO,
    accessor: "additional_info",
    className: "col-additional-info",
  },
  {
    Header: constants.TEXT_END_DATE,
    accessor: "end_date",
    className: "col-end-date",
    Cell: ({ value }) => {
      return moment(value).format("MM/DD/YYYY");
    },
  },
  {
    Header: constants.TEXT_STATUS,
    accessor: "status",
    className: "col-status",
    Cell: ({ row }) => (
      <>
        {row.original.status === "pending approval" && [
          <FiberManualRecordIcon
            fontSize="small"
            style={{ color: "grey" }}
            key={row.original.id}
          />,
          ` ${row.original.status}`,
        ]}
        {row.original.status === "denied" && [
          <FiberManualRecordIcon
            fontSize="small"
            style={{ color: "red" }}
            key={row.original.id}
          />,
          ` ${row.original.status}`,
        ]}
        {row.original.status === "approved" && [
          <FiberManualRecordIcon
            fontSize="small"
            style={{ color: "blue" }}
            key={row.original.id}
          />,
          ` ${row.original.status}`,
        ]}
      </>
    ),
  },
  {
    Header: constants.TEXT_CREATED_ON,
    accessor: "created_on",
    Cell: ({ value }) => {
      return moment(value).format("MM/DD/YYYY");
    },
  },
  {
    Header: constants.TEXT_CREATED_BY,
    accessor: "created_by",
  },
  {
    Header: constants.TEXT_STATUS_NOTE,
    accessor: "note",
    className: "col-status-notes",
    Cell: ({ row }) =>
      row.original.note && (
        <div style={{ textAlign: "center" }}>
          <HelperTooltip info={true} text={row.original.note} />
        </div>
      ),
  },
  {
    Header: constants.TEXT_STATUS_CHANGED_BY,
    accessor: "status_changed_by",
    className: "col-status-changed",
  },
  {
    Header: "ACTIONS",
    id: "actions",
    Cell: ({ row }) => <Actions record={row.original} menuItems={menuItems} />,
  },
];

const ManageExceptions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, loading } = useSelector((state) => state.manageExceptions);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getExceptions({}));
  }, [dispatch]);

  const handleDialog = () => {
    setIsOpen(!isOpen);
  };

  const tableRef = useRef(null);

  const clearFilter = () => {
    tableRef.current.clearAllFilter();
  };

  return (
    <Container fluid className="page-container">
      <div className="panel-heading">{constants.TEXT_MANAGE_EXCEPTIONS}</div>
      <div className="content-layout">
        <div className="sub-heading">
          {constants.TEXT_ASSETS_WITH_EXCEPTONS}
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
          <button
            className="btn btn-primary btn-sm create-new-btn"
            onClick={handleDialog}
          >
            {constants.TEXT_BUTTON_NEW_ENTRY}
          </button>
        </div>
        <Table
          COLUMNS={COLUMNS}
          DATA={data}
          isLoading={loading}
          ref={tableRef}
          disableColumns={["id"]}
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
      </div>
    </Container>
  );
};

export default ManageExceptions;
