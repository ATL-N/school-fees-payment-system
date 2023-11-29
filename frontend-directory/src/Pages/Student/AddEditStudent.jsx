import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddEditStudent.css";
import { AddEditStudentForm } from "../../Components/Student/AddEditStudentForm";
import { StateContext } from "../../Components/utils/Context";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage, database } from "../../Components/config/firebase";

export const AddEditStudent = () => {
  const initialState = {
    stuId: "",
    image: null,
    studentName: "",
    studentClass: "",
    classid: null,
    amountOwed: 0,
    dateOfBirth: "",
    gender: "",
    address: "",
    parentNameM: "",
    parentMId: 0,
    parentSId: 0,
    customParentNameM: "",
    customParentNameMTel: "",
    customParentNameMMail: "",
    parentNameMAddress: "",
    customParentNameMRelation: "",
    custompPrentNameS: "",
    customParentNameSTel: "",
    customParentNameSMail: "",
    parentNameS: "",
    parentNameSAddress: "",
    customParentNameSRelation: "",
  };

  const [studentFormData, setStudentFormData] = useState(initialState);
  const [selectedImage, setSelectedImage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  var imageURL = "";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [parentResults, setParentResults] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isParentNotOnList, setIsParentNotOnList] = useState(false);
  const [isParent2NotOnList, setIsParent2NotOnList] = useState(false);
  const [parent1Mapping, setParent1Mapping] = useState([]);
  const [parent2Mapping, setParent2Mapping] = useState([]);
  const [parent1, setParent1] = useState([]);
  const [parent2, setParent2] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
    useContext(StateContext);

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
      });
  }, []);

  const updateField = (field, value) => {
    setStudentFormData({
      ...studentFormData,
      [field]: value,
    });
    console.log(studentFormData);
  };

  const handleInputChange = (e, clasResult) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      if (files.length > 0) {
        const imageSelected = files[0];
        setImageUpload(imageSelected);
        imageURL = URL.createObjectURL(imageSelected);
        setSelectedImage(imageURL);
        console.log("running file:", imageSelected);
        updateField(name, imageSelected);
        console.log("running imageSelected:", imageSelected, imageURL);
      }
    } else if (name === "parentMId") {
      if (value === "others") {
        console.log("running if");
        setIsParentNotOnList(true);

        setStudentFormData({
          ...studentFormData,
          customParentNameM: "",
        });
        setIsParentNotOnList(true);
        console.log("isParentNotOnList11", isParentNotOnList);
      } else {
        console.log("running else");
        setStudentFormData({
          ...studentFormData,
          customParentNameM: "",
        });
        // setIsParentNotOnList(false);

        console.log("isParentNotOnList", isParentNotOnList);
      }
      setStudentFormData({
        ...studentFormData,
        customParentNameM: "",
      });

      updateField(name, value);
    } else if (name === "parentSId") {
      if (value === "others") {
        setStudentFormData({
          ...studentFormData,
          customParentNameS: "",
        });
        setIsParent2NotOnList(true);
        console.log("setIsParent2NotOnList", isParent2NotOnList);
      } else {
        setStudentFormData({
          ...studentFormData,
          customParentNameS: "",
        });
        setIsParent2NotOnList(false);
      }
      setStudentFormData({
        ...studentFormData,
        customParentNameM: "",
      });

      updateField(name, value);
    } else if (name === "classid") {
      const clas = clasResult.find((classe) => classe.id === parseInt(value));
      console.log("clas", clas, clasResult);
      const stuClas = clas ? clas.classname : null;
      console.log("clas3", clas, stuClas);
      setStudentFormData({
        ...studentFormData,
        classid: parseInt(value),
        studentClass: stuClas,
      });
    } else {
      updateField(name, value);
      console.log("studentFormData", studentFormData);
    }
  };

  const resetForm = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the form?"
    );
    if (confirmReset) {
      setStudentFormData(initialState);
      setSelectedImage(null);
      window.location.reload();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentFormData.studentName || !studentFormData.studentClass) {
      toast.error("Please provide a value for each input.");
    } else {

      const confirmedClassAdd = window.confirm(`Add student`);
      
      if (confirmedClassAdd) {
        const currentDate = new Date();
        const currentDateToString = currentDate.toISOString();
      
        let downloadURL = ''; // Initialize downloadURL variable outside the try-catch block
      
        if (!id) {
          const imageRef = ref(
            storage,
            `images/${imageUpload?.name + currentDateToString}`
          );
          const snapshot = await uploadBytes(imageRef, imageUpload);
      
          try {
            downloadURL = await getDownloadURL(snapshot.ref);
            console.log("downloadURL", downloadURL);
          } catch (error) {
            toast.error(error);
            return; // Exit the function if there's an error in image upload
          }
        }
      
        const apiUrl = id
          ? `http://localhost:5050/api/updateStudent/${id}`
          : "http://localhost:5050/api/addStudent";
      
        axios
          .post(apiUrl, {
            stuId: studentFormData.stuId,
            image: downloadURL,
            studentName: studentFormData.studentName,
            studentClass: studentFormData.studentClass,
            classid: studentFormData.classid,
            amountOwed: studentFormData.amountOwed,
            dateOfBirth: studentFormData.dateOfBirth,
            gender: studentFormData.gender,
            address: studentFormData.address,
            parentNameM: studentFormData.parentNameM,
            parentMId: studentFormData.parentMId,
            customParentNameM: studentFormData.customParentNameM,
            customParentNameMTel: studentFormData.customParentNameMTel,
            customParentNameMMail: studentFormData.customParentNameMMail,
            parentNameMAddress: studentFormData.parentNameMAddress,
            custompPrentNameS: studentFormData.custompPrentNameS,
            customParentNameSTel: studentFormData.customParentNameSTel,
            customParentNameSMail: studentFormData.customParentNameSMail,
            parentNameS: studentFormData.parentNameS,
            parentNameSAddress: studentFormData.parentNameSAddress,
            parentSId: studentFormData.parentSId,
            customParentNameMRelation: studentFormData.customParentNameMRelation,
            customParentNameSRelation: studentFormData.customParentNameSRelation,
          })
          .then((response) => {
            const { message, error } = response.data;
            if (message) {
              setStudentFormData(initialState);
              toast.success(message);
              setTimeout(() => {
                navigate(-1);
              }, 500);
            } else {
              toast.error(error);
              setTimeout(() => {
                navigate(-1);
              }, 500);
            }
          })
          .catch((err) => toast.error(err.response));
      
      } 
      

    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/getClasses");
      setResults(response.data);
      console.log("response:", response.data);
      // toast.error('Error');
      return;
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const fetchParents = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/getParents");
      setParentResults(response.data);
      console.log("response:", response.data);
      return;
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const loadData = async () => {
    try {
      const studentResponse = await axios.get(
        `http://localhost:5050/api/getStudent/${id}`
      );
      if (studentResponse.data.length > 0) {
        const selectedStudent = studentResponse.data[0];
        setStudentResults(studentResponse.data);
        const studentId = selectedStudent.id;
        const mainParentId = selectedStudent.parentid;
        setSelectedImage(selectedStudent.image);
        console.log("studentIddddd", mainParentId);

        const parentMappingResponse = await axios.get(
          `http://localhost:5050/api/getStudentParentsMapping/${studentId}`
        );
        console.log(
          "parentMappingResponse",
          parentMappingResponse,
          parentMappingResponse.data.length
        );
        if (parentMappingResponse.data.length > 1) {
          
          const checkParent1ID = parentMappingResponse.data[0].parentid;

          let [selectedParent1, selectedParent2] = "";

          if (mainParentId === checkParent1ID) {
            selectedParent1 = parentMappingResponse.data[0];
            selectedParent2 = parentMappingResponse.data[1];

            setParent1Mapping(parentMappingResponse.data[0]);
            setParent2Mapping(parentMappingResponse.data[1]);
          } else {
            selectedParent2 = parentMappingResponse.data[0];
            selectedParent1 = parentMappingResponse.data[1];

            setParent2Mapping(parentMappingResponse.data[0]);
            setParent1Mapping(parentMappingResponse.data[1]);
          }

          const parent1Id = selectedParent1.parentid;
          const parent2Id = selectedParent2.parentid;

          console.log(
            "studentIddddd mainparent",
            mainParentId,
            checkParent1ID,
            parent1Id,
            parent2Id
          );

          const parentDetails1 = await axios.get(
            `http://localhost:5050/api/getParents/${parent1Id}`
          );
          const parentDetails2 = await axios.get(
            `http://localhost:5050/api/getParents/${parent2Id}`
          );
          console.log("running running24", parentDetails1.data.length);

          if (parentDetails1.data.length > 0) {
            console.log("running running3", parentDetails1.data.length);
            setParent1(parentDetails1.data[0]);
          }

          if (parentDetails2.data.length > 0) {
            console.log("running running4", parentDetails2.data.length);
            setParent2(parentDetails2.data[0]);
          }
        } else if (parentMappingResponse.data.length > 0) {
          console.log("running else if running");
          setParent1Mapping(parentMappingResponse.data[0]);
          const selectedParent1 = parentMappingResponse.data[0];
          const parent1Id = selectedParent1.parentid;
          const parentDetails1 = await axios.get(
            `http://localhost:5050/api/getParents/${parent1Id}`
          );
          if (parentDetails1.data.length > 0) {
            console.log("running running3", parentDetails1.data.length);
            setParent1(parentDetails1.data[0]);
          }
        } else {
          console.log("no parent in for this pupil");
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    console.log("useEffect running", id);
    if (id) {
      console.log("useEffect2 running", id);
      loadData();
      setIsParent2NotOnList(true);
      setIsParentNotOnList(true);
    }
  }, [query, id]);

  useEffect(() => {
    console.log("parent results:", studentResults);

    fetchClasses();
    fetchParents();
  }, []);

  return (
    <div className="form-container">
      <AddEditStudentForm
        studentFormData={studentFormData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        selectedImage={selectedImage}
        resetForm={resetForm}
        results={results}
        parentResults={parentResults}
        handleBack={handleBack}
        isParentNotOnList={isParentNotOnList}
        isParent2NotOnList={isParent2NotOnList}
        id={id}
        studentResults={studentResults}
        setStudentFormData={setStudentFormData}
        parent1={parent1}
        parent2={parent2}
        parent1Mapping={parent1Mapping}
        parent2Mapping={parent2Mapping}
      />
    </div>
  );
};
