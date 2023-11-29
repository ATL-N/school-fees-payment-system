import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../Student/AddEditStudent.css";
import { AddEditStaffForm } from "../../Components/Teacher/AddEditStaffForm";
import { StateContext } from "../../Components/utils/Context";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage, database } from "../../Components/config/firebase";

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
    password: '1234',
  };

  const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
    useContext(StateContext);
  const [staffResults, setStaffResults] = useState([]);
  const [staffFormData, setStaffFormData] = useState(initialState);
  const [selectedImage, setSelectedImage] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
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
      setImageUpload(imageSelected);
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
            image: staff.image,
            staffName: staff.staffname,
            dateOfBirth: staff.dateofbirth,
            contactNumber: staff.contactnumber,
            email: staff.email,
            gender: staff.gender,
            qualification: staff.qualification,
            role: staff.role,
            address: staff.address,
            salary: staff.salary,
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

        setSelectedImage(selectedStaff.image);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!staffFormData.staffName || !staffFormData.role) {
      toast.error("Please provide a value for each input.");
    } else {
      const confirmSubmit = window.confirm(
        "Are you sure you want to submit the data?"
      );
      if (confirmSubmit) {
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
          ? `http://localhost:5050/api/updateStaff/${id}`
          : "http://localhost:5050/api/addStaff";
      
        axios
          .post(apiUrl, {
            image: downloadURL, // Use the downloadURL in the request
            staffName: staffFormData.staffName,
            dateOfBirth: staffFormData.dateOfBirth,
            contactNumber: staffFormData.contactNumber,
            email: staffFormData.email,
            gender: staffFormData.gender,
            qualification: staffFormData.qualification,
            role: staffFormData.role,
            address: staffFormData.address,
            salary: staffFormData.salary,
            password: staffFormData.password,
          })
          .then((response) => {
            // console.log("running then column", response);
            if (response.data.message) {
              // setStaffFormData(initialState);
              toast.success(response.data?.message);
              setTimeout(() => {
                navigate(-1);
              }, 500);
            } else if (response.data.error) {
              toast.error(response.data.error);
              setTimeout(() => {
                // navigate(-1);
              }, 500);
            } else {
              toast.error("Unknown Error");
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
