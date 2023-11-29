import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { StudentPaymentHistoryPage } from "./StudentPaymentHistoryPage";
import { StateContext } from "../../Components/utils/Context";

export const StudentPaymentHistory = () => {
  const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
    useContext(StateContext);
  const [query, setQuery] = useState("");
  const [payments, setPayments] = useState([]);
  const [isSearchBarActive, setSearchBarActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const selectRef = useRef(null);
  const { studentId } = useParams();
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
    fetchPayment();
  };

  const fetchPayment = async () => {
    try {
      console.log("running try:.......", studentId);
      const response = await axios.get(
        `http://localhost:5050/api/getStudentPayments/${studentId}`
      );
      setPayments(response.data);
      console.log("response:", response.data);
      setErrorMessage("Please enter a search query.");
      return;
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    fetchPayment();
    console.log('payments', payments)
  }, [query]);

  return (
    <div>
      <StudentPaymentHistoryPage
        handleSearchBarFocus={handleSearchBarFocus}
        handleSearchBarBlur={handleSearchBarBlur}
        handleInputChange={handleInputChange}
        query={query}
        fetchPayment={fetchPayment}
        payments={payments}
        isSearchBarActive={isSearchBarActive}
      />
    </div>
  );
};
