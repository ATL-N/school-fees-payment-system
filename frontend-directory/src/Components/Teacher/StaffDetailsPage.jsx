import React from 'react';
import { Link } from 'react-router-dom';

const StaffDetailsPage = (props) => {
  // Sample staff details


  return (
    <div className='form-div' style={{marginTop:'50px'}}>
      <div className='page-info'>
      Add a new staff to the system page

        
      </div>

      <div className="preview-div">
          {props.imageUrl?  <img src={props.imageUrl  } alt="Preview" className="img-preview-div"/> : <div className="img-preview-div" >load image to Preview</div>}
       </div>

      <div className='input-area-container'>
        <form className='input-area-div' style={{marginTop:'0px'}} >
          <div className='form-without-button-div'> 

          <div className='group-div group-div-max-height'>
            < div className='group-title-div'>staff details</div>


            <div className='form-input-div'>staff Name: 
              <strong>{props.staff.StaffName? props.staff?.StaffName: 'na'}</strong>
            </div>

            <div className='form-input-div'>Date of Birth: 
                <strong>{props.staff?.DateOfBirth}</strong>
            </div>

            <div className='form-input-div'>contact Number: 
                <strong>{props.staff?.ContactNumber}</strong>
            </div>

            <div className='form-input-div'>Email: 
              <strong>{props.staff?.Email}</strong>
            </div>

            <div className='form-input-div'>Gender: 
              <strong>{props.staff?.Gender}</strong>
            </div>

            <div className='form-input-div'>Qualification: 
              <strong>{props.staff?.Qualification}</strong>
            </div>

            <div className='form-input-div'>Role/Duties/Dept.: 
              <strong>{props.staff?.Role}</strong>
            </div>

            <div className='form-input-div'>Address: 
              <strong>{props.staff?.Address}</strong>
            </div>


          </div>

        </div>
        <div className="nav-buttons">
            {props.staff && 
            <div className="clear-btn-div"> 
                <input type="button" value={'Go Back'}  onClick={props.handleBack} title='clear all fields' className="form-button clear-btn"/>
            </div>}

            <Link to={`/editStaff/${encodeURIComponent(props.staff.id)}`} className='link-remove form-button submit-btn'>EDIT INFO</Link>


          </div>

        </form>
      </div>

    </div>
  )
};

export default StaffDetailsPage;
