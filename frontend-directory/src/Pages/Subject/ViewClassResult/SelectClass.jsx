import React, { useEffect, useState } from 'react'
import {useNavigate, useParams, Link} from "react-router-dom";
import axios from 'axios';
import {toast} from 'react-toastify';
// import './AddEditClass.css';
import { AddEditSubjectForm } from '../../../Components/Report/AddEditSubjectForm';


export const SelectClass = (props) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

    
  return (
    <div className='form-container'>
      < div className='group-title-div form-info'>select the the details to add marks</div>



      <div className='input-area-container div2'>
        
        <form action="" onSubmit={props.handleSubmit1} className='input-area-div div2 div3' >
          <div className='form-without-button-div div2'> 
          <div className='group-div'>

            <div className='form-input-div'>select Class: 
              <select required defaultValue={''} name="classId" id="classId" className='form-input' 
              onChange={(e) => props.handleClassChange(e, props.clasResults)} 
              value={props.myFormData.classId}
              >
                <option value="" disabled >select class from system</option>
                {props.clasResults?.map((clas) => (
                  <option key={clas.id} value={clas.id}>{clas.classname}</option>
                ))}            
              </select>
            </div>

            <div className='form-input-div'>Year: 
              <input type="number" 
                value={props.myFormData.year} 
                name='year' 
                onChange={props.handleInputChange}
                placeholder="Enter the year between 2000 and current year name here..." 
                className='form-input'
                max={parseInt(year)}
                min={2000}
                required/>
            </div>


            <div className='form-input-div'>select Term: 
              <select required defaultValue={''} name="semester" id="semester" className='form-input' 
              onChange={(e) => props.handleInputChange(e, props.clasResults)} 
              value={props.myFormData.semester}
              >
                <option value="" disabled >select class from system</option>
                <option value={1} >First term</option>
                <option value={2} >Second term</option>
                <option value={3} >Third term</option>
                           
              </select>
            </div>

          </div>          

          </div>

          <div className="nav-buttons">
            {props.myFormData && 
            <div className="clear-btn-div"> 
              <input type="button" value={'BACK'}  onClick={props.goback} title='clear all fields' className="form-button clear-btn"/>
            </div>}

              {props.id? props.myFormData.classId && <input type="submit" value="Update"  title="upload the product"  className="form-button nav-button next-btn submit-btn"/> : props.myFormData.classId && <input type="submit" value="SELECT"  title="upload the product"  className="form-button nav-button next-btn submit-btn"/>}
          </div>

        </form>
      </div>


    </div>
        
  )
}
