import React from 'react';
import { Link } from 'react-router-dom';
// import './StudentListingPage.css';

const FeeListingPage = (props) => {
  // Sample student data
  const students = [
    { id: 1, firstName: 'John', lastName: 'Doe', dateOfBirth: '1998-05-15', parentName: 'Parent A', studentClass: 'Class A' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', dateOfBirth: '1999-03-22', parentName: 'Parent B', studentClass: 'Class B' },
    // Add more student data as needed
  ];

  return (

    <form onSubmit={props.handleSearch} className='search-container'>
      <div className='search_main'>current Active students</div>
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
          <Link className='link form-button submit-btn ' style={{color:"white"}} to={`/makePayment/${encodeURIComponent()}`}>
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
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {props.results.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.StudentName}</td>
                  <td>Ghc {student.AmountOwed}</td>
                  <td>{student.DateOfBirth}</td>
                  <td>{student.Class}</td>
                  <td>
                    <Link to={`/viewStudentDetails/${encodeURIComponent(student.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>View</Link>
                    <Link to='/editStudentDetails' className='link-remove form-button nav-button next-btn submit-btn'>Edit</Link>
                    <Link to='/deleteStudent' className='link-remove form-button clear-btn' >Delete</Link>
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

export default FeeListingPage;
