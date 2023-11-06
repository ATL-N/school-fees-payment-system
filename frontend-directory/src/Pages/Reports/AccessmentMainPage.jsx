import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { StateContext } from '../../Components/utils/Context';


export const AccessmentMainPage = () => {
    const { showNavBar, setShowNavBar, userDetails, setUserDetails } = useContext(StateContext);
    const [students, setStudents] = useState([])
    const [studentsOwing, setStudentsOwing] = useState([])
    const [newStudents, setNewStudents] = useState([])
    const [staff, setStaff] = useState([])
    const [classes, setclasses] = useState([])
    const [payments, setPayments] = useState([])
    const [paymentsForWeek, setPaymentsForWeek] = useState([])
    const [totalOwing, setTotalOwing] = useState(0)
    const [totalPayment, setTotalPayment] = useState(0)
    const [totalPaymentForWeek, setTotalPaymentForWeek] = useState(0)
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
            
            const response = await axios.get('http://localhost:5050/api/getPaymentsForDay');
            setPayments(response.data)
            console.log("response:",response.data)
            const amounts = response.data.map((payment) => payment.AmountPaid);
            sum = amounts.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            formattedMoney = new Intl.NumberFormat('en-GH', {
                style: 'currency',
                currency: 'GHS', 
                minimumFractionDigits: 2, 
              }).format(sum);
            setTotalPayment(formattedMoney)
            console.log('Total amount:', amounts, sum);

            const paymentForWeekresponse = await axios.get('http://localhost:5050/api/getPaymentsForWeek');
            setPaymentsForWeek(paymentForWeekresponse.data)
            console.log("paymentForWeekresponse:",paymentForWeekresponse.data)
            const amountsForWeek = paymentForWeekresponse.data.map((payment) => payment.AmountPaid);
            sum = amountsForWeek.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            formattedMoney = new Intl.NumberFormat('en-GH', {
                style: 'currency',
                currency: 'GHS', 
                minimumFractionDigits: 2, 
              }).format(sum);
            setTotalPaymentForWeek(formattedMoney)
            console.log('Total amount for week:', amounts, sum);

            const Staffresponse = await axios.get('http://localhost:5050/api/getStaff');
            setStaff(Staffresponse.data);
            console.log("Staffresponse:",Staffresponse.data)

            
            const Studentresponse = await axios.get('http://localhost:5050/api/getStudents');
            setStudents(Studentresponse.data);
            console.log("Studentresponse:",Studentresponse.data)
            
            const newStudentresponse = await axios.get('http://localhost:5050/api/getNewStudentsForDay');
            setNewStudents(newStudentresponse.data);
            console.log("newStudentresponse:",newStudentresponse.data)

            const studentOwingresponse = await axios.get('http://localhost:5050/api/getStudentsOwing');
            setStudentsOwing(studentOwingresponse.data);
            console.log("studentOwingresponse:",studentOwingresponse.data)
            const amountOwing = studentOwingresponse.data.map((amountOwed) => amountOwed.AmountOwed);
            sum = amountOwing.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            
            formattedMoney = new Intl.NumberFormat('en-GH', {
                style: 'currency',
                currency: 'GHS', 
                minimumFractionDigits: 2, 
              }).format(sum);
            setTotalOwing(formattedMoney)
            console.log('Total amount for week:', amounts, sum);

           
            
        }catch (error) {
            console.error('Network error:', error);
        }
    }

    useEffect(()=>{
        loadData()
    }, [sum])

    return (
        <div className="dashboard">

            <main className="main" style={{marginTop:'30px', height:'90vh'}}>
                <Link className='link-none widget' to='/SubjectList'>
                <section className="widget-div">
                    Subjects
                    <div className="profile bold-div">
                        {/* {staff?.length} */}
                    </div>
                </section>
                </Link>

                <Link className='link-none widget' to='/GradesList'>
                <section className="">
                    Grades
                    <div className="student-info bold-div">
                        {/* {students?.length} */}
                    </div>
                </section>
                </Link>

                <Link className='link-none widget' to='/selectForMarksPage' title='CLICK TO enter THE REPORTS OF subject'>
                <section className=''>
                    Enter marks
                    <div className="fee-summary bold-div ">
                        {/* {payments?.length} */}
                    </div>
                    
                </section>
                </Link>


                <Link className='widget link-none' to='/viewClassResult'>
                <section className="">
                    Class Result
                    <div className="payment-history bold-div">
                    {/* {studentsOwing.length} */}
                    </div>
                    
                </section>
                </Link>

                <Link className='widget link-none' to='/printClassList'>
                <section className="">
                    Print class List
                    <div className="payment-history bold-div">
                    </div>
                    
                </section>
                </Link>

            </main>

            <footer className="footer">
                <p>&copy; 2023 GREATER GRACE CHRISTIAN ACADEMY</p>
            </footer>
        </div>
    );
};

