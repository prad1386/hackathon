import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { viewAsset } from "@store/myAssets.duck";
import moment from "moment";
import { Loader } from "@utils/tools";
import { constants } from "@constants";

const activityTypes = {
  ScheduleActivity: {
    label: "Scheduled",
    description: "Scheduler scheduled patch for asset on",
  },
  CreateExceptionActivity: {
    label: "Exception Created",
    description: "User requested exception on asset from",
  },
  ApproveExceptionActivity: {
    label: "Exception",
    approved: "Approver approved exception request",
    denied: "Approver denied exception request",
  },
  PatchStatusChangeActivity: {
    label: "Patch Status Changed",
    description_from: "Patch status changed from",
    description_to: "Patch status changed to",
  },
};

const ViewAsset = () => {
  const {
    assets: { viewAsset: data, activityLog },
    loading,
  } = useSelector((state) => state.myAssets);

  const dispatch = useDispatch();

  const { asset_instance_id, campaign_id, view } = useParams();
  useEffect(() => {
    dispatch(viewAsset({ asset_instance_id, campaign_id, view }));
  }, [dispatch, asset_instance_id, campaign_id, view]);

  const returnStatus = (status) => {
    return status === "complete-manualintervention"
      ? "Completed (Manually)"
      : status;
  };

  return (
    <Container fluid className="page-container detail-view">
      <div className="panel-heading ">{constants.TEXT_MY_ASSETS}</div>

      <section className="content-layout">
        <div className="sub-heading mb-2">
          <div className="d-flex">
            <div className="p-2 flex-grow-1">
              Asset Name:{" "}
              {data.asset_instance_id === asset_instance_id
                ? data.asset_name
                : null}
            </div>
            <div className="p-2">
              <Link className="btn btn-primary px-4 btn-sm" to="/myassets">
                {constants.TEXT_BUTTON_CLOSE}
              </Link>
            </div>
          </div>
        </div>
        {loading && <Loader />}
        <Row>
          {asset_instance_id === data.asset_instance_id ? (
            <>
              <Col sm={6} className="mt-2 bd-highlight">
                <div className="d-flex">
                  <div className="p-2 camp-label uppercase">
                    {constants.TEXT_PRODUCT_TIER_1}
                  </div>
                  <div className="p-2 flex-fill">{data.product_tier1}</div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label uppercase">
                    {constants.TEXT_PRODUCT_TIER_2}
                  </div>
                  <div className="p-2 flex-fill">{data.product_tier2}</div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label uppercase">
                    {constants.TEXT_PRODUCT_TIER_3}
                  </div>
                  <div className="p-2 flex-fill">{data.product_tier3}</div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label uppercase">
                    {constants.TEXT_TSS_MANAGER}
                  </div>
                  <div className="p-2 flex-fill">{data.tss_manager}</div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label uppercase">
                    {constants.TEXT_SERVER_OWNER}
                  </div>
                  <div className="p-2 flex-fill">{data.server_owner}</div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label uppercase">
                    {constants.TEXT_TECHNOLOGY_TYPE}
                  </div>
                  <div className="p-2 flex-fill">{data.technology_type}</div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label uppercase">
                    {constants.TEXT_ENVIRONMENT}
                  </div>
                  <div className="p-2 flex-fill">{data.system_environment}</div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label uppercase">
                    {constants.TEXT_LOCATION}
                  </div>
                  <div className="p-2 flex-fill">
                    {data.discovered_location}
                  </div>
                </div>
              </Col>
              <Col sm={6} className="mt-2 bd-highlight">
                <div className="d-flex">
                  <div className="p-2 camp-label uppercase">
                    {constants.TEXT_CAMPAIGN}
                  </div>
                  <div className="p-2 flex-fill">{data.campaign_name}</div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label uppercase">
                    {constants.TEXT_DEPLOYMENT_TYPE}
                  </div>
                  <div className="p-2 flex-fill">
                    {data.manual_campaign === true ? "Manual" : "Automated"}
                  </div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label uppercase">
                    {constants.TEXT_PATCH_STATUS}
                  </div>
                  <div className="p-2 flex-fill">
                    {view === "scheduled" ? "Not Scheduled" : data.patch_status}
                  </div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label uppercase">
                    {constants.TEXT_CR_NUMBER}
                  </div>
                  <div className="p-2 flex-fill">{data.cr_number}</div>
                </div>
                <div className="d-flex">
                  <div className="p-2 camp-label uppercase">
                    {constants.TEXT_CR_STATUS}
                  </div>
                  <div className="p-2 flex-fill">{data.cr_status}</div>
                </div>
                {data.scheduled_date ? (
                  <div className="d-flex">
                    <div className="p-2 camp-label uppercase">
                      {constants.TEXT_SCHEDULE_DATE}
                    </div>
                    <div className="p-2 flex-fill">
                      {moment(data.scheduled_date).format("MM/DD/YYYY")}
                    </div>
                  </div>
                ) : null}
                {data.start_time && (
                  <div className="d-flex">
                    <div className="p-2 camp-label uppercase">
                      {constants.TEXT_SCHEDULE_TIME}
                    </div>
                    <div className="p-2 flex-fill">{data.start_time}</div>
                  </div>
                )}
                <div className="d-flex">
                  <div className="p-2 camp-label uppercase">
                    {constants.TEXT_EXCEPTION_STATUS}
                  </div>
                  <div className="p-2 flex-fill">{data.exception_status}</div>
                </div>
              </Col>
              <hr className="mt-3" />
              <div>
                <p className="mb-3 asset-log-title">
                  {constants.TEXT_VIEW_ASSET_LOG}
                </p>

                {activityLog.map((item) => (
                  <Row className="log-row" key={item.date}>
                    <Col sm={8} key={item.type}>
                      <span className="log-item">
                        {activityTypes[item.type].label}{" "}
                        {item.status && item.status}
                      </span>
                      {item.type === "ScheduleActivity" && (
                        <p>{`${activityTypes[item.type].description} ${moment(
                          item.date
                        ).format("MM-DD-YYYY")} between ${
                          item.start_time
                        } and ${item.end_time}`}</p>
                      )}

                      {item.type === "CreateExceptionActivity" && (
                        <p>{`${activityTypes[item.type].description} ${moment(
                          item.start_date
                        ).format("MM-DD-YYYY")} to ${moment(
                          item.end_date
                        ).format("MM-DD-YYYY")}`}</p>
                      )}

                      {item.type === "ApproveExceptionActivity" && (
                        <p>{activityTypes[item.type][item.status]}</p>
                      )}

                      {item.type === "PatchStatusChangeActivity" &&
                        (item.patch_status_to ? (
                          <>
                            <p style={{ marginBottom: "0" }}>{`${
                              activityTypes[item.type].description_from
                            } ${returnStatus(
                              item.patch_status_from
                            )} to ${returnStatus(item.patch_status_to)}`}</p>
                            <p>{`Check logs on the server  "${item.patch_logs}" for more details`}</p>
                          </>
                        ) : (
                          <>
                            <p style={{ marginBottom: "0" }}>{`${
                              activityTypes[item.type].description_to
                            } ${returnStatus(item.patch_status_from)} `}</p>
                            <p>{`Check logs on the server  "${item.patch_logs}" for more details`}</p>
                          </>
                        ))}
                    </Col>
                    <Col sm={4} className="log-time" key={item.start_time}>
                      <p className="log-item">
                        {moment(item.date).format("MM-DD-YYYY hh:mm A")}
                      </p>
                    </Col>
                  </Row>
                ))}
              </div>
            </>
          ) : null}
        </Row>
      </section>
    </Container>
  );
};

export default ViewAsset;
