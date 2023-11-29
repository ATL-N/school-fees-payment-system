import React from 'react';
import { Link } from 'react-router-dom';

 export const SubjectListingPage = (props) => {


  return (

    <form onSubmit={props.handleSearch} className='search-container'>
      <div className='search_main'>number of Subjects: {props.results.length}</div>

      <br />
      <div className='search-input-container-div'>
        <input
          type="text"
          placeholder="Search for a subjects by their names..."
          value={props.query}
          onChange={props.handleInputChange}
          onFocus={props.handleSearchBarFocus}
          onBlur={props.handleSearchBarBlur}
          className='search-input'
        />
        <div className={`custom-dropdown ${props.isSearchBarActive || props.query!==''? 'open' : ''}`}>
          <Link className='link form-button submit-btn ' style={{color:"white"}} to={`/addSubject`}>
            Add New Subject
          </Link>
          <table className="student-table">
            <thead>
              <tr>
                <th>Subject ID</th>
                <th>Subject Name</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {props.results?.map(subject => (
                <tr key={subject.id}>
                  <td>{subject.id}</td>
                  <td>{subject.subjectname}</td>
                  <td>
                    {/* <Link to={`/viewClassDetails/${encodeURIComponent(subject.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>View</Link> */}
                    <Link to={`/editSubjectDetails/${encodeURIComponent(subject.id)}`} className='link-remove form-button nav-button next-btn submit-btn'>Edit</Link>
                    <button onClick={() => props.handleDelete(subject.id, subject.subjectname)} className='link-remove form-button clear-btn'>Delete</button>
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

