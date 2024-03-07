import { useEffect } from "react";
import Auth from "../Auth";
import { Navbar, Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { showToast } from "@utils/tools";
import { useSelector, useDispatch } from "react-redux";
import { clearNotifications } from "@store/notifications.duck";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const notifications = useSelector((state) => state.notifications);
  const {
    userInfo: { name },
  } = useSelector((state) => state.users);
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
  }, [notifications, dispatch]);

  return (
    <>
      <Auth />
      <Navbar collapseOnSelect variant="light" className="header-bg-color">
        <Container fluid>
          <Navbar.Brand href="/">
            <img
              alt="brand-logo"
              src={require("@assets/images/logo.png")}
              width={140}
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Collapse id="navbarScroll" className="justify-content-end">
            <Navbar.Text>Welcome {name}</Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <ToastContainer />
    </>
  );
};

export default Header;
