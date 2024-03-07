import { useState } from "react";
import { useDispatch } from "react-redux";
import ActionMenu from "@components/ActionMenu";
import {
  getOperatorGroup,
  updateOperatorGroup,
} from "@store/admin/operatorGroup.duck";
import DialogBox from "@components/DialogBox";
import { constants } from "@constants";

const Actions = ({ record, menuItems, handleModify }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const dispatch = useDispatch();

  const selectedRowStatus = record.status === "Retired" && ["Modify", "Retire"];

  const handleActionsMenu = (action) => {
    setSelectedMenuItem(action);
    if (action === "Modify") {
      handleModify(record);
    } else {
      handleDialog();
    }
  };

  const handleDialog = () => {
    setIsOpen(!isOpen);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    handleDialog();
  };

  const handleRetire = (event) => {
    event.preventDefault();
    const formData = {
      id: record.id,
      data: { status: "Retired" },
    };

    dispatch(updateOperatorGroup(formData))
      .unwrap()
      .then(() => {
        handleDialog();
        dispatch(getOperatorGroup({}));
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
        title={`${selectedMenuItem} Operator Group`}
        isOpen={isOpen}
        handleClose={handleDialog}
        maxWidth="sm"
        hideButtons={true}
      >
        {selectedMenuItem === "Retire" && (
          <section className="form">
            <p style={{ fontSize: "1rem" }}>{constants.TEXT_RETIRE_MSG}</p>
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
                onClick={(e) => handleRetire(e)}
              >
                {constants.TEXT_CONFIRM}
              </button>
            </div>
          </section>
        )}
      </DialogBox>
    </>
  );
};

export default Actions;
