import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ITEM_HEIGHT = 48;

const ActionMenu = ({
  options,
  handleActionsMenu,
  selectedRowActionStatus,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const checkdisable = (option) => {
    if (selectedRowActionStatus) {
      return Boolean(
        selectedRowActionStatus.find((status) => {
          return option === status;
        })
      );
    } else {
      return false;
    }
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        className="action-menu"
        onClick={handleClick}
        data-testid="action-menu"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            disabled={checkdisable(option)}
            selected={option === "Pyxis"}
            className={"action-menuitems"}
            onClick={() => {
              handleActionsMenu(option);
              handleClose();
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ActionMenu;
