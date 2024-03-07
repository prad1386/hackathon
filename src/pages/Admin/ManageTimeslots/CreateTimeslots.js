import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Row, Col } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createTimeslot,
  getTimeslots,
} from "@store/admin/manageTimeslots.duck";
import * as yup from "yup";

import { constants } from "@constants";

const CreateTimeslots = ({ handleDialog,allTimeslots }) => {
  const timeEntries = [
    "12:00 AM",
    "04:00 AM",
    "08:00 AM",
    "12:00 PM",
    "04:00 PM",
    "08:00 PM",
  ];
  const [formReset, setFormReset] = useState("");
  const [endTimeEntries, setEndTimeEntries] = useState([]);
  const { init_data } = useSelector((state) => state.manageTimeslots);
  const dispatch = useDispatch();

  const schema = yup
    .object({
      timeslot_name: yup
        .string()
        .required("Timeslot name is a required field!")
        .test(
          "same_dates_test",
          "Timeslot name already exists!",
          function (value) {
           return allTimeslots.every(timelotS => timelotS.timeslot_name !== value)
          }
        ),
      day_of_week: yup.string().required("Day of week is a required field!"),
      max_assets: yup
        .number()
        .moreThan(0)
        .required("Max assets is a required field!"),
      start_time: yup.string().required("Start time is a required field!"),
      end_time: yup.string().required("End time is a required field!"),
      status: yup.string().required("Status is a required field!"),
    })
    .required();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      timeslot_name: init_data.timeslot_name,
      day_of_week: init_data.day_of_week,
      status: init_data.status,
      start_time: init_data.start_time,
      end_time: init_data.end_time,
      max_assets: init_data.max_assets,
    },
  });

  const onSubmit = (data) => {
    dispatch(createTimeslot(data))
      .unwrap()
      .then(() => {
        setFormReset("successful");
        handleDialog();
        dispatch(getTimeslots({}));
      });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    handleDialog();
  };

  useEffect(() => {
    // reset form
    reset(init_data);
  }, [formReset, init_data, reset]);

  const onBlurStartTime = (e) => {
    const index = timeEntries.indexOf(e.target.value);
    index + 1 < timeEntries.length
      ? setEndTimeEntries([timeEntries[index + 1]])
      : setEndTimeEntries([timeEntries[0]]);
  };

  return (
    <section>
      <div className="alert alert-secondary" role="alert">
        <span className="mandatory asterisk">*</span>
        <strong>{constants.TEXT_REQUIRED_FIELDS}</strong>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <Row className="mb-2">
          <Col sm={4} className="mb-2">
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_TIMESLOT_NAME}
            </label>
          </Col>

          <Col sm={8} className="mb-2">
            <FormControl fullWidth>
              <TextField
                hiddenLabel
                variant="outlined"
                name="timeslot_name"
                placeholder="Enter Timeslot Name"
                size="small"
                className="form-textfield"
                {...register("timeslot_name")}
                error={!!errors.timeslot_name}
                helperText={errors.timeslot_name?.message}
              />
            </FormControl>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="mb-2">
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_DAY_OF_WEEK}
            </label>
          </Col>
          <Col sm={8} className="mb-2">
            <FormControl size="small" fullWidth>
              <Controller
                render={({ field }) => (
                  <Select
                    {...field}
                    {...register("day_of_week")}
                    error={!!errors.day_of_week}
                  >
                    <MenuItem value="">
                      <em>Select Value</em>
                    </MenuItem>
                    <MenuItem value="Monday">Monday</MenuItem>
                    <MenuItem value="Tuesday">Tuesday</MenuItem>
                    <MenuItem value="Wednesday">Wednesday</MenuItem>
                    <MenuItem value="Thursday">Thursday</MenuItem>
                    <MenuItem value="Friday">Friday</MenuItem>
                    <MenuItem value="Saturday">Saturday</MenuItem>
                    <MenuItem value="Sunday">Sunday</MenuItem>
                  </Select>
                )}
                control={control}
                name="day_of_week"
                defaultValue=""
              />
              <FormHelperText className="mandatory">
                {errors.day_of_week && errors.day_of_week?.message}
              </FormHelperText>
            </FormControl>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="mb-2">
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_START_TIME}
            </label>
          </Col>
          <Col sm={8} className="mb-2">
            <FormControl size="small" fullWidth>
              <Controller
                render={({ field }) => (
                  <Select
                    {...field}
                    {...register("start_time")}
                    error={!!errors.start_time}
                    onChange={(e) => {
                      field.onChange(e);
                      onBlurStartTime(e);
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Value</em>
                    </MenuItem>
                    {timeEntries.map((item) => (
                      <MenuItem value={item} key={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                control={control}
                name="start_time"
                defaultValue=""
              />
              <FormHelperText className="mandatory">
                {errors.start_time && errors.start_time?.message}
              </FormHelperText>
            </FormControl>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="mb-2">
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_END_TIME}
            </label>
          </Col>
          <Col sm={8} className="mb-2">
            <FormControl size="small" fullWidth>
              <Controller
                render={({ field }) => (
                  <Select
                    {...field}
                    {...register("end_time")}
                    error={!!errors.end_time}
                  >
                    {endTimeEntries.map((item) => (
                      <MenuItem value={item} key={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                control={control}
                name="end_time"
                defaultValue=""
              />
              <FormHelperText className="mandatory">
                {errors.end_time && errors.end_time?.message}
              </FormHelperText>
            </FormControl>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4} className="mb-2">
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_MAX_ASSETS}
            </label>
          </Col>

          <Col sm={4} className="mb-2">
            <FormControl fullWidth>
              <TextField
                hiddenLabel
                variant="outlined"
                placeholder="assets count"
                size="small"
                className="form-textfield"
                {...register("max_assets")}
                error={!!errors.max_assets}
                helperText={errors.max_assets?.message}
              />
            </FormControl>
          </Col>
          <Col sm={4} className="mb-2">
            <label className="col-form-label">
              {constants.TEXT_ENTER_MAX_ASSETS}
            </label>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4}>
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_STATUS}
            </label>
          </Col>
          <Col sm={8} className="mb-2">
            <FormControl size="small" fullWidth>
              <Controller
                render={({ field }) => (
                  <Select
                    {...field}
                    {...register("status")}
                    error={!!errors.status}
                  >
                    <MenuItem value="">
                      <em>Select Value</em>
                    </MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                  </Select>
                )}
                control={control}
                name="status"
                defaultValue=""
              />
              <FormHelperText className="mandatory">
                {errors.status && errors.status?.message}
              </FormHelperText>
            </FormControl>
          </Col>
        </Row>
        <div className="d-grid gap-2 d-md-flex  justify-content-md-end button-sec">
          <button
            className="btn btn-primary px-4 btn-sm"
            onClick={(e) => handleCancel(e)}
          >
            {constants.TEXT_BUTTON_CANCEL}
          </button>
          <button className="btn btn-primary px-4 btn-sm" type="submit">
            {constants.TEXT_BUTTON_SUBMIT}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateTimeslots;
