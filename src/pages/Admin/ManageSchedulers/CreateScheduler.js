import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, FormHelperText, Autocomplete } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Row, Col } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import {
  getSchedulerGroup,
  createSchedulerGroup,
  updateSchedulerGroup,
} from "@store/admin/manageScheduler.duck";
import { getAllOrgGroups } from "@store/users.duck";
import { Loader } from "@utils/tools";
import { constants } from "@constants";

const CreateScheduler = ({
  handleDialog,
  isModify,
  record: { id, scheduler_group } = { id: "", scheduler_group: "" },
}) => {
  const [formReset, setFormReset] = useState("");
  const { init_data, allProductTiers } = useSelector(
    (state) => state.manageSchedulers
  );
  const { allOrgGroups, groupsLoading } = useSelector((state) => state.users);

  const dispatch = useDispatch();

  const menuItemsTier1 = Object.keys(allProductTiers);
  const [menuItemsTier2, setMenuItemsTier2] = useState([]);
  const [menuItemsTier3, setMenuItemsTier3] = useState([]);
  const [searchString, setSearchString] = useState("");

  const onBlurTier1 = () => {
    const watchField = watch("product_tier1");
    if (watchField) {
      const tempArr = allProductTiers[watchField];
      const tier1Items = tempArr.map((item) => {
        return Object.keys(item)[0];
      });
      setMenuItemsTier2(tier1Items);
    }
  };

  const onBlurTier2 = () => {
    const watchField = watch("product_tier1");
    if (watchField) {
      const watchField2 = watch("product_tier2");
      const tier2Arr = allProductTiers[watchField];
      let tier3Item = [];
      tier2Arr.forEach((item) => {
        if (watchField2 in item) {
          tier3Item = item[watchField2];
        }
      });
      setMenuItemsTier3(tier3Item);
    }
  };

  const schema = yup
    .object({
      product_tier1: yup
        .string()
        .required("Product tier 1 is a required field!"),
      product_tier2: yup
        .string()
        .required("Product tier 2 is a required field!"),
      product_tier3: yup.string(),
      scheduler_group:
        !isModify &&
        yup.string().required("Scheduler group is a required field!"),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    if (isModify) {
      const formData = { data: { ...data, scheduler_group }, id };
      dispatch(updateSchedulerGroup(formData))
        .unwrap()
        .then(() => {
          setFormReset("successful");
          handleDialog();
          dispatch(getSchedulerGroup({}));
        });
    } else {
      dispatch(createSchedulerGroup(data))
        .unwrap()
        .then(() => {
          setFormReset("successful");
          handleDialog();
          dispatch(getSchedulerGroup({}));
        });
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    handleDialog();
  };

  useEffect(() => {
    // reset form
    !isModify
      ? reset(init_data)
      : reset({
          scheduler_group: scheduler_group,
        });
  }, [formReset, init_data, reset, isModify, scheduler_group]);

  useEffect(() => {
    //debounce method to fetch data after 5ms of delay in keystroke
    const getData = setTimeout(() => {
      if (searchString !== "") {
        dispatch(getAllOrgGroups(searchString));
      }
    }, 500);
    return () => clearTimeout(getData);
  }, [searchString, dispatch]);

  const debounceOrgGroups = (e) => {
    setSearchString(e.target.value);
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
              {constants.TEXT_PRODUCT_TIER_1}
            </label>
          </Col>

          <Col sm={8} className="mb-3">
            <div className="input-group">
              <Controller
                control={control}
                name="product_tier1"
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    freeSolo
                    options={menuItemsTier1.map((option) => option)}
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
                          onBlur={onBlurTier1}
                          placeholder={constants.TEXT_PRODUCT_TIER_1}
                          error={!!errors.product_tier1}
                        />
                      );
                    }}
                    onChange={(event, values, reason) => onChange(values)}
                    className="form-control autocomplete"
                  />
                )}
              />
              <button className="btn btn-secondary btn-search" disabled>
                <SearchIcon />
              </button>
            </div>
            <FormHelperText className="mandatory">
              {errors.product_tier1 && errors.product_tier1?.message}
            </FormHelperText>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4}>
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_PRODUCT_TIER_2}
            </label>
          </Col>

          <Col sm={8} className="mb-3">
            <div className="input-group">
              <Controller
                control={control}
                name="product_tier2"
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    freeSolo
                    options={menuItemsTier2.map((option) => option)}
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
                          onBlur={onBlurTier2}
                          placeholder={constants.TEXT_PRODUCT_TIER_2}
                          error={!!errors.product_tier2}
                        />
                      );
                    }}
                    onChange={(event, values, reason) => onChange(values)}
                    className="form-control autocomplete"
                  />
                )}
              />
              <button className="btn btn-secondary btn-search" disabled>
                <SearchIcon />
              </button>
            </div>
            <FormHelperText className="mandatory">
              {errors.product_tier2 && errors.product_tier2?.message}
            </FormHelperText>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4}>
            <label className="col-form-label">
              {constants.TEXT_PRODUCT_TIER_3}
            </label>
          </Col>

          <Col sm={8} className="mb-3">
            <div className="input-group">
              <Controller
                control={control}
                name="product_tier3"
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    freeSolo
                    options={menuItemsTier3.map((option) => option)}
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
                          // onBlur={onBlurTier3}
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
                disabled
              >
                <SearchIcon />
              </button>
            </div>
            <FormHelperText className="mandatory">
              {errors.product_tier3 && errors.product_tier3?.message}
            </FormHelperText>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4}>
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_SCHEDULER_GROUP}
            </label>
          </Col>

          <Col sm={8} className="mb-3">
            {isModify ? (
              <div className="input-group">
                <input
                  type="text"
                  disabled
                  className="form-control"
                  value={scheduler_group}
                  {...register("scheduler_group")}
                ></input>
              </div>
            ) : (
              <>
                <div className="input-group">
                  <Controller
                    control={control}
                    name="scheduler_group"
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        freeSolo
                        options={allOrgGroups.map((option) => option)}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              InputProps={{
                                ...params.InputProps,
                                type: "search",
                              }}
                              onChange={(e) => {
                                onChange(e);
                                debounceOrgGroups(e);
                              }}
                              size="small"
                              className="form-control"
                              hiddenLabel
                              placeholder={constants.TEXT_SCHEDULER_GROUP}
                              error={!!errors.scheduler_group}
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
                  {groupsLoading && <Loader />}
                </div>
                <FormHelperText className="mandatory">
                  {errors.scheduler_group && errors.scheduler_group?.message}
                </FormHelperText>
              </>
            )}
          </Col>
        </Row>
        <div className="d-grid gap-2 d-md-flex  justify-content-md-end button-sec">
          <button
            className="btn btn-primary px-4 btn-sm"
            onClick={(e) => handleCancel(e)}
          >
            {constants.TEXT_BUTTON_CANCEL}
          </button>
          <button className="btn btn-primary px-4 btn-sm" type="submit">
            {isModify
              ? constants.TEXT_BUTTON_MODIFY
              : constants.TEXT_BUTTON_SUBMIT}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateScheduler;
