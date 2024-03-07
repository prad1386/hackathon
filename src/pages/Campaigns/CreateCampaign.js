import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Container, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { getTechnologyTypes } from "@store/admin/technologyTypes.duck";
import { constants } from "@constants";
import {
  viewCampaign,
  assetActions,
  validateAssets,
  addCampaign,
} from "@store/campaign.duck";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import HelperTooltip from "@components/HelperTooltip";
import { Loader } from "@utils/tools";
import DialogBox from "@components/DialogBox";
import CSVExport from "@utils/CSVDownload";
import Papa from "papaparse";

const CreateCampaign = () => {
  const { campaign_init } = useSelector((state) => state.campaign);
  const { allCampaigns: allCampaignName, postDataLoading } = useSelector(
    (state) => state.campaign
  );
  const { technologyTypes } = useSelector((state) => state.technologyTypes);

  const ref = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();

  // Dialog box to be opened on btn selection
  const [isOpen, setisOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");

  const action_type = queryParameters.get("action");
  const campaign_id = queryParameters.get("id") ?? 0;

  const [campDataLoading, setcampDataLoading] = useState(false);

  const [cloneCheckbox, setCloneCheckbox] = useState("false"); //Checkbox takes string value
  const [campaignDetails, setCampaignDetails] = useState({});
  const [notScheduledAssets, setNotScheduledAssets] = useState([]);

  const [wrongTechTypeAssets, setWrongTechTypeAssets] = useState([]);

  const [downloadAssetsFlag, SetDownloadAssetsFlag] = useState(false);
  const [CSVFilename, setCSVFilename] = useState("");
  const [downloadAssetsList, setDownloadAssetsList] = useState([]);

  const [csvData, setCsvData] = useState(null);
  const [csvObj, setcsObj] = useState(null);
  const [formDatadisable, setFormDatadisable] = useState(false);
  const [validateBtnDisable, setValidateBtnDisable] = useState(true);
  const [formSuccessMsg, setformSuccessMsg] = useState(null);
  const [assetValidation, setassetValidation] = useState([]);
  const [assetUploadId, setassetUploadId] = useState(0);
  const [formReset, setFormReset] = useState("");
  const [selectedTechType, setSelectedTechType] = useState("");

  // Get all Technology Types
  useEffect(() => {
    dispatch(getTechnologyTypes({}));
  }, [dispatch]);

  const parseFile = (file) => {
    setValidateBtnDisable(false);
    Papa.parse(file.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const resultData = results.data.map((data) => {
          return data.ASSET_INSTANCE_ID
            ? { asset_instance_id: data.ASSET_INSTANCE_ID }
            : data.asset_instance_id && {
                asset_instance_id: data.asset_instance_id,
              };
        });
        const finalResultData = resultData.filter(
          (value) => JSON.stringify(value) !== "{}"
        );
        setCsvData(finalResultData);
      },
    });
  };

  const schema = yup
    .object({
      campaign_name:
        action_type !== "modify" &&
        yup
          .string()
          .required("Campaign name is a required field!")
          .test(
            "same_dates_test",
            "Campaign name already exists!",
            function (value) {
              return allCampaignName.every(
                (camp) => camp.campaign_name !== value
              );
            }
          ),
      campaign_description:
        action_type !== "modify" &&
        yup.string().required("Campaign description is a required field!"),
      technology_type:
        action_type !== "clone" &&
        yup.string().required("Technology type is a required field!"),
      start_date:
        (action_type === "create" || action_type === "clone") &&
        yup
          .date("Start date is Required")
          .nullable()
          .typeError("Start date is required")
          .required("Start date is required"),
      end_date:
        action_type === "create" || action_type === "clone"
          ? yup
              .date()
              .nullable()
              .typeError("End date is required")
              .transform((v) => (v instanceof Date && !isNaN(v) ? v : null))
              .required("End Date is required")
              .test(
                "same_dates_test",
                "End date should be greater and must not equal to Start date.",
                function (value) {
                  const { start_date } = this.parent;
                  return value
                    ? value.getTime() !== start_date.getTime() &&
                        value.getTime() >= start_date.getTime()
                    : start_date.getTime();
                }
              )
          : yup
              .date()
              .nullable()
              .typeError("End date is required")
              .transform((v) => (v instanceof Date && !isNaN(v) ? v : null))
              .required("End Date is required")
              .test(
                "same_dates_test",
                `End date should not be same date and less than Start date.`,
                function (value) {
                  const { start_date } = this.parent;
                  return value
                    ? value.getTime() !== start_date.getTime() &&
                        value.getTime() >= start_date.getTime()
                    : start_date.getTime();
                }
              ),
      email_distribution:
        action_type !== "clone" &&
        yup
          .string()
          .test(
            "Validate Email",
            "Invalid Email Format / Multiple Email should be comma sepearated",
            function (value) {
              if (value === "") {
                return true;
              } else {
                const re = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i;
                const result = value.replace(/\s/g, "").split(/,|;/);
                for (let i = 0; i < result.length; i++) {
                  if (!re.test(result[i])) {
                    return false;
                  }
                }
                return true;
              }
            }
          ),
      email_notification: action_type !== "clone" && yup.string(),
    })
    .required();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: action_type === "create" && {
      campaign_name: campaign_init.campaign_name,
      campaign_description: campaign_init.campaign_description,
      technology_type: campaign_init.technology_type,
      email_distribution: campaign_init.email_distribution,
      email_notification: campaign_init.email_notification,
      manual_campaign: campaign_init.manual_campaign,
      start_date: campaign_init.start_date,
      end_date: campaign_init.end_date,
    },
  });

  const uploadForm = async () => {
    if (csvData != null || csvData.length > 0) {
      setFormDatadisable(true); //validateAssets
      setValidateBtnDisable(true);
      try {
        return await dispatch(validateAssets(csvData))
          .unwrap()
          .then((res) => {
            if (res) {
              if (res.incorrect_instance_id.length > 0) {
                setFormDatadisable(false);
                setassetUploadId(res.upload_id);
                setValidateBtnDisable(false);
                setcsObj(csvData);
                setassetValidation(res.incorrect_instance_id);
                setformSuccessMsg("greater");
              } else if (res.incorrect_instance_id.length === 0) {
                setFormDatadisable(false);
                setassetUploadId(res.upload_id);
                setValidateBtnDisable(false);
                setcsObj(csvData);
                setassetValidation(res.incorrect_instance_id);
                setformSuccessMsg("equalsZero");
              }
            }
          });
      } catch (error) {
        setassetUploadId(0);
        setValidateBtnDisable(false);
        setFormDatadisable(false);
        setformSuccessMsg("error");
      }
    } else {
    }
  };

  // Download CSV for not scheduled assets after clone
  const notSchAssetsCSV = () => {
    setDownloadAssetsList(notScheduledAssets);
    setCSVFilename("notScheduledAssets");
    SetDownloadAssetsFlag(true);
  };

  const wrongTechTypeAssetsCSV = () => {
    setDownloadAssetsList(wrongTechTypeAssets);
    setCSVFilename("wrongTechTypesAssets");
    SetDownloadAssetsFlag(true);
  };

  const onSubmit = (data) => {
    if (data && !isOpen) {
      setWrongTechTypeAssets([]);
      setNotScheduledAssets([]);
      // Create new Campaign
      if (action_type === "create") {
        if (assetUploadId) {
          setSelectedTechType(data.technology_type);
          const formData = {
            ...data,
            upload_id: assetUploadId,
          };

          dispatch(addCampaign(formData))
            .unwrap()
            .then((res) => {
              if (res.status === "failed") {
                setWrongTechTypeAssets(res.data);
              } else {
                ref.current.value = "";
                setFormReset("successful");
                setassetUploadId(0);
                setFormDatadisable(false);
                navigate("/campaigns");
              }
            });
        }
      }

      // Modify Campaign
      if (action_type === "modify") {
        const formData = {
          ...data,
          upload_id: assetUploadId,
        };
        dispatch(assetActions({ formData, id: campaign_id, action_type }))
          .unwrap()
          .then(() => {
            ref.current.value = "";
            setFormReset("successful");
            setassetUploadId(0);
            setFormDatadisable(false);
            navigate("/campaigns");
          });
      }

      // Clone Campaign
      if (action_type === "clone") {
        let formData = {
          start_date: data.start_date,
          end_date: data.end_date,
          upload_id: "",
          old_campaign_id: campaignDetails.campaign_id,
          campaign_name: data.campaign_name,
          old_campaign_name: data.campaign_name,
          campaign_description: data.campaign_description,
          old_campaign_start_date: campaignDetails.start_date,
          old_campaign_end_date: campaignDetails.end_date,
          technology_type: campaignDetails.technology_type,
          manual_campaign: campaignDetails.manual_campaign,
          assets: "",
        };

        if (cloneCheckbox === "true") {
          if (assetUploadId) {
            formData = {
              ...formData,
              upload_id: assetUploadId,
            };
          }
        } else {
          formData = {
            ...formData,
          };
        }

        dispatch(assetActions({ formData, id: campaign_id, action_type }))
          .unwrap()
          .then((res) => {
            setFormReset("successful");
            setassetUploadId(0);
            setFormDatadisable(false);
            //Redirect to campaigns if all assets are scheduled after clone
            if (res.data.length <= 0) {
              navigate("/campaigns");
            } else {
              setNotScheduledAssets(res.data);
            }
          });
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("campaignStartDate", new Date());
    // reset form

    if (action_type !== "create" && !isOpen) {
      dispatch(viewCampaign(campaign_id))
        .unwrap()
        .then((res) => {
          if (res) {
            setcampDataLoading(true);
            setCampaignDetails(res);
            reset({
              campaign_name: res.campaign_name,
              campaign_description: res.campaign_description,
              technology_type: res.technology_type,
              email_distribution: res.email_distribution,
              email_notification: res.email_notification,
              manual_campaign: res.manual_campaign,
              start_date: new Date(res.start_date),
              end_date: new Date(res.end_date),
            });
          }
        });
    } else {
      if (!isOpen) {
        reset(campaign_init);
      }
    }
  }, [
    dispatch,
    formReset,
    action_type,
    campaign_id,
    reset,
    campaign_init,
    isOpen,
  ]);

  const handleDialog = () => {
    setisOpen(!isOpen);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    handleDialog();
  };

  const handleDialogType = (type) => {
    setDialogType(type);
    handleDialog();
  };

  const Dialogcomponent = (
    <DialogBox
      title={
        dialogType === "notSchAssets"
          ? `Number of Assets not scheduled (${notScheduledAssets.length})`
          : dialogType === "failedAssets"
          ? `Failed Assets (${assetValidation.length})`
          : `Wrong technology types Assets (${wrongTechTypeAssets.length})`
      }
      isOpen={isOpen}
      handleClose={handleDialog}
      hideButtons={true}
    >
      <div className="p-3">
        <div>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Asset Instance Id</th>
              </tr>
            </thead>
            <tbody>
              {dialogType === "notSchAssets" &&
                notScheduledAssets.map((asset) => {
                  return (
                    <tr key={asset.asset_instance_id}>
                      <td>{asset.asset_instance_id}</td>
                    </tr>
                  );
                })}

              {dialogType === "failedAssets" &&
                assetValidation.map((asset) => {
                  return (
                    <tr key={asset.asset_instance_id}>
                      <td>{asset.asset_instance_id}</td>
                    </tr>
                  );
                })}

              {dialogType === "wrongTechType" &&
                wrongTechTypeAssets.map((asset) => {
                  return (
                    <tr key={asset.asset_instance_id}>
                      <td>{asset.asset_instance_id}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end button-sec mt-2 mb-1">
          <button
            type="button"
            className="btn btn-primary px-4 btn-sm"
            onClick={(e) => handleCancel(e)}
          >
            {constants.TEXT_BUTTON_CANCEL}
          </button>
          {(dialogType === "notSchAssets" ||
            dialogType === "wrongTechType") && (
            <button
              onClick={
                dialogType === "notSchAssets"
                  ? notSchAssetsCSV
                  : wrongTechTypeAssetsCSV
              }
              className="btn btn-primary px-4 btn-sm"
            >
              <img
                alt="excel-logo"
                src={require("@assets/images/excel.png")}
                width={25}
              />{" "}
              Download
            </button>
          )}
        </div>
      </div>
    </DialogBox>
  );

  return (
    <Container fluid className="page-container form">
      <div className="panel-heading ">
        {action_type === "clone" && constants.TEXT_CLONE_CAMPAIGN}
        {action_type === "create" && constants.TEXT_CREATE_NEW_CAMPAIGN}
        {action_type !== "clone" &&
          action_type !== "create" &&
          constants.TEXT_MODIFY_CAMPAIGN}
      </div>

      <section className="content-layout">
        <div className="alert alert-secondary" role="alert">
          <span className="mandatory asterisk">*</span>
          <strong>{constants.TEXT_REQUIRED_FIELDS}</strong>
        </div>
        {campDataLoading === false &&
          action_type !== "create" &&
          action_type !== "clone" && <Loader />}
        {(campDataLoading ||
          action_type === "create" ||
          action_type === "clone") && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ width: "800px" }}>
              <Row className="mb-2">
                <Col sm={3}>
                  <label className="col-form-label">
                    <span className="mandatory asterisk">*</span>
                    {constants.TEXT_CAMPAIGN_NAME}
                  </label>
                </Col>

                <Col sm={9}>
                  <FormControl fullWidth>
                    {action_type === "modify" ? (
                      <TextField
                        hiddenLabel
                        variant="outlined"
                        placeholder="Campaign Name"
                        size="small"
                        className="form-textfield"
                        name="campaign_name"
                        disabled={action_type === "modify"}
                        {...register("campaign_name")}
                        error={!!errors.campaign_name}
                        helperText={errors.campaign_name?.message}
                      />
                    ) : (
                      <Controller
                        name="campaign_name"
                        control={control}
                        render={({ field: { onChange, value } }) => {
                          return (
                            <TextField
                              hiddenLabel
                              variant="outlined"
                              placeholder="Campaign Name"
                              size="small"
                              onChange={(e) => onChange(e)}
                              className="form-textfield"
                              {...register("campaign_name")}
                              error={!!errors.campaign_name}
                              helperText={errors.campaign_name?.message}
                            />
                          );
                        }}
                      />
                    )}
                  </FormControl>
                </Col>
              </Row>

              <Row className="mb-2">
                <Col sm={3}>
                  <label className="col-form-label">
                    <span className="mandatory asterisk">*</span>
                    {constants.TEXT_DESCRIPTION}
                  </label>
                </Col>
                <Col sm={9}>
                  <FormControl fullWidth>
                    <TextField
                      hiddenLabel
                      variant="outlined"
                      placeholder="Campaign Description"
                      size="small"
                      className="form-textfield"
                      {...register("campaign_description")}
                      disabled={action_type === "modify"}
                      error={!!errors.campaign_description}
                      helperText={errors.campaign_description?.message}
                    />
                  </FormControl>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col sm={3}>
                  <label className="col-form-label">
                    <span className="mandatory asterisk">*</span>
                    {constants.TEXT_TECHNOLOGY_TYPE}
                  </label>
                </Col>
                <Col sm={9}>
                  <FormControl size="small" fullWidth>
                    <Controller
                      render={({ field }) => (
                        <Select
                          {...field}
                          {...register("technology_type")}
                          disabled={action_type !== "create"}
                          error={!!errors.technology_type}
                        >
                          <MenuItem value="">
                            <em>Select Value</em>
                          </MenuItem>
                          {technologyTypes.map((item) => (
                            <MenuItem
                              key={item}
                              value={item}
                              className="text-capitalize"
                            >
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                      control={control}
                      name="technology_type"
                      defaultValue=""
                    />
                    <FormHelperText className="mandatory">
                      {errors.technology_type &&
                        errors.technology_type?.message}
                    </FormHelperText>
                  </FormControl>
                </Col>
              </Row>

              <Row>
                <Col sm={3}>
                  <label className="col-form-label">
                    <span className="mandatory asterisk">*</span>
                    {constants.TEXT_START_DATE}
                  </label>
                </Col>
                <Col sm={9}>
                  <Row className="g-3">
                    <div className="col-sm-5">
                      <Controller
                        name="start_date"
                        control={control}
                        defaultValue={new Date()}
                        render={({ field: { onChange, value } }) => {
                          localStorage.setItem("campaignStartDate", value);
                          return (
                            <DatePicker
                              className="form-control form-control-sm"
                              onChange={onChange}
                              minDate={new Date()}
                              selected={value}
                              placeholderText="Select Start Date"
                              error={!!errors.start_date}
                              helperText={errors.start_date?.message}
                            />
                          );
                        }}
                      ></Controller>
                      <FormHelperText className="mandatory">
                        {errors.start_date && errors.start_date?.message}
                      </FormHelperText>
                    </div>
                    <div className="col-sm-7">
                      <Row className="mb-2">
                        <Col sm={4} style={{ textAlign: "right" }}>
                          <label className="col-form-label">
                            <span className="mandatory asterisk">*</span>
                            {constants.TEXT_END_DATE}
                          </label>
                        </Col>
                        <Col sm={8}>
                          <Controller
                            name="end_date"
                            control={control}
                            defaultValue={new Date()}
                            render={({ field: { onChange, value } }) => {
                              return (
                                <DatePicker
                                  className="form-control form-control-sm"
                                  onChange={onChange}
                                  minDate={new Date()}
                                  selected={value}
                                  startDate={new Date()}
                                  placeholderText="Select End Date"
                                  error={!!errors.end_date}
                                  helperText={errors.end_date?.message}
                                />
                              );
                            }}
                          />
                          <FormHelperText className="mandatory">
                            {errors.end_date && errors.end_date?.message}
                          </FormHelperText>
                        </Col>
                      </Row>
                    </div>
                  </Row>
                </Col>
              </Row>
              {action_type !== "clone" && (
                <>
                  <Row className="mb-2">
                    <Col sm={3}>
                      <label className="col-form-label">
                        {constants.TEXT_EMAIL_DISTRIBUTION}
                      </label>
                    </Col>
                    <Col sm={9}>
                      <FormControl fullWidth>
                        <TextField
                          hiddenLabel
                          variant="outlined"
                          placeholder={constants.TEXT_EMAIL_DISTRIBUTION}
                          size="small"
                          className="form-textfield"
                          {...register("email_distribution")}
                          error={!!errors.email_distribution}
                          helperText={errors.email_distribution?.message}
                        />
                      </FormControl>
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col sm={3}>
                      <label className="col-form-label">
                        {constants.TEXT_EMAIL_NOTIFICATION}
                      </label>
                    </Col>
                    <Col sm={9}>
                      <FormControl fullWidth>
                        <TextField
                          hiddenLabel
                          variant="outlined"
                          placeholder={constants.TEXT_EMAIL_NOTIFICATION}
                          size="small"
                          className="form-textfield"
                          {...register("email_notification")}
                        />
                      </FormControl>
                    </Col>
                  </Row>
                </>
              )}

              {action_type === "clone" && (
                <Row>
                  <Col sm={4} className="clone-confirmation-msg">
                    Do you want to upload new assets?
                  </Col>
                  <Col sm={8} className="clone-confirmation-radio">
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={cloneCheckbox}
                      onChange={(event) => setCloneCheckbox(event.target.value)}
                    >
                      <FormControlLabel
                        value={true}
                        control={
                          <Radio
                            sx={{
                              "& .MuiSvgIcon-root": {
                                fontSize: 18,
                              },
                            }}
                          />
                        }
                        label="Yes"
                      />
                      <FormControlLabel
                        value={false}
                        control={
                          <Radio
                            sx={{
                              "& .MuiSvgIcon-root": {
                                fontSize: 18,
                              },
                            }}
                          />
                        }
                        label="No"
                      />
                    </RadioGroup>
                  </Col>
                </Row>
              )}

              {(action_type !== "clone" || cloneCheckbox === "true") && (
                <Row>
                  <Col sm={3}>
                    <label className="col-form-label">
                      {(action_type === "create" ||
                        action_type === "clone") && (
                        <span className="mandatory asterisk">*</span>
                      )}
                      {constants.TEXT_ASSETS}
                    </label>
                  </Col>
                  <Col sm={9}>
                    <div className="input-group mb-2">
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        name="Drag your file here or Browse to upload"
                        id="inputGroupFile01"
                        ref={ref}
                        accept=".csv"
                        required={
                          action_type === "create" || action_type === "clone"
                            ? true
                            : false
                        }
                        multiple="multiple"
                        onChange={parseFile}
                      />

                      <button
                        type="button"
                        className="m-3 btn btn-primary btn-sm asset-upload-btn"
                        onClick={uploadForm}
                        disabled={validateBtnDisable}
                      >
                        {constants.TEXT_VALIDATE}
                      </button>
                      <div className="mt-3">
                        <HelperTooltip
                          text={constants.TEXT_HELPER_ASSET_UPLOAD}
                        />
                      </div>
                    </div>
                    <div className="orange">
                      {formDatadisable ? (
                        <div className="d-flex">
                          <Loader size={18} />
                          <span className="px-1">
                            Validation in progress ...
                          </span>
                        </div>
                      ) : formSuccessMsg === "greater" ? (
                        <div>
                          Out of {csvObj.length} asset(s)
                          <button
                            type="button"
                            className="btn btn-link"
                            onClick={() => handleDialogType("failedAssets")}
                          >
                            {assetValidation.length} failed on validation
                          </button>
                          .
                        </div>
                      ) : formSuccessMsg === "equalsZero" ? (
                        <div> All Assets Validated Successfully!</div>
                      ) : formSuccessMsg === "error" ? (
                        <div></div>
                      ) : null}
                    </div>
                  </Col>
                </Row>
              )}

              {action_type !== "clone" && (
                <>
                  <Row className="mb-2">
                    <Col sm={3}>
                      <label className="col-form-label">
                        <span className="mandatory asterisk">*</span>
                        {constants.TEXT_DEPLOYMENT_TYPE}
                      </label>
                    </Col>
                    <Col sm={9}>
                      <div className="manual-campaign">
                        <label htmlFor="manual-yes">
                          <input
                            {...register("manual_campaign", { required: true })}
                            type="radio"
                            name="manual_campaign"
                            defaultChecked={true}
                            value={true}
                            id="manual-yes"
                          />
                          {constants.TEXT_MANUAL_CAMPAIGN_Y}
                        </label>
                        <label htmlFor="manual-no">
                          <input
                            {...register("manual_campaign", { required: true })}
                            // disabled
                            type="radio"
                            name="manual_campaign"
                            defaultChecked={false}
                            value={false}
                            id="manual-no"
                          />
                          {constants.TEXT_MANUAL_CAMPAIGN_N}
                        </label>

                        <FormHelperText className="mandatory">
                          {errors.manual_campaign?.type === "required" &&
                            "Manual Campaign is a reqired field!"}
                        </FormHelperText>
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col sm={3}>
                      <label className="col-form-label">
                        {constants.TEXT_NOTES}
                      </label>
                    </Col>
                    <Col sm={9}>
                      <textarea
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Notes"
                        {...register("notes")}
                        disabled={action_type !== "create"}
                      ></textarea>
                    </Col>
                  </Row>
                </>
              )}

              <Row>
                <Col>
                  {notScheduledAssets.length > 0 && (
                    <div className="alert alert-danger" role="alert">
                      <span className="clone-confirmation-msg">
                        Number of assets which are not scheduled are{" "}
                        {notScheduledAssets.length}{" "}
                        <button
                          className="know-more"
                          onClick={() => handleDialogType("notSchAssets")}
                        >
                          Know more
                        </button>
                      </span>
                    </div>
                  )}

                  {wrongTechTypeAssets.length > 0 && (
                    <div className="alert alert-danger" role="alert">
                      <span className="clone-confirmation-msg">
                        Number of assets which are not{" "}
                        <strong>{selectedTechType}</strong> technology type are{" "}
                        {wrongTechTypeAssets.length}{" "}
                        <button
                          className="know-more"
                          onClick={() => handleDialogType("wrongTechType")}
                        >
                          know more
                        </button>
                      </span>
                    </div>
                  )}
                </Col>
              </Row>

              <div className="d-grid gap-2 d-md-flex  justify-content-md-center button-sec">
                <Link className="btn btn-primary px-4 btn-sm" to="/campaigns">
                  {notScheduledAssets.length <= 0
                    ? constants.TEXT_BUTTON_CANCEL
                    : constants.TEXT_BUTTON_GOBACK}
                </Link>

                {notScheduledAssets.length <= 0 && (
                  <button
                    className="btn btn-primary px-4 btn-sm"
                    type="Submit"
                    disabled={
                      postDataLoading ||
                      (action_type === "create" && formSuccessMsg === null)
                    }
                  >
                    {constants.TEXT_BUTTON_SUBMIT}
                  </button>
                )}
                {action_type === "create" && (
                  <HelperTooltip text={constants.TEXT_HELPER_SUBMIT_ENABLE} />
                )}
                {postDataLoading && <Loader size={22} />}
              </div>
            </div>
          </form>
        )}
      </section>
      {Dialogcomponent}
      {downloadAssetsFlag && (
        <CSVExport
          filename={CSVFilename}
          columnheader={[
            { label: "asset_instance_id", key: "asset_instance_id" },
          ]}
          data={downloadAssetsList}
        />
      )}
    </Container>
  );
};

export default CreateCampaign;
