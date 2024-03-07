import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  TextareaAutosize,
  Autocomplete,
  Alert,
  Stack,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import { Row, Col } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import {
  createExceptions,
  getExceptions,
  getAssetsForPt3,
  getAllProductTier3,
} from "@store/admin/manageExceptions.duck";
import { Loader } from "@utils/tools";
import { constants } from "@constants";

const CreateException = ({ handleDialog, singleAsset }) => {
  const [formReset, setFormReset] = useState("");
  const [exceptionFor, setExceptionFor] = useState("");
  const [assetScheduled, setAssetScheduled] = useState(false);

  const {
    init_data,
    product_tier3,
    pt3_assets,
    assetId_map,
    pt3_loading,
    assets_loading,
    scheduled_assets,
  } = useSelector((state) => state.manageExceptions);
  const dispatch = useDispatch();

  const schema = yup
    .object({
      exception_for:
        !singleAsset &&
        yup.string().required("Exception for is a required field!"),
      asset_name:
        exceptionFor === "single" &&
        yup.string().required("Asset Name is a required field!"),
      product_tier3:
        !singleAsset &&
        yup.string().required("Product tier 3 is a required field!"),
      justification: yup
        .string()
        .required("Justification is a required field!"),
      additional_info: yup
        .string()
        .required("Additional info is a required field!"),
      start_date: yup
        .date("Start Date is Required")
        .nullable()
        .typeError("Start date is required")
        .required("Start Date is required"),
      end_date: yup
        .date()
        .nullable()
        .typeError("End date is required")
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
        ),
    })
    .required();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      justification: init_data.justification,
      additional_info: init_data.additional_info,
      end_date: init_data.end_date,
    },
  });

  const onSubmit = (data) => {
    let formData = { ...data, status: constants.TEXT_PENDING_APPROVAL };
    if (singleAsset) {
      formData = {
        ...formData,
        asset_instance_id: singleAsset.asset_instance_id,
        product_tier3: singleAsset.product_tier3,
      };
    } else {
      formData = {
        ...formData,
        asset_instance_id: assetId_map[data.asset_name],
      };
    }

    dispatch(createExceptions(formData))
      .unwrap()
      .then(() => {
        setFormReset("successful");
        handleDialog();
        dispatch(getExceptions({}));
      });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    handleDialog();
  };

  useEffect(() => {
    // reset form
    if (!singleAsset) {
      reset(init_data);
    }
  }, [formReset, init_data, reset, singleAsset]);

  const onBlurFor = (e) => {
    setAssetScheduled(false);
    dispatch(getAllProductTier3({}));
    setExceptionFor(e.target.value);
  };

  const onBlurTier3 = () => {
    const pt3 = watch("product_tier3");
    if (pt3) {
      dispatch(getAssetsForPt3(pt3))
        .unwrap()
        .then((res) => {
          if (res.scheduledAssets.length > 0 && exceptionFor === "all") {
            setAssetScheduled(true);
          }
        });
    }
  };

  const onBlurAssetName = () => {
    const assetName = watch("asset_name");
    setAssetScheduled(false);
    if (assetName) {
      scheduled_assets.forEach((asset) => {
        if (asset.asset_name === assetName) {
          setAssetScheduled(true);
          return;
        }
      });
    }
  };

  return (
    <section>
      <div className="alert alert-secondary" role="alert">
        <span className="mandatory asterisk">*</span>
        <strong>{constants.TEXT_REQUIRED_FIELDS}</strong>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <Row className="mb-3">
          <Col sm={4}>
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_REQ_EXCEPTION_FOR}
            </label>
          </Col>

          <Col sm={8}>
            {singleAsset ? (
              <div className="input-group">
                <input
                  type="text"
                  disabled
                  className="form-control"
                  value={constants.TEXT_SINGLE_ASSET}
                  {...register("exception_for")}
                ></input>
              </div>
            ) : (
              <>
                <FormControl size="small" fullWidth>
                  <Controller
                    render={({ field }) => (
                      <Select
                        {...field}
                        {...register("exception_for")}
                        error={!!errors.exception_for}
                        onChange={(e) => {
                          field.onChange(e);
                          onBlurFor(e);
                        }}
                        value={field.value ? field.value : ""}
                      >
                        <MenuItem value="">
                          <em>Select Value</em>
                        </MenuItem>
                        <MenuItem value="all">
                          {constants.TEXT_ALL_ASSETS_PT3}
                        </MenuItem>
                        <MenuItem value="single">
                          {constants.TEXT_SINGLE_ASSET}
                        </MenuItem>
                      </Select>
                    )}
                    control={control}
                    name="exception_for"
                    defaultValue=""
                  />
                </FormControl>
                <FormHelperText className="mandatory">
                  {errors.exception_for && errors.exception_for?.message}
                </FormHelperText>
              </>
            )}
          </Col>
        </Row>

        <Row>
          <Col sm={4}>
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_PRODUCT_TIER_3}
            </label>
          </Col>
          <Col sm={8} className="mb-3">
            {singleAsset ? (
              <div className="input-group">
                <input
                  type="text"
                  disabled
                  className="form-control"
                  value={singleAsset.product_tier3}
                  {...register("product_tier3")}
                ></input>
              </div>
            ) : (
              <>
                <div className="input-group">
                  <Controller
                    control={control}
                    name="product_tier3"
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        freeSolo
                        options={product_tier3.map((option) => option)}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              InputProps={{
                                ...params.InputProps,
                                type: "search",
                              }}
                              size="small"
                              className="form-control"
                              hiddenLabel
                              onBlur={onBlurTier3}
                              placeholder={constants.TEXT_PRODUCT_TIER_3}
                              error={!!errors.product_tier3}
                            />
                          );
                        }}
                        onChange={(event, values, reason) => onChange(values)}
                        className="form-control autocomplete"
                      />
                    )}
                  />

                  <button
                    className="btn btn-secondary btn-search"
                    type="button"
                  >
                    <SearchIcon />
                  </button>
                  {pt3_loading && <Loader />}
                </div>
                <FormHelperText className="mandatory">
                  {errors.product_tier3 && errors.product_tier3?.message}
                </FormHelperText>
              </>
            )}
          </Col>
        </Row>
        {exceptionFor !== "all" && (
          <Row>
            <Col sm={4}>
              <label className="col-form-label">
                <span className="mandatory asterisk">*</span>
                {constants.TEXT_ASSET_NAME}
              </label>
            </Col>

            <Col sm={8} className="mb-3">
              {singleAsset ? (
                <div className="input-group">
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    value={singleAsset.asset_name}
                    {...register("asset_name")}
                  ></input>
                </div>
              ) : (
                <>
                  <div className="input-group">
                    <Controller
                      control={control}
                      name="asset_name"
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          freeSolo
                          options={pt3_assets.map((option) => option)}
                          renderInput={(params) => {
                            return (
                              <TextField
                                {...params}
                                InputProps={{
                                  ...params.InputProps,
                                  type: "search",
                                }}
                                size="small"
                                className="form-control"
                                hiddenLabel
                                onBlur={onBlurAssetName}
                                placeholder="Asset Name"
                                error={!!errors.asset_name}
                              />
                            );
                          }}
                          onChange={(event, values, reason) => onChange(values)}
                          className="form-control autocomplete"
                        />
                      )}
                    />

                    <button
                      className="btn btn-secondary btn-search"
                      type="button"
                    >
                      <SearchIcon />
                    </button>
                    {assets_loading && <Loader />}
                  </div>
                  <FormHelperText className="mandatory">
                    {errors.asset_name && errors.asset_name?.message}
                  </FormHelperText>
                </>
              )}
            </Col>
          </Row>
        )}
        {assetScheduled && (
          <Row className="mb-3">
            <Col sm={12}>
              {exceptionFor === "single" && (
                <Stack sx={{ width: "100%" }} spacing={2}>
                  <Alert severity="warning">
                    <strong>{constants.TEXT_SCHEDULED_ASSET_MSG}</strong>
                  </Alert>
                </Stack>
              )}
              {exceptionFor === "all" && (
                <Stack sx={{ width: "100%" }} spacing={2}>
                  <Alert severity="warning">
                    <span>{constants.TEXT_SCHEDULED_ASSET_MSG_PT3}</span>
                    <strong>
                      {scheduled_assets.map((asset) => {
                        return (
                          <div key={asset.asset_name}>{asset.asset_name}</div>
                        );
                      })}
                    </strong>
                  </Alert>
                </Stack>
              )}
            </Col>
          </Row>
        )}

        <Row className="mb-3">
          <Col sm={4}>
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_JUSTIFICATION}
            </label>
          </Col>

          <Col sm={8}>
            <FormControl size="small" fullWidth>
              <Controller
                render={({ field }) => (
                  <Select
                    {...field}
                    {...register("justification")}
                    error={!!errors.justification}
                  >
                    <MenuItem value="">
                      <em>Select Value</em>
                    </MenuItem>
                    <MenuItem value="Risk Accepted">Risk Accepted</MenuItem>
                    <MenuItem value="Fix Unavalable">Fix Unavilable</MenuItem>
                    <MenuItem value="Mitigating control in place">
                      Mitigating control in place
                    </MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                )}
                control={control}
                name="justification"
                defaultValue=""
              />
            </FormControl>
            <FormHelperText className="mandatory">
              {errors.justification && errors.justification?.message}
            </FormHelperText>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4}>
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_ADDITIONAL_INFO}
            </label>
          </Col>

          <Col sm={8}>
            <FormControl size="small" fullWidth>
              <TextareaAutosize
                placeholder="Additional Info"
                className="form-control form-control-sm"
                {...register("additional_info")}
                error={errors.additional_info}
              />
            </FormControl>
            <FormHelperText className="mandatory">
              {errors.additional_info && errors.additional_info?.message}
            </FormHelperText>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4}>
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_EXCEPTION_START}
            </label>
          </Col>

          <Col sm={8}>
            <FormControl size="small" fullWidth>
              <Controller
                name="start_date"
                control={control}
                defaultValue={new Date()}
                render={({ field: { onChange, value } }) => {
                  return (
                    <DatePicker
                      className="form-control form-control-sm"
                      onChange={onChange}
                      minDate={new Date()}
                      selected={value}
                      placeholderText="Start Date"
                      error={!!errors.start_date}
                      helperText={errors.start_date?.message}
                    />
                  );
                }}
              ></Controller>
              <FormHelperText className="mandatory">
                {errors.start_date && errors.start_date?.message}
              </FormHelperText>
            </FormControl>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4}>
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_EXCEPTION_END}
            </label>
          </Col>

          <Col sm={8}>
            <FormControl size="small" fullWidth>
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
                      placeholderText="End Date"
                      error={!!errors.end_date}
                      helperText={errors.end_date?.message}
                    />
                  );
                }}
              ></Controller>
            </FormControl>
            <FormHelperText className="mandatory">
              {errors.end_date && errors.end_date?.message}
            </FormHelperText>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4}>
            <label className="col-form-label">{constants.TEXT_STATUS}</label>
          </Col>

          <Col sm={8}>
            <div className="input-group mb-3">
              <input
                type="text"
                disabled
                className="form-control"
                value={constants.TEXT_PENDING_APPROVAL}
              ></input>
            </div>
          </Col>
        </Row>
        <div className="d-grid gap-2 d-md-flex  justify-content-md-end button-sec">
          <button
            className="btn btn-primary px-4 btn-sm"
            onClick={(e) => handleCancel(e)}
          >
            {constants.TEXT_BUTTON_CANCEL}
          </button>
          <button
            className="btn btn-primary px-4 btn-sm"
            type="submit"
            disabled={assetScheduled}
          >
            {constants.TEXT_BUTTON_SUBMIT}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateException;
