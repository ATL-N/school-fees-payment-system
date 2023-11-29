import React, {useState, useEffect, useContext} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";
import axios from "axios";
import StudentDetailsPage from '../../Components/Student/StudentDetailsPage'
import { StateContext } from '../../Components/utils/Context';



export const StudentDetails = () => {


  const { showNavBar, setShowNavBar, userDetails, setUserDetails } = useContext(StateContext);
    const [student, setStudent] = useState([]);
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
          const studentResponse = await axios.get(`http://localhost:5050/api/getStudent/${id}`);
          if (studentResponse.data.length > 0) {
            const selectedStudent = studentResponse.data[0];
            setStudent(studentResponse.data[0]);
            const studentId = selectedStudent.id;
            setImageUrl(`http://localhost:5050/uploads/${selectedStudent.image}`);
            console.log('studentId', studentId)

            const parentMappingResponse = await axios.get(`http://localhost:5050/api/getStudentParentsMapping/${studentId}`);
            console.log('parentMappingResponse', parentMappingResponse, parentMappingResponse.data.length)
                if (parentMappingResponse.data.length > 1) {

                    setParent1Mapping(parentMappingResponse.data[0])
                    setParent2Mapping(parentMappingResponse.data[1])
                    
                    const selectedParent1 = parentMappingResponse.data[0];
                    const selectedParent2 = parentMappingResponse.data[1];

                    const parent1Id = selectedParent1.parentid;
                    const parent2Id = selectedParent2.parentid;



                    const parentDetails1 = await axios.get(`http://localhost:5050/api/getParents/${parent1Id}`);
                    const parentDetails2 = await axios.get(`http://localhost:5050/api/getParents/${parent2Id}`);
                    console.log('running running2', parentDetails1.data.length)

                    if (parentDetails1.data.length > 0) {
                            console.log('running running3', parentDetails1.data.length)
                            setParent1(parentDetails1.data[0])
                        }

                    if (parentDetails2.data.length > 0) {
                        console.log('running running4', parentDetails2.data.length)
                        setParent2(parentDetails2.data[0])
                    }

                }else if (parentMappingResponse.data.length > 0){
                    console.log('running else if running')
                    setParent1Mapping(parentMappingResponse.data[0])
                    const selectedParent1 = parentMappingResponse.data[0];
                    const parent1Id = selectedParent1.parentid;
                    console.log('running else if running', parent1Id)
                    const parentDetails1 = await axios.get(`http://localhost:5050/api/getParents/${parent1Id}`);
                    if (parentDetails1.data.length > 0) {
                        console.log('running running3', parentDetails1.data.length)
                        setParent1(parentDetails1.data[0])
                    }

                }
                else {
                    console.log('no parent in for this pupil')
                }
        }
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };

    useEffect(()=>{
        loadData();
        console.log('student',student)
    }, [id])

  return (
    <StudentDetailsPage 
    handleBack = {handleBack}
    parent1 = {parent1}
    parent2 = {parent2}
    parent1Mapping = {parent1Mapping}
    parent2Mapping = {parent2Mapping}
    imageUrl = {imageUrl}
    student = {student}
    handleDelete = {handleDelete}
    />
  )
}
