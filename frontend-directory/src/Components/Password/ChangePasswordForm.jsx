import React from 'react'

export const ChangePasswordForm = (props) => {
    return (
        <div >
    
          < div className='group-title-div form-info'>Change user password</div>
    
    
    
          <div className='input-area-container'>
            
            <form action="" onSubmit={props.handleSubmit} className='input-area-div' >
              <div className='form-without-button-div'> 
              <div className='group-div'>
    
              <div className='form-input-div'>old password: 
                <input type="password" 
                  value={props.passwordFormData.oldPassword} 
                  name='oldPassword' 
                  onChange={props.handleInputChange}
                  placeholder="Enter the old password here..." 
                  className='form-input'/>
              </div>
    
              <div className='form-input-div'>new password: 
                <input type="password" 
                  value={props.passwordFormData.newPassword} 
                  name='newPassword' 
                  onChange={props.handleInputChange}
                  placeholder="Enter your new password here..." 
                  className='form-input'/>
              </div>

              <div className='form-input-div'>confirm password: 
                <input type="password" 
                  value={props.passwordFormData.confirmPassword} 
                  name='confirmPassword' 
                  onChange={props.handleInputChange}
                  placeholder="confirm your new password here..." 
                  className='form-input'/>
              </div>
    
              </div>          
    
              </div>
    
              <div className="nav-buttons">    
                  {(props.passwordFormData.confirmPassword && props.passwordFormData.newPassword && props.passwordFormData.oldPassword) && <input type="submit" value="change password"  className="form-button nav-button next-btn submit-btn"/>}
              </div>
    
            </form>
          </div>
    
        </div>
      )
}
