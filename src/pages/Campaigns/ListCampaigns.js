import { Link, Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Table from "../../components/Table";
import { format } from "date-fns";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import TourIcon from "@mui/icons-material/Tour";
import MOCK_DATA from "./MOCK_DATA.json";
import "./index.scss";

const COLUMNS = [
  {
    Header: "CAMPAIGN NAME",
    accessor: "campaignName",
    Cell: ({ row }) => (
      <Link className="link" to={`${row.values.campaignName}`}>
        {row.values.campaignName}
      </Link>
    ),
  },
  {
    Header: "DESCRIPTION",
    accessor: "campaignDescription",
  },
  {
    Header: "STATUS",
    accessor: "campaignStatus",
    Cell: ({ row }) => (
      <>
        {row.values.campaignStatus === "Active"
          ? [
              <FiberManualRecordIcon
                fontSize="small"
                style={{ color: "green" }}
                key={Math.random()} //change this to id in real data
              />,
              " Active",
            ]
          : [
              <FiberManualRecordIcon
                fontSize="small"
                style={{ color: "red" }}
                key={Math.random()} //change this to id in real data
              />,
              " Paused",
            ]}
      </>
    ),
  },
  {
    Header: "MANUAL CAMPAIGN",
    accessor: "manual",
    Cell: ({ row }) => (
      <>
        {row.values.manual === true && (
          <TourIcon fontSize="small" style={{ color: "red" }} />
        )}
      </>
    ),
  },
  {
    Header: "TECHNOLOGY TYPE",
    accessor: "technologyType",
  },
  {
    Header: "CAMPAIGN START",
    accessor: "startDate",
    Cell: ({ value }) => {
      return format(new Date(value), "dd/MM/yyyy");
    },
  },
  {
    Header: "CAMPAIGN END",
    accessor: "endDate",
    Cell: ({ value }) => {
      return format(new Date(value), "dd/MM/yyyy");
    },
  },
  {
    Header: "ASSETS",
    accessor: "assetUrl",
    Cell: ({ row }) => (
      <Link to={`${row.values.assetUrl}`}>
        <img
          alt="excel-logo"
          src={require("../../assets/images/excel.png")}
          width={25}
        />
      </Link>
    ),
  },
];

const ListCampaigns = () => {
  return (
    <Container fluid className="page-container">
      <div className="panel-heading">Campaign</div>
      <div className="content-layout">
        <div className="sub-heading">My Campaigns</div>
        <div className="campaign-filter-section">
          <Row>
            <Col sm={6}>
              <div className="campaign-filters">Filters | </div>
            </Col>
            <Col sm={6} className="create-campaign-btn">
              <Link
                className="btn btn-primary btn-sm px-4"
                to="createcampaigns"
              >
                New Campaign
              </Link>
            </Col>
          </Row>
        </div>

        <Table COLUMNS={COLUMNS} MOCK_DATA={MOCK_DATA} />
      </div>
      <Outlet />
    </Container>
  );
};

export default ListCampaigns;
