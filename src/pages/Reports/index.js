import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import Button from "@mui/material/Button";
import Table from "@components/Table";
import { constants } from "@constants";
import CSVExport from "@utils/CSVDownload";

import {
  getAssetReports,
  getCampaignReports,
  getCampaignPatchFailureReports,
  patchWithManualIntervention,
} from "@store/reporting.duck";
import { errorGlobal } from "@store/notifications.duck";

const ReportsPage = () => {
  const [getDownloadData, SetDownloadData] = useState([]);
  const [getColumnHeader, SetColumnHeader] = useState([]);
  const [getfileName, SetfileName] = useState("");

  const dispatch = useDispatch();
  const COLUMNS = [
    {
      Header: constants.TEXT_REPORT_NAME,
      accessor: "report_name",
      Cell: ({ row }) => (
        <Link
          className="link"
          to={
            row.values.report_name === constants.TEXT_ASSETS_PENDING_REPORT
              ? "assetreports"
              : row.values.report_name ===
                constants.TEXT_CAMPAIGN_PROGRESS_REPORT
              ? "campaignreports"
              : row.values.report_name === constants.TEXT_CAMPAIGN_PATCH_REPORT
              ? "campaignpatchfailure"
              : row.values.report_name === constants.TEXT_PATCH_MANUAL_REPORT &&
                "patchwithmanualintervention"
          }
        >
          {row.values.report_name}
        </Link>
      ),
    },
    {
      Header: constants.TEXT_DESCRIPTION,
      accessor: "description",
    },
    {
      Header: constants.TEXT_CATEGORY,
      accessor: "category",
    },
    {
      Header: "DOWNLOAD REPORTS (CSV)",
      Cell: ({ row }) => (
        <div>
          <button
            onClick={(e) => {
              downloadCSV(e, row.values.report_name);
            }}
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

  const data = [
    {
      report_name: constants.TEXT_ASSETS_PENDING_REPORT,
      description: "Percent of assets yet to be scheduled for each campaign.",
      category: "Scheduling",
    },
    {
      report_name: constants.TEXT_CAMPAIGN_PROGRESS_REPORT,
      description: "Success rate of all completed campaigns.",
      category: "Campaigns",
    },
    {
      report_name: constants.TEXT_CAMPAIGN_PATCH_REPORT,
      description:
        "List of all assets with failed patches after campaign completion.",
      category: "Campaigns",
    },
    {
      report_name: constants.TEXT_PATCH_MANUAL_REPORT,
      description:
        "List of all assets requiring manual intervention by the operator during patching.",
      category: "Operations",
    },
  ];

  const downloadCSV = (e, report) => {
    SetDownloadData([]);
    // const reportcsv
    report === constants.TEXT_CAMPAIGN_PROGRESS_REPORT
      ? dispatch(getCampaignReports({}))
          .unwrap()
          .then((res) => {
            if (res.length > 0) {
              SetDownloadData(res);
              const headerCSV = Object.keys(res[0]).map((key) => {
                return { label: key, key: key };
              });
              SetColumnHeader(headerCSV);
            } else {
              dispatch(errorGlobal("No record(s) found."));
            }
          })
      : report === constants.TEXT_ASSETS_PENDING_REPORT
      ? dispatch(getAssetReports({}))
          .unwrap()
          .then((res) => {
            if (res.length > 0) {
              SetDownloadData(res);
              const headerCSV = Object.keys(res[0]).filter((key) =>
                key !== "unscheduledAssets" ? { label: key, key: key } : false
              );
              SetColumnHeader(headerCSV);
            } else {
              dispatch(errorGlobal("No record(s) found."));
            }
          })
      : report === constants.TEXT_CAMPAIGN_PATCH_REPORT
      ? dispatch(getCampaignPatchFailureReports({}))
          .unwrap()
          .then((res) => {
            if (res.length > 0) {
              SetDownloadData(res);
              const headerCSV = Object.keys(res[0]).map((key) => {
                return { label: key, key: key };
              });
              SetColumnHeader(headerCSV);
            } else {
              dispatch(errorGlobal("No record(s) found."));
            }
          })
      : report === constants.TEXT_PATCH_MANUAL_REPORT &&
        dispatch(patchWithManualIntervention({}))
          .unwrap()
          .then((res) => {
            if (res.length > 0) {
              SetDownloadData(res);
              const headerCSV = Object.keys(res[0]).map((key) => {
                return { label: key, key: key };
              });
              SetColumnHeader(headerCSV);
            } else {
              dispatch(errorGlobal("No record(s) found."));
            }
          });

    SetfileName(report);
  };

  const tableRef = useRef(null);

  const clearFilter = () => {
    tableRef.current.clearAllFilter();
  };

  return (
    <Container fluid className="page-container">
      <div className="panel-heading">{constants.TEXT_REPORTS}</div>
      <div className="content-layout">
        <div className="sub-heading">{constants.TEXT_LIST_OF_REPORTS}</div>
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
        <Table COLUMNS={COLUMNS} DATA={data} ref={tableRef} />
        {getDownloadData.length > 0 && (
          <CSVExport
            filename={getfileName}
            columnheader={getColumnHeader}
            data={getDownloadData}
          />
        )}
      </div>
    </Container>
  );
};

export default ReportsPage;
