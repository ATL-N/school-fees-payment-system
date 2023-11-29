import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const EnterMarks = (props) => {
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
          <div className="form-without-button-div" style={{maxHeight:'45vh'}}>
            <div
              className={`custom-dropdown ${
                props.isSearchBarActive || props.query !== "" ? "open" : ""
              }`}
            >
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class Score(50)</th>
                    <th>Exams Score(50)</th>
                    <th>Total Score(100)</th>
                  </tr>
                </thead>
                <tbody>
                  {props.studentResults?.map((student) => (
                    <tr key={student.id}>
                      <td>{student.studentname}</td>
                      <td>
                        <input
                          type="number"
                          value={props.scores[student.id]?.classCore || ""}
                          onChange={(e) =>
                            props.handleSCoreChange(student.id, student.studentname, 'classCore', e.target.value)
                          }
                          className="form-input"
                          style={{border:'1px solid gray'}}
                          name="classCore"
                          min={0}
                          max={50}

                        />
                      </td>
                      <td>
                      <input
                          type="number"
                          value={props.scores[student.id]?.examsCore || ""}
                          onChange={(e) =>
                            props.handleSCoreChange(student.id, student.studentname, 'examsCore', e.target.value)
                          }
                          className="form-input"
                          style={{border:'1px solid gray'}}
                          name="examsCore"
                          min={0}
                          max={50}

                        />
                        </td>
                      <td>
                      <input
                          type="number"
                          value={props.scores[student.id]?.totalScore || ""}
                          className="form-input"
                          // style={{border:'1px solid gray'}}
                          onChange={props.handleInputChange}
                          min={0}
                          max={50}
                          readOnly
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
                {/* <input onClick={props.resetForm} title="clear all fields" className="form-button clear-btn">Reset</input> */}
              </div>
            )}

            <input
              type="submit"
              value="Submit Marks"
              title="upload the product"
              className="form-button nav-button next-btn submit-btn"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
