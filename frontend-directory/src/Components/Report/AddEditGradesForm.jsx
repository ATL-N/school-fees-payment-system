import React,{useEffect} from 'react'
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import { yupschema } from '../utils/utils';

export const AddEditGradesForm = (props) => {

  console.log('props.gradeFormData', props.gradeFormData)

  useEffect(()=>{
    if(props.id){
      console.log('useEffect2468 running', props.gradeResults)
      // console.log('545useEffect2', props.parent1, props.parent2)
      props.gradeResults?.map((grade)=>(
        props.setGradeFormData({
          ...props.gradeFormData,
          gradeName: grade.gradename,
          minGradePoint: grade.mingrade,
          maxGradePoint: grade.maxgrade,
        })
  
        ))   
        // console.log(props.setGradeFormData, props.setGradeFormData)   
    }
  
  }, [props.gradeResults])

    const {register, handleSubmit, formState: {errors} } = useForm({
        resolver:yupResolver(yupschema)
    });



  return (
    <div >

      < div className='group-title-div form-info'>Add a new Grade</div>



      <div className='input-area-container'>
        
        <form action="" onSubmit={props.handleSubmit} className='input-area-div' >
          <div className='form-without-button-div'> 
          <div className='group-div'>

            <div className='form-input-div'>Grade Name: 
              <input type="text" 
                value={props.gradeFormData?.gradeName || ''} 
                name='gradeName' 
                onChange={props.handleInputChange}
                placeholder="Enter the grade name(A, B, C) here..." 
                className='form-input'/>
            </div>

            <div className='form-input-div'>Min Grade Point: 
              <input type="number" 
                value={props.gradeFormData?.minGradePoint || ''} 
                name='minGradePoint' 
                onChange={props.handleInputChange}
                placeholder="Enter the min grade point(90, 80, 70) here..." 
                className='form-input'/>
            </div>

            <div className='form-input-div'>Max Grade Point: 
              <input type="number" 
                value={props.gradeFormData?.maxGradePoint || ''} 
                name='maxGradePoint' 
                onChange={props.handleInputChange}
                placeholder="Enter the max grade point(100, 89.9, 79.9) here..." 
                className='form-input'/>
            </div>

          </div>          

          </div>

          <div className="nav-buttons">
            {props.gradeFormData && 
            <div className="clear-btn-div"> 
              <input type="button" value={'Go Back'}  onClick={props.handleBack} title='clear all fields' className="form-button clear-btn"/>
                {/* <input onClick={props.resetForm} title="clear all fields" className="form-button clear-btn">Reset</input> */}
            </div>}

              {props.id? props.gradeFormData?.gradeName && <input type="submit" value="Update"  title="upload the product"  className="form-button nav-button next-btn submit-btn"/> : props.gradeFormData?.gradeName && <input type="submit" value="Upload"  title="upload the product"  className="form-button nav-button next-btn submit-btn"/>}
          </div>

        </form>
      </div>

    </div>
  )
}
