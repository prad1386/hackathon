import { useEffect } from "react";
import { Navbar, Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { showToast } from "../../utils/tools";
import { useSelector, useDispatch } from "react-redux";
import { clearNotifications } from "../../store/reducers/notifications";
import {
  useMsal,
  useIsAuthenticated,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";

const Header = () => {
  const { accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const userName = accounts[0] && accounts[0].name;

  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  useEffect(() => {
    let { global } = notifications;

    if (notifications && global.error) {
      const msg = global.error ? global.msg : "Error";

      showToast("ERROR", msg);
      dispatch(clearNotifications());
    }

    if (notifications && global.success) {
      const msg = global.success ? global.msg : "Success";

      showToast("SUCCESS", msg);
      dispatch(clearNotifications());
    }
  }, [notifications]);

  return (
    <>
      <Navbar collapseOnSelect variant="light" className="header-color">
        <Container fluid>
          <Navbar.Brand href="/">
            <img
              alt="brand-logo"
              src={require("../../assets/images/logo.png")}
              width={30}
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Text>Service Management  &nbsp; &gt; &nbsp; OpsAccelerator</Navbar.Text>
          <Navbar.Collapse id="navbarScroll" className="justify-content-end">
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <ToastContainer />
    </>
  );
};

export default Header;
