import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import StudentResultPDF from "./StudentResultPDF";
import { StateContext } from "../../../Components/utils/Context";

export const PrintStudentResult = () => {
  const { studentId, classId, semester, academicYear, total, overallPosition } = useParams();
  const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
    useContext(StateContext);
  const [studentResult, setStudentResult] = useState([]);
  const [studentName, setStudentName] = useState([]);
  const navigate = useNavigate();

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
        `http://localhost:5050/api/getOneStudentAccessment/${studentId}/${classId}/${semester}/${academicYear}`
      );

      setStudentResult(classAccessmentResponse.data);
      console.log("classAccessmentResponsessss:", classAccessmentResponse.data);
      console.log("setIsPrintingPage");

      const stuName = await axios.get(
        `http://localhost:5050/api/getStudent/${studentId}`
      );

      setStudentName(stuName.data[0].StudentName);
      console.log("stuNamessss:", stuName.data);
      console.log("setIsPrintingPage");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // console.log("running useeffect:", studentId);

    loadClassResult();
    console.log("classAccessmentResponsessss:", studentResult);
  }, []);
  return (
    <div>
      <StudentResultPDF
        classId={classId}
        semester={semester}
        academicYear={academicYear}
        studentId={studentId}
        total={total}
        studentResult={studentResult}
        studentName={studentName}
        overallPosition = {overallPosition}
      />

    </div>
  );
};
