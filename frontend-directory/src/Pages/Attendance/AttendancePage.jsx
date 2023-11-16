import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const AttendancePage = (props) => {
  return (
    <div className="form-container">
      <div className="group-title-div form-info">
        current class({props.myFormData.className}) result for{" "}
        {props.myFormData.subjectName} in {props.myFormData.year} term,{" "}
        {props.myFormData.semester}
      </div>

      <div className="input-area-container">
        <form
          action=""
          onSubmit={props.handleSubmit}
          className="input-area-div div3"
        >
          <div
            className="form-without-button-div"
            style={{ maxHeight: "45vh" }}
          >
            <div
              className={`custom-dropdown ${
                props.isSearchBarActive || props.query !== "" ? "open" : ""
              }`}
            >
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Abscent</th>
                    <th>Present</th>
                  </tr>
                </thead>
                <tbody>
                  {props.studentResults?.map((student) => (
                    <tr key={student.id}>
                      <td>{student.StudentName}</td>
                      <td>
                        <input
                          type="radio"
                          value={'Abscent'}
                          onChange={(e) =>
                            props.handleAttendanceChange(student.id, student.StudentName, 'status', e.target.value)
                          }
                          className="radio-btn"
                          name={student.id + "attendance"}
                          min={0}
                          max={50}
                        />
                      </td>

                      <td>
                        <input
                          type="radio"
                          value={'Present'}
                          onChange={(e) =>
                            props.handleAttendanceChange(student.id, student.StudentName, 'status', e.target.value)
                          }
                          className="radio-btn"
                          name={student.id + "attendance"}
                          min={0}
                          max={50}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="nav-buttons">
            {props.myFormData && (
              <div className="clear-btn-div">
                <input
                  type="button"
                  value={"BACK"}
                  onClick={props.handleBack}
                  title="clear all fields"
                  className="form-button clear-btn"
                />
              </div>
            )}

            <input
              type="submit"
              value="Submit"
              title="upload the product"
              className="form-button nav-button next-btn submit-btn"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
