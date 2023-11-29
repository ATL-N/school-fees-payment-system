import React from "react";
import { Link } from "react-router-dom";

export const ClassListingPage = (props) => {
  return (
    <form onSubmit={props.handleSearch} className="search-container">
      <div className="search_main">
        number of Classes: {props.results.length}
      </div>

      <br />
      <div className="search-input-container-div">
        <input
          type="text"
          placeholder="Search for a class..."
          value={props.query}
          onChange={props.handleInputChange}
          onFocus={props.handleSearchBarFocus}
          onBlur={props.handleSearchBarBlur}
          className="search-input"
        />
        <div
          className={`custom-dropdown ${
            props.isSearchBarActive || props.query !== "" ? "open" : ""
          }`}
        >
          <Link
            className="link form-button submit-btn "
            style={{ color: "white" }}
            to={`/addClass`}
          >
            Add New Class
          </Link>

          <Link
            className="link form-button submit-btn "
            style={{ color: "white", marginLeft: "15px" }}
            to={`/printclasslist`}
          >
            Get class List
          </Link>

          <table className="student-table">
            <thead>
              <tr>
                <th>Class ID</th>
                <th>Class Name</th>
                <th>Class Teacher</th>
                <th>Class Population</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {props.results?.map((classes) => (
                <tr key={classes.id}>
                  <td>{classes.id}</td>
                  <td>{classes.classname}</td>
                  <td>{classes.classteacher}</td>
                  <td>{classes.classsize}</td>
                  <td>
                    {/* <Link to={`/viewClassDetails/${encodeURIComponent(classes.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>View</Link> */}
                    <Link
                      to={`/editClassDetails/${encodeURIComponent(classes.id)}`}
                      className="link-remove form-button nav-button next-btn submit-btn"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() =>
                        props.handleDelete(classes.id, classes.classname)
                      }
                      className="link-remove form-button clear-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <div>
        <input type="button" value="add a new student" className='search-button' />
      </div> */}
    </form>
  );
};
