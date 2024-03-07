import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Button from "@mui/material/Button";
import Table from "@components/Table";
import { getCampaignReports } from "@store/reporting.duck";
import { constants } from "@constants";
import DialogBox from "@components/DialogBox";
import CSVExport from "@utils/CSVDownload";
import { getIndividualCampaignReport } from "@store/reporting.duck";
import { errorGlobal } from "@store/notifications.duck";

const CampaignReportsPage = () => {
  const { campaignReport, loading } = useSelector((state) => state.reporting);
  const [getDownloadData, SetDownloadData] = useState([]);
  const [getColumnHeader, SetColumnHeader] = useState([]);
  const [getfileName, SetfileName] = useState("");
  const dispatch = useDispatch();
  const [selectedAssets, setselectedAssets] = useState([]);
  const [isOpen, setisOpen] = useState(false);

  useEffect(() => {
    dispatch(getCampaignReports({}));
  }, [dispatch]);

  const handleDialog = () => {
    setisOpen(!isOpen);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    handleDialog();
  };

  const handleDialogcomp = (assets) => {
    setselectedAssets(assets);
    handleDialog();
  };

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
      Header: "SCHEDULED ASSETS",
      accessor: "scheduledAssetsCount",
    },
    {
      Header: "FAILED ASSETS",
      accessor: "failedAssets",
      Cell: ({ row }) => (
        <button
          type="button"
          className="btn btn-link btn-custom-linkhighlight"
          onClick={() => handleDialogcomp(row.values.failedAssets)}
        >
          {row.values.failedAssets.length}
        </button>
      ),
    },
    {
      Header: "PATCHED ASSETS",
      accessor: "patchedAssets",
      Cell: ({ row }) => (
        <button
          type="button"
          className="btn btn-link btn-custom-linkhighlight"
          onClick={() => handleDialogcomp(row.values.patchedAssets)}
        >
          {row.values.patchedAssets.length}
        </button>
      ),
    },
    {
      Header: "SUCCESS RATE",
      accessor: "percentageAssetsSucceded",
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
    dispatch(getIndividualCampaignReport(id))
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
    <>
      <Container fluid className="page-container">
        <div className="panel-heading">
          {constants.TEXT_CAMPAIGN_PROGRESS_REPORT}
        </div>
        <div className="content-layout">
          <div className="sub-heading">
            {constants.TEXT_LIST_OF} {constants.TEXT_CAMPAIGN_PROGRESS_REPORT}
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
            DATA={campaignReport}
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
      <DialogBox
        title={`Assets (${selectedAssets.length}) `}
        isOpen={isOpen}
        handleClose={handleDialog}
        hideButtons={true}
      >
        <div className="p-3">
          <div>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Asset Instance Id</th>
                  <th>Asset Name</th>
                </tr>
              </thead>
              <tbody>
                {selectedAssets.map((asset) => {
                  return (
                    <tr key={asset.asset_instance_id}>
                      <td>{asset.asset_instance_id}</td>
                      <td>{asset.asset_name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end button-sec mt-2 mb-1">
            <button
              type="button"
              className="btn btn-primary px-4 btn-sm"
              onClick={(e) => handleCancel(e)}
            >
              {constants.TEXT_BUTTON_CANCEL}
            </button>
          </div>
        </div>
      </DialogBox>
    </>
  );
};

export default CampaignReportsPage;
