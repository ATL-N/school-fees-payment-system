import React from 'react'
import { Link } from 'react-router-dom';
import './SelectUserForm.css'

export const SelectUserForm = (props) => {

  return (
    <form onSubmit={props.handleSearch} className='search-container'>
      <div style={{  marginBottom: '10px'}} className='search_main'>To accept fees for a student, you have to click on the make payment against the student's name</div>
      <div className='search-input-container'>
        <input
          type="text"
          placeholder="Search for a student name or class..."
          value={props.query}
          onChange={props.handleInputChange}
          onFocus={props.handleSearchBarFocus}
          onBlur={props.handleSearchBarBlur}
          className='search-input'
        />
        <div className={`custom-dropdown ${props.isSearchBarActive || props.query!=='' ? 'open' : ''}`}>
          <Link className='link form-button submit-btn ' style={{color:"white"}} to={`/addStudent`}>
            Add New Student
          </Link>
              <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Balance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {props.results?.map((student) => (
                  <tr key={student.id}>
                    <td>{student.StudentName}</td>
                    <td>{student.ClassName}</td>
                    <td>{(-1 * student.AmountOwed).toLocaleString('en-GH', {
                        style: 'currency',
                        currency: 'GHS',
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      <Link className='link' to={`/makePayment/${encodeURIComponent(student.id)}`}>
                        Accept Payment
                      </Link>
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
  )
}
