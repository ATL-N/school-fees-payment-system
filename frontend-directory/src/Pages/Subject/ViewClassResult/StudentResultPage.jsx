import React from 'react'
import { Link } from 'react-router-dom';


export const StudentResultPage = (props) => {
console.log('props.academicYear', props.studentId, props.studentResult)
  

  return (
    <div className='form-container'>
      <form onSubmit={props.handleSearch} className='search-container' style={{marginTop:'0px'}}>
        <br />
        <label htmlFor=""style={{textTransform:'capitalize'}}>Name: {props.studentName} YEAR: {props.academicYear} term: {props.semester} total:{props.total} Position:{props.overallPosition}</label>
        <div className='search-input-container div3'>
        <Link style={{textDecoration:'none'}} className='form-button ' target="_blank" to={`/printStudentResult/${encodeURIComponent(props.studentId)}/${encodeURIComponent(props.classId)}/${encodeURIComponent(props.semester)}/${encodeURIComponent(props.academicYear)}/${encodeURIComponent(props.total)}/${encodeURIComponent(props.overallPosition)}`}>
        Print
      </Link>
          <div className={`custom-dropdown ${props.isSearchBarActive || props.query!=='' ? 'open' : ''}`}>
            
                <table>
                <thead>
                  <tr>
                    <th>SubjectName</th>
                    <th>ClassScore</th>
                    <th>ExamScore</th>
                    <th>Total Score</th>
                    <th>Grade</th>
                    <th>Position</th>
                  </tr>
                </thead>
                <tbody>
                  {props.studentResult?.map((studentGrade) => (
                    <tr key={studentGrade.id}>
                      <td>{studentGrade.subjectname}</td>
                      <td>{studentGrade.classscore}</td>
                      <td>{studentGrade.examscore}</td>
                      <td>{studentGrade.totalscore}</td>
                      <td>{studentGrade.gradename}</td>
                      <td>{studentGrade.studentposition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </div>
            
      </form>
    </div>
  )
}
