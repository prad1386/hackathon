import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const PageNotFound = () => {
  return (
    <Container fluid className="page-container page-not-found">
      <div className="panel-heading">Sorry, Requested page not found!</div>
      <Link className="btn btn-primary btn-sm px-4" to="/">
        <HomeOutlinedIcon /> Take Me Home
      </Link>
    </Container>
  );
};

export default PageNotFound;
