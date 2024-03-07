import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { viewCampaign } from "@store/campaign.duck";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import moment from "moment";
import { constants } from "@constants";
import { downaloadAssets } from "@store/campaign.duck";
import { Loader } from "@utils/tools";
import CSVExport from "@utils/CSVDownload";

const ViewCampaign = () => {
  const [getDownloadData, SetDownloadData] = useState([]);
  const { viewCampaign: data, viewCampaignLoading } = useSelector(
    (state) => state.campaign
  );
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(viewCampaign(id));
  }, [dispatch, id]);

  const getSelectedItem = (item, e) => {
    e.preventDefault();
    if (item.campaign_id) {
      dispatch(downaloadAssets(item.campaign_id))
        .unwrap()
        .then((res) => {
          if (res) {
            SetDownloadData(res);
          }
        });
    }
  };

  const headersCSV = [
    { label: "asset_instance_id", key: "asset_instance_id" },
    { label: "asset_name", key: "asset_name" },
  ];

  return (
    <Container fluid className="page-container detail-view">
      <div className="panel-heading ">{constants.TEXT_CAMPAIGN}</div>

      <section className="content-layout">
        <div className="sub-heading mb-2">
          <div className="d-flex">
            <div className="p-2 flex-grow-1">
              {data.campaign_id === Number(id) ? data.campaign_name : null}
            </div>
            <div className="p-2">
              <Link className="btn btn-primary px-4 btn-sm" to="/campaigns">
                {constants.TEXT_BUTTON_CLOSE}
              </Link>
            </div>
          </div>
        </div>
        {viewCampaignLoading && <Loader />}
        <Row>
          <Col className="mt-2 bd-highlight">
            {Number(id) === data.campaign_id ? (
              <div>
                <div className="d-flex">
                  <div className="p-2 camp-label w-25 uppercase">
                    {constants.TEXT_CAMPAIGN_NAME}
                  </div>
                  <div className="p-2 flex-fill">{data.campaign_name}</div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label w-25 uppercase">
                    {constants.TEXT_DESCRIPTION}
                  </div>
                  <div className="p-2 flex-fill">
                    {data.campaign_description}
                  </div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label w-25 uppercase">
                    {constants.TEXT_STATUS}
                  </div>
                  <div className="p-2 flex-fill">
                    {data.campaign_status === "active" ? (
                      <div>
                        <FiberManualRecordIcon
                          fontSize="small"
                          style={{ color: "green" }}
                        />
                        <span>{data.campaign_status}</span>
                      </div>
                    ) : data.campaign_status === "new" ? (
                      <div>
                        <FiberManualRecordIcon
                          fontSize="small"
                          style={{ color: "grey" }}
                        />
                        <span>{data.campaign_status}</span>
                      </div>
                    ) : data.campaign_status === "paused" ? (
                      <div>
                        <FiberManualRecordIcon
                          fontSize="small"
                          style={{ color: "orange" }}
                        />
                        <span>{data.campaign_status}</span>
                      </div>
                    ) : data.campaign_status === "expired" ||
                      data.campaign_status === "retired" ? (
                      <div>
                        <FiberManualRecordIcon
                          fontSize="small"
                          style={{ color: "red" }}
                        />
                        <span>{data.campaign_status}</span>
                      </div>
                    ) : (
                      data.campaign_status === "complete" && (
                        <div>
                          <FiberManualRecordIcon
                            fontSize="small"
                            style={{ color: "blue" }}
                          />
                          <span>{data.campaign_status}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label w-25 uppercase">
                    {constants.TEXT_TECHNOLOGY_TYPE}
                  </div>
                  <div className="p-2 flex-fill">{data.technology_type}</div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label w-25 uppercase">
                    {constants.TEXT_CAMPAIGN_START}
                  </div>
                  <div className="p-2 flex-fill">
                    {moment(data.start_date).format("MM/DD/YYYY")}
                  </div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label w-25 uppercase">
                    {constants.TEXT_CAMPAIGN_END}
                  </div>
                  <div className="p-2 flex-fill">
                    {moment(data.end_date).format("MM/DD/YYYY")}
                  </div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label w-25 uppercase">
                    {constants.TEXT_EMAIL_DISTRIBUTION}
                  </div>
                  <div className="p-2 flex-fill">{data.email_distribution}</div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label w-25 uppercase">
                    {constants.TEXT_EMAIL_NOTIFICATION}
                  </div>
                  <div className="p-2 flex-fill">
                    <Link to="#">{data.assets}</Link>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label w-25 uppercase">
                    {constants.TEXT_ASSETS_UPLOADED}
                  </div>
                  <div className="p-2 flex-fill">
                    <img
                      alt="excel-logo"
                      src={require("@assets/images/excel.png")}
                      width={25}
                    />
                    <button
                      onClick={(e) => getSelectedItem(data, e)}
                      className="btn btn-link p-0 btn-link-style"
                    >
                      View File
                    </button>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label w-25 uppercase">
                    {constants.TEXT_DEPLOYMENT_TYPE}
                  </div>
                  <div className="p-2 flex-fill">
                    {data.manual_campaign
                      ? constants.TEXT_MANUAL_CAMPAIGN_Y
                      : constants.TEXT_MANUAL_CAMPAIGN_N}
                  </div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label w-25 uppercase">
                    {constants.TEXT_NOTES}
                  </div>
                  <div className="p-2 flex-fill">{data.notes}</div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label w-25 uppercase">
                    {constants.TEXT_CREATED_ON}
                  </div>
                  <div className="p-2 flex-fill">
                    {moment(data.created_date).format("MM/DD/YYYY")}
                  </div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label w-25 uppercase">
                    {constants.TEXT_CREATED_BY}
                  </div>
                  <div className="p-2 flex-fill">{data.created_by}</div>
                </div>
              </div>
            ) : null}
          </Col>
        </Row>
      </section>
      {getDownloadData.length > 0 && (
        <CSVExport
          filename={data.campaign_name}
          columnheader={headersCSV}
          data={getDownloadData}
        />
      )}
    </Container>
  );
};

export default ViewCampaign;
