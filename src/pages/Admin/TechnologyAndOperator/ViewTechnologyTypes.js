import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Button from "@mui/material/Button";
import Table from "@components/Table";
import moment from "moment";
import { getTechnologyTypes } from "@store/admin/technologyTypes.duck";
import CreateTechnologyType from "./CreateTechnologyType";
import DialogBox from "@components/DialogBox";
import { constants } from "@constants";

const COLUMNS = [
  {
    Header: constants.TEXT_TECHNOLOGY_TYPE,
    accessor: "technology_type",
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
            key={Math.random()}
          />,
          ` ${row.original.status}`,
        ]}
        {(row.original.status === "Retired" ||
          row.original.status === "retired") && [
          <FiberManualRecordIcon
            fontSize="small"
            style={{ color: "red" }}
            key={Math.random()}
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
      return moment(value).format("MM/DD/YYYY HH:mm:ss");
    },
  },
  {
    Header: constants.TEXT_CREATED_BY,
    accessor: "created_by",
  },
];

const TechnologyTypes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, loading } = useSelector((state) => state.technologyTypes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTechnologyTypes({}));
  }, [dispatch]);

  const handleDialog = () => {
    setIsOpen(!isOpen);
  };

  const tableRef = useRef(null);

  const clearFilter = () => {
    tableRef.current.clearAllFilter();
  };

  return (
    <section>
      <div className="sub-heading">{constants.TEXT_LIST_TECHNOLOGY_TYPES}</div>
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
      <Table COLUMNS={COLUMNS} DATA={data} isLoading={loading} ref={tableRef} />

      <DialogBox
        title={constants.TEXT_NEW_TECH_TYPE_DIALOG_TITLE}
        isOpen={isOpen}
        handleClose={handleDialog}
        maxWidth="sm"
        hideButtons={true}
      >
        <CreateTechnologyType handleDialog={handleDialog} />
      </DialogBox>
    </section>
  );
};

export default TechnologyTypes;
