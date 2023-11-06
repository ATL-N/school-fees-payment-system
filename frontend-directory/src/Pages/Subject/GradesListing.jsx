import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { GradesListingPage } from "../../Components/Subject/GradesListingPage";
import { StateContext } from "../../Components/utils/Context";

export const GradesListing = () => {
  const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
    useContext(StateContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isSearchBarActive, setSearchBarActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const selectRef = useRef(null);
  const navigate = useNavigate();

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
    setQuery(e.target.value);
    fetchGrades();
  };

  const fetchGrades = async () => {
    try {
      if (query.trim() === "") {
        const response = await axios.get("http://localhost:5050/api/getGrades");
        setResults(response.data);
        console.log("response33355:", response.data);
        setErrorMessage("Please enter a search query.");
        return;
      } else {
        const response = await axios.get(
          `http://localhost:5050/api/searchClasses?query=${encodeURIComponent(
            query
          )}`
        );
        if (response.status === 200) {
          setResults(response.data);
          setErrorMessage("");
        } else {
          console.error("Error fetching data:", response.status);
          setErrorMessage("An error occurred while fetching data.");
          setResults([]);
        }
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleDelete = async (gradeId, gradeName) => {
    const deleteConfirmed = window.confirm(
      `Are you sure you want to delete ${gradeName} from the list`
    );
    if (deleteConfirmed) {
      const response = await axios.get(
        `http://localhost:5050/api/deleteGrade/${gradeId}`
      );
      toast.success(`${gradeName} deleted succesfully`);
      setTimeout(() => {
        // navigate('/');
      }, 500);
    } else {
      toast.error(`Delete action cancelled`);
      toast.success(`${gradeName} deleted succesfully`);
      setTimeout(() => {
        // navigate('/');
      }, 500);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [query]);

  return (
    <div>
      <GradesListingPage
        handleSearchBarFocus={handleSearchBarFocus}
        handleSearchBarBlur={handleSearchBarBlur}
        handleInputChange={handleInputChange}
        query={query}
        fetchGrades={fetchGrades}
        results={results}
        // teachers = {teachers}
        isSearchBarActive={isSearchBarActive}
        handleDelete={handleDelete}
      />
    </div>
  );
};
