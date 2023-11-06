import React, {useContext, useState, useEffect} from 'react'
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { StateContext } from '../../Components/utils/Context';
import { ChangePasswordForm } from '../../Components/Password/ChangePasswordForm'

export const ChangePassword = () => {

    const initialState = {
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
        userName: '',
        email: '',
      };

      const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
      useContext(StateContext);
      const { id } = useParams();
      const navigate = useNavigate();
    const [passwordFormData, setPasswordFormData] = useState(initialState);

    axios.defaults.withCredentials = true;
    useEffect(() => {
      setShowNavBar(true);
      axios
        .get("http://localhost:5050/home")
        .then((res) => {
          if (res.data.userDetails == "" || res.data.userDetails == null) {
            navigate("/loginPage");
          } else {
            setUserDetails(res.data.userDetails);
            setPasswordFormData({
                ...passwordFormData,
                userName: res.data.userDetails.StaffName,
                email: res.data.userDetails.Email,
              });
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("running userdetails useeffect error");
        });
      console.log("running userdetails useeffect done");
    }, []);


    const updateField = (field, value) => {
        setPasswordFormData({
          ...passwordFormData,
          [field]: value,
        });
        console.log(passwordFormData);
      };
    

      const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        updateField(name, value);
        
      };

      const handleSubmit = (e) => {
        const confirmSubmit = window.confirm(
          "Are you sure you want to submit the data?"
        );
        if (confirmSubmit) {
          e.preventDefault();
    
          if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
            toast.error("New password and confirm password must be the same");
          } else {
            const apiUrl =`http://localhost:5050/api/updateStaffPassword/${userDetails.id}`
    
            const formDataToSend = new FormData();
            formDataToSend.append("oldPassword", passwordFormData.oldPassword);
            formDataToSend.append("newPassword", passwordFormData.newPassword);
            formDataToSend.append("confirmPassword", passwordFormData.confirmPassword);
            formDataToSend.append("userName", passwordFormData.userName);
            formDataToSend.append("email", passwordFormData.email);
       
            axios
              .post(apiUrl, formDataToSend)
              .then((response) => {
                console.log('running then column', response)
                if (response.data.message) {
                  setPasswordFormData(initialState);
                  toast.success(response.data?.message);
                  setTimeout(() => {
                    navigate(-1);
                  }, 500);
                }else if(response.data.error){
                  toast.error(response.data.error)
                  setTimeout(() => {
                    // navigate(-1);
                  }, 500);
                }
                else{
                  toast.error('Unknown Error')
                  setTimeout(() => {
                    // navigate(-1);
                  }, 500);
                }
              })
              .catch((err) => toast.error(err.response));
          }
        }
      };

  return (
    <div>
        <ChangePasswordForm 
        passwordFormData={passwordFormData}
        setPasswordFormData={setPasswordFormData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        id={id}
        />
    </div>
  )
}
