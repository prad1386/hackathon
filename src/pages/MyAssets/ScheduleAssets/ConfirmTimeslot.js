import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import "react-calendar/dist/Calendar.css";
import "./index.scss";

const ConfirmTimeSlots = ({ assets }) => {
  const {
    timeslots: { selectedTimeslot },
  } = useSelector((state) => state.myAssets);

  const getScheduledDate = localStorage.getItem("date");

  const setMomentDate = getScheduledDate;
  const scheduleTimeslotParse = selectedTimeslot;

  return (
    <Row>
      <Col sm={4}>
        <Card>
          <Card.Header>List of Assets in this Schedule</Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {assets.map((asset) => {
                return (
                  <ListGroup.Item key={asset.id}>
                    {asset.asset_name}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={8}>
        <Card>
          <Card.Header>Scheduled Date &amp; Timeslot</Card.Header>
          <Card.Body>
            <div className="d-flex mb-5">
              <div className="p-2 flex-fill">
                <span className="fw-bold">Scheduled Date</span>
                <br />
                <span className="ff-6 fw-bold">{setMomentDate}</span>
              </div>
              <div className="p-2 flex-fill">
                <span className="fw-bold">Scheduled Time</span>
                <br />
                <span className="ff-6 fw-bold">
                  {scheduleTimeslotParse.start_time} -{" "}
                  {scheduleTimeslotParse.end_time}
                </span>
              </div>
            </div>
            <section className="text-center">
              <div className="text-danger">
                Your are about to deploy changes to {assets.length} assets on
                the following schedule.
              </div>
              <div className="text-danger">
                Beware this will cause a system outage.
              </div>
            </section>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ConfirmTimeSlots;
