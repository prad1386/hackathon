import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Navigation from "./components/Navigation";
import Header from "./components/Header";

import CampaignPage from "./pages/Campaigns/ListCampaigns";
import Dashboard from "./pages/Dashboard";
import PageNotFound from "./pages/PageNotFound";

import "./assets/scss/index.scss";

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Container fluid className="main-container">
        <Row>
          <Col md={2} className="left-nav sidebar">
            <Navigation />
          </Col>
          <Col md={10} className="p-0 right-container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="campaigns">
                <Route index element={<CampaignPage />} />
                <Route path="*" element={<PageNotFound />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </BrowserRouter>
  );
};

export default Router;
