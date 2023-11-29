import React from 'react';
import { Link } from 'react-router-dom';

export const StaffListingPage = (props) => {

  return (

    <form onSubmit={props.handleSearch} className='search-container'>
    <div className='search_main'>number of Staff: {props.results.length}</div>
      <br />
      <div className='search-input-container-div'>
        <input
          type="text"
          placeholder="Search for a student..."
          value={props.query}
          onChange={props.handleInputChange}
          onFocus={props.handleSearchBarFocus}
          onBlur={props.handleSearchBarBlur}
          className='search-input'
        />
        <div className={`custom-dropdown ${props.isSearchBarActive || props.query!==''? 'open' : ''}`}>
          <Link className='link form-button submit-btn ' style={{color:"white"}} to={`/addStaff`}>
            Add New Staff
          </Link>
          <table className="student-table">
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Date Added</th>
                <th>Role</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {props.results.map(staff => (
                <tr key={staff.id}>
                  <td>{staff.id}</td>
                  <td>{staff.staffname}</td>
                  <td>{staff.gender}</td>
                  <td>{staff.dateadded}</td>
                  <td>{staff.role}</td>
                  <td>
                    <Link to={`/viewStaffDetails/${encodeURIComponent(staff.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>View</Link>
                    <Link to={`/editStaff/${encodeURIComponent(staff.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>Edit</Link>
                    <button onClick={() => props.handleDelete(staff.id, staff.staffname)} className='link-remove form-button clear-btn'>Delete</button>
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

