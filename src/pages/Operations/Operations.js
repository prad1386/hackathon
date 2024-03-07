import { Container } from "react-bootstrap";
import Tabs from "@components/Tabs";
import UpcomingPatches from "./UpcomingPatches";
import AssetsNeedAttention from "./AssetsNeedAttention";
import { constants } from "@constants";

let tabs = [
  {
    label: constants.TEXT_TAB_LABEL_NEED_ATTENTION,
    Component: <AssetsNeedAttention />,
  },
  {
    label: constants.TEXT_TAB_LABEL_UPCOMING_PATCHES,
    Component: <UpcomingPatches />,
  },
];

const Operations = () => {
  return (
    <Container fluid className="page-container">
      <div className="panel-heading">{constants.TEXT_OPERATIONS}</div>
      <div className="content-layout">
        <Tabs tabs={tabs} />
      </div>
    </Container>
  );
};

export default Operations;
