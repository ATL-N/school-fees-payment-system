import React, { useEffect } from 'react'
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import { yupschema } from '../utils/utils';


export const AddEditStudentForm = (props) => {

  const formtDate = (postgresDate) => {
    const datePart = postgresDate.split("T")[0];
    const parts = datePart.split("-");
    const formattedDate = `${parts[1]}-${parts[2]}-${parts[0]}`;
    console.log('formattedDate', datePart, formattedDate)
    return formattedDate
  }

  useEffect(()=>{
    if(props.id){
      console.log('useEffect2468 running', props.studentResults)
      console.log('545useEffect2', props.parent1, props.parent2)
      props.studentResults?.map((student)=>(
        props.setStudentFormData({
          ...props.studentFormData,
          stuId: props.id,
          image: student.image,
          studentName: student.studentname,
          studentClass: student.classname,
          classid: student.classid,
          amountOwed: student.amountowed,
          dateOfBirth: student.dateofbirth,
          gender: student.gender,
          address: student.address,
          parentMId: props.parent1.id,
          customParentNameM: props.parent1.parentname,
          customParentNameMTel: props.parent1.contactnumber,
          customParentNameMMail: props.parent1.email,
          parentNameMAddress: props.parent1.residenceaddress,
          customParentNameMRelation: props.parent1Mapping.relationtoward,
          parentSId: props.parent2.id,
          custompPrentNameS: props.parent2.parentname,
          customParentNameSTel: props.parent2.contactnumber,
          customParentNameSMail: props.parent2.email,
          parentNameSAddress: props.parent2.residenceaddress,
          customParentNameSRelation: props.parent2Mapping.relationtoward,
          
        })
  
        ))      
    }
  
  }, [props.studentResults, props.parent1, props.parent1Mapping, props.parent2])

  
  const {register, handleSubmit, formState: {errors} } = useForm({
    resolver:yupResolver(yupschema)
  });

  return (
    <div className='form-div'>
      <div className='page-info'>
        Add or edit a new student to the system page
      </div>

      <div className="preview-div">
          {props.selectedImage?  <img src={props.selectedImage || ''  } alt="Preview" className="img-preview-div"/> : <div className="img-preview-div" >load image to Preview</div>}
       </div>

      <div className='input-area-container'>
        <form action="" onSubmit={props.handleSubmit} className='input-area-div' style={{marginTop:'0px'}} >
          <div className='form-without-button-div'> 

          <div className='group-div'>
            < div className='group-title-div'>Student details</div>

            { !props.id && <div className='form-input-div'> Picture: 
              <input type="file" 
                accept="image/jpeg, image/png" 
                name='image' 
                onChange={props.handleInputChange} 
                className='form-input' 
                required
                />
                
            </div>
            }


            <div className='form-input-div'>student Name: 
              <input type="text" 
                value={props.studentFormData.studentName} 
                name='studentName' 
                onChange={props.handleInputChange}
                placeholder="Enter the pupil's name here..." 
                className={errors.fileName ? "form-input input-field-error": "form-input"}
                required
                />
            </div>

            <div className='form-input-div'>Date of Birth: 
              <input type="date" 
                value={props.studentFormData.dateOfBirth} 
                name='dateOfBirth' 
                onChange={props.handleInputChange}
                placeholder="Enter the pupils date of birth here...(optional)"  
                className='form-input'
                required
                />
            </div>

            <div className='form-input-div'>Gender: 
              <select defaultValue='' name="gender" id="gender" className='form-input ' placeholder='select gender' onChange={props.handleInputChange} value={props.studentFormData.gender} required>
                <option value="" disabled >select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className='form-input-div'>student Class: 
              <select defaultValue="" name="classid" id="classid" className='form-input' placeholder='select student Class' onChange={(e) => props.handleInputChange(e, props.results)} value={props.studentFormData.classid} required>
                <option  value="" disabled>select student Class</option>
                {props.results?.map((classes) => (
                  <option key={classes.id} value={classes.id}>{classes.classname}</option>
                ))}

              </select>
            </div>

            <div className='form-input-div'>Address: 
            <textarea name="address" 
              id="address" 
              value={props.studentFormData.address}
              placeholder="Enter the pupil's residencetial address here..." 
              onChange={props.handleInputChange}
              className='form-input'
              cols="30" 
              rows="3"
              required
              >
              
            </textarea>
          </div>

          </div>

          <div className='group-div'>
          < div className='group-title-div'>FEES BALANCE</div>

            <div className='form-input-div' title='Enter the current balance. if its carry forward, add a negative value to it'>Current Balance: 
              <input type="number" 
                value={props.studentFormData.amountOwed==0? '' : props.studentFormData.amountOwed} 
                name='amountOwed' onChange={props.handleInputChange} 
                placeholder="Enter the pupil's current balance here..." 
                className='form-input'
                required
                />
            </div>
          </div>

          <div className='group-div'>
          < div className='group-title-div'>First Parent Details</div>

            <div className='form-input-div'>Parent 1: 
              <select defaultValue="" name="parentMId" id="parentMId" className='form-input' 
              onChange={props.handleInputChange} 
              value={props.studentFormData.parentMId}
              required
              >
                <option style={{color:'lightgray'}} value="" selected>select parent from system</option>
                <option value="others" className='others'>Not on the List?</option>
                {props.parentResults?.map((parent) => (
                  <option key={parent.id} value={parent.id}>{parent.parentname}</option>
                ))}            
              </select>
            </div>
            
            {props.isParentNotOnList &&
            <div className='custom-div'>
              <div className='form-input-div'>Parent 1 Name: 
              <input type="text" 
                value={props.isParentNotOnList || props.id ? (props.studentFormData.customParentNameM === "others" ? "" : props.studentFormData.customParentNameM) : ""}
                name='customParentNameM' onChange={props.handleInputChange}
                placeholder="Enter the first parent's name here(optional)..."  
                className='form-input'
                autoFocus={props.id? false : true} 
                required
                />
              </div>

              <div className='form-input-div' >Parent 1 Tel: 
              <input type="tel" 
                value={props.studentFormData.customParentNameMTel === "others"? "" : props.studentFormData.customParentNameMTel} 
                name='customParentNameMTel' onChange={props.handleInputChange}
                placeholder="Enter the first parent's name here(optional)..."  
                className='form-input'
                required
                />
              </div>

              <div className='form-input-div' >Parent 1 Email: 
              <input type="text" 
                value={props.studentFormData.customParentNameMMail === "others"? "" : props.studentFormData.customParentNameMMail} 
                name='customParentNameMMail' onChange={props.handleInputChange}
                placeholder="Enter the first parent's name here(optional)..."  
                className='form-input'
                // required
                />
              </div>

              

              <div className='form-input-div'>Address: 
                <textarea name="parentNameMAddress" 
                  id="parentNameMAddress" 
                  value={props.studentFormData.parentNameMAddress}
                  placeholder="Enter the pupil's residencetial parentNameMAddress here..." 
                  onChange={props.handleInputChange}
                  className='form-input'
                  cols="30" 
                  rows="3"
                  required
                  >
                </textarea>
              </div>
            </div>
            }
            <div className='form-input-div'>Relation to student: 
              <select defaultValue="" name="customParentNameMRelation" id="customParentNameMRelation" className='form-input ' placeholder='select customParentNameMRelation' onChange={props.handleInputChange} value={props.studentFormData.customParentNameMRelation} required>
                <option value="" disabled>select relation to student</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Sibling">Sibling</option>
                <option value="Guardian">Guardian</option>
                <option value="Grand Parent">Grand Parent</option>
              </select>
            </div>

            

          </div>

          <div className='group-div'>
          < div className='group-title-div'>Second Parent Details</div>

          <div className='form-input-div'>Parent 2: 
            <select defaultValue='' name="parentSId" id="parentSId" className='form-input' 
            placeholder='select fees Type' 
            onChange={props.handleInputChange} 
            value={props.studentFormData.parentSId}
            required
            >
              <option style={{color:'lightgray'}} value="" selected>select parent from system</option>
              <option value="others" className='others'>Not on the List?</option>
              {props.parentResults?.map((parent) => (
                <option key={parent.id} value={parent.id}>{parent.parentname}</option>
              ))}            
            </select>

          </div>

          {props.isParent2NotOnList &&
          <div className='custom-div'>
          < div className='group-title-div'>Parent 2 Details Form</div>
          
          <div className='form-input-div'>Parent 2 Name: 
          <input type="text" 
                value={props.isParent2NotOnList || props.id ? (props.studentFormData.custompPrentNameS === "others" ? "" : props.studentFormData.custompPrentNameS) : ""}
                name='custompPrentNameS' onChange={props.handleInputChange}
            placeholder="Enter the SECOND parent's name here(optional)..."  
            className='form-input'
            autoFocus={props.id? false : true} 
            required
            />
          </div>

          <div className='form-input-div' >Parent 2 Tel: 
          <input type="text" 
            value={props.studentFormData.customParentNameSTel === "others"? "" : props.studentFormData.customParentNameSTel} 
            name='customParentNameSTel' onChange={props.handleInputChange}
            placeholder="Enter the SECOND parent's name here(optional)..."  
            className='form-input'
            required
            />
          </div>

          <div className='form-input-div' >Parent 2 Email: 
          <input type="text" 
            value={props.studentFormData.customParentNameSMail === "others"? "" : props.studentFormData.customParentNameSMail} 
            name='customParentNameSMail' onChange={props.handleInputChange}
            placeholder="Enter the SECOND parent's name here(optional)..."  
            className='form-input'
            // required
            />
          </div>

          

          <div className='form-input-div'>Address: 
            <textarea name="parentNameSAddress" 
              id="parentNameSAddress" 
              value={props.studentFormData.parentNameSAddress}
              placeholder="Enter the pupil's residencetial parentNameSAddress here..." 
              onChange={props.handleInputChange}
              className='form-input'
              cols="30" 
              rows="3"
              > 
            </textarea>
          </div>
        </div>
          }

        <div className='form-input-div'>Relation to student: 
            <select defaultValue='' name="customParentNameSRelation" id="customParentNameSRelation" className='form-input ' placeholder='select customParentNameSRelation' onChange={props.handleInputChange} value={props.studentFormData.customParentNameSRelation}>
              <option value="" disabled >select relation to student</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Sibling">Sibling</option>
              <option value="Guardian">Guardian</option>
              <option value="Grand Parent">Grand Parent</option>
            </select>
          </div>

          </div>

          </div>

          <div className="nav-buttons">
            {props.studentFormData && 
            <div className="clear-btn-div"> 
              <input type="button" value={'RESET'}  onClick={props.resetForm} title='clear all fields' className="form-button clear-btn"/>
                {/* <input onClick={props.resetForm} title="clear all fields" className="form-button clear-btn">Reset</input> */}
            </div>}

              {props.selectedImage && <input type="submit" value={props.id? 'Update' : 'ADD STUDENT'}  title="upload the product"  className="form-button nav-button next-btn submit-btn"/>}
          </div>

        </form>
      </div>

    </div>
  )
}
