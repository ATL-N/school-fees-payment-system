import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ClassResultPDF } from "../Subject/ViewClassResult/ClassResultPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { StateContext } from "../../Components/utils/Context";

export const PrintEmptyClassResult = () => {
  const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
    useContext(StateContext);
  const { classId, semester, academicYear, className } = useParams();
  const navigate = useNavigate();
  const [classGradeResult, setClassGradeResult] = useState([]);
  const [distinctSubjects, setDistinctSubjects] = useState([]);

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
      const classAccessmentResponse = await axios.get(
        `http://localhost:5050/api/getAllClassAccessment?classId=${classId}&semester=${semester}&year=${academicYear}`
      );

      setClassGradeResult(classAccessmentResponse.data);

      // Extract distinct subjects from the response data
      if (classAccessmentResponse.data.length > 0) {
        const subjects = Object.keys(classAccessmentResponse.data[0]).filter(
          (key) =>
            key !== "StudentName" && key !== "total" && key !== "position"
        );
        setDistinctSubjects(subjects);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadClassResult();
  }, [classId, semester, academicYear]); // Make sure to include the dependencies here

  useEffect(() => {
    console.log("distinctSubjects", distinctSubjects);
    console.log("classId", classId, className);
  }, [distinctSubjects]); // Log distinctSubjects after it has been set

  return (
    <div>
      <ClassEmptyPDF
        classId={classId}
        semester={semester}
        academicYear={academicYear}
        className={className}
        classGradeResult={classGradeResult}
        distinctSubjects={distinctSubjects}
      />
    </div>
  );
};
