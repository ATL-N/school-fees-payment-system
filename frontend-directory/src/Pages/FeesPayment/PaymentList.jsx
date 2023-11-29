import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PaymentListPage from "./PaymentListPage";
import { StateContext } from "../../Components/utils/Context";

export const PaymentList = () => {
  const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
    useContext(StateContext);
  const [query, setQuery] = useState("");
  const [payments, setPayments] = useState([]);
  const [isSearchBarActive, setSearchBarActive] = useState(true);
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalExpensesForDate, setTotalPaymentsForDate] = useState(0);
  const selectRef = useRef(null);
  const navigate = useNavigate();
  let sum;
  let formattedMoney;
  const currentDate = new Date().toISOString().split('T')[0];



  const initialState = {
    startDate: Date,
    endDate: Date,
  };

  const [dateFormData, setDateFormData] = useState(initialState);


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

  const updateField = (field, value) => {
    setDateFormData({
      ...dateFormData,
      [field]: value,
    });
    console.log(dateFormData);
  };

  const handleInputChange1 = (e) => {
    const { name, value, files } = e.target;

      updateField(name, value);
      console.log('dateFormData', dateFormData)
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if(dateFormData.endDate =='' || dateFormData.startDate =='' ){
        toast.error("Please provide a value for each input field. or ");
      }else{
        if (dateFormData.startDate<=dateFormData.endDate && dateFormData.startDate <= currentDate && dateFormData.endDate <= currentDate){      
        const response = await axios.get(
          `http://localhost:5050/api/getPaymentsForDate?startDate=${encodeURIComponent(dateFormData.startDate)}&endDate=${encodeURIComponent(dateFormData.endDate)}`
        );
        setResults(response.data);
        setPayments(response.data);


        const amountsForDate = response.data.map(
          (payment) => payment.AmountPaid
        );
        sum = amountsForDate.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        formattedMoney = new Intl.NumberFormat("en-GH", {
          style: "currency",
          currency: "GHS",
          minimumFractionDigits: 2,
        }).format(sum);
        setTotalPaymentsForDate(formattedMoney);
        console.log("Total amount for date selected:",  sum);
  
      }else{
        toast.error("start date should be later then end date and or date cant be greater than today");

      }

      }
    
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const fetchPayment = async () => {
    try {
      if (query.trim() === "") {
        const response = await axios.get(
          "http://localhost:5050/api/getPayments"
        );
        setPayments(response.data);
        const amountsForDate = response.data.map(
          (payment) => payment.amountpaid
        );
        sum = amountsForDate.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        formattedMoney = new Intl.NumberFormat("en-GH", {
          style: "currency",
          currency: "GHS",
          minimumFractionDigits: 2,
        }).format(sum);
        setTotalPaymentsForDate(formattedMoney);

        return;
      } else {
        const response = await axios.get(
          `http://localhost:5050/api/searchPayments?query=${encodeURIComponent(
            query
          )}`
        );
        setPayments(response.data);
        const amountsForDate = response.data.map(
          (payment) => payment.amountpaid
        );
        sum = amountsForDate.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        formattedMoney = new Intl.NumberFormat("en-GH", {
          style: "currency",
          currency: "GHS",
          minimumFractionDigits: 2,
        }).format(sum);
        setTotalPaymentsForDate(formattedMoney);
      }

    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    fetchPayment();
    console.log('fetched payments:', payments)
  }, [query]);

  return (
    <div>
      <PaymentListPage
        handleSearchBarFocus={handleSearchBarFocus}
        handleSearchBarBlur={handleSearchBarBlur}
        handleInputChange={handleInputChange}
        query={query}
        fetchPayment={fetchPayment}
        payments={payments}
        isSearchBarActive={isSearchBarActive}
        dateFormData={dateFormData}
        handleSubmit={handleSubmit}
        totalExpensesForDate={totalExpensesForDate}
        handleInputChange1={handleInputChange1}
      />
    </div>
  );
};
