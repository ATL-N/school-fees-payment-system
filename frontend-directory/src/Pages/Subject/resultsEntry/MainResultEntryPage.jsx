import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { SelectSubject } from "./SelectSubject";
import { EnterMarks } from "./EnterMarks";
import { StateContext } from "../../../Components/utils/Context";

export const MainResultEntryPage = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
    useContext(StateContext);
  const [isSubjectSelected, setIsSubjectSelected] = useState(false);
  const initialState = {
    subjectName: null,
    subjectId: null,
    staffName: null,
    staffId: null,
    studentName: null,
    studentId: null,
    className: "",
    classId: null,
    gradeId: null,
    gradeName: null,
    semester: null,
    year: year,
    classCore: 0,
    examScore: 0,
    totalScore: null,
  };

  const [myFormData, setMyFormData] = useState(initialState);
  const [teachers, setTeachers] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [subjectResults, setSubjectResults] = useState([]);
  const [staffResults, setStaffResults] = useState([]);
  const [clasResults, setClasResults] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [studentGradeResults, setStudentGradesResults] = useState([]);
  const [uploaded, SetUploaded] = useState(false);
  let teacherResult;
  let subResult;
  let clasResult;

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
    setMyFormData({
      ...myFormData,
      [field]: value,
    });
    console.log(myFormData);
  };

  const resetForm = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the form?"
    );
    if (confirmReset) {
      setMyFormData(initialState);
      // window.location.reload();
    }
  };

  const loadStudentGrade = async () => {
    const classAccessmentResponse = await axios.get(
      `http://localhost:5050/api/getClassAccessment?classId=${myFormData.classId}&semester=${myFormData.semester}&year=${myFormData.year}&subjectId=${myFormData.subjectId}`
    );
    setStudentGradesResults(classAccessmentResponse.data);
    console.log(
      "classAccessmentResponse:",
      classAccessmentResponse.data,
      myFormData.classId
    );
  };

  const loadData = async () => {
    try {
      console.log("laoding data");
      const subjectResponse = await axios.get(
        `http://localhost:5050/api/getSubjects`
      );
      if (subjectResponse.data.length > 0) {
        subResult = subjectResponse.data;
        console.log("subjectResponse", subjectResponse);
        setSubjectResults(subjectResponse.data);
      }

      const clasResponse = await axios.get(
        `http://localhost:5050/api/getClasses`
      );
      if (clasResponse.data.length > 0) {
        clasResult = clasResponse.data;
        console.log("clasResponse", clasResponse);
        setClasResults(clasResponse.data);
      }

      const staffresponse = await axios.get(
        "http://localhost:5050/api/getStaff"
      );
      teacherResult = staffresponse.data;
      setStaffResults(staffresponse.data);
      console.log("teacherResult:", teacherResult);

      if (isSubjectSelected) {
        const studentResponse = await axios.get(
          `http://localhost:5050/api/getClassStudent/${myFormData.classId}`
        );
        setStudentResults(studentResponse.data);
        console.log(
          "studentResponse:",
          studentResponse.data,
          myFormData.classId
        );

        loadStudentGrade();
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleStudentChange = (e, Result) => {
    const { name, value, files } = e.target;

    if (name === "studentId") {
      const subStaff = Result.find((student) => student.id === parseInt(value));
      const studentname = subStaff ? subStaff.StudentName : null;
      console.log("running subjectId", studentname);
      setMyFormData({
        ...myFormData,
        studentId: parseInt(value),
        studentName: studentname,
      });
    } else {
      updateField(name, value);
    }

    console.log(myFormData);
  };

  const handleSubjectChange = (e, subResult) => {
    const { name, value, files } = e.target;

    if (name === "subjectId") {
      console.log("running subjectId");
      const subStaff = subResult.find(
        (subject) => subject.id === parseInt(value)
      );
      const subjectName = subStaff ? subStaff.SubjectName : null;
      setMyFormData({
        ...myFormData,
        subjectId: parseInt(value),
        subjectName: subjectName,
      });
    } else {
      updateField(name, value);
    }

    console.log(myFormData);
  };

  const handleClassChange = (e, clasResult) => {
    const { name, value, files } = e.target;

    if (name === "classId") {
      console.log("running subjectId");
      const clasStaff = clasResult.find((clas) => clas.id === parseInt(value));
      console.log("clasStaff", clasStaff);
      const className = clasStaff ? clasStaff.ClassName : null;
      setMyFormData({
        ...myFormData,
        classId: parseInt(value),
        className: className,
      });
    } else {
      updateField(name, value);
    }

    console.log(myFormData);
  };

  const handleInputChange = (e, result) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const imageSelected = files[0];
      console.log("running file:");
      updateField(name, imageSelected);
    } else if (name === "staffId") {
      console.log("running staffId");
      const selectedStaff = result.find(
        (staff) => staff.id === parseInt(value)
      );
      const staffName = selectedStaff ? selectedStaff.StaffName : null;
      setMyFormData({
        ...myFormData,
        staffId: parseInt(value),
        staffName: staffName,
      });
    } else if (name === "staffId") {
      console.log("running staffId");
      const selectedStaff = result.find(
        (staff) => staff.id === parseInt(value)
      );
      const staffName = selectedStaff ? selectedStaff.StaffName : null;
      setMyFormData({
        ...myFormData,
        staffId: parseInt(value),
        staffName: staffName,
      });
    } else if (name === "examScore") {
      // Calculate the total score here based on the exam score
      const examScore = parseFloat(value);
      const totalScore = examScore + parseFloat(myFormData.classCore);
      setMyFormData({
        ...myFormData,
        examScore: examScore,
        totalScore: totalScore,
      });
    } else if (name === "classCore") {
      // Calculate the total score here based on the exam score
      const clasScore = parseFloat(value);
      const totalScore = clasScore + parseFloat(myFormData.examScore);
      setMyFormData({
        ...myFormData,
        classCore: clasScore,
        totalScore: totalScore,
      });
    } else {
      updateField(name, value);
    }

    console.log(myFormData);
  };

  const handleBack = () => {
    setIsSubjectSelected(false);
  };

  const goback = () => {
    navigate(-1);
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();

    if (myFormData.year > parseInt(year) || myFormData.year < 2000) {
      toast.error("The year should be between 2000 and current year.");
    } else {
      setIsSubjectSelected(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (myFormData.year > parseInt(year) || myFormData.year < 2000) {
      toast.error("The year should be between 2000 and the current year.");
    } else {
      const apiUrl = "http://localhost:5050/api/addStudentGrade";

      axios
        .post(apiUrl, {
          subjectName: myFormData.subjectName,
          subjectId: myFormData.subjectId,
          staffName: myFormData.staffName,
          staffId: myFormData.staffId,
          studentName: myFormData.studentName,
          studentId: myFormData.studentId,
          className: myFormData.className,
          classId: myFormData.classId,
          gradeId: myFormData.gradeId,
          gradeName: myFormData.gradeName,
          semester: myFormData.semester,
          year: myFormData.year,
          classCore: myFormData.classCore,
          examScore: myFormData.examScore,
          totalScore: myFormData.totalScore,
        })
        .then(() => {
          setMyFormData(initialState);
        })
        .catch((err) => toast.error("error", err.response));

      setMyFormData({
        ...myFormData,
        studentName: "",
        studentId: null,
        classCore: 0,
        examScore: 0,
        totalScore: null,
      });

      SetUploaded(!uploaded);

      console.log("formdata", myFormData);

      const successMessage = id
        ? "Data updated successfully"
        : "Data saved successfully";
      toast.success(successMessage);
      setTimeout(() => {
        // navigate(-1);
        loadStudentGrade();
      }, 500);
    }
  };
  useEffect(() => {
    setMyFormData({
      ...myFormData,
      studentName: null,
      studentId: null,
      classCore: 0,
      examScore: 0,
      totalScore: 0,
    });
    console.log("uploaded", uploaded);
    console.log("formdataaaaaa", myFormData);
  }, [uploaded]);

  useEffect(() => {
    console.log("running load data");
    loadData();
  }, [isSubjectSelected]);

  return (
    <div>
      {!isSubjectSelected && (
        <SelectSubject
          setIsSubjectSelected={setIsSubjectSelected}
          myFormData={myFormData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
          teachers={teachers}
          setMyFormData={setMyFormData}
          id={id}
          subjectResults={subjectResults}
          staffResults={staffResults}
          clasResults={clasResults}
          handleSubjectChange={handleSubjectChange}
          handleClassChange={handleClassChange}
          handleSubmit1={handleSubmit1}
          goback={goback}
        />
      )}
      {isSubjectSelected && (
        <EnterMarks
          setIsSubjectSelected={setIsSubjectSelected}
          myFormData={myFormData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
          teachers={teachers}
          setMyFormData={setMyFormData}
          id={id}
          subjectResults={subjectResults}
          staffResults={staffResults}
          handleBack={handleBack}
          handleStudentChange={handleStudentChange}
          studentResults={studentResults}
          studentGradeResults={studentGradeResults}
        />
      )}
    </div>
  );
};
