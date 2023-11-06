import { Link } from 'react-router-dom';



export const ClassResultPage = (props) => {
  console.log('props.classGradeResult', props.classGradeResult)

  return (
    <>
    <div className='form-container'>
        < div className='group-title-div form-info'>current class({props.myFormData.className}) result for {props.myFormData.subjectName} in {props.myFormData.year} term, {props.myFormData.semester}</div>

      <form onSubmit={props.handleSearch} className='search-container'>
      {/* <label htmlFor=""></label> */}
      <div className='search-input-container div4'>
      <input type="button" value={'BACK'}  onClick={props.handleBack} title='clear all fields' className="form-button clear-btn"/>
      <Link style={{textDecoration:'none'}} className='form-button' target="_blank" to={`/printClassResult/${encodeURIComponent(props.myFormData.classId)}/${encodeURIComponent(props.myFormData.semester)}/${encodeURIComponent(props.myFormData.year)}/${encodeURIComponent(props.myFormData.className)}`}>
        Print
      </Link>
        <div className={`custom-dropdown ${props.isSearchBarActive || props.query!=='' ? 'open' : ''}`}>
          
              <table>
              <thead>
              <tr>
                <th>Student Name</th>

                {props.distinctSubjects.map((subject) => (
                <th key={subject}>{subject}</th>
                ))}

              <th>Total Score</th>
              <th>Position</th>
              <th>Action</th>

              </tr>
              </thead>
              <tbody>
                {props.classGradeResult.map((result) => (
                  <tr key={result.StudentID}>
                    <td>{result.StudentName}</td>
                    {props.distinctSubjects.map((subject) => (
                      <td key={subject}>{result[subject]}</td>
                    ))}
                    <td>{result.total}</td>
                    <td>{result.position}</td>
                    <td>
                      <Link style={{textDecoration:'none'}} className='form-button' target="" to={`/viewStudentResult/${encodeURIComponent(result.StudentID)}/${encodeURIComponent(props.myFormData.classId)}/${encodeURIComponent(props.myFormData.semester)}/${encodeURIComponent(props.myFormData.year)}/${encodeURIComponent(result.total)}/${encodeURIComponent(result.position)}`}>
                        View Results
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
      
    </form>
</div>



</>

  )
}
