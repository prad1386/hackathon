import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import ClearAllOutlinedIcon from "@mui/icons-material/ClearAllOutlined";
import DeveloperBoardOutlinedIcon from "@mui/icons-material/DeveloperBoardOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import "./index.scss";

const Navigation = () => {
  return (
    <Container fluid className="navigation p-0">
      <div className="panel-heading p-2">Accelerate BT Operations</div>

      <NavLink to="/">
        <HomeOutlinedIcon /> <span>Home</span>
      </NavLink>

      <NavLink to="/campaigns">
        <TimerOutlinedIcon /> <span>Campaigns</span>
      </NavLink>

     
    </Container>
  );
};

export default Navigation;
