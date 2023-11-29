import { Link } from "react-router-dom";

export const PrintClassListPage = (props) => {
  console.log("props.numberOfColumns", props.myFormData.numberOfColumns);

  const tableHeaders = Array.from(
    { length: props.myFormData.numberOfColumns },
    (_, index) => <th key={index}>header, {index + 1}</th>
  );

  const tableRows = Array.from(
    { length: props.myFormData.numberOfColumns },
    (_, index) => <td key={index}></td>
  );

  return (
    <>
      <div className="form-container">
        <div className="group-title-div form-info">
          current class({props.myFormData.className}) result for{" "}
          {props.myFormData.subjectName} in {props.myFormData.year} term,{" "}
          {props.myFormData.semester}
        </div>

        <form onSubmit={props.handleSearch} className="search-container">
          <div className="search-input-container div4">
            <input
              type="button"
              value={"BACK"}
              onClick={props.handleBack}
              title="clear all fields"
              className="form-button clear-btn"
            />
            <Link
              style={{ textDecoration: "none" }}
              className="form-button"
              target="_blank"
              to={`/printEmptyClassResult/${encodeURIComponent(
                props.myFormData.classId
              )}/${encodeURIComponent(
                props.myFormData.numberOfColumns)}/${encodeURIComponent(
                  props.myFormData.className)}
              `}
            >
              Print
            </Link>
            <div
              className={`custom-dropdown ${
                props.isSearchBarActive || props.query !== "" ? "open" : ""
              }`}
            >
              <table className="responsive_table">
                <thead>
                  <tr>
                  <th className="studentName_td">Student Name</th>
                  <th className="studentName_td">Student contact</th>
                    <th>{tableHeaders}</th>
                  </tr>
                </thead>
                <tbody>
                  {props.studentResults.map((result) => (
                    <tr key={result.studentid}>
                      <td>{result.studentname}</td>
                      <td>{result.contact}</td>
                      <td>{tableRows}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
