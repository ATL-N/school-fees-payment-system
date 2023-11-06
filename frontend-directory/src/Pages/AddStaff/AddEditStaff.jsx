import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../Student/AddEditStudent.css";
import { AddEditStaffForm } from "../../Components/Teacher/AddEditStaffForm";
import { StateContext } from "../../Components/utils/Context";

export const AddEditStaff = () => {
  const initialState = {
    staffId: null,
    image: null,
    staffName: "",
    dateOfBirth: "",
    contactNumber: 0,
    email: "",
    gender: "",
    qualification: "",
    role: "",
    address: "",
    salary: null,
    password: 1234,
  };

  const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
    useContext(StateContext);
  const [staffResults, setStaffResults] = useState([]);
  const [staffFormData, setStaffFormData] = useState(initialState);
  const [selectedImage, setSelectedImage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  var imageURL = "";

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
    setStaffFormData({
      ...staffFormData,
      [field]: value,
    });
    console.log(staffFormData);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const imageSelected = files[0];
      imageURL = URL.createObjectURL(imageSelected);
      setSelectedImage(imageURL);
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
      if (id) {
        staffResults.map((staff) =>
          setStaffFormData({
            ...staffFormData,
            staffId: id,
            image: staff.Image,
            staffName: staff.StaffName,
            dateOfBirth: staff.DateOfBirth,
            contactNumber: staff.ContactNumber,
            email: staff.Email,
            gender: staff.Gender,
            qualification: staff.Qualification,
            role: staff.Role,
            address: staff.Address,
            salary: staff.Salary,
          })
        );
      } else {
        setStaffFormData(initialState);
        setSelectedImage(null);
      }
      window.location.reload();
    }
  };

  const fetchStaff = async () => {
    try {
      console.log("fetching staff2");

      const response = await axios.get(
        `http://localhost:5050/api/getStaff/${id}`
      );
      console.log("response.data", response.data);
      if (response.data.length > 0) {
        const selectedStaff = response.data[0];

        setSelectedImage(
          `http://localhost:5050/uploads/${selectedStaff.Image}`
        );
        console.log("fetching staff3");
        setStaffResults(response.data);
        console.log("response:", response.data);
        // toast.error('Error');
        return;
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleSubmit = (e) => {
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the data?"
    );
    if (confirmSubmit) {
      e.preventDefault();

      if (!staffFormData.staffName || !staffFormData.role) {
        toast.error("Please provide a value for each input.");
      } else {
        const apiUrl = id
          ? `http://localhost:5050/api/updateStaff/${id}`
          : "http://localhost:5050/api/addStaff";

        const formDataToSend = new FormData();
        formDataToSend.append("image", staffFormData.image);
        formDataToSend.append("staffName", staffFormData.staffName);
        formDataToSend.append("dateOfBirth", staffFormData.dateOfBirth);
        formDataToSend.append("contactNumber", staffFormData.contactNumber);
        formDataToSend.append("email", staffFormData.email);
        formDataToSend.append("gender", staffFormData.gender);
        formDataToSend.append("qualification", staffFormData.qualification);
        formDataToSend.append("role", staffFormData.role);
        formDataToSend.append("address", staffFormData.address);
        formDataToSend.append("salary", staffFormData.salary);
        formDataToSend.append("password", staffFormData.password);

        axios
          .post(apiUrl, formDataToSend)
          .then((response) => {
            console.log('running then column', response)
            if (response.data.message) {
              setStaffFormData(initialState);
              toast.success(response.data?.message);
              setTimeout(() => {
                navigate(-1);
              }, 500);
            }else if(response.data.error){
              toast.error(response.data.error)
              setTimeout(() => {
                // navigate(-1);
              }, 500);
            }
            else{
              toast.error('Unknown Error')
              setTimeout(() => {
                // navigate(-1);
              }, 500);
            }
          })
          .catch((err) => toast.error(err.response));
      }
    }
  };

  useEffect(() => {
    if (id) {
      console.log("fetching staff");
      fetchStaff();
    }
  }, [id]);

  return (
    <div className="form-container">
      <AddEditStaffForm
        staffFormData={staffFormData}
        setStaffFormData={setStaffFormData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        selectedImage={selectedImage}
        resetForm={resetForm}
        id={id}
        staffResults={staffResults}
      />
    </div>
  );
};
