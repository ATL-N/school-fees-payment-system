import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import './AddEditClass.css';
import { AddEditSubjectForm } from "../../../Components/Report/AddEditSubjectForm";

export const SelectSubject = (props) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  return (
    <div className="form-container">
      <div className="group-title-div form-info">
        select the the details to add marks
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
                subject name:
                <select
                  required
                  defaultValue={""}
                  name="subjectId"
                  id="subjectId"
                  className="form-input"
                  onChange={(e) =>
                    props.handleSubjectChange(e, props.subjectResults)
                  }
                  value={props.myFormData.subjectId}
                >
                  <option value="" disabled>
                    select subject from system
                  </option>
                  {props.subjectResults?.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.subjectname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-input-div">
                subject Teacher:
                <select
                  required
                  defaultValue={""}
                  name="staffId"
                  id="staffId"
                  className="form-input"
                  onChange={(e) =>
                    props.handleInputChange(e, props.staffResults)
                  }
                  value={props.myFormData.staffId}
                >
                  <option value="" disabled>
                    select Teacher from system
                  </option>
                  {props.staffResults?.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.staffname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-input-div">
                Class name:
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
                Year:
                <input
                  type="number"
                  value={props.myFormData.year}
                  name="year"
                  onChange={props.handleInputChange}
                  placeholder="Enter the year between 2000 and current year name here..."
                  className="form-input"
                  max={parseInt(year)}
                  min={2000}
                  required
                />
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

            {props.id ? (
              <input
                type="submit"
                value="Update"
                title="upload the product"
                className="form-button nav-button next-btn submit-btn"
              />
            ) : (
              <input
                type="submit"
                value="Continue"
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
