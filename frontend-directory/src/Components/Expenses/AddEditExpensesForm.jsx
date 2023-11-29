import React,{useEffect} from 'react'
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import { yupschema } from '../utils/utils';

export const AddEditExpensesForm = (props) => {

  console.log('props.expensesFormData', props.expensesFormData)

  useEffect(()=>{
    if(props.id){
      console.log('useEffect2468 running', props.classResults)
      console.log('545useEffect2', props.parent1, props.parent2)
      props.classResults?.map((classes)=>(
        props.setClassFormData({
          ...props.expensesFormData,
          className: classes.classname,
          classTeacher: classes.classteacher,
          amount: classes.feesforthetime,
          purpose: classes.classsize,
        })
  
        ))   
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

          <div className='form-input-div'>Recepient Name: 
            <input type="text" 
              value={props.expensesFormData.recipientName} 
              name='recipientName' 
              onChange={props.handleInputChange}
              placeholder="Enter the recepient name here..." 
              className='form-input'/>
          </div>


          <div className='form-input-div'>Amount(Ghc): 
            <input type="number" 
              value={props.expensesFormData.amount} 
              name='amount' 
              onChange={props.handleInputChange} 
              placeholder="Enter the amount given out..." 
              className='form-input'
              min={0}
              />
          </div>


          <div className='form-input-div'>Purpose: 
            <input type="text" 
              value={props.expensesFormData.purpose} 
              name='purpose' onChange={props.handleInputChange} 
              placeholder="Enter purpose for the money..." 
              className='form-input'/>
          </div>

          </div>          

          </div>

          <div className="nav-buttons">
            {props.expensesFormData && 
            <div className="clear-btn-div"> 
              <input type="button" value={'RESET'}  onClick={props.resetForm} title='clear all fields' className="form-button clear-btn"/>
                {/* <input onClick={props.resetForm} title="clear all fields" className="form-button clear-btn">Reset</input> */}
            </div>}

              {props.id? props.expensesFormData.recipientName && <input type="submit" value="Update"  title="upload the product"  className="form-button nav-button next-btn submit-btn"/> : props.expensesFormData.recipientName && <input type="submit" value="Upload"  title="upload the product"  className="form-button nav-button next-btn submit-btn"/>}
          </div>

        </form>
      </div>

    </div>
  )
}
