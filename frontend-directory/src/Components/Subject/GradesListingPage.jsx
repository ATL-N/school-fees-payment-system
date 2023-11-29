import React from 'react';
import { Link } from 'react-router-dom';

 export const GradesListingPage = (props) => {


  return (

    <form onSubmit={props.handleSearch} className='search-container'>
      <div className='search_main'>number of Subjects: {props.results?.length}</div>

      <br />
      <div className='search-input-container-div'>
        {/* <input
          type="text"
          placeholder="Search for a grade..."
          value={props.query}
          onChange={props.handleInputChange}
          onFocus={props.handleSearchBarFocus}
          onBlur={props.handleSearchBarBlur}
          className='search-input'
        /> */}
        <div className={`custom-dropdown ${props.isSearchBarActive || props.query!==''? 'open' : ''}`}>
          <Link className='link form-button submit-btn ' style={{color:"white"}} to={`/addGrades`}>
            Add New Grade
          </Link>
          <table className="student-table">
            <thead>
              <tr>
                <th>grade ID</th>
                <th>grade Name</th>
                <th>min grade point</th>
                <th>max grade point</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {props.results?.map(grade => (
                <tr key={grade.id}>
                  <td>{grade.id}</td>
                  <td>{grade.gradename}</td>
                  <td>{grade.mingrade}</td>
                  <td>{grade.maxgrade}</td>
                  <td>
                    {/* <Link to={`/viewClassDetails/${encodeURIComponent(grade.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>View</Link> */}
                    <Link to={`/editGradeDetails/${encodeURIComponent(grade.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>Edit</Link>
                    <button onClick={() => props.handleDelete(grade.id, grade.GradeName)} className='link-remove form-button clear-btn'>Delete</button>
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

