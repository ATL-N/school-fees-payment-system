import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { StateContext } from "../../Components/utils/Context";
import { AddEditSemesterForm } from "./AddEditSemesterForm";


export const AddEditSemester = () => {
  const initialState = {
    semesterName: "",
    dateStart: "",
    dateEnd: "",
    active: "Yes",
  };

  const { showNavBar, setShowNavBar, userDetails, setUserDetails} = useContext(StateContext);
  const [semesterFormData, setSemesterFormData] = useState(initialState);
  const [teachers, setTeachers] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [classResults, setClassResults] = useState([]);


  axios.defaults.withCredentials = true;
  useEffect(() => {
    setShowNavBar(true);
    axios
      .get("https://school-fees-payment-system-server.onrender.com/home")
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
    setSemesterFormData({
      ...semesterFormData,
      [field]: value,
    });
    console.log(semesterFormData);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const imageSelected = files[0];
      console.log("running file:");
      updateField(name, imageSelected);
    } else {
      updateField(name, value);
    }
  };

  const resetForm = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the form?"
    );
    if (confirmReset) {
      setSemesterFormData(initialState);
      window.location.reload();
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!semesterFormData.semesterName || !semesterFormData.dateStart) {
      toast.error("Please provide a value for each input field.");
    } else {
      const confirmedClassAdd = window.confirm(`complete fees payment`);
      if(confirmedClassAdd){
      const apiUrl = id
        ? `https://school-fees-payment-system-server.onrender.com/api/updateClass/${id}`
        : "https://school-fees-payment-system-server.onrender.com/api/addSemester";

      axios
        .post(apiUrl, {
          semesterName: semesterFormData.semesterName,
          dateStart: semesterFormData.dateStart,
          dateEnd: semesterFormData.dateEnd,
          active: semesterFormData.active,
        })
        .then((response) => {
          const { message } = response.data;
          if (message){
            setSemesterFormData(initialState);
            toast.success(message);
            setTimeout(() => {
              navigate(-1);
            }, 500);
          }else{
            toast.error('error adding class');
            setTimeout(() => {
              navigate(-1);
            }, 500);
          }
          
        })
        .catch((err) => toast.error(err.response));

    }
    }
  };


  return (
    <>
    <div className="form-container">
      <AddEditSemesterForm
        semesterFormData={semesterFormData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
        setSemesterFormData={setSemesterFormData}
        id={id}
      />
    </div>
    
    </>
  );
};
