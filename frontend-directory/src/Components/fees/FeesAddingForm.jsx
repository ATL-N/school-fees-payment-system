import React,{useEffect} from 'react'
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import { yupschema } from '../utils/utils';

export const FeesAddingForm = (props) => {

  console.log('props.feesAddingFormData', props.feesAddingFormData)

  useEffect(()=>{
    if(props.id){
      console.log('useEffect2468 running', props.classResults)
      console.log('545useEffect2', props.parent1, props.parent2)
      props.classResults?.map((classes)=>(
        props.setClassFormData({
          ...props.feesAddingFormData,
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
            <select defaultValue="" name="classid" id="classid" className='form-input' placeholder='select student Class' onChange={(e) => props.handleInputChange(e, props.classResults)} value={props.feesAddingFormData.classId}>
              <option  value="" disabled>select Class</option>
              {props.classResults?.map((classes) => (
                <option key={classes.id} value={classes.id}>{classes.classname}</option>
              ))}

            </select>
          </div>


          <div className='form-input-div'>TERM: 
            <input type="text" 
              value={props.feesAddingFormData.semestername} 
              className='form-input'
              readOnly/>
          </div>


            <div className='form-input-div'>Fees type: 
            <select name="feesType" id="feesType" className='form-input active' 
            placeholder='select fees Type' 
            onChange={props.handleInputChange} 
            value={props.feesAddingFormData.feesType}
            >
              <option value="" disabled selected>select fee type</option>
              <option value="Studies">Studies</option>
              <option value="Feeding">Feeding</option>
              <option value="Tuition">Tuition</option>
              <option value="others">others</option>              
            </select>
          </div>

           <div className='form-input-div'>Term's Fees: 
            <input type="number" 
              value={parseFloat(props.feesAddingFormData.feesForTheTime)} 
              name='feesForTheTime' 
              onChange={props.handleInputChange} 
              placeholder="Enter the tersm's fess for the class here..." 
              className='form-input'/>
          </div>


          </div>          

          </div>

          <div className="nav-buttons">
            {props.feesAddingFormData && 
            <div className="clear-btn-div"> 
              <input type="button" value={'RESET'}  onClick={props.resetForm} title='clear all fields' className="form-button clear-btn"/>
                {/* <input onClick={props.resetForm} title="clear all fields" className="form-button clear-btn">Reset</input> */}
            </div>}

              {props.id? props.feesAddingFormData.className && <input type="submit" value="Update"  title="upload the product"  className="form-button nav-button next-btn submit-btn"/> : props.feesAddingFormData.className && <input type="submit" value="Upload"  title="upload the product"  className="form-button nav-button next-btn submit-btn"/>}
          </div>

        </form>
      </div>

    </div>
  )
}
