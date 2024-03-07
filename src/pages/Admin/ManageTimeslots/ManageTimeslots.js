import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Button from "@mui/material/Button";
import Table from "@components/Table";
import moment from "moment";
import { getTimeslots } from "@store/admin/manageTimeslots.duck";
import CreateTimeslots from "./CreateTimeslots";
import DialogBox from "@components/DialogBox";
import { constants } from "@constants";

const COLUMNS = [
  {
    Header: constants.TEXT_TIMESLOT_NAME,
    accessor: "timeslot_name",
  },
  {
    Header: constants.TEXT_DAY_OF_WEEK,
    accessor: "day_of_week",
  },
  {
    Header: constants.TEXT_START_TIME,
    accessor: "start_time",
  },
  {
    Header: constants.TEXT_END_TIME,
    accessor: "end_time",
  },
  {
    Header: constants.TEXT_MAXIMUM_NUMBER_OF_ASSETS,
    accessor: "max_assets",
    className: "col-maxassets",
  },
  {
    Header: constants.TEXT_STATUS,
    accessor: "status",
    className: "col-status",
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
    Header: constants.TEXT_CREATED_ON,
    accessor: "created_date",
    Cell: ({ value }) => {
      return moment(value).format("MM/DD/YYYY HH:mm:ss");
    },
  },
  {
    Header: constants.TEXT_CREATED_BY,
    accessor: "created_by",
  },
];

const ManageTimeslots = () => {
  const { allTimeslots: data, loading } = useSelector(
    (state) => state.manageTimeslots
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTimeslots({}));
  }, [dispatch]);

  const [isOpen, setIsOpen] = useState(false);

  const handleDialog = () => {
    setIsOpen(!isOpen);
  };

  const tableRef = useRef(null);

  const clearFilter = () => {
    tableRef.current.clearAllFilter();
  };

  return (
    <Container fluid className="page-container">
      <div className="panel-heading">{constants.TEXT_MANAGE_TIMESLOTS}</div>
      <div className="content-layout">
        <div className="sub-heading">{constants.TEXT_LIST_OF_TIMESLOTS}</div>
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
        />

        <DialogBox
          title={constants.TEXT_NEW_TIMESLOT_DIALOG_TITLE}
          isOpen={isOpen}
          handleClose={handleDialog}
          maxWidth="sm"
          hideButtons={true}
        >
          <CreateTimeslots handleDialog={handleDialog} allTimeslots={data} />
        </DialogBox>
      </div>
      <Outlet />
    </Container>
  );
};

export default ManageTimeslots;
