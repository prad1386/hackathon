import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionMenu from "@components/ActionMenu";
import DialogBox from "@components/DialogBox";
import { useNavigate } from "react-router-dom";
import { constants } from "@constants";
import { Container, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { assetActions } from "@store/campaign.duck";
import "react-datepicker/dist/react-datepicker.css";
import { TextField, FormControl, FormHelperText } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";

const Actions = ({ id, menuItems, rowData, selectedRowActionStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const {
    userInfo: { name },
  } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedRowStatus =
    selectedRowActionStatus === "new"
      ? ["Pause", "Resume"]
      : selectedRowActionStatus === "paused"
      ? ["Pause", "Modify"]
      : selectedRowActionStatus === "retired"
      ? ["Modify", "Retire", "Resume", "Pause"]
      : selectedRowActionStatus === "expired"
      ? ["Retire", "Pause", "Resume"]
      : selectedRowActionStatus === "complete"
      ? ["Modify", "Retire", "Pause", "Resume"]
      : selectedRowActionStatus === "active" && ["Resume"];

  const handleActionsMenu = (item) => {
    if (item === "Clone") {
      navigate(`campaign?action=clone&id=${id}`);
    } else if (item === "Modify" && selectedRowActionStatus === "new") {
      navigate(`campaign?action=modify&id=${id}`);
    } else {
      handleDialog();
    }
    setSelectedMenuItem(item);
  };

  const handleDialog = () => {
    setIsOpen(!isOpen);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    handleDialog();
  };

  const handleClick = (event, item) => {
    event.preventDefault();
    const actionItem =
      item === "Pause"
        ? "paused"
        : item === "Resume"
        ? "active"
        : item === "Retire" && "retired";

    const formData = {
      campaignStatuses: [
        {
          campaign_status: actionItem,
          id: id,
        },
      ],
    };
    dispatch(assetActions({ formData, id, action_type: actionItem }));
  };

  const schema = yup
    .object({
      campaign_name: yup
        .string()
        .required("Campaign name is a required field!"),
      start_date: yup
        .date("Start Date is Required")
        .nullable()
        .typeError("Start date is required")
        .required("Start Date is required"),
      end_date: yup
        .date()
        .nullable()
        .typeError("End date is required")
        .transform((v) => (v instanceof Date && !isNaN(v) ? v : null))
        .required("End Date is required")
        .test(
          "same_dates_test",
          `End date should not be same date and less than ${moment(
            rowData.end_date
          ).format("MM/DD/YYYY")} .`,
          function (value) {
            return value
              ? value.getTime() !== new Date(rowData.end_date).getTime() &&
                  value.getTime() >= new Date(rowData.end_date).getTime()
              : value.getTime();
          }
        ),
    })
    .required();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      campaign_name: rowData.campaign_name,
      start_date: new Date(rowData.start_date),
      end_date: new Date(rowData.end_date),
    },
  });

  const onSubmit = (data) => {
    if (data) {
      const formData = {
        ...data,
        created_by: `${name}`,
        upload_id: rowData.upload_id,
      };
      // Create put
      dispatch(assetActions({ formData, id: id, action_type: "modify" }));
    }
  };

  return (
    <>
      <ActionMenu
        options={menuItems}
        id={id}
        handleActionsMenu={handleActionsMenu}
        selectedRowActionStatus={selectedRowStatus}
      />
      <DialogBox
        title={`${selectedMenuItem} Campaign`}
        isOpen={isOpen}
        handleClose={handleDialog}
        maxWidth="sm"
        hideButtons={true}
      >
        {selectedMenuItem === "Pause" ||
        selectedMenuItem === "Resume" ||
        selectedMenuItem === "Retire" ? (
          <section className="form">
            <p>
              Do you really want to{" "}
              <strong>{selectedMenuItem.toLocaleLowerCase()}</strong> this
              campaign ? <br /> <br /> Please confirm.{" "}
            </p>
            <br />
            <div className="d-grid gap-2 d-md-flex  justify-content-md-end button-sec">
              <button
                className="btn btn-primary px-4 btn-sm"
                onClick={(e) => handleCancel(e)}
              >
                {constants.TEXT_BUTTON_CANCEL}
              </button>
              <button
                className="btn btn-primary px-4 btn-sm"
                onClick={(e) => handleClick(e, selectedMenuItem)}
              >
                {selectedMenuItem}
              </button>
            </div>
          </section>
        ) : (
          selectedRowActionStatus === "active" &&
          selectedMenuItem === "Modify" && (
            <Container fluid className="page-container form">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Row className="mb-2">
                  <Col sm={3} className="mb-2">
                    <label className="col-form-label">
                      <span className="mandatory asterisk">*</span>
                      {constants.TEXT_CAMPAIGN_NAME}
                    </label>
                  </Col>
                  <Col sm={9} className="mb-2">
                    <FormControl fullWidth>
                      <TextField
                        hiddenLabel
                        variant="outlined"
                        placeholder="Campaign Name"
                        size="small"
                        className="form-textfield"
                        name="campaign_name"
                        disabled={true}
                        {...register("campaign_name")}
                        error={!!errors.campaign_name}
                        helperText={errors.campaign_name?.message}
                      />
                    </FormControl>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col sm={3} className="mb-2">
                    <label className="col-form-label">
                      <span className="mandatory asterisk">*</span>
                      {constants.TEXT_START_DATE}
                    </label>
                  </Col>
                  <Col sm={9} className="mb-2">
                    <Controller
                      name="start_date"
                      control={control}
                      defaultValue={new Date()}
                      render={({ field: { onChange, value } }) => {
                        localStorage.setItem("campaignStartDate", value);
                        //setStartDate(value);
                        return (
                          <DatePicker
                            className="form-control form-control-sm"
                            onChange={onChange}
                            minDate={new Date()}
                            selected={value}
                            placeholderText="Select Start Date"
                            disabled="disabled"
                            error={!!errors.start_date}
                            helperText={errors.start_date?.message}
                          />
                        );
                      }}
                    ></Controller>
                    <FormHelperText className="mandatory">
                      {errors.start_date && errors.start_date?.message}
                    </FormHelperText>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col sm={3} className="mb-2">
                    <label className="col-form-label">
                      <span className="mandatory asterisk">*</span>
                      {constants.TEXT_END_DATE}
                    </label>
                  </Col>
                  <Col sm={9} className="mb-2">
                    <Controller
                      name="end_date"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            onChange={onChange}
                            min={new Date()}
                            selected={value} //createDateAsUTC
                            defaultValue={moment(rowData.end_date).format(
                              "YYYY-MM-DD"
                            )}
                          />
                        );
                      }}
                    />
                  </Col>
                  <FormHelperText className="mandatory">
                    {errors.end_date && errors.end_date?.message}
                  </FormHelperText>
                </Row>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end button-sec mt-2 mb-1">
                  <button
                    className="btn btn-primary px-4 btn-sm"
                    onClick={(e) => handleCancel(e)}
                  >
                    {constants.TEXT_BUTTON_CANCEL}
                  </button>
                  <button className="btn btn-primary px-4 btn-sm" type="Submit">
                    Submit
                  </button>
                </div>
              </form>
            </Container>
          )
        )}
      </DialogBox>
    </>
  );
};

export default Actions;
