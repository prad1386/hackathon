import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import Calendar from "react-calendar";
import Timeslots from "./Timeslot";
import "react-calendar/dist/Calendar.css";
import "./index.scss";
import DialogBox from "@components/DialogBox";
import {
  getTimeslotSchedule,
  calendarSelectedDate,
  timeslotSelected,
} from "@store/myAssets.duck";

const AvailableTimeSlots = ({ assets, action }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // on page load get selected date from store else todays date
  const {
    assets: { schedulingSelectedDate },
  } = useSelector((state) => state.myAssets);
  const {
    timeslots: { selectedTimeslot },
  } = useSelector((state) => state.myAssets);

  const checkDate =
    schedulingSelectedDate === "" ? moment() : schedulingSelectedDate;
  const getSelectedTimeslot = selectedTimeslot;

  // set calendar date
  const [selectedDate, setSelectedDate] = useState(new Date(checkDate));

  // set calendar date
  // const [minimunDate, setMinimunDate] = useState(new Date());

  // get the selected timeslot id
  const [activeStep, setActiveStep] = useState(null);

  // Dialog box to be opened on btn selection
  const [isOpen, setisOpen] = useState(false);

  // convert the selected date with moment readable to get the start date and end date
  const nowSelectedDate = moment(selectedDate);

  // convert the selectedDate to display in the timeslot header (Format: August 2022)
  const dateSelectedForHeader = moment(selectedDate).format("MMMM YYYY");

  // Get weekend days
  const saturday = nowSelectedDate.clone().weekday(6);
  const sunday = nowSelectedDate.clone().weekday(0);
  const startDate = moment(sunday).format("MM-DD-YYYY");
  const endDate = moment(saturday).format("MM-DD-YYYY");

  // get the alltimeslots from store
  const {
    timeslots: { allTimeslots: data },
  } = useSelector((state) => state.myAssets);

  // since the timeslot is a non editable format in react - convert it to editable mode to check/ add isProd key
  const timeslotsCloned = structuredClone(data);

  // Send the start date / end date
  useEffect(() => {
    (assets === undefined || assets.length <= 0) && navigate("/myassets");
    dispatch(getTimeslotSchedule({ startDate, endDate, assets }));
  }, [dispatch, startDate, endDate, assets, navigate]);

  // update the timeslot record whenever back to page (update functionality)
  useEffect(() => {
    if (
      action !== "update" ||
      getSelectedTimeslot.hasOwnProperty("timeslot_id")
    ) {
      getSelectedTimeslot === null
        ? setActiveStep(null)
        : setActiveStep(getSelectedTimeslot.timeslot_id);
    } else {
      timeslotsCloned.forEach((d) => {
        if (d.date === moment(getSelectedTimeslot.scheduled_date).format("l")) {
          return d.timeslots.forEach((time) => {
            if (time.start_time === getSelectedTimeslot.start_time) {
              dispatch(timeslotSelected(time));
              localStorage.setItem("date", d.date);
              setActiveStep(time.timeslot_id);
            }
          });
        }
      });
    }
  }, [
    dispatch,
    getSelectedTimeslot,
    data,
    selectedDate,
    timeslotsCloned,
    action,
  ]);

  // On Change of calendar - get the selected date and dispatch
  const onChange = (event) => {
    dispatch(calendarSelectedDate(event.toString()));
    setSelectedDate(event);
    dispatch(
      getTimeslotSchedule({
        startDate: moment(event).clone().weekday(0).format("M-DD-YYYY"),
        endDate: moment(event).clone().weekday(6).format("M-DD-YYYY"),
      })
    );
  };

  if (assets.length > 0) {
    // check the assets environement is Prod  - return true/false
    var checkProd = assets.some(
      (asset) => asset.system_environment === "Production"
    );

    // check if any one item in the assets array has Prod value
    if (checkProd) {
      // Get weekend(s) from API and add it to prod status
      timeslotsCloned.map((d) =>
        d.day_of_week === "Sunday" || d.day_of_week === "Saturday"
          ? d.timeslots.map((h) => (h.isProd = false))
          : d.timeslots.map((h) => (h.isProd = true))
      );
    } else {
      // if not prod then append as false
      timeslotsCloned.map((d) => d.timeslots.map((h) => (h.isProd = false)));
    }
  }

  // set active class on click of timeslot box
  const toggleClass = (id, timeObj, date) => {
    localStorage.setItem("date", date);
    // setSelectedTimeslotDate(date);
    setActiveStep(id);
    dispatch(timeslotSelected(timeObj));
    dispatch(calendarSelectedDate(selectedDate.toString()));
  };

  const handleDialog = () => {
    setisOpen(!isOpen);
  };

  const Dialogcomponent = (
    <DialogBox
      title={"Production assets not allowed to schedule on weekdays"}
      isOpen={isOpen}
      handleClose={handleDialog}
      hide={true}
    >
      <div className="p-3">
        One or more selected asset(s) is a production version and not allowed
        for scheduling in weekdays.
        <br />
        <br />
        Please remove the production asset(s) from the selection{" "}
        <Link to={"/myassets"}>checklist</Link> to schedule in weekdays. or
        continue forward to schedule in weekends(Saturday / Sunday) timeslot.{" "}
        <br />
        <br />
        For further information contact system administrator.
      </div>
    </DialogBox>
  );

  //Restirct schedule for next 5 days from current day
  let minimunDate;
  const todayPlusFiveDays = new Date();
  const campaign_start = new Date(
    assets.length ? assets[0].start_date : todayPlusFiveDays
  );
  todayPlusFiveDays.setDate(todayPlusFiveDays.getDate() + 6);

  if (campaign_start > todayPlusFiveDays) {
    minimunDate = campaign_start;
  } else {
    minimunDate = todayPlusFiveDays;
  }

  return (
    <Container>
      {assets.length && assets[0].start_date && assets[0].end_date ? (
        <Row>
          {checkProd && (
            <div className="warning">
              Out of {assets.length} assets selected{" "}
              {
                assets.filter(
                  ({ system_environment }) =>
                    system_environment === "Production"
                ).length
              }{" "}
              is production asset(s). Scheduling for production asset(s) allowed
              only in weekends.
            </div>
          )}

          <Col sm={4}>
            <span className="scheduler-subheading">
              Select a date for this deployment
            </span>
            <Calendar
              onChange={onChange}
              value={selectedDate}
              minDate={minimunDate}
              maxDate={new Date(assets[0].end_date)}
              calendarType="US"
            />
          </Col>
          <Col sm={8}>
            <span className="scheduler-subheading">
              Select one of the available timeslot
            </span>
            <h5 className="mb-3">{dateSelectedForHeader}</h5>
            {Dialogcomponent}
            <div className="pl-table">
              <div className="pl-thead tall">
                <div className="row">
                  {timeslotsCloned.map((date, i) => {
                    return (
                      // get the dates from array and convert it to readable and append it in the header
                      <div
                        key={Math.random()}
                        id={Math.random()}
                        className="col"
                      >
                        <div>{new Date(date.date).toDateString()}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pl-tbody scroll">
                <div className="row d-flex align-items-start">
                  {timeslotsCloned.map((data) => {
                    return (
                      <div
                        className="col"
                        key={Math.random()}
                        id={Math.random()}
                      >
                        {data.timeslots.map((time) => {
                          //data.is_back_date ||
                          return data.is_back_date ||
                            data.is_forward_date ||
                            data.is_within_five_days ? (
                            // if back date & Forward date is true then disable thos timeslots
                            <Timeslots
                              time={time}
                              classstr="strip-disabled"
                              key={Math.random()}
                              id={Math.random()}
                            />
                          ) : time.is_timeslot_full === false ? (
                            time.isProd ? (
                              // check the pobj has isProd to append the dialog
                              <Timeslots
                                time={time}
                                classstr="strip dialoghandle"
                                onClick={handleDialog}
                                key={Math.random()}
                                id={Math.random()}
                              />
                            ) : (
                              // check the obj has isProd as false - enable selection and toggle
                              <Timeslots
                                time={time}
                                classstr={`strip ${
                                  time.timeslot_id === activeStep &&
                                  `activehigh`
                                }`}
                                onClick={() =>
                                  toggleClass(time.timeslot_id, time, data.date)
                                }
                                key={Math.random()}
                                id={Math.random()}
                              />
                            )
                          ) : (
                            // if timeslot is full then disable the timelots box
                            <Timeslots
                              time={time}
                              classstr="strip-disabled"
                              key={Math.random()}
                              id={Math.random()}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      ) : (
        <div>
          {" "}
          Campaign start/End date is missing. Please contact administator!{" "}
        </div>
      )}
    </Container>
  );
};

export default AvailableTimeSlots;
