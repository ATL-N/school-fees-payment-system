import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ClassListingPage } from "../../Components/Class/ClassListingPage";
import { StateContext } from "../../Components/utils/Context";

export const ClassListing = () => {
  const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
    useContext(StateContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
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
    fetchClasses();
  };

  const fetchClasses = async () => {
    try {
      if (query.trim() === "") {
        const response = await axios.get(
          "http://localhost:5050/api/getClasses"
        );
        setResults(response.data);
        console.log("response:", response.data);
        setErrorMessage("Please enter a search query.");
        return;
      } else {
        const response = await axios.get(
          `http://localhost:5050/api/searchClasses?query=${encodeURIComponent(
            query
          )}`
        );
        setResults(response.data);
        setErrorMessage("");
        console.log("response20:", response.data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleDelete = async (classId, ClassName) => {
    const deleteConfirmed = window.confirm(
      `Are you sure you want to delete ${ClassName} from the list`
    );
    if (deleteConfirmed) {
      const response = await axios.get(
        `http://localhost:5050/api/deleteClass/${classId}`
      );
      toast.success(`${ClassName} deleted succesfully`);
      setTimeout(() => {
        // navigate('/');
      }, 500);
    } else {
      toast.error(`Delete action cancelled`);
      toast.success(`${ClassName} deleted succesfully`);
      setTimeout(() => {
        // navigate('/');
      }, 500);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [query]);

  return (
    <div>
      <ClassListingPage
        handleSearchBarFocus={handleSearchBarFocus}
        handleSearchBarBlur={handleSearchBarBlur}
        handleInputChange={handleInputChange}
        query={query}
        fetchClasses={fetchClasses}
        results={results}
        isSearchBarActive={isSearchBarActive}
        handleDelete={handleDelete}
      />
    </div>
  );
};
