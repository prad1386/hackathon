import { useState } from "react";
import ActionMenu from "@components/ActionMenu";
import CreateException from "@adminPages/ManageExceptions/CreateException";
import DialogBox from "@components/DialogBox";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  calendarSelectedDate,
  timeslotSelected,
  checkAsset,
  cancelScheduledAsset,
  getpendingDeployment,
} from "@store/myAssets.duck";
const Actions = ({ menuItems, record }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const status = record.cr_status ? record.cr_status.toLowerCase() : "";
  const flag = status === "planning in progress" || status === "scheduled";

  const selectedRowStatus = !flag && ["Modify Schedule", "Cancel Schedule"];

  const handleActionsMenu = (item) => {
    setSelectedMenuItem(item);
    handleDialog();
    if (item === "Modify Schedule") {
      dispatch(calendarSelectedDate(record.scheduled_date));
      dispatch(timeslotSelected(record));
      dispatch(checkAsset({ checkedAsset: [record], selectAll: false }));
      navigate(`scheduleassets?action=update`);
    }
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
    dispatch(cancelScheduledAsset(record.schedule_id))
      .unwrap()
      .then(() => {
        dispatch(getpendingDeployment({}));
      });
  };

  return (
    <>
      <ActionMenu
        options={menuItems}
        id={record.id}
        handleActionsMenu={handleActionsMenu}
        selectedRowActionStatus={selectedRowStatus}
      />
      <DialogBox
        title={selectedMenuItem}
        isOpen={isOpen}
        handleClose={handleDialog}
        maxWidth="sm"
        hideButtons={true}
      >
        {selectedMenuItem === "Request Exception" ? (
          <CreateException handleDialog={handleDialog} singleAsset={record} />
        ) : (
          selectedMenuItem === "Cancel Schedule" && (
            <section className="form">
              <p>
                Do you really want to Cancel the Schedule ? <br /> <br /> Please
                confirm.{" "}
              </p>
              <br />
              <div className="d-grid gap-2 d-md-flex  justify-content-md-end button-sec">
                <button
                  className="btn btn-primary px-3 btn-sm"
                  onClick={(e) => handleCancel(e)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary px-3 btn-sm"
                  onClick={(e) => handleClick(e, selectedMenuItem)}
                >
                  {selectedMenuItem}
                </button>
              </div>
            </section>
          )
        )}
      </DialogBox>
    </>
  );
};

export default Actions;
