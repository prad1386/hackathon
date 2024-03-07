import { Container } from "react-bootstrap";
import Tabs from "@components/Tabs";
import ScheduleAssetsTab from "@myAssetsPages/ScheduleAssetsTab";
import PendingDeploymentTab from "@myAssetsPages/PendingDeploymentTab";
import SuccessDeploymentTab from "@myAssetsPages/successDeploymentTab";
import { constants } from "@constants";

const tabs = [
  {
    label: constants.TEXT_SCHEDULE_ASSETS,
    Component: <ScheduleAssetsTab />,
  },
  {
    label: constants.TEXT_PENDING_DEPLOYMENTS,
    Component: <PendingDeploymentTab />,
  },
  {
    label: constants.TEXT_SUCCESSFUL_DEPLOYMENTS,
    Component: <SuccessDeploymentTab />,
  },
];

const MyAssets = () => {
  return (
    <Container fluid className="page-container">
      <div className="panel-heading">{constants.TEXT_MY_ASSETS}</div>
      <div className="content-layout">
        <Tabs tabs={tabs} />
      </div>
    </Container>
  );
};

export default MyAssets;
