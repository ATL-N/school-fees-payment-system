import React, { useEffect } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { yupschema } from "../../Components/utils/utils";

export const AddEditSemesterForm = (props) => {
  console.log("props.semesterFormData", props.semesterFormData);

  useEffect(() => {
    if (props.id) {
      console.log("useEffect2468 running", props.classResults);
      console.log("545useEffect2", props.parent1, props.parent2);
      props.classResults?.map((semester) =>
        props.setClassFormData({
          ...props.semesterFormData,
          semesterName: semester.classname,
          dateStart: semester.classteacher,
          dateEnd: semester.feesforthetime,
          active: semester.classsize,
        })
      );
      // console.log(props.setClassFormData, props.setClassFormData)
    }
  }, [props.classResults]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupschema),
  });

  return (
    <div>
      <div className="group-title-div form-info">Add a new Term</div>

      <div className="input-area-container">
        <form
          action=""
          onSubmit={props.handleSubmit}
          className="input-area-div"
        >
          <div className="form-without-button-div">
            <div className="group-div">
              <div className="form-input-div">
                select Term:
                <select
                  required
                  defaultValue={""}
                  name="semesterName"
                  id="semesterName"
                  className="form-input"
                  onChange={props.handleInputChange}
                  value={props.semesterFormData.semesterName}
                >
                  <option value="" disabled>
                    select class from system
                  </option>
                  <option value="1">First term</option>
                  <option value="2">Second term</option>
                  <option value="3">Third term</option>
                </select>
              </div>

              <div className="form-input-div">
                Start date:
                <input
                  type="date"
                  value={props.semesterFormData.dateStart}
                  name="dateStart"
                  onChange={props.handleInputChange}
                  placeholder="Enter the pupils date of birth here...(optional)"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-input-div">
                End date:
                <input
                  type="date"
                  value={props.semesterFormData.dateEnd}
                  name="dateEnd"
                  onChange={props.handleInputChange}
                  placeholder="Enter the pupils date of birth here...(optional)"
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="nav-buttons">
            {props.semesterFormData && (
              <div className="clear-btn-div">
                <input
                  type="button"
                  value={"RESET"}
                  onClick={props.resetForm}
                  title="clear all fields"
                  className="form-button clear-btn"
                />
              </div>
            )}

            {props.id
              ? props.semesterFormData.semesterName && (
                  <input
                    type="submit"
                    value="Update"
                    title="upload the product"
                    className="form-button nav-button next-btn submit-btn"
                  />
                )
              : props.semesterFormData.semesterName && (
                  <input
                    type="submit"
                    value="Upload"
                    title="upload the product"
                    className="form-button nav-button next-btn submit-btn"
                  />
                )}
          </div>
        </form>
      </div>
    </div>
  );
};
