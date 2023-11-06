import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';



export const EnterMarks = (props) => {

    

  return (
    <div className='form-container'>
        < div className='group-title-div form-info'>Add a new marks and view result</div>



      <div className='input-area-container div2'>
        
        <form action="" onSubmit={props.handleSubmit} className='input-area-div div2 div3' >
          <div className='form-without-button-div div2'> 
          <div className='group-div'>

            <div className='form-input-div'>Subject Name: 
              <strong>{props.myFormData.subjectName}</strong>
            </div>

            <div className='form-input-div'>Class Name: 
              <strong>{props.myFormData.className}</strong>
            </div>


            <div className='form-input-div'>select Student: 
              <select defaultValue='' name="studentId" id="studentId" className='form-input' 
              onChange={(e) => props.handleStudentChange(e, props.studentResults)} 
              value={props.myFormData ? props.myFormData.studentId : ""}
              >
                <option value="" disabled >select student from system</option>
                {props.studentResults?.map((student) => (
                  <option key={student.id} value={student.id}>{student.StudentName}</option>
                ))}            
              </select>
            </div>

            <div className='form-input-div'>class Score: 
              <input type="number" 
                value={props.myFormData.classCore} 
                name='classCore' 
                onChange={props.handleInputChange}
                placeholder="Enter the class sCore min 0 max 50 here..." 
                className='form-input'
                max={50}
                min={0}/>
            </div>

            <div className='form-input-div'>Exam Score: 
              <input type="number" 
                value={props.myFormData.examScore} 
                name='examScore' 
                onChange={props.handleInputChange}
                placeholder="Enter the class sCore min 0 max 50 here..." 
                className='form-input'
                max={50}
                min={0}/>
            </div>

            <div className='form-input-div'>Total Score: 
              <input type="number" 
                value={props.myFormData.totalScore} 
                name='totalScore' 
                onChange={props.handleInputChange}
                placeholder="Enter the class sCore min 0 max 100 here..." 
                className='form-input'
                max={100}
                min={0}
                readOnly/>
            </div>

          </div>          

          </div>

          <div className="nav-buttons">
            {props.myFormData && 
            <div className="clear-btn-div"> 
              <input type="button" value={'BACK'}  onClick={props.handleBack} title='clear all fields' className="form-button clear-btn"/>
                {/* <input onClick={props.resetForm} title="clear all fields" className="form-button clear-btn">Reset</input> */}
            </div>}

              {props.id? props.myFormData.subjectName && <input type="submit" value="Update"  title="upload the product"  className="form-button nav-button next-btn submit-btn"/> : props.myFormData.subjectName && <input type="submit" value="Add Mark"  title="upload the product"  className="form-button nav-button next-btn submit-btn"/>}
          </div>

        </form>
      </div>


      <form onSubmit={props.handleSearch} className='search-container'>
      <label htmlFor="">current class({props.myFormData.className}) result for {props.myFormData.subjectName} in {props.myFormData.year} term, {props.myFormData.semester}</label>
      <br />
      <div className='search-input-container div3'>
        {/* <input
          type="text"
          placeholder="Search for a student..."
          value={props.query}
          onChange={props.handleInputChange}
          onFocus={props.handleSearchBarFocus}
          onBlur={props.handleSearchBarBlur}
          className='search-input'
        /> */}
        <div className={`custom-dropdown ${props.isSearchBarActive || props.query!=='' ? 'open' : ''}`}>
          
              <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Year</th>
                  <th>Exams</th>
                  <th>Total Score</th>
                  <th>Position</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {props.studentGradeResults?.map((studentGrade) => (
                  <tr key={studentGrade.id}>
                    <td>{studentGrade.StudentName}</td>
                    <td>{studentGrade.SubjectName}</td>
                    <td>{studentGrade.AcademicYear}</td>
                    <td>{studentGrade.ExamScore}</td>
                    <td>{studentGrade.TotalScore}</td>
                    <td>{studentGrade.position}</td>
                    <td>
                      <Link className='link' to={`/deleteResult/${encodeURIComponent(studentGrade.id)}`}>
                        Delete
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

</div>
        
  )
}
