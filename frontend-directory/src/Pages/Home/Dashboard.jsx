import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import axios from "axios";
import { StateContext } from "../../Components/utils/Context";

export const Dashboard = () => {
  const { showNavBar, setShowNavBar, userDetails, setUserDetails } = useContext(StateContext);
  const [students, setStudents] = useState([]);
  const [studentsOwing, setStudentsOwing] = useState([]);
  const [newStudents, setNewStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [classes, setclasses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentsForWeek, setPaymentsForWeek] = useState([]);
  const [totalOwing, setTotalOwing] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalPaymentForWeek, setTotalPaymentForWeek] = useState(0);
  const [userName, setUserName] = useState("");
  let sum;
  let formattedMoney;
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


  const loadData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5050/api/getPaymentsForDay"
      );
      setPayments(response.data);
      // console.log("response:", response.data);
      const amounts = response.data.map((payment) => payment.AmountPaid);
      sum = amounts.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      formattedMoney = new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2,
      }).format(sum);
      setTotalPayment(formattedMoney);
      // console.log("Total amount:", amounts, sum);

      const paymentForWeekresponse = await axios.get(
        "http://localhost:5050/api/getPaymentsForWeek"
      );
      setPaymentsForWeek(paymentForWeekresponse.data);
      // console.log("paymentForWeekresponse:", paymentForWeekresponse.data);
      const amountsForWeek = paymentForWeekresponse.data.map(
        (payment) => payment.AmountPaid
      );
      sum = amountsForWeek.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      formattedMoney = new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2,
      }).format(sum);
      setTotalPaymentForWeek(formattedMoney);
      // console.log("Total amount for week:", amounts, sum);

      const Staffresponse = await axios.get(
        "http://localhost:5050/api/getStaff"
      );
      setStaff(Staffresponse.data);
      // console.log("Staffresponse:", Staffresponse.data);

      const Studentresponse = await axios.get(
        "http://localhost:5050/api/getStudents"
      );
      setStudents(Studentresponse.data);
      // console.log("Studentresponse:", Studentresponse.data);

      const newStudentresponse = await axios.get(
        "http://localhost:5050/api/getNewStudentsForDay"
      );
      setNewStudents(newStudentresponse.data);
      // console.log("newStudentresponse:", newStudentresponse.data);

      const studentOwingresponse = await axios.get(
        "http://localhost:5050/api/getStudentsOwing"
      );
      setStudentsOwing(studentOwingresponse.data);
      // console.log("studentOwingresponse:", studentOwingresponse.data);
      const amountOwing = studentOwingresponse.data.map(
        (amountOwed) => amountOwed.AmountOwed
      );
      sum = amountOwing.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );

      formattedMoney = new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2,
      }).format(sum);
      setTotalOwing(formattedMoney);
      // console.log("Total amount for week:", amounts, sum);
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [sum]);

  return (
    <div className="dashboard">
      <main className="main" style={{ marginTop: "30px" }}>
        <Link className="link-none widget" to="/staffList">
          <section className="">
          <div className="profile bold-div link">STAFF</div>
            NUMBER OF STAFF
            <div className="profile bold-div">{staff?.length}</div>
          </section>
        </Link>

        <Link className="link-none widget" to="/studentList">
          <section className="">
          <div className="profile bold-div link">Students</div>
            NUMBER OF Students
            <div className="student-info bold-div">{students?.length}</div>
            NUMBER OF new Students
            <div className="student-info bold-div">{newStudents?.length}</div>
          </section>
        </Link>

        <Link className="link-none widget" to="/paymentList">
          <section className="">
          <div className="profile bold-div link">Payments</div>

            Number of payments for the day:
            <div className="fee-summary bold-div ">{payments?.length}</div>
            Total amount received for the day:
            <div className="fee-summary bold-div">{totalPayment}</div>
            total payment for the week:
            <div className="fee-summary bold-div">{totalPaymentForWeek}</div>
          </section>
        </Link>

        <Link className="widget link-none" to="/studentOwingList">
          <section className="">
          <div className="profile bold-div link">Debtors</div>

            Number of stuents owing fees
            <div className="payment-history bold-div">
              {studentsOwing.length}
            </div>
            Amount owed by students:
            <div className="payment-history bold-div">{totalOwing}</div>
          </section>
        </Link>

        <Link className="link-none widget" to="/reportsMainPage">
          <section className="">
          <div className="profile bold-div link">Reports</div>

            <div className="notifications bold-div">reports page</div>
          </section>
        </Link>

        <Link className="link-none widget" to="/accessMainPage">
          <section className="">
          <div className="profile bold-div link">Accessment</div>

            <div className="notifications bold-div">view and add results</div>
          </section>
        </Link>

        <Link className="link-none widget" to="/addClassFees">
          <section className="">
          <div className="profile bold-div link">Add fees</div>
            Add new fees for New term
          </section>
        </Link>

        {/* Add more widgets as needed */}
      </main>

      <footer className="footer">
        <p>&copy; 2023 GREATER GRACE CHRISTIAN ACADEMY</p>
      </footer>
    </div>
  );
};

export default Dashboard;
