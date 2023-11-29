import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FeesAddingForm } from "./FeesAddingForm";
import { StateContext } from "../utils/Context";

export const FeesAdding = () => {

  const { showNavBar, setShowNavBar, userDetails, setUserDetails, currentTerm, setCurrentTerm } = useContext(StateContext);
  console.log("currentTerm:", currentTerm)

  const initialState = {
    classId: null,
    className: "",
    semesterid: currentTerm.id,
    semestername: currentTerm.semestername,
    feesType: "",
    feesForTheTime: null,
  };

  const [feesAddingFormData, setFeesAddingFormData] = useState(initialState);
  const { id } = useParams();
  const navigate = useNavigate();
  const [classResults, setClassResults] = useState([]);
  var check = 0

  const updateField = (field, value) => {
    setFeesAddingFormData({
      ...feesAddingFormData,
      [field]: value,
    });
    console.log(feesAddingFormData);
  };

  const handleInputChange = (e, clasResult) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const imageSelected = files[0];
      console.log("running file:");
      updateField(name, imageSelected);
    } else if (name === "classid") {
      const clas = clasResult.find((classe) => classe.id === parseInt(value));
      console.log("clas", clas, clasResult);
      const stuClas = clas ? clas.classname : null;
      console.log("clas3", clas, stuClas);
      setFeesAddingFormData({
        ...feesAddingFormData,
        classId: parseInt(value),
        className: stuClas,
      });
    } else {
      updateField(name, value);
    }
  };

  const resetForm = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the form? This action is permanent"
    );
    if (confirmReset) {
      setFeesAddingFormData(initialState);
      // window.location.reload();
    }
  };

  const fetchClasses = async () => {
    const response = await axios.get("http://localhost:5050/api/getClasses");
    setClassResults(response.data);
    console.log("fetching Teachers");

    const currentSem = await axios.get(
      "http://localhost:5050/api/getSemester"
    );
    setCurrentTerm(currentSem.data[0]);
    console.log("currentSem:", currentSem.data[0].semestername);

  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!feesAddingFormData.className || !feesAddingFormData.feesForTheTime) {
      toast.error("Please provide a value for each input field.");
    } else {
      const confirmedFeeAdd = window.confirm(
        `Would you like to add fees? This action is irrevesible`
      );
      if (confirmedFeeAdd) {
        const apiUrl = id
          ? `http://localhost:5050/api/updateClass/${id}`
          : "http://localhost:5050/api/addFees";

        axios
          .post(apiUrl, {
            classId: feesAddingFormData.classId,
            className: feesAddingFormData.className,
            dateStart: feesAddingFormData.dateStart,
            semesterid: feesAddingFormData.semesterid,
            dateEnd: feesAddingFormData.dateEnd,
            feesForTheTime: feesAddingFormData.feesForTheTime,
            feesType: feesAddingFormData.feesType,
          })
          .then((response) => {
            setFeesAddingFormData(initialState);
            const { message, updateMessage } = response.data;
            toast.success(message);
            toast.success(updateMessage);
            setTimeout(() => {
              navigate(-1);
            }, 500);
          })
          .catch((err) => toast.error(err.response));
      }
    }
  };

  useEffect(() => {
    fetchClasses();
    setFeesAddingFormData({
      ...feesAddingFormData,
      semesterid: currentTerm.id,
      semestername: currentTerm.semestername,
    })
    if (check<=2){
      check = check + 1
    }
  }, [check]);

  return (
    <div className="form-container">
      <FeesAddingForm
        feesAddingFormData={feesAddingFormData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
        classResults={classResults}
        setFeesAddingFormData={setFeesAddingFormData}
        id={id}
        currentTerm = {currentTerm}
      />
    </div>
  );
};
