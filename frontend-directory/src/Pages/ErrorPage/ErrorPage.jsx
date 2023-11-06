import React,{useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios";
import { StateContext } from '../../Components/utils/Context';

export const ErrorPage = () => {


    const { showNavBar, setShowNavBar, userDetails, setUserDetails} = useContext(StateContext);

    setShowNavBar(false)

    useEffect(()=>{
      setShowNavBar(false)
      console.log('showNavBar', showNavBar)
    }, [])
  
    let username;
    const[userName, setUserName] = useState('')
    
    useEffect(() => {
      console.log('running userdetails useeffect')
      axios
        .get("http://localhost:5050/home")
        .then((res) => {
          setUserDetails(res.data.userDetails);
          setUserName(res.data.userDetails?.StaffName)
          username = res.data.userDetails?.StaffName
          console.log('userDetails222 UseContext', userDetails, userName)
      })
        .catch((err) => {
          console.log(err)
          console.log('running userdetails useeffect error')
        });
        console.log('running userdetails useeffect done')
    
    },[]);
    return (
        <div className="errorPage" style={{textAlign: "center" }}>
            <h1>ERROR FINDING THE REQUESTED PAGE</h1>
        </div>
    )
}