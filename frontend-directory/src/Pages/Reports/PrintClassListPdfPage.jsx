import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { StateContext } from "../../Components/utils/Context";
import { ClassListPDF } from "../Subject/ViewClassResult/ClassListPDF";

export const PrintClassListPdfPage = () => {
  const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
    useContext(StateContext);
  const { classId, numberOfColumns, academicYear, className } = useParams();
  const navigate = useNavigate();
  const [classGradeResult, setClassGradeResult] = useState([]);
  const [distinctSubjects, setDistinctSubjects] = useState([]);
  const [studentResults, setStudentResults] = useState([]);


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

  const loadClassResult = async () => {
    try {
        const studentResponse = await axios.get(
          `http://localhost:5050/api/getClassStudent/${classId}`
        );
        setStudentResults(studentResponse.data);
        console.log(
          "studentResponse:",
          studentResponse.data,
          classId
        );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadClassResult();
    console.log('studentResultsdssdsdsd', studentResults)

  }, []); // Make sure to include the dependencies here

  return (
    <div>
      <ClassListPDF
        classId={classId}
        numberOfColumns={numberOfColumns}
        academicYear={academicYear}
        className={className}
        classGradeResult={classGradeResult}
        distinctSubjects={distinctSubjects}
        studentResults={studentResults}
      />
    </div>
  );
};
