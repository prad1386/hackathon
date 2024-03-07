import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { constants } from "@constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AvailableTimeSlots from "@myAssetsPages/ScheduleAssets/CreateAvailableTimeslot";
import ConfirmTimeSlots from "@myAssetsPages/ScheduleAssets/ConfirmTimeslot";
import { uncheckAssetAll, timeslotSelected } from "@store/myAssets.duck";
import {
  postAssetDeployment,
  updateAssetDeployment,
} from "@store/myAssets.duck";

const ScheduleAssets = () => {
  /// extract URL search param to check whether schedule or update
  const queryParams = new URLSearchParams(window.location.search);
  const view = queryParams.get("action");

  const {
    timeslots: { allTimeslots: data },
    assets: { selectedAssets: checkedData },
  } = useSelector((state) => state.myAssets);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const [steps, setSteps] = useState([
    {
      key: "firstStep",
      stepnum: 1,
      label: "Choose an available timeslot",
      isDone: true,
      component: () => (
        <AvailableTimeSlots
          assets={checkedData}
          timeslotData={data}
          action={view}
        />
      ),
    },
    {
      key: "secondStep",
      stepnum: 2,
      label: "Confirm & Submit",
      isDone: false,
      component: () => <ConfirmTimeSlots assets={checkedData} action={view} />,
    },
  ]);

  const {
    timeslots: { selectedTimeslot },
  } = useSelector((state) => state.myAssets);
  const selectedDateontimeslot = localStorage.getItem("date");
  const [activeStep, setActiveStep] = useState(steps[0]);
  const getTimeslot = selectedTimeslot;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    if (steps[steps.length - 1].key === activeStep.key) {
    }

    const index = steps.findIndex((x) => x.key === activeStep.key);
    setSteps((prevStep) =>
      prevStep.map((x) => {
        if (x.key === activeStep.key) x.isDone = true;
        return x;
      })
    );
    setActiveStep(steps[index + 1]);
  };

  const handleSubmit = () => {
    dispatch(uncheckAssetAll());
    if (view !== "update") {
      const datacheck = checkedData.map((asset) => {
        return {
          campaign_id: asset.campaign_id,
          asset_instance_id: asset.asset_instance_id,
          start_time: getTimeslot.start_time,
          end_time: getTimeslot.end_time,
          scheduled_date: selectedDateontimeslot,
          timeslot_id: getTimeslot.timeslot_id,
          technology_type: asset.technology_type,
          discovered_location: asset.discovered_location,
          system_environment: asset.system_environment,
          product_tier3: asset.product_tier3,
        };
      });
      dispatch(postAssetDeployment(datacheck));
    } else {
      const updateDatacheck = {
        campaign_id: checkedData[0].campaign_id,
        asset_instance_id: checkedData[0].asset_instance_id,
        start_time: getTimeslot.start_time,
        end_time: getTimeslot.end_time,
        scheduled_date: selectedDateontimeslot,
        timeslot_id: getTimeslot.timeslot_id,
      };
      dispatch(updateAssetDeployment(updateDatacheck));
      dispatch(timeslotSelected({}));
    }
    navigate("/myassets");
    localStorage.clear();
  };

  const handleBack = () => {
    const index = steps.findIndex((x) => x.key === activeStep.key);
    if (index === 0) return;

    setSteps((prevStep) =>
      prevStep.map((x) => {
        if (x.key === activeStep.key) x.isDone = false;
        return x;
      })
    );
    setActiveStep(steps[index - 1]);
  };

  return (
    <Container fluid className="page-container">
      <div className="panel-heading">{constants.TEXT_SCHEDULE_ASSETS}</div>
      <div className="content-layout">
        <div>
          <div className="App">
            <div className="box">
              <div className="steps">
                <ul className="nav">
                  {steps.map((step, i) => {
                    return (
                      <li
                        key={Math.random()}
                        id={Math.random()}
                        className={`${
                          activeStep.key === step.key ? "active" : "inactive"
                        } ${step.isDone ? "done" : ""}`}
                      >
                        <div className="stepLabel">
                          <span className="activenum">{step.stepnum}</span>{" "}
                          <span className="activetext">{step.label}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div
                className="step-component"
                key={activeStep.key}
                id={activeStep.key}
              >
                {activeStep.component()}
              </div>
              <div className="btn-component d-grid gap-2 d-md-flex  justify-content-md-end button-sec mt-5">
                {steps[0].key !== activeStep.key && (
                  <input
                    type="button"
                    className="btn btn-primary px-4 btn-sm"
                    value="Back"
                    onClick={handleBack}
                    disabled={steps[0].key === activeStep.key}
                  />
                )}
                {steps[steps.length - 1].key !== activeStep.key ? (
                  <>
                    <input
                      type="button"
                      className="btn btn-primary px-4 btn-sm"
                      value="Back"
                      onClick={handleGoBack}
                    />
                    <input
                      type="button"
                      className="btn btn-primary px-4 btn-sm"
                      value="Next"
                      disabled={Object.keys(getTimeslot).length <= 0}
                      onClick={handleNext}
                    />
                  </>
                ) : (
                  <input
                    type="button"
                    className="btn btn-primary px-4 btn-sm"
                    value="Submit"
                    disabled={Object.keys(getTimeslot).length <= 0}
                    onClick={handleSubmit}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ScheduleAssets;
