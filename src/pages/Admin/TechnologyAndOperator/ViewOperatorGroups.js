import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Table from "@components/Table";
import moment from "moment";
import { getOperatorGroup } from "@store/admin/operatorGroup.duck";
import CreateOperatorGroup from "./CreateOperatorGroup";
import Actions from "./Actions";
import DialogBox from "@components/DialogBox";
import { constants } from "@constants";

const menuItems = ["Modify", "Retire"];

const OperatorGroups = () => {
  const [isModify, setisModify] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modifyRecord, setModifyRecord] = useState({});

  const { allOperatorGroup: data, loading } = useSelector(
    (state) => state.operatorGroup
  );
  const dispatch = useDispatch();

  const handleModify = (record) => {
    setModifyRecord(record);
    setisModify(true);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    dispatch(getOperatorGroup({}));
  }, [dispatch]);

  const handleDialog = () => {
    setIsOpen(!isOpen);
  };

  const COLUMNS = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: constants.TEXT_OPERATOR_GROUP,
      accessor: "operator_group",
    },
    {
      Header: constants.TEXT_TECHNOLOGY_TYPE,
      accessor: "technology_type",
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
      accessor: "created_on",
      Cell: ({ value }) => {
        return moment(value).format("MM/DD/YYYY HH:mm:ss");
      },
    },
    {
      Header: constants.TEXT_CREATED_BY,
      accessor: "created_by",
    },
    {
      Header: "ACTIONS",
      id: "actions",
      Cell: ({ row }) => (
        <Actions
          record={row.original}
          menuItems={menuItems}
          handleModify={handleModify}
        />
      ),
    },
  ];

  const tableRef = useRef(null);

  const clearFilter = () => {
    tableRef.current.clearAllFilter();
  };

  return (
    <>
      <div className="sub-heading">{constants.TEXT_LIST_OPERATOR_GRPS}</div>
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
        title={
          isModify ? "Modify" : constants.TEXT_ASSIGN_OPERATOR_GRP_DIALOG_TITLE
        }
        isOpen={isOpen}
        handleClose={handleDialog}
        maxWidth="sm"
        hideButtons={true}
      >
        <CreateOperatorGroup
          handleDialog={handleDialog}
          isModify={isModify}
          modifyRecord={modifyRecord}
          setisModify={setisModify}
        />
      </DialogBox>
    </>
  );
};

export default OperatorGroups;
