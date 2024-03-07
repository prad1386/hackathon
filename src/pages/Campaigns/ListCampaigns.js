import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import Button from "@mui/material/Button";
import { Container } from "react-bootstrap";
import Table from "@components/Table";
import moment from "moment";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Actions from "./Actions";
import { getCampaigns } from "@store/campaign.duck";
import { constants } from "@constants";
import { downaloadAssets } from "@store/campaign.duck";
import CSVExport from "@utils/CSVDownload";

const menuItems = ["Modify", "Resume", "Pause", "Retire", "Clone"];

const ListCampaigns = () => {
  const [getDownloadData, SetDownloadData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [getfileName, SetfileName] = useState("");

  const { allCampaigns: data, loading } = useSelector(
    (state) => state.campaign
  );

  const { actionStatus: actionStatusRefresh } = useSelector(
    (state) => state.campaign
  );

  const {
    userInfo: { isSuperUser },
  } = useSelector((state) => state.users);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCampaigns({}));
  }, [dispatch, actionStatusRefresh]);

  const getSelectedItem = (item) => {
    setLoading(true);
    SetfileName(item.campaign_name);
    dispatch(downaloadAssets(item.campaign_id))
      .unwrap()
      .then((response) => {
        if (response) {
          setLoading(false);
          SetDownloadData(response);
        }
      });
  };

  const COLUMNS = [
    {
      Header: "ID",
      accessor: "campaign_id",
    },
    {
      Header: "Upload Id",
      accessor: "upload_id",
    },
    {
      Header: constants.TEXT_CAMPAIGN_NAME,
      accessor: "campaign_name",
      Cell: ({ row }) => (
        <Link className="link" to={`viewcampaign/${row.original.campaign_id}`}>
          {row.original.campaign_name}
        </Link>
      ),
    },
    {
      Header: constants.TEXT_DESCRIPTION,
      accessor: "campaign_description",
      className: "col-description",
    },
    {
      Header: constants.TEXT_STATUS,
      accessor: "campaign_status",
      className: "col-status",
      Cell: ({ row }) => (
        <>
          {row.original.campaign_status === "new"
            ? [
                <FiberManualRecordIcon
                  fontSize="small"
                  style={{ color: "grey" }}
                  key={row.original.campaign_id}
                />,
                ` ${row.original.campaign_status}`,
              ]
            : row.original.campaign_status === "active"
            ? [
                <FiberManualRecordIcon
                  fontSize="small"
                  style={{ color: "green" }}
                  key={row.original.campaign_id}
                />,
                ` ${row.original.campaign_status}`,
              ]
            : row.original.campaign_status === "paused"
            ? [
                <FiberManualRecordIcon
                  fontSize="small"
                  style={{ color: "orange" }}
                  key={row.original.campaign_id}
                />,
                ` ${row.original.campaign_status}`,
              ]
            : row.original.campaign_status === "complete"
            ? [
                <FiberManualRecordIcon
                  fontSize="small"
                  style={{ color: "blue" }}
                  key={row.original.campaign_id}
                />,
                ` ${row.original.campaign_status}`,
              ]
            : row.original.campaign_status === "expired"
            ? [
                <FiberManualRecordIcon
                  fontSize="small"
                  style={{ color: "red" }}
                  key={row.original.campaign_id}
                />,
                ` ${row.original.campaign_status}`,
              ]
            : row.original.campaign_status === "retired" && [
                <FiberManualRecordIcon
                  fontSize="small"
                  style={{ color: "red" }}
                  key={row.original.campaign_id}
                />,
                ` ${row.original.campaign_status}`,
              ]}
        </>
      ),
    },
    {
      Header: constants.TEXT_DEPLOYMENT_TYPE,
      accessor: "manual_campaign",
      className: "col-deployment-type",
      Cell: ({ row }) => (
        <>
          {row.original.manual_campaign
            ? constants.TEXT_MANUAL_CAMPAIGN_Y
            : constants.TEXT_MANUAL_CAMPAIGN_N}
        </>
      ),
    },
    {
      Header: constants.TEXT_TECHNOLOGY_TYPE,
      accessor: "technology_type",
      className: "col-tech-type",
    },
    {
      Header: constants.TEXT_CAMPAIGN_START,
      accessor: "start_date",
      Cell: ({ value }) => {
        return moment(value).format("MM/DD/YYYY");
      },
    },
    {
      Header: constants.TEXT_CAMPAIGN_END,
      accessor: "end_date",
      Cell: ({ value }) => {
        return moment(value).format("MM/DD/YYYY");
      },
    },
    {
      Header: constants.TEXT_ASSETS,
      accessor: "assets",
      Cell: ({ row }) => (
        <div>
          <button
            onClick={(e) => getSelectedItem(row.original, e)}
            className="btn btn-link p-0"
          >
            <img
              alt="excel-logo"
              src={require("@assets/images/excel.png")}
              width={25}
            />
          </button>
        </div>
      ),
    },
  ];

  if (isSuperUser) {
    COLUMNS.push({
      Header: "ACTIONS",
      id: "actions",
      Cell: ({ row }) => (
        <Actions
          id={row.original.campaign_id}
          menuItems={menuItems}
          rowData={row.original}
          selectedRowActionStatus={row.original.campaign_status}
        />
      ),
    });
  }

  const tableRef = useRef(null);

  const clearFilter = () => {
    tableRef.current.clearAllFilter();
  };

  const headersCSV = [
    { label: "asset_instance_id", key: "asset_instance_id" },
    { label: "asset_name", key: "asset_name" },
  ];

  return (
    <Container fluid className="page-container">
      <div className="panel-heading">{constants.TEXT_CAMPAIGN}</div>
      <div className="content-layout">
        <div className="sub-heading">{constants.TEXT_MY_CAMPAIGN}</div>
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
          <div className="create-new-btn">
            {isLoading ? (
              <span className="loadingtxt mx-2">Download in progress ...</span>
            ) : null}
            {isSuperUser && (
              <Link
                className="btn btn-primary btn-sm create-new-btn mx-2"
                to="campaign/?action=create"
              >
                {constants.TEXT_NEW_CAMPAIGN}
              </Link>
            )}
          </div>
        </div>
        <Table
          COLUMNS={COLUMNS}
          DATA={data}
          isLoading={loading}
          ref={tableRef}
          disableColumns={["id", "campaign_id", "upload_id"]}
        />
        {getDownloadData.length > 0 && (
          <CSVExport
            filename={getfileName}
            columnheader={headersCSV}
            data={getDownloadData}
          />
        )}
      </div>
      <Outlet />
    </Container>
  );
};

export default ListCampaigns;
