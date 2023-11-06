import React from 'react'

export const MakePaymentpage = (props) => {
    console.log('makePaymentPage',props.makePaymentFormData)


  return (
    <div className='form-div'>
      <div className='page-info' style={{marginTop:'25px'}}>
        Pay fees
      </div>

      <div className="preview-div">
          {props.imageUrl?  <img src={props.imageUrl} alt="Preview" className="img-preview-div"/> : <div className="img-preview-div" > image  Preview</div>}
       </div>

      <div className='input-area-container'>
        <form action="" onSubmit={props.handleSubmit} className='input-area-div' style={{marginTop:'0px'}}>
          <div className='form-without-button-div'> 
          <div className='group-div'>
          
          <div className='form-input-div'>student Name: 
            <input type="text" 
              value={props.student.StudentName} 
              name='studentName' 
              className='form-input readonly'
              readOnly
              />
          </div>

          <div className='form-input-div '>Class: 
            <input type="text" 
              value={props.student.ClassName} 
              name='studentClass' 
              className='form-input readonly'
              readOnly
              />
          </div>

          <div className='form-input-div '>Current Balance(Ghc): 
            <input type="number" 
              value={-props.student.AmountOwed} 
              name='amountOwed' 
              placeholder="Enter the pupil's class here..." 
              className='form-input readonly'
              readOnly
              />
          </div>

          <div className='form-input-div '>New Balance(Ghc): 
            <input type="number" 
              value={-props.makePaymentFormData.newBalance} 
              onChange={props.handleInputChange}
              name='newBalance' 
              placeholder="Wards new balance will appear here..." 
              className='form-input readonly'
              readOnly
              />
          </div>

          <div className='form-input-div'>Amount Received(Ghc): 
            <input type="number" 
              value={props.makePaymentFormData.amountReceived} 
              name='amountReceived' 
              onChange={props.handleInputChange}
              className='form-input'
              placeholder="Enter amount received here..." 
              />
              
          </div>

          <div className='form-input-div'>Fees type: 
            <select name="feesType" id="feesType" className='form-input active' 
            placeholder='select fees Type' 
            onChange={props.handleInputChange} 
            value={props.makePaymentFormData.feesType}
            >
              <option value="" disabled selected>select fee type</option>
              <option value="Studies">Studies</option>
              <option value="Feeding">Feeding</option>
              <option value="Tuition">Tuition</option>
              <option value="others">others</option>              
            </select>
          </div>

          <div className='form-input-div'>Received From: 
            <input type="text" 
              value={props.makePaymentFormData.receivedFrom} 
              name='receivedFrom' 
              onChange={props.handleInputChange}
              placeholder="Enter the name of the person making the payment..."  
              className='form-input'/>
          </div>

          <div className='form-input-div'>Comment: 
            <textarea name="comment" 
              id="comment" 
              value={props.makePaymentFormData.comment}
              placeholder="Enter any comments here(optional)..." 
              onChange={props.handleInputChange}
              cols="20" 
              rows="10"
              >
              
            </textarea>
          </div>

          </div>

          </div>

          <div className="nav-buttons">
            {props.student && 
            <div className="clear-btn-div"> 
              <input type="button" value={'Go Back'}  onClick={props.handleBack} title='clear all fields' className="form-button clear-btn"/>
                {/* <input onClick={props.resetForm} title="clear all fields" className="form-button clear-btn">Reset</input> */}
            </div>}

              {props.student && <input type="submit" value="Pay Fees"  title="Pay fees"  className="form-button nav-button next-btn submit-btn"/>}
          </div>

        </form>
      </div>

    </div>
  )
}
