import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddEditClass.css";
import { AddEditClassForm } from "../../Components/Class/AddEditClassForm";
import { StateContext } from "../../Components/utils/Context";


export const AddEditClass = () => {
  const initialState = {
    className: "",
    classTeacher: "",
    feesForTheTime: "",
    classSize: "",
  };

  const { showNavBar, setShowNavBar, userDetails, setUserDetails} = useContext(StateContext);
  const [classFormData, setClassFormData] = useState(initialState);
  const [teachers, setTeachers] = useState([]);
  const { id } = useParams();
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
    setClassFormData({
      ...classFormData,
      [field]: value,
    });
    console.log(classFormData);
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
      setClassFormData(initialState);
      // window.location.reload();
    }
  };

  const fetchTeachers = async () => {
    const response = await axios.get("http://localhost:5050/api/getStaff");
    setTeachers(response.data);
    console.log("fetching Teachers");
  };

  const loadData = async () => {
    try {
      const classResponse = await axios.get(
        `http://localhost:5050/api/getClasses/${id}`
      );
      if (classResponse.data.length > 0) {
        const selectedClass = classResponse.data[0];
        console.log("classResponse", classResponse, selectedClass);
        setClassResults(classResponse.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!classFormData.className || !classFormData.classTeacher) {
      toast.error("Please provide a value for each input field.");
    } else {
      const confirmedClassAdd = window.confirm(`complete fees payment`);
      if(confirmedClassAdd){
      const apiUrl = id
        ? `http://localhost:5050/api/updateClass/${id}`
        : "http://localhost:5050/api/addClass";

      axios
        .post(apiUrl, {
          className: classFormData.className,
          classTeacher: classFormData.classTeacher,
          feesForTheTime: classFormData.feesForTheTime,
          classSize: classFormData.classSize,
        })
        .then((response) => {
          setClassFormData(initialState);
          const { message } = response.data;
          toast.success(message);
          setTimeout(() => {
            navigate(-1);
          }, 500);
        })
        .catch((err) => toast.error(err.response));

    }
    }
  };

  useEffect(() => {
    fetchTeachers();
    if (id) {
      console.log("running load data");
      loadData();
    }
  }, []);

  return (
    <>
    <div className="form-container">
      <AddEditClassForm
        classFormData={classFormData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
        teachers={teachers}
        classResults={classResults}
        setClassFormData={setClassFormData}
        id={id}
        // classFormData = {classFormData}
      />
    </div>
    
    </>
  );
};
