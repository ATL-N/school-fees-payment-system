import React,{useEffect} from 'react'
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import { yupschema } from '../utils/utils';

export const AddEditClassForm = (props) => {

  console.log('props.classFormData', props.classFormData)

  useEffect(()=>{
    if(props.id){
      console.log('useEffect2468 running', props.classResults)
      console.log('545useEffect2', props.parent1, props.parent2)
      props.classResults?.map((classes)=>(
        props.setClassFormData({
          ...props.classFormData,
          className: classes.ClassName,
          classTeacher: classes.ClassTeacher,
          feesForTheTime: classes.FeesForTheTime,
          classSize: classes.ClassSize,
        })
  
        ))   
        // console.log(props.setClassFormData, props.setClassFormData)   
    }
  
  }, [props.classResults])

    const {register, handleSubmit, formState: {errors} } = useForm({
        resolver:yupResolver(yupschema)
    });



  return (
    <div >

      < div className='group-title-div form-info'>Add a new class</div>



      <div className='input-area-container'>
        
        <form action="" onSubmit={props.handleSubmit} className='input-area-div' >
          <div className='form-without-button-div'> 
          <div className='group-div'>

          <div className='form-input-div'>Class Name: 
            <input type="text" 
              value={props.classFormData.className} 
              name='className' 
              onChange={props.handleInputChange}
              placeholder="Enter the Class name here..." 
              className='form-input'/>
          </div>

          <div className='form-input-div'>class Teacher: 
            <select defaultValue='' name="classTeacher" id="classTeacher" className='form-input' placeholder='select gender' onChange={props.handleInputChange} value={props.classFormData.classTeacher}>
              <option value="" disabled selected>select class Teacher</option>
              {props.teachers?.map((teacher) => (
                <option key={teacher.id} value={teacher.StaffName}>{teacher.StaffName}</option>

              ))}
            </select>
          </div>

          </div>          

          </div>

          <div className="nav-buttons">
            {props.classFormData && 
            <div className="clear-btn-div"> 
              <input type="button" value={'RESET'}  onClick={props.resetForm} title='clear all fields' className="form-button clear-btn"/>
            </div>}

              {props.id? props.classFormData.className && <input type="submit" value="Update"  title="upload the product"  className="form-button nav-button next-btn submit-btn"/> : props.classFormData.className && <input type="submit" value="Upload"  title="upload the product"  className="form-button nav-button next-btn submit-btn"/>}
          </div>

        </form>
      </div>

    </div>
  )
}
