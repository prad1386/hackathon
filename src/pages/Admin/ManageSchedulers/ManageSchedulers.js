import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Button from "@mui/material/Button";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Table from "@components/Table";
import moment from "moment";
import {
  getSchedulerGroup,
  getProductTiers,
} from "@store/admin/manageScheduler.duck";
import CreateScheduler from "./CreateScheduler";
import DialogBox from "@components/DialogBox";
import Actions from "./Actions";
import { constants } from "@constants";

const menuItems = ["Modify", "Retire"];

const COLUMNS = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: constants.TEXT_PRODUCT_TIER_1,
    accessor: "product_tier1",
  },
  {
    Header: constants.TEXT_PRODUCT_TIER_2,
    accessor: "product_tier2",
  },
  {
    Header: constants.TEXT_PRODUCT_TIER_3,
    accessor: "product_tier3",
  },
  {
    Header: constants.TEXT_SCHEDULER_GROUP,
    accessor: "scheduler_group",
  },
  {
    Header: constants.TEXT_CREATED_ON,
    accessor: "created_on",
    Cell: ({ value }) => {
      return moment(value).format("MM/DD/YYYY HH:mm:ss");
    },
  },
  {
    Header: constants.TEXT_CREATED_BY,
    accessor: "created_by",
    className: "col-createdby",
  },
  {
    Header: constants.TEXT_STATUS,
    accessor: "status",
    Cell: ({ row }) => (
      <>
        {(row.original.status === "Active" ||
          row.original.status === "active") && [
          <FiberManualRecordIcon
            fontSize="small"
            style={{ color: "green" }}
            key={row.original.id}
          />,
          ` ${row.original.status}`,
        ]}
        {(row.original.status === "Retired" ||
          row.original.status === "retired") && [
          <FiberManualRecordIcon
            fontSize="small"
            style={{ color: "red" }}
            key={row.original.id}
          />,
          ` ${row.original.status}`,
        ]}
      </>
    ),
  },
  {
    Header: "ACTIONS",
    id: "actions",
    Cell: ({ row }) => <Actions record={row.original} menuItems={menuItems} />,
  },
];

const ManageSchedulers = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { listSchedulerGroups: data, loading } = useSelector(
    (state) => state.manageSchedulers
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSchedulerGroup({}));
    dispatch(getProductTiers({}));
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
      <div className="panel-heading">{constants.TEXT_MANAGE_SCHEDULERS}</div>
      <div className="content-layout">
        <div className="sub-heading">
          {constants.TEXT_ASSIGNED_SCHEDULER_GRPS}
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
          title={constants.TEXT_NEW_SCHEDULER_GRP_DIALOG_TITLE}
          isOpen={isOpen}
          handleClose={handleDialog}
          maxWidth="sm"
          hideButtons={true}
        >
          <CreateScheduler handleDialog={handleDialog} />
        </DialogBox>
      </div>
    </Container>
  );
};

export default ManageSchedulers;
