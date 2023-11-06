import React,{useEffect} from 'react'
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import { yupschema } from '../utils/utils';

export const AddEditSubjectForm = (props) => {

  console.log('props.subjectFormData', props.subjectFormData)

  useEffect(()=>{
    if(props.id){
      console.log('useEffect2468 running', props.subjectResults)
      // console.log('545useEffect2', props.parent1, props.parent2)
      props.subjectResults?.map((subject)=>(
        props.setSubjectFormData({
          ...props.subjectFormData,
          subjectName: subject.SubjectName,

        })
  
        ))   
        // console.log(props.setSubjectFormData, props.setSubjectFormData)   
    }
  
  }, [props.subjectResults])

    const {register, handleSubmit, formState: {errors} } = useForm({
        resolver:yupResolver(yupschema)
    });



  return (
    <div >

      < div className='group-title-div form-info'>Add a new Subject</div>



      <div className='input-area-container'>
        
        <form action="" onSubmit={props.handleSubmit} className='input-area-div' >
          <div className='form-without-button-div'> 
          <div className='group-div'>

            <div className='form-input-div'>Subject Name: 
              <input type="text" 
                value={props.subjectFormData.subjectName} 
                name='subjectName' 
                onChange={props.handleInputChange}
                placeholder="Enter the Class name here..." 
                className='form-input'/>
            </div>

          </div>          

          </div>

          <div className="nav-buttons">
            {props.subjectFormData && 
            <div className="clear-btn-div"> 
              <input type="button" value={'RESET'}  onClick={props.resetForm} title='clear all fields' className="form-button clear-btn"/>
                {/* <input onClick={props.resetForm} title="clear all fields" className="form-button clear-btn">Reset</input> */}
            </div>}

              {props.id? props.subjectFormData.subjectName && <input type="submit" value="Update"  title="upload the product"  className="form-button nav-button next-btn submit-btn"/> : props.subjectFormData.subjectName && <input type="submit" value="Upload"  title="upload the product"  className="form-button nav-button next-btn submit-btn"/>}
          </div>

        </form>
      </div>

    </div>
  )
}
