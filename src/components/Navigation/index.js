import { Container } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import ClearAllOutlinedIcon from "@mui/icons-material/ClearAllOutlined";
import DeveloperBoardOutlinedIcon from "@mui/icons-material/DeveloperBoardOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { constants } from "@constants";
import "./index.scss";

const Navigation = () => {
  const {
    userInfo: { isSuperUser },
  } = useSelector((state) => state.users);

  const {
    PORTAL_NAME,
    NAV_CAMPAIGNS,
    NAV_MY_ASSETS,
    NAV_OPERATIONS,
    NAV_REPORTS,
    NAV_ADMIN,
    NAV_MANAGE_TIMESLOTS,
    NAV_TECH_OPERATOR,
    NAV_MANAGE_EXCEPTIONS,
    NAV_MANAGE_SCHEDULERS,
  } = constants;

  return (
    <Container fluid className="navigation p-0">
      <div className="panel-heading p-2">{PORTAL_NAME}</div>

      <NavLink to="/campaigns">
        <TimerOutlinedIcon /> <span>{NAV_CAMPAIGNS}</span>
      </NavLink>

      <NavLink to="/myassets">
        <ClearAllOutlinedIcon />
        <span>{NAV_MY_ASSETS}</span>
      </NavLink>

      <NavLink to="/operations">
        <DeveloperBoardOutlinedIcon />
        <span>{NAV_OPERATIONS}</span>
      </NavLink>

      <div className="divider"></div>

      <NavLink to="/reports">
        <ReceiptOutlinedIcon />
        <span>{NAV_REPORTS}</span>
      </NavLink>
      {isSuperUser && (
        <>
          <Link to="#">
            <SettingsOutlinedIcon />
            <span>{NAV_ADMIN}</span>
            <KeyboardArrowRightIcon fontSize="medium" />
          </Link>

          <div className="admin-sub-navlinks">
            <NavLink to="admin/managetimeslots">
              <span>{NAV_MANAGE_TIMESLOTS}</span>
            </NavLink>
            <NavLink to="admin/technologyOperators">
              <span>{NAV_TECH_OPERATOR}</span>
            </NavLink>
            <NavLink to="admin/manageexceptions">
              <span>{NAV_MANAGE_EXCEPTIONS}</span>
            </NavLink>
            <NavLink to="admin/manageschedulers">
              <span>{NAV_MANAGE_SCHEDULERS}</span>
            </NavLink>
          </div>
        </>
      )}
    </Container>
  );
};

export default Navigation;
