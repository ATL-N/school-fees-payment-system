import React from 'react';
import { Link } from 'react-router-dom';

const StudentDetailsPage = (props) => {
  // Sample student details


  return (
    <div className='form-div' style={{marginTop:'50px'}}>
      <div className='page-info'>
      Student details
      </div>

      <div className="preview-div">
          {props.imageUrl?  <img src={props.imageUrl  } alt="Preview" className="img-preview-div"/> : <div className="img-preview-div" >load image to Preview</div>}
       </div>

      <div className='input-area-container'>
        <form className='input-area-div' style={{marginTop:'0px'}} >
          <div className='form-without-button-div'> 

          <div className='group-div group-div-max-height'>
            < div className='group-title-div'>Student details</div>


            <div className='form-input-div'>student Name: 
              <strong>{props.student.StudentName? props.student?.StudentName: 'na'}</strong>
            </div>

            <div className='form-input-div'>Date of Birth: 
                <strong>{props.student?.DateOfBirth}</strong>
            </div>

            <div className='form-input-div'>Gender: 
              <strong>{props.student?.Gender}</strong>
            </div>

            <div className='form-input-div'>student Class: 
              <strong>{props.student?.Class}</strong>
            </div>

            <div className='form-input-div'>Address: 
            <strong>{props.student?.Address}</strong>
          </div>

          </div>

          <div className='group-div group-div-max-height'>
          < div className='group-title-div'>FEES Details</div>

            <div className='form-input-div'>Current Balance: 
             <strong>{props.student?.AmountOwed}</strong>
            </div>
          </div>

          
        <div className='group-div group-div-max-height'>
          < div className='group-title-div'>First Parent Details</div>
            
            <div className='form-input-div'>Parent 1 Name: 
                <strong>{props.parent1.ParentName? props.parent1?.ParentName: 'N/A'}</strong>
            </div>

            <div className='form-input-div' >Parent 1 Tel: 
                <strong>{props.parent1.ContactNumber? props.parent1.ContactNumber: 'N/A'}</strong>
            </div>

            <div className='form-input-div' >Parent 1 Email: 
                <strong>{props.parent1.Email? props.parent1.Email: 'N/A'}</strong>
            </div>

            

            <div className='form-input-div'>Address: 
                <strong>{props.parent1?.ResidenceAddress? props.parent1.ResidenceAddress : 'N/A'}</strong>
            </div>


            <div className='form-input-div'>Relation to student: 
                <strong>{props.parent1Mapping?.RelationToWard ? props.parent1Mapping.RelationToWard : 'N/A'}</strong>
            </div>

        </div>

        <div className='group-div group-div-max-height'>
            < div className='group-title-div'>Second Parent Details</div>
                
            <div className='form-input-div'>Parent 2 Name: 
                <strong>{props.parent2?.ParentName ? props.parent2.ParentName : 'N/A'}</strong>
            </div>

            <div className='form-input-div' >Parent 2 Tel: 
                <strong>{props.parent2?.ContactNumber ? props.parent2?.ContactNumber : 'N/A'}</strong>
            </div>

            <div className='form-input-div' >Parent 2 Email: 
                <strong>{props.parent2.Email ? props.parent2.Email : 'N/A'}</strong>
            </div>

            <div className='form-input-div'>parent 2 Address: 
                <strong>{props.parent2?.ResidenceAddress ? props.parent2?.ResidenceAddress : 'N/A'}</strong>
            </div>

            <div className='form-input-div'>Relation to student: 
                <strong>{props.parent2Mapping?.RelationToWard ? props.parent2Mapping?.RelationToWard : 'N/A'}</strong>
            </div>

        </div>

        </div>
        <div className="nav-buttons">
            {props.student && 
            <div className="clear-btn-div"> 
                <input type="button" value={'Go Back'}  onClick={props.handleBack} title='clear all fields' className="form-button clear-btn"/>
            </div>}

            <Link to={`/makePayment/${encodeURIComponent(props.student.id)}`} className='link-remove form-button submit-btn'>RECEIVE FEES</Link>

            <Link to={`/editStudentDetails/${encodeURIComponent(props.student.id)}`} className='link-remove form-button submit-btn'>EDIT INFO</Link>


          </div>

        </form>
      </div>

    </div>
  )
};

export default StudentDetailsPage;
