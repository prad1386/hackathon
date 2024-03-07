import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { tabSelected } from "@store/users.duck";
import { constants } from "@constants";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const TabsContainer = ({ tabs }) => {
  const { selectedAssetsTab, selectedOperatorTab, selectedTechtypeTab } =
    useSelector((state) => state.users);

  const tabClicked = tabs[0].label;

  const intialTab = () => {
    if (tabClicked === constants.TEXT_SCHEDULE_ASSETS) {
      return selectedAssetsTab;
    }
    if (tabClicked === constants.TEXT_TAB_LABEL_NEED_ATTENTION) {
      return selectedOperatorTab;
    }
    if (tabClicked === constants.TEXT_TAB_LABEL_TECH_TYPES) {
      return selectedTechtypeTab;
    }
  };

  const [value, setValue] = useState(() => intialTab());
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    dispatch(tabSelected({ value: newValue, tab: tabClicked }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          {tabs.map(({ label }, i) => (
            <Tab label={label} key={i} />
          ))}
        </Tabs>
      </Box>
      {tabs.map(({ Component }, i) => (
        <TabPanel value={value} index={i} key={i}>
          {Component}
        </TabPanel>
      ))}
    </Box>
  );
};

export default TabsContainer;
