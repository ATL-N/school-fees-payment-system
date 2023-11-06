import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import {toast} from "react-toastify";
import axios from "axios";
import { StaffListingPage } from '../../Components/Teacher/StaffListingPage';

export const SubjectListing = () => {

  const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearchBarActive, setSearchBarActive] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const selectRef = useRef(null);




    const handleSearchBarFocus = () => {
        if (selectRef.current) {
            selectRef.current.click();
        }
        setSearchBarActive(true);
    };

    const handleSearchBarBlur = () => {
        setSearchBarActive(false);
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value)
        fetchStaff()
    }

    const fetchStaff = async () => {
        
        try {
            if (query.trim() === '') {
                const response = await axios.get('http://localhost:5050/api/getStaff');
                setResults(response.data);
                console.log("response:",response.data)
                setErrorMessage('Please enter a search query.');
                return;
            }else {
            const response = await axios.get(`http://localhost:5050/api/searchStaff?query=${encodeURIComponent(query)}`);
            if (response.status === 200) {
                setResults(response.data);
                setErrorMessage('');
              } else {
                console.error('Error fetching data:', response.status);
                setErrorMessage('An error occurred while fetching data.');
                setResults([]);
              }
          } 
        }catch (error) {
            console.error('Network error:', error);
        }

    }

    const handleDelete = async (staffId, staffName) => {
      const deleteConfirmed = window.confirm(`Are you sure you want to delete ${staffName}?`);
      if(deleteConfirmed){
        const response = await axios.get(`http://localhost:5050/api/deleteStaff/${staffId}`);
        toast.success(`${staffId} deleted successfully`);

    }

  }

  useEffect(()=>{
      fetchStaff()
  }, [query])



  return (
    <div>
      <StaffListingPage 
        handleSearchBarFocus = {handleSearchBarFocus}
        handleSearchBarBlur ={handleSearchBarBlur}
        handleInputChange = {handleInputChange}
        query ={query}
        fetchStaff = {fetchStaff}
        results = {results}
        isSearchBarActive ={isSearchBarActive}
        handleDelete = {handleDelete}
      />
    </div>
  )
}
