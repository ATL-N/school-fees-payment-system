import React, { useEffect, useState, useContext } from 'react'
import {useNavigate, useParams, Link} from "react-router-dom";
import axios from 'axios';
import {toast} from 'react-toastify';
import { AddEditExpensesForm } from '../../Components/Expenses/AddEditExpensesForm';
import { StateContext } from '../../Components/utils/Context';



export const AddEditExpenses = () => {

    const initialState = {
        recipientName: "",
        amount: null,
        purpose: "",
    }

    const { showNavBar, setShowNavBar, userDetails, setUserDetails} = useContext(StateContext);
    const [expensesFormData, setExpensesFormData] = useState(initialState) 
    const [teachers, setTeachers] = useState([]) 
    const {id} = useParams();
    const navigate = useNavigate();
    const [classResults, setClassResults] = useState([]);
    
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
        setExpensesFormData({
          ...expensesFormData,
          [field]: value ,
        })
        console.log(expensesFormData)
    }

    const handleInputChange = (e) => {
        const {name, value, files} = e.target;

        if(name==="image"){
            const imageSelected = files[0];
            console.log("running file:")
            updateField(name, imageSelected )
        }else{
            updateField(name, value);
        }
    }

    const resetForm =() => {
        const confirmReset = window.confirm("Are you sure you want to reset the form?");
        if (confirmReset){
            setExpensesFormData(initialState)
            // window.location.reload();
        }
    }


    const loadData = async () => {
      try {
        const classResponse = await axios.get(`http://localhost:5050/api/getClasses/${id}`);
        if (classResponse.data.length > 0) {
          const selectedClass = classResponse.data[0];
          console.log('classResponse', classResponse, selectedClass)
          setClassResults(classResponse.data)
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!expensesFormData.recipientName || !expensesFormData.amount) {
          toast.error('Please provide a value for each input field.');
        } else {
          const expenseConfirmed = window.confirm(`Are you sure you want to complete transaction`);
          if(expenseConfirmed){
          const apiUrl = id ? `http://localhost:5050/api/updateExpense/${id}` : 'http://localhost:5050/api/addExpense';
    
          // const formDataToSend = new FormData();
          // formDataToSend.append('recipientName', expensesFormData.recipientName);
          // formDataToSend.append('amount', expensesFormData.amount);
          // formDataToSend.append('purpose', expensesFormData.purpose);
          // formDataToSend.append('classSize', expensesFormData.classSize);
    
          axios
            .post(apiUrl, {
              recipientName: expensesFormData.recipientName,
              amount: expensesFormData.amount,
              purpose: expensesFormData.purpose,
            })
            .then(() => {
              setExpensesFormData(initialState);
            })
            .catch((err)=>toast.error(err.response));
    
          const successMessage = id ? 'Data updated successfully' : 'Data saved successfully';
          toast.success(successMessage);
          setTimeout(() => {
            navigate(-1);
          }, 500);
         } }
      };

    useEffect(()=>{
      if(id){
        console.log('running load data')
        loadData()
      }
    },[])

  return (
    <div recipientName='form-container'>
        < AddEditExpensesForm
        expensesFormData = {expensesFormData}
        handleInputChange = {handleInputChange}
        handleSubmit = {handleSubmit}
        resetForm = {resetForm}
        teachers = {teachers}
        classResults = {classResults}
        setExpensesFormData = {setExpensesFormData}
        id = {id}
        // expensesFormData = {expensesFormData}
        />
</div>
        
  )
}
