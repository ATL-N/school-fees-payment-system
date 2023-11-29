import React from 'react'
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import { yupschema } from '../utils/utils';
import { useEffect } from 'react';
export const AddEditStaffForm = (props) => {

  useEffect(()=>{

    if(props.id){
      console.log('useEffect2468 running', props.staffResults)
      console.log('545useEffect2', props.parent1, props.parent2)
      props.staffResults.map((staff)=>(
        props.setStaffFormData({
          ...props.staffFormData,
          staffId: props.id,
          image: staff.image,
          staffName: staff.staffname,
          dateOfBirth: staff.dateofbirth,
          contactNumber: staff.contactnumber,
          email: staff.email,
          gender: staff.gender,
          qualification: staff.qualification,
          role: staff.role,
          address: staff.address,
          salary: staff.salary
        })

        ))   
        // console.log(props.setStaffFormData, props.setStaffFormData)   
    }
  }, [props.staffResults])

    const {register, handleSubmit, formState: {errors} } = useForm({
        resolver:yupResolver(yupschema)
    });

    
    


  return (
    <div className='form-div'>
      <div className='page-info'>
        Add a new staff to the system page
      </div>

      <div className="preview-div">
          {props.selectedImage?  <img src={props.selectedImage  } alt="Preview" className="img-preview-div"/> : <div className="img-preview-div" >load image to Preview</div>}
       </div>

      <div className='input-area-container'>
        <form action="" onSubmit={props.handleSubmit} className='input-area-div' style={{marginTop:'0px'}}>
          <div className='form-without-button-div'> 
          <div className='group-div'>

            {!props.id && <div className='form-input-div'> Picture: 
              <input type="file" 
                accept="image/jpeg, image/png" 
                name='image' 
                onChange={props.handleInputChange} 
                className='form-input' />
            </div>
            }

            <div className='form-input-div'>Staff Name: 
              <input type="text" 
                value={props.staffFormData.staffName} 
                name='staffName' 
                onChange={props.handleInputChange}
                placeholder="Enter the staff name here..." 
                className='form-input'
                // readOnly={props.id !== null || props.id!==''||props.id !== undefined}
                />
            </div>

            <div className='form-input-div'>Date of Birth: 
              <input type="date" 
                value={props.staffFormData.dateOfBirth} 
                name='dateOfBirth' 
                onChange={props.handleInputChange}
                placeholder="Enter the pupils date of birth here...(optional)"  
                className='form-input'/>
            </div>

            <div className='form-input-div'>Contact Number: 
              <input type="text" 
                value={props.staffFormData.contactNumber} 
                name='contactNumber' 
                onChange={props.handleInputChange} 
                placeholder="Enter the tel number here..." 
                className='form-input'/>
            </div>

            <div className='form-input-div'>Email: 
              <input type="email" 
                value={props.staffFormData.email} 
                name='email' onChange={props.handleInputChange}
                placeholder="Enter the email here..."  
                className='form-input'/>
            </div>

            <div className='form-input-div'>Gender: 
              <select name="gender" id="gender" className='form-input' placeholder='select gender' onChange={props.handleInputChange} value={props.staffFormData.gender}>
                <option value="" disabled selected>select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className='form-input-div'>Qualifications: 
              <input type="text" 
                value={props.staffFormData.qualification} 
                name='qualification' onChange={props.handleInputChange}
                placeholder="Enter the qualifications name here..."  
                className='form-input'/>
            </div>

            <div className='form-input-div'>Role/Duties/Dept.: 
              <input type="text" 
                value={props.staffFormData.role} 
                name='role' onChange={props.handleInputChange} 
                placeholder="Enter the department here..." 
                className='form-input'/>
            </div>

            <div className='form-input-div'>Salary: 
              <input type="number" 
                value={props.staffFormData.salary} 
                name='salary' onChange={props.handleInputChange} 
                placeholder="Enter the salary here..." 
                className='form-input'/>
            </div>

            <div className='form-input-div'>Address: 
              <textarea name="address" 
                id="address" 
                value={props.staffFormData.address}
                placeholder="Enter the pupil's residencetial address here..." 
                onChange={props.handleInputChange}
                cols="30" 
                rows="10"
                >
              </textarea>
            </div>
          </div>

          </div>

          <div className="nav-buttons">
            {props.staffFormData && 
            <div className="clear-btn-div"> 
              <input type="button" value={'RESET'}  onClick={props.resetForm} title='clear all fields' className="form-button clear-btn"/>
                {/* <input onClick={props.resetForm} title="clear all fields" className="form-button clear-btn">Reset</input> */}
            </div>}

            {props.selectedImage && <input type="submit" value={props.id? 'Update' : 'ADD STAFF'}  title="upload the product"  className="form-button nav-button next-btn submit-btn"/>}
          </div>

        </form>
      </div>

    </div>
  
  )
}
