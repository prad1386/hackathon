import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { Container } from "react-bootstrap";
import Table from "@components/Table";
import { patchWithManualIntervention } from "@store/reporting.duck";
import { constants } from "@constants";
import CSVExport from "@utils/CSVDownload";
import { getIndividualPatchWithManualIntervention } from "@store/reporting.duck";
import { errorGlobal } from "@store/notifications.duck";

const PatchWithManualInterventionPage = () => {
  const { patchWithManualInterventionReport, loading } = useSelector(
    (state) => state.reporting
  );
  const [getDownloadData, SetDownloadData] = useState([]);
  const [getColumnHeader, SetColumnHeader] = useState([]);
  const [getfileName, SetfileName] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(patchWithManualIntervention({}));
  }, [dispatch]);

  const COLUMNS = [
    {
      Header: "campaignId",
      accessor: "campaignId",
    },
    {
      Header: "CAMPAIGN NAME",
      accessor: "campaignName",
    },
    {
      Header: "ASSET NAME",
      accessor: "assetName",
    },
    {
      Header: "ASSET INSTANCE ID",
      accessor: "assetInstanceId",
    },
    {
      Header: "PRODUCT TIER 3",
      accessor: "productTier3",
    },
    {
      Header: "ENVIRONMENT",
      accessor: "environment",
    },
    {
      Header: "CR NUMBER",
      accessor: "crNumber",
    },
    {
      Header: "OPERATOR NAME",
      accessor: "operatorName",
    },
    {
      Header: "TECHNOLOGY TYPE",
      accessor: "technologyType",
    },
    {
      Header: "PATCH STATUS",
      accessor: "patchStatus",
    },
    {
      Header: "DOWNLOAD REPORTS (CSV)",
      Cell: ({ row }) => (
        <div>
          <button
            onClick={(e) => {
              downloadCSV(e, row.values.campaignId, row.values.campaignName);
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

  const tableRef = useRef(null);

  const clearFilter = () => {
    tableRef.current.clearAllFilter();
  };

  const downloadCSV = (e, id, report) => {
    SetDownloadData([]);
    dispatch(getIndividualPatchWithManualIntervention(id))
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

  return (
    <Container fluid className="page-container">
      <div className="panel-heading">{constants.TEXT_PATCH_MANUAL_REPORT}</div>
      <div className="content-layout">
        <div className="sub-heading">
          {constants.TEXT_LIST_OF} {constants.TEXT_PATCH_MANUAL_REPORT}
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
          DATA={patchWithManualInterventionReport}
          isLoading={loading}
          ref={tableRef}
        />
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

export default PatchWithManualInterventionPage;
