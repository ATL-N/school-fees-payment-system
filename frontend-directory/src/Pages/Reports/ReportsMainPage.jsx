import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { StateContext } from "../../Components/utils/Context";

export const ReportsMainPage = () => {
  const { showNavBar, setShowNavBar, userDetails, setUserDetails } =
    useContext(StateContext);
  const [students, setStudents] = useState([]);
  const [studentsOwing, setStudentsOwing] = useState([]);
  const [newStudents, setNewStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [paymentsForWeek, setPaymentsForWeek] = useState([]);
  const [totalOwing, setTotalOwing] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalPaymentForWeek, setTotalPaymentForWeek] = useState(0);
  const [totalExpenseForWeek, setTotalExpenseForWeek] = useState(0);
  const [totalExpenseForDay, setTotalExpenseForDay] = useState(0);
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
      console.log("response:", response.data);
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
      console.log("Total amount:", amounts, sum);

      const paymentForWeekresponse = await axios.get(
        "http://localhost:5050/api/getPaymentsForWeek"
      );
      setPaymentsForWeek(paymentForWeekresponse.data);
      console.log("paymentForWeekresponse:", paymentForWeekresponse.data);
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
      console.log("Total amount for week:", amounts, sum);

      const expenseResponse = await axios.get(
        "http://localhost:5050/api/getExpensesForDay"
      );
      setExpenses(expenseResponse.data);
      console.log("expenseResponse:", expenseResponse.data);
      const expenseAmountsforDay = expenseResponse.data.map(
        (payment) => payment.AmountPaid
      );
      sum = expenseAmountsforDay.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      formattedMoney = new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2,
      }).format(sum);
      setTotalExpenseForDay(formattedMoney);
      console.log("Total amount:", expenseAmountsforDay, sum);

      const expenseForWeekresponse = await axios.get(
        "http://localhost:5050/api/getExpensesForWeek"
      );
      setTotalExpenseForWeek(expenseForWeekresponse.data);
      console.log("expenseForWeekresponse:", expenseForWeekresponse.data);
      const expenseAmountsForWeek = expenseForWeekresponse.data.map(
        (expense) => expense.AmountPaid
      );
      sum = expenseAmountsForWeek.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      formattedMoney = new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2,
      }).format(sum);
      setTotalExpenseForWeek(formattedMoney);
      console.log(
        "Total amount spent for week:",
        expenseForWeekresponse.data.length,
        sum
      );

      const Staffresponse = await axios.get(
        "http://localhost:5050/api/getStaff"
      );
      setStaff(Staffresponse.data);
      console.log("Staffresponse:", Staffresponse.data);

      const classresponse = await axios.get(
        "http://localhost:5050/api/getClasses"
      );
      setClasses(classresponse.data);
      console.log("classresponse:", classresponse.data);

      const Studentresponse = await axios.get(
        "http://localhost:5050/api/getStudents"
      );
      setStudents(Studentresponse.data);
      console.log("Studentresponse:", Studentresponse.data);

      const newStudentresponse = await axios.get(
        "http://localhost:5050/api/getNewStudentsForDay"
      );
      setNewStudents(newStudentresponse.data);
      console.log("newStudentresponse:", newStudentresponse.data);

      const studentOwingresponse = await axios.get(
        "http://localhost:5050/api/getStudentsOwing"
      );
      setStudentsOwing(studentOwingresponse.data);
      console.log("studentOwingresponse:", studentOwingresponse.data);
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
      console.log("Total amount for week:", amounts, sum);
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
        <Link className="link-none widget" to="/studentList">
          <section className="">
          <div className="profile bold-div link">STUDENTS</div>
            Number of active students
            <div className="student-info bold-div">{students?.length}</div>
            Number of active staff
            <div className="student-info bold-div">{staff?.length}</div>
            Number of active classes
            <div className="student-info bold-div">{classes?.length}</div>
          </section>
        </Link>

        <Link className="link-none widget" to="/paymentList">
          <section className="">
          <div className="profile bold-div link">PAYMENTS</div>
            Number of payments for the day:
            <div className="fee-summary bold-div ">{payments?.length}</div>
            Total amount received for the day:
            <div className="fee-summary bold-div">{totalPayment}</div>
            total payment for the week:
            <div className="fee-summary bold-div">{totalPaymentForWeek}</div>
          </section>
        </Link>

        <Link
          className="link-none widget"
          to="/expenseList"
          title="CLICK TO SEE THE REPORTS OF THE EXPENSES"
        >
          <section className="">
          <div className="profile bold-div link">EXPENSES</div>
            number of EXPENSES for day:
            <div className="fee-summary bold-div ">{expenses?.length}</div>
            Total EXPENSES for day:
            <div className="fee-summary bold-div ">{totalExpenseForDay}</div>
            Total EXPENSES for week:
            <div className="fee-summary bold-div ">{totalExpenseForWeek}</div>
          </section>
        </Link>

        <Link className="widget link-none" to="/studentOwingList">
          <section className="">
          <div className="profile bold-div link">DEBTORS</div>
            Number of stuents owing fees
            <div className="payment-history bold-div">
              {studentsOwing.length}
            </div>
            FEES IN AREARS REPORTS:
            <div className="payment-history bold-div">{totalOwing}</div>
          </section>
        </Link>


      </main>

      <footer className="footer">
        <p>&copy; 2023 GREATER GRACE CHRISTIAN ACADEMY</p>
      </footer>
    </div>
  );
};
