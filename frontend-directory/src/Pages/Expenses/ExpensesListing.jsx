import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ExpensesListingPage } from "../../Components/Expenses/ExpensesListingPage";
import { StateContext } from "../../Components/utils/Context";

export const ExpensesListing = () => {
  const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
    useContext(StateContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isSearchBarActive, setSearchBarActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalExpensesForDate, setTotalExpensesForDate] = useState(0);

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
          `http://localhost:5050/api/getExpensesForDate?startDate=${encodeURIComponent(dateFormData.startDate)}&endDate=${encodeURIComponent(dateFormData.endDate)}`
        );
        setResults(response.data);

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
        setTotalExpensesForDate(formattedMoney);
        console.log("Total amount for date selected:",  sum);
  
      }else{
        toast.error("start date should be later then end date and or date cant be greater than today");

      }

      }
    
    } catch (error) {
      console.error("Network error:", error);
    }
  };


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
    fetchExpenses();
  };

  const fetchExpenses = async () => {
    try {
      if (query.trim() === "") {
        const response = await axios.get(
          "http://localhost:5050/api/getExpenses"
        );
        setResults(response.data);
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
        setTotalExpensesForDate(formattedMoney);
        return;
      } else {
        const response = await axios.get(
          `http://localhost:5050/api/searchExpenses?query=${encodeURIComponent(
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
    fetchExpenses();
  }, [query]);

  return (
    <div>
      <ExpensesListingPage
        handleSearchBarFocus={handleSearchBarFocus}
        handleSearchBarBlur={handleSearchBarBlur}
        handleInputChange={handleInputChange}
        query={query}
        fetchExpenses={fetchExpenses}
        results={results}
        isSearchBarActive={isSearchBarActive}
        handleDelete={handleDelete}
        handleInputChange1={handleInputChange1}
        dateFormData={dateFormData}
        handleSubmit={handleSubmit}
        totalExpensesForDate={totalExpensesForDate}
      />
    </div>
  );
};
