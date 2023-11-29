import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AddEditGradesForm } from "../../Components/Report/AddEditGradesForm";
import { StateContext } from "../../Components/utils/Context";

export const AddEditGrades = () => {
  const initialState = {
    gradeName: "",
    minGradePoint: null,
    maxGradePoint: null,
  };

  const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
    useContext(StateContext);
  const [gradeFormData, setGradeFormData] = useState(initialState);
  const [teachers, setTeachers] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [gradeResults, setGradeResults] = useState([]);

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
    setGradeFormData({
      ...gradeFormData,
      [field]: value,
    });
    console.log(gradeFormData);
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

  const handleBack = () => {
    navigate(-1)
  };

  const loadData = async () => {
    try {
      const subjectResponse = await axios.get(
        `http://localhost:5050/api/getGrade/${id}`
      );
      if (subjectResponse.data.length > 0) {
        console.log("subjectResponse", subjectResponse);
        setGradeResults(subjectResponse.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!gradeFormData.gradeName) {
      toast.error("Please provide a value for each input field.");
    } else {
      const apiUrl = id
        ? `http://localhost:5050/api/updateGrade/${id}`
        : "http://localhost:5050/api/addGrade";

      axios
        .post(apiUrl, {
          gradeName: gradeFormData.gradeName,
          minGradePoint: gradeFormData.minGradePoint,
          maxGradePoint: gradeFormData.maxGradePoint,
        })
        .then((response) => {
          const {message, error} = response.data;
          // setGradeFormData(initialState);
          if (response.data.message) {
            toast.success(response.data?.message);
            setTimeout(() => {
              navigate(-1);
            }, 500);
            setGradeFormData(initialState);
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
        .catch((err) => toast.error(err.response));
    }
  };

  useEffect(() => {
    if (id) {
      console.log("running load data");
      loadData();
    }
  }, [id]);

  return (
    <div className="form-container">
      <AddEditGradesForm
        gradeFormData={gradeFormData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleBack={handleBack}
        teachers={teachers}
        setGradeFormData={setGradeFormData}
        id={id}
        gradeResults={gradeResults}
        // gradeFormData = {gradeFormData}
      />
    </div>
  );
};
