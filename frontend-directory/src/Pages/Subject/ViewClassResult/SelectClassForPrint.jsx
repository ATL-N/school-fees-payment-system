import React, { useEffect, useState } from 'react'
import {useNavigate, useParams, Link} from "react-router-dom";
import axios from 'axios';
import {toast} from 'react-toastify';
// import './AddEditClass.css';
import { AddEditSubjectForm } from '../../../Components/Report/AddEditSubjectForm';


export const SelectClassForPrint = (props) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

    
  return (
    <div className='form-container'>
      < div className='group-title-div form-info'>select the the details to add marks</div>



      <div className='input-area-container div2'>
        
        <form action="" onSubmit={props.handleSubmit1} className='input-area-div div2 div3' >
          <div className='form-without-button-div div2'> 
          <div className='group-div'>

            <div className='form-input-div'>Class Name: 
              <select required defaultValue={''} name="classId" id="classId" className='form-input' 
              onChange={(e) => props.handleClassChange(e, props.clasResults)} 
              value={props.myFormData.classId}
              >
                <option value="" disabled >select class </option>
                {props.clasResults?.map((clas) => (
                  <option key={clas.id} value={clas.id}>{clas.classname}</option>
                ))}            
              </select>
            </div>

            <div className='form-input-div'>Number of columns: 
              <input type="number" 
              defaultValue={2}
              value={props.myFormData.numberOfColumns}
                name='numberOfColumns' 
                onChange={props.handleInputChange}
                placeholder="Enter the number Of Columns between 2000 and current year name here..." 
                className='form-input'
                max={12}
                min={1}
                required/>
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
