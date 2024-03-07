import { useState } from "react";
import { useDispatch } from "react-redux";
import { FormControl, FormHelperText, TextareaAutosize } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ActionMenu from "@components/ActionMenu";
import DialogBox from "@components/DialogBox";
import {
  getExceptions,
  updateException,
} from "@store/admin/manageExceptions.duck";
import { constants } from "@constants";

const Actions = ({ record: { id, status }, menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const dispatch = useDispatch();

  const selectedRowStatus =
    status === "approved"
      ? ["Approve", "Deny"]
      : status === "denied" && ["Approve", "Deny"];

  const handleActionsMenu = (action) => {
    setSelectedMenuItem(action);
    handleDialog();
  };

  const handleDialog = () => {
    setIsOpen(!isOpen);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    handleDialog();
  };

  const schema = yup
    .object({
      note: yup.string().required("Note is a required field!"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      note: "",
    },
  });

  const onSubmit = (data) => {
    const formData = {
      id,
      status: selectedMenuItem,
      data,
    };

    dispatch(updateException(formData))
      .unwrap()
      .then(() => {
        handleDialog();
        dispatch(getExceptions({}));
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
        title={`${selectedMenuItem} Exception`}
        isOpen={isOpen}
        handleClose={handleDialog}
        maxWidth="sm"
        hideButtons={true}
      >
        <section>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <FormControl size="small" fullWidth>
              <TextareaAutosize
                placeholder={`Enter your ${selectedMenuItem} note here...`}
                className="form-control form-control-sm"
                {...register("note")}
                error={errors.note}
              />
            </FormControl>
            <FormHelperText className="mandatory">
              {errors.note && errors.note?.message}
            </FormHelperText>
            <br />
            <div className="d-grid gap-2 d-md-flex  justify-content-md-end button-sec">
              <button
                className="btn btn-primary px-4 btn-sm"
                onClick={(e) => handleCancel(e)}
              >
                {constants.TEXT_BUTTON_CANCEL}
              </button>
              {selectedMenuItem === "Approve" ? (
                <button className="btn btn-primary px-4 btn-sm" type="submit">
                  {constants.TEXT_APPROVE}
                </button>
              ) : (
                <button className="btn btn-primary px-4 btn-sm" type="submit">
                  {constants.TEXT_DENY}
                </button>
              )}
            </div>
          </form>
        </section>
      </DialogBox>
    </>
  );
};

export default Actions;
