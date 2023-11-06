import React, {useState, useEffect, useContext} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";
import axios from "axios";
import StaffDetailsPage from '../../Components/Teacher/StaffDetailsPage';
import { StateContext } from '../../Components/utils/Context';

export const StaffDetails = () => {


  const { showNavBar, setShowNavBar, userDetails, setUserDetails } = useContext(StateContext);
    const [staff, setStaff] = useState([]);
    const [parent1, setParent1] = useState([]);
    const [parent2, setParent2] = useState([]);
    const [parent1Mapping, setParent1Mapping] = useState([]);
    const [parent2Mapping, setParent2Mapping] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();
    const {id} = useParams()
    const currentDate = new Date().toLocaleDateString();
 
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
  

    const handleBack = () => {
        navigate(-1)
      }

      const handleDelete = () => {
        const userConfirmed = window.confirm("Are you sure you want to perform this action?");
        if (userConfirmed) {
          
        }
      }


      const loadData = async () => {
        try {
          const staffResponse = await axios.get(`http://localhost:5050/api/getStaff/${id}`);
          if (staffResponse.data.length > 0) {
            const selectedStaff = staffResponse.data[0];
            setStaff(staffResponse.data[0]);
            const staffId = selectedStaff.id;
            setImageUrl(`http://localhost:5050/uploads/${selectedStaff.Image}`);
            console.log('studentId', staffId)

        }
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };

    useEffect(()=>{
        loadData();
        console.log('staff',staff)
    }, [id])

  return (
    <StaffDetailsPage 
    handleBack = {handleBack}
    imageUrl = {imageUrl}
    staff = {staff}
    handleDelete = {handleDelete}
    />
  )
}
