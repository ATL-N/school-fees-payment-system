import React, { useEffect, useState, useContext } from "react";
import { PaymentPDF } from "./PaymentPDF";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { StateContext } from "../../Components/utils/Context";

export const PaymentReceiptPage = () => {
  const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
    useContext(StateContext);
  const [results, setResults] = useState([]);
  const { id } = useParams();
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

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/api/getPayments/${id}`
        );
        setResults(response.data[0]);
        console.log("response:", response.data[0]);
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    console.log("running useeffect");
    fetchExpenses();
    console.log("results", results, id);
  }, [id]);

  return (
    <div style={{ marginTop: "60px" }}>
      <PaymentPDF results={results} />
    </div>
  );
};
