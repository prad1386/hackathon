import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const HelperTooltip = ({ text, info }) => {
  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 300,
      fontSize: 15,
    },
  });

  return (
    <CustomWidthTooltip title={text} placement="right-end">
      {info ? <InfoOutlinedIcon /> : <HelpOutlineIcon />}
    </CustomWidthTooltip>
  );
};

export default HelperTooltip;
