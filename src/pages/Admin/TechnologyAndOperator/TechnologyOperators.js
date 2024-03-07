import { Container } from "react-bootstrap";
import TechnologyTypes from "./ViewTechnologyTypes";
import OperatorGroups from "./ViewOperatorGroups";
import Tabs from "@components/Tabs";
import { constants } from "@constants";

let tabs = [
  {
    label: constants.TEXT_TAB_LABEL_TECH_TYPES,
    Component: <TechnologyTypes />,
  },
  {
    label: constants.TEXT_TAB_LABEL_OPERATOR_GRPS,
    Component: <OperatorGroups />,
  },
];

const TechnologyOperators = () => {
  return (
    <Container fluid className="page-container">
      <div className="panel-heading">
        {constants.TEXT_TECH_TYPE_OPERATOR_GRP}
      </div>
      <div className="content-layout">
        <Tabs tabs={tabs} />
      </div>
    </Container>
  );
};

export default TechnologyOperators;
