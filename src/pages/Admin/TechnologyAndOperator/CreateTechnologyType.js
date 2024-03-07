import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, FormHelperText, Autocomplete } from "@mui/material";
import { Row, Col } from "react-bootstrap";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  getTechnologyTypes,
  createTechnologyType,
} from "@store/admin/technologyTypes.duck";
import { getAllOrgGroups } from "@store/users.duck";
import SearchIcon from "@mui/icons-material/Search";
import { Loader } from "@utils/tools";
import { constants } from "@constants";

const CreateTechnologyType = ({ handleDialog }) => {
  const { init_data } = useSelector((state) => state.technologyTypes);
  const { allOrgGroups, groupsLoading } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const [formReset, setFormReset] = useState("");
  const [searchString, setSearchString] = useState("");

  const schema = yup
    .object({
      operator_group: yup
        .string()
        .required("Operator Group is a required field!"),
      technology_type: yup
        .string()
        .required("Technology Type is a required field!"),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      operator_group: init_data.operator_group,
      technology_type: init_data.technology_type,
    },
  });

  const onSubmit = (data) => {
    dispatch(createTechnologyType(data))
      .unwrap()
      .then(() => {
        setFormReset("successful");
        handleDialog();
        dispatch(getTechnologyTypes({}));
      });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    handleDialog();
  };

  useEffect(() => {
    // reset form
    reset(init_data);
  }, [formReset, init_data, reset]);

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
              {constants.TEXT_TECHNOLOGY_TYPE}
            </label>
          </Col>

          <Col sm={8} className="mb-3">
            <div className="input-group">
              <TextField
                hiddenLabel
                variant="outlined"
                placeholder="Technology Type"
                size="small"
                className="form-control"
                {...register("technology_type")}
                error={!!errors.technology_type}
              />
            </div>
            <FormHelperText className="mandatory">
              {errors.technology_type && errors.technology_type?.message}
            </FormHelperText>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={4}>
            <label className="col-form-label">
              <span className="mandatory asterisk">*</span>
              {constants.TEXT_OPERATOR_GROUP}
            </label>
          </Col>

          <Col sm={8} className="mb-3">
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
              <button className="btn btn-secondary btn-search" type="button">
                <SearchIcon />
              </button>
              {groupsLoading && <Loader />}
            </div>
            <FormHelperText className="mandatory">
              {errors.operator_group && errors.operator_group?.message}
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
            {constants.TEXT_BUTTON_SUBMIT}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateTechnologyType;
