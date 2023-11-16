import React, {useState, useEffect, useContext} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";
import axios from "axios";
import { MakePaymentpage } from './MakePaymentpage';
import { StateContext } from '../../Components/utils/Context';


export const MakePayment = () => {

    const { showNavBar, setShowNavBar, userDetails, setUserDetails} = useContext(StateContext);
    const [student, setStudent] = useState([]);
    const [newBalance, setNewBalance] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();
    const {id} = useParams()
    const currentDate = new Date().toLocaleDateString();

 

    const initialState = {
        studentId: id,
        studentName: "",
        studentClass: "",
        amountOwed: 0,
        amountReceived: '',
        feesType: "",
        receivedFrom: "",
        comment: "",
        newBalance: '',
        receivedBy: userDetails.id,
        
    }

    console.log('userDetails', userDetails)

    const [makePaymentFormData, setMakePaymentFormData] = useState(initialState) 


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
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("running userdetails useeffect error");
        });
      console.log("running userdetails useeffect done");
    }, []);
  



    const updateField = (field, value) => {
        setMakePaymentFormData({
          ...makePaymentFormData,
          [field]: value ,
        })
        console.log(makePaymentFormData)
      }

      const handleInputChange = (e) => {
        const {name, value, files} = e.target;
        if (name === "amountReceived") {
            const balance = parseFloat(student.AmountOwed);
            const received = parseFloat(value); // Convert to a float to handle decimal values
            const calculatedBalance = balance - received;
        
            setMakePaymentFormData({
              ...makePaymentFormData,
              [name]: value,
              newBalance: calculatedBalance.toFixed(2), // Format as a decimal number with two decimal places
            });
          }else{
        updateField(name, value);
        }
      }

      const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!makePaymentFormData.studentName || !makePaymentFormData.studentClass) {
          toast.error('Please provide a value for each input.');
        } else {
          const ConfirmedPayment = window.confirm(`complete fees payment`);
          if(ConfirmedPayment){
          const apiUrl = `http://localhost:5050/api/makePayment` ;
    
          const formDataToSend = new FormData();
          formDataToSend.append('studentId', makePaymentFormData.studentId);
          formDataToSend.append('studentName', makePaymentFormData.studentName);
          formDataToSend.append('studentClass', makePaymentFormData.studentClass);
          formDataToSend.append('amountOwed', makePaymentFormData.amountOwed);
          formDataToSend.append('amountReceived', makePaymentFormData.amountReceived);
          formDataToSend.append('feesType', makePaymentFormData.feesType);
          formDataToSend.append('receivedFrom', makePaymentFormData.receivedFrom);
          formDataToSend.append('comment', makePaymentFormData.comment);
          formDataToSend.append('paymentDate', makePaymentFormData.paymentDate);
          formDataToSend.append('newBalance', makePaymentFormData.newBalance);
    
          axios
            .post(apiUrl, {
                studentId: makePaymentFormData.studentId,
                studentName: makePaymentFormData.studentName,
                studentClass: makePaymentFormData.studentClass,
                amountOwed: makePaymentFormData.amountOwed,
                amountReceived: makePaymentFormData.amountReceived,
                feesType: makePaymentFormData.feesType,
                receivedFrom: makePaymentFormData.receivedFrom,
                comment: makePaymentFormData.comment,
                paymentDate: makePaymentFormData.paymentDate,
                newBalance: makePaymentFormData.newBalance,
                receivedBy: makePaymentFormData.receivedBy,
            })
            .then((response) => {
            //   setMakePaymentFormData(initialState);
            const { paymentId, message } = response.data;
            console.log('paymentId', paymentId)
            toast.success(message);
            setTimeout(() => {
              navigate(`/printPayment/${paymentId}`);
            }, 500);

            })
            .catch((err)=>toast.error(err.response, 'error'));
    
          
        }
        }
      };

      const handleBack = () => {
        navigate(-1)
      }



    const loadData = async () => {
        try {
          const response = await axios.get(`http://localhost:5050/api/getStudent/${id}`);
          if (response.data.length > 0) {
            const selectedStudent = response.data[0];
            setStudent(response.data[0]);
            setImageUrl(`http://localhost:5050/uploads/${selectedStudent.Image}`);

            setMakePaymentFormData({
                ...makePaymentFormData,
                studentName: selectedStudent.StudentName,
                studentClass: selectedStudent.ClassName,
                amountOwed: selectedStudent.AmountOwed,
                newBalance: makePaymentFormData.newBalance? makePaymentFormData.newBalance : selectedStudent.AmountOwed,
              })

            console.log("response data", response.data)
          }
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };


    useEffect(()=>{
        loadData();
        console.log('student',student)
    }, [id])

  return (
    <div>
      <MakePaymentpage 
      student = {student}
      id = {id}
      imageUrl = {imageUrl}
      makePaymentFormData = {makePaymentFormData}
      handleInputChange = {handleInputChange}
      handleSubmit = {handleSubmit}
      handleBack = {handleBack}
      />
    </div>
  )
}
