import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import { Row, Col } from "react-bootstrap";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  getOperatorGroup,
  createOperatorGroup,
  updateOperatorGroup,
} from "@store/admin/operatorGroup.duck";
import { getAllOrgGroups } from "@store/users.duck";
import SearchIcon from "@mui/icons-material/Search";
import { Loader } from "@utils/tools";
import { constants } from "@constants";

const CreateOperatorGroup = ({
  handleDialog,
  isModify = false,
  modifyRecord: { id, operator_group, technology_type },
  setisModify,
}) => {
  const { technologyTypes } = useSelector((state) => state.technologyTypes);
  const { init_data } = useSelector((state) => state.operatorGroup);
  const { allOrgGroups, groupsLoading } = useSelector((state) => state.users);

  const dispatch = useDispatch();
  const [formReset, setFormReset] = useState("");
  const [searchString, setSearchString] = useState("");

  const schema = yup
    .object({
      operator_group:
        !isModify &&
        yup.string().required("Operator Group is a required field!"),
      technology_type: yup
        .string()
        .required("Technology Type is a required field!"),
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
  });

  const onSubmit = (data) => {
    if (isModify) {
      const formData = { data: { ...data, operator_group }, id };
      dispatch(updateOperatorGroup(formData))
        .unwrap()
        .then(() => {
          setisModify(false);
          handleDialog();
          dispatch(getOperatorGroup({}));
        });
    } else {
      dispatch(createOperatorGroup(data))
        .unwrap()
        .then(() => {
          setFormReset("successful");
          setisModify(false);
          handleDialog();
          dispatch(getOperatorGroup({}));
        });
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setisModify(false);
    handleDialog();
  };

  useEffect(() => {
    // reset form
    !isModify
      ? reset(init_data)
      : reset({
          technology_type: technology_type.toLowerCase(),
        });
  }, [formReset, init_data, reset, isModify, technology_type]);

  useEffect(() => {
    //debounce method to fetch data after 500ms of delay in keystroke
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
              {constants.TEXT_OPERATOR_GROUP}
            </label>
          </Col>

          <Col sm={8} className="mb-3">
            {isModify ? (
              <div className="input-group">
                <input
                  type="text"
                  disabled
                  className="form-control"
                  value={operator_group}
                  {...register("operator_group")}
                ></input>
              </div>
            ) : (
              <>
                <div className="input-group">
                  <Controller
                    control={control}
                    name="operator_group"
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
                              placeholder={constants.TEXT_OPERATOR_GROUP}
                              error={!!errors.operator_group}
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
                  {errors.operator_group && errors.operator_group?.message}
                </FormHelperText>
              </>
            )}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4}>
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_TECHNOLOGY_TYPE}
            </label>
          </Col>

          <Col sm={8} className="mb-3">
            <div className="input-group">
              <FormControl size="small" fullWidth>
                <Controller
                  render={({ field }) => (
                    <Select
                      {...field}
                      {...register("technology_type")}
                      error={!!errors.technology_type}
                    >
                      <MenuItem value="">
                        <em>Select Value</em>
                      </MenuItem>
                      {technologyTypes.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  control={control}
                  name="technology_type"
                  defaultValue=""
                />
              </FormControl>
            </div>
            <FormHelperText className="mandatory">
              {errors.technology_type && errors.technology_type?.message}
            </FormHelperText>
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

export default CreateOperatorGroup;
