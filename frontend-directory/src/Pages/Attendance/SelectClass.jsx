import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const SelectClass = (props) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  return (
    <div className="form-container">
      <div className="group-title-div form-info">
        select the the details to take attendance
      </div>

      <div className="input-area-container div2">
        <form
          action=""
          onSubmit={props.handleSubmit1}
          className="input-area-div div2 div3"
        >
          <div className="form-without-button-div div2">
            <div className="group-div">
              <div className="form-input-div">
                Class Name:
                <select
                  required
                  defaultValue={""}
                  name="classId"
                  id="classId"
                  className="form-input"
                  onChange={(e) =>
                    props.handleClassChange(e, props.clasResults)
                  }
                  value={props.myFormData.classId}
                >
                  <option value="" disabled>
                    select class from system
                  </option>
                  {props.clasResults?.map((clas) => (
                    <option key={clas.id} value={clas.id}>
                      {clas.classname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-input-div">
                Current Term:
                <input
                  type="number"
                  value={props.myFormData.semester}
                  onChange={props.handleInputChange}
                  name="semester"
                  className="form-input"
                  required
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="nav-buttons">
            {props.myFormData && (
              <div className="clear-btn-div">
                <input
                  type="button"
                  value={"BACK"}
                  onClick={props.goback}
                  title="clear all fields"
                  className="form-button clear-btn"
                />
              </div>
            )}

            {props.id
              ? props.myFormData.classId && (
                  <input
                    type="submit"
                    value="Update"
                    title="upload the product"
                    className="form-button nav-button next-btn submit-btn"
                  />
                )
              : props.myFormData.classId && (
                  <input
                    type="submit"
                    value="SELECT"
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
