import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Row, Col } from "react-bootstrap";
import {
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  TextareaAutosize,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ActionMenu from "@components/ActionMenu";
import DialogBox from "@components/DialogBox";
import {
  assignToMe,
  getPatches,
  updatePatch,
} from "@store/patchesOperation.duck";
import { constants } from "@constants";

const Actions = ({
  menuItems,
  row: { schedule_id, asset_instance_id, operator_name },
}) => {
  const [formReset, setFormReset] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const dispatch = useDispatch();
  const selectedRowStatus = operator_name ? ["Assign to Me"] : null;

  const schema = yup
    .object({
      patching_status: yup.string(),
      precheck_status: yup.string(),
      postcheck_status: yup.string(),
      operator_notes: yup
        .string()
        .required("Operator Notes is a required field!"),
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
  });

  useEffect(() => {
    // reset form
    const init_data = { patching_status: "", operator_notes: "" };

    reset(init_data);
  }, [reset, formReset]);

  const handleActionsMenu = (item) => {
    setSelectedMenuItem(item);
    handleDialog();
  };

  const handleDialog = () => {
    setIsOpen(!isOpen);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    handleDialog();
  };

  const handleConfirm = (event) => {
    event.preventDefault();
    const formData = {
      schedule_id,
      asset_instance_id,
    };

    dispatch(assignToMe(formData))
      .unwrap()
      .then(() => {
        handleDialog();
        dispatch(getPatches({ status: "failed" }));
      });
  };

  const onSubmit = (data) => {
    const finalData = {
      patching_status: data.patching_status,
      postcheck_status: data.postcheck_status,
      precheck_status: data.precheck_status,
      operator_notes: data.operator_notes,
      schedule_id,
      asset_instance_id,
    };
    dispatch(updatePatch(finalData))
      .unwrap()
      .then(() => {
        setFormReset("successful");
        handleDialog();
        dispatch(getPatches({ status: "failed" }));
      });
  };

  return (
    <>
      <ActionMenu
        options={menuItems}
        handleActionsMenu={handleActionsMenu}
        selectedRowActionStatus={selectedRowStatus}
      />
      <DialogBox
        title={`${selectedMenuItem}`}
        isOpen={isOpen}
        handleClose={handleDialog}
        maxWidth="sm"
        hideButtons={true}
      >
        {selectedMenuItem === "Assign to Me" && (
          <section className="form">
            <p style={{ fontSize: "1rem" }}>{constants.TEXT_ASSIGN_TO_ME}</p>
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
                onClick={(e) => handleConfirm(e)}
              >
                {constants.TEXT_CONFIRM}
              </button>
            </div>
          </section>
        )}

        {selectedMenuItem === "Edit" && (
          <section className="form">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row className="mb-3">
                <Col sm={4}>
                  <label className="col-form-label">
                    {constants.TEXT_PATCHING_STATUS}
                  </label>
                </Col>

                <Col sm={8}>
                  <FormControl size="small" fullWidth>
                    <Controller
                      render={({ field }) => (
                        <Select
                          {...field}
                          {...register("patching_status")}
                          error={!!errors.patching_status}
                        >
                          <MenuItem value="">
                            <em>Select Value</em>
                          </MenuItem>
                          <MenuItem value="complete-manualIntervention">
                            Completed (Manually)
                          </MenuItem>
                        </Select>
                      )}
                      control={control}
                      name="patching_status"
                      defaultValue=""
                    />
                  </FormControl>
                  <FormHelperText className="mandatory">
                    {errors.patching_status && errors.patching_status?.message}
                  </FormHelperText>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4}>
                  <label className="col-form-label">
                    {constants.TEXT_PRECHECK_STATUS}
                  </label>
                </Col>

                <Col sm={8}>
                  <FormControl size="small" fullWidth>
                    <Controller
                      render={({ field }) => (
                        <Select
                          {...field}
                          {...register("precheck_status")}
                          error={!!errors.precheck_status}
                        >
                          <MenuItem value="">
                            <em>Select Value</em>
                          </MenuItem>
                          <MenuItem value="complete-manualIntervention">
                            Completed (Manually)
                          </MenuItem>
                        </Select>
                      )}
                      control={control}
                      name="precheck_status"
                      defaultValue=""
                    />
                  </FormControl>
                  <FormHelperText className="mandatory">
                    {errors.precheck_status && errors.precheck_status?.message}
                  </FormHelperText>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4}>
                  <label className="col-form-label">
                    {constants.TEXT_POSTCHECK_STATUS}
                  </label>
                </Col>

                <Col sm={8}>
                  <FormControl size="small" fullWidth>
                    <Controller
                      render={({ field }) => (
                        <Select
                          {...field}
                          {...register("postcheck_status")}
                          error={!!errors.postcheck_status}
                        >
                          <MenuItem value="">
                            <em>Select Value</em>
                          </MenuItem>
                          <MenuItem value="complete-manualIntervention">
                            Completed (Manually)
                          </MenuItem>
                        </Select>
                      )}
                      control={control}
                      name="postcheck_status"
                      defaultValue=""
                    />
                  </FormControl>
                  <FormHelperText className="mandatory">
                    {errors.postcheck_status &&
                      errors.postcheck_status?.message}
                  </FormHelperText>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4}>
                  <label className="col-form-label">
                    <span className="mandatory asterisk">*</span>
                    {constants.TEXT_OPERATOR_NOTES}
                  </label>
                </Col>

                <Col sm={8}>
                  <FormControl size="small" fullWidth>
                    <TextareaAutosize
                      placeholder={constants.TEXT_OPERATOR_NOTES}
                      className="form-control form-control-sm"
                      {...register("operator_notes")}
                      error={errors.operator_notes}
                    />
                  </FormControl>
                  <FormHelperText className="mandatory">
                    {errors.operator_notes && errors.operator_notes?.message}
                  </FormHelperText>
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
        )}
      </DialogBox>
    </>
  );
};

export default Actions;
