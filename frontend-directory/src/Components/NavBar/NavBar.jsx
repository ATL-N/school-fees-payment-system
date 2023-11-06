import React,{useEffect, useState, useContext } from 'react'
import { LogoBar } from './LogoBar'
import { UserAccount } from './AccountBar'
import { Link } from 'react-router-dom'
import axios from "axios";
import { StateProvider, StateContext } from '../utils/Context';

export const NavBar = () => {
  const { showNavBar, setShowNavBar, userDetails, setUserDetails} = useContext(StateContext);

  
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
    <>

    {showNavBar &&

    <div className='header-container'>
    <header className="header">
        <div><LogoBar/></div>
        <div className='uppercase'><h1>Welcome, {userDetails?.StaffName}</h1></div>
        <div className='header-account-div'><UserAccount /></div>

        
    </header>
    <nav className="nav">
      <ul className="nav-ul">
          <Link to="/studentList" className='nav-a'> <li className="nav-li"> STUDENTS </li></Link>
          <Link to="/staffList" className='nav-a'><li className="nav-li"> STAFF </li></Link>
          <Link to="/classList" className='nav-a'><li className="nav-li"> CLASSES </li></Link>
          <Link to="/expenseList" className='nav-a'><li className="nav-li"> EXPENSES </li></Link>
          <Link to="/selectStudent" className='nav-a'><li className="nav-li"> RECEIVE FEES </li></Link>
      </ul>
    </nav>
    </div>

    }
    </>
  )
}
