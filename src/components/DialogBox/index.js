import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import "./index.scss";

const DialogBox = ({
  title,
  maxWidth,
  children,
  isOpen,
  handleClose,
  hide = false,
  hideButtons = false,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={maxWidth}
      className="dialog-box"
      data-testid="dialog-box"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions hidden={hideButtons}>
        <button type="button" onClick={handleClose} className="btn btn-primary">
          Cancel
        </button>
        <button onClick={handleClose} className="btn btn-primary" hidden={hide}>
          Submit
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
