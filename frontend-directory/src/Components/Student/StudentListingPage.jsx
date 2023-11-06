import React from 'react';
import { Link } from 'react-router-dom';

const StudentListingPage = (props) => {


  return (

    <form onSubmit={props.handleSearch} className='search-container'>
      <div className='search_main'>number of Student found: {props.results.length}</div>
      <br />
      <div className='search-input-container-div'>
        <input
          type="text"
          placeholder="Search for a studentName or class..."
          value={props.query}
          onChange={props.handleInputChange}
          onFocus={props.handleSearchBarFocus}
          onBlur={props.handleSearchBarBlur}
          className='search-input'
        />
        <div className={`custom-dropdown ${props.isSearchBarActive || props.query!==''? 'open' : ''}`}>
          <Link className='link form-button submit-btn ' style={{color:"white"}} to={`/addStudent`}>
            Add New Student
          </Link>

          <table className="student-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>current Balance(Ghc)</th>
                <th>Date of Birth</th>
                <th>Class</th>
                <th>Date Added</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {props.results.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.StudentName}</td>
                  <td>
                      {student.AmountOwed != null ? (
                        (-1 * student.AmountOwed).toLocaleString('en-GH', {
                          style: 'currency',
                          currency: 'GHS',
                          minimumFractionDigits: 2,
                        })
                      ) : (
                        ''
                      )}
                    </td>                  
                    <td>{student.DateOfBirth}</td>
                  <td>{student.ClassName}</td>
                  <td>{student.DateAdded}</td>
                  <td>
                    <Link to={`/viewStudentDetails/${encodeURIComponent(student.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>View</Link>
                    <Link to={`/editStudentDetails/${encodeURIComponent(student.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>Edit</Link>
                    <Link to={`/viewPaymentsHistory/${encodeURIComponent(student.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>Payments</Link>
                    <button onClick={() => props.handleDelete(student.id)} className='link-remove form-button clear-btn'>Delete</button>
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

export default StudentListingPage;
