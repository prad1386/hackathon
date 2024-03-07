import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import Navigation from "./components/Navigation";
import Header from "./components/Header";
import { useSelector } from "react-redux";
import { Loader } from "./utils/tools";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CampaignPage from "@campaignPages/ListCampaigns";
import CreateCampaign from "@campaignPages/CreateCampaign";
import ViewCampaign from "@campaignPages/ViewCampaign";
import OperationsPage from "@pages/Operations/Operations";
import ViewPatchDetails from "@pages/Operations/ViewPatchDetails";
import MyAssetsPage from "@myAssetsPages/MyAssets";
import ScheduleAssets from "@myAssetsPages/ScheduleAssets/ScheduleAssets";
import ViewAsset from "@myAssetsPages/ViewAsset";
import ReportsPage from "@pages/Reports";
import AssetReportsPage from "@pages/Reports/AssetReport";
import CampaignReportsPage from "@pages/Reports/CampaignReport";
import PatchWithManualInterventionPage from "@pages/Reports/PatchWithManualIntervention";
import CampaignPatchFailurePage from "@pages/Reports/CampaignPatchFailure";
import ManageTimeslots from "@adminPages/ManageTimeslots/ManageTimeslots";
import ManageExceptions from "@adminPages/ManageExceptions/ManageExceptions";
import ManageSchedulers from "@adminPages/ManageSchedulers/ManageSchedulers";
import TechnologyOperators from "@adminPages/TechnologyAndOperator/TechnologyOperators";
import PageNotFound from "@pages/PageNotFound";
import NotAccessible from "@pages/NotAccessible";
import { constants } from "@constants";

import "@assets/scss/index.scss";

const Router = () => {
  const {
    userInfo: { isSuperUser, isOperator, isScheduler, isReadOnly },
    loading,
    authRejected,
    isRoleFetched,
  } = useSelector((state) => state.users);

  return (
    <BrowserRouter>
      <Header />
      <Container
        fluid
        className={`main-container ${!isRoleFetched ? "page-loader" : ""}`}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            {authRejected && (
              <Stack sx={{ width: "100%", marginTop: "20px" }} spacing={2}>
                <Alert severity="error">
                  <strong> Sorry, You are not Authenticated!</strong>
                </Alert>
              </Stack>
            )}

            {!isRoleFetched && <Loader />}

            {isRoleFetched && (
              <div className="sub-container">
                <div className="left-nav sidebar">
                  <Navigation />
                </div>
                <div className="right-container">
                  <>
                    <Routes>
                      <Route path="/" element={<Navigate to="/campaigns" />} />
                      <Route path="campaigns">
                        <Route index element={<CampaignPage />} />
                        {isSuperUser ? (
                          <Route path="campaign" element={<CreateCampaign />} />
                        ) : (
                          <Route path="campaign" element={<NotAccessible />} />
                        )}
                        <Route
                          path="viewcampaign/:id"
                          element={<ViewCampaign />}
                        />
                        <Route path="*" element={<PageNotFound />} />
                      </Route>

                      <Route path="myassets">
                        <Route index element={<MyAssetsPage />} />
                        {isSuperUser || isScheduler ? (
                          <Route
                            path="scheduleassets"
                            element={<ScheduleAssets />}
                          />
                        ) : (
                          <Route path="*" element={<NotAccessible />} />
                        )}
                        <Route
                          path="viewasset/:asset_instance_id/cid/:campaign_id/status/:view"
                          element={<ViewAsset />}
                        />
                        <Route path="*" element={<PageNotFound />} />
                      </Route>

                      {isSuperUser || isOperator || isReadOnly ? (
                        <Route path="operations">
                          <Route index element={<OperationsPage />} />
                          <Route
                            path="viewpatchdetails/:campaign_id/:asset_instance_id"
                            element={<ViewPatchDetails />}
                          />
                          <Route path="*" element={<PageNotFound />} />
                        </Route>
                      ) : (
                        <Route path="*" element={<NotAccessible />} />
                      )}
                      <Route path="reports">
                        <Route index element={<ReportsPage />} />
                        <Route
                          path="assetreports"
                          element={<AssetReportsPage />}
                        />
                        <Route
                          path="campaignreports"
                          element={<CampaignReportsPage />}
                        />
                        <Route
                          path="patchwithmanualintervention"
                          element={<PatchWithManualInterventionPage />}
                        />
                        <Route
                          path="campaignpatchfailure"
                          element={<CampaignPatchFailurePage />}
                        />
                        <Route path="*" element={<PageNotFound />} />
                      </Route>

                      {isSuperUser ? (
                        <Route path="admin">
                          <Route
                            path="managetimeslots"
                            element={<ManageTimeslots />}
                          />
                          <Route
                            path="technologyOperators"
                            element={<TechnologyOperators />}
                          />
                          <Route
                            path="manageschedulers"
                            element={<ManageSchedulers />}
                          />
                          <Route
                            path="manageexceptions"
                            element={<ManageExceptions />}
                          />

                          <Route path="*" element={<PageNotFound />} />
                        </Route>
                      ) : (
                        <Route path="*" element={<NotAccessible />} />
                      )}
                    </Routes>
                    <div className="release-details">
                      {constants.TEXT_RELEASE_NOTES}{" "}
                      {new Date().toISOString().split("T")[0]}
                    </div>
                  </>
                </div>
              </div>
            )}
            {isRoleFetched &&
              !isSuperUser &&
              !isOperator &&
              !isScheduler &&
              !isReadOnly && (
                <Stack sx={{ width: "100%", marginTop: "20px" }} spacing={2}>
                  <Alert severity="error">
                    <strong>User does not have role assignment!</strong>
                  </Alert>
                </Stack>
              )}
          </>
        )}
      </Container>
    </BrowserRouter>
  );
};

export default Router;
