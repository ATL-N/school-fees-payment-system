import React, { useEffect, useState, useContext } from 'react'
import {useNavigate, useParams, Link} from "react-router-dom";
import axios from 'axios';
import {toast} from 'react-toastify';
import { AddEditSubjectForm } from '../../Components/Report/AddEditSubjectForm';
import { StateContext } from '../../Components/utils/Context';

export const AddEditSubject = () => {

    const initialState = {
        subjectName: "",
    }

    const { showNavBar, setShowNavBar, userDetails, setUserDetails } = useContext(StateContext);
    const [subjectFormData, setSubjectFormData] = useState(initialState) 
    const [teachers, setTeachers] = useState([]) 
    const {id} = useParams();
    const navigate = useNavigate();
    const [subjectResults, setSubjectResults] = useState([]);

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
        setSubjectFormData({
          ...subjectFormData,
          [field]: value ,
        })
        console.log(subjectFormData)
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

    const handleBack =() => {
        navigate(-1)
    }

    const loadData = async () => {
      try {
        const subjectResponse = await axios.get(`http://localhost:5050/api/getSubject/${id}`);
        if (subjectResponse.data.length > 0) {
          // const selectedClass = subjectResponse.data[0];
          console.log('subjectResponse', subjectResponse)
          setSubjectResults(subjectResponse.data)
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!subjectFormData.subjectName) {
          toast.error('Please provide a value for each input field.');
        } else {
          const apiUrl = id ? `http://localhost:5050/api/updateSubject/${id}` : 'http://localhost:5050/api/addSubject';
    
          axios
            .post(apiUrl, {
              subjectName: subjectFormData.subjectName,
            })
            .then((response) => {
              if (response.data.message) {
                toast.success(response.data?.message);
                setTimeout(() => {
                  navigate(-1);
                }, 500);
              setSubjectFormData(initialState);
              } else if (response.data.error) {
                toast.error(response.data.error);
                setTimeout(() => {
                }, 500);
              } else {
                toast.error("Internal Error");
                setTimeout(() => {
                }, 500);
              }
            })
            .catch((err)=>toast.error(err.response));
        }
      };

    useEffect(()=>{
      console.log('id:', id)
      if(id){
        console.log('running load data')
        loadData()
      }
    },[id])

  return (
    <div className='form-container'>
        < AddEditSubjectForm
        subjectFormData = {subjectFormData}
        handleInputChange = {handleInputChange}
        handleSubmit = {handleSubmit}
        handleBack = {handleBack}
        teachers = {teachers}
        setSubjectFormData = {setSubjectFormData}
        id = {id}
        subjectResults = {subjectResults}
        // subjectFormData = {subjectFormData}
        />
</div>
        
  )
}
