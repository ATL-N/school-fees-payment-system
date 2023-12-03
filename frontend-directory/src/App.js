import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { StateProvider, StateContext } from "./Components/utils/Context";
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Outlet,
} from "react-router-dom";
import { NavBar } from "./Components/NavBar/NavBar";
import { Dashboard } from "./Pages/Home/Dashboard";
import { AddEditStudent } from "./Pages/Student/AddEditStudent";
import { AddEditSubject } from "./Pages/Reports/AddEditSubject";
import { AddEditClass } from "./Pages/AddClass/AddEditClass";
import { AddEditStaff } from "./Pages/AddStaff/AddEditStaff";
import { SelectStudent } from "./Pages/FeesPayment/SelectStudent";
import { MakePayment } from "./Pages/FeesPayment/MakePayment";
import { StudentListing } from "./Pages/Student/StudentListing";
import { StudentDetails } from "./Pages/Student/StudentDetails";
import { FeeListing } from "./Pages/Fee/FeesListing";
import { PaymentList } from "./Pages/FeesPayment/PaymentList";
import { ClassListing } from "./Pages/AddClass/ClassListing";
import { StudentPaymentHistory } from "./Pages/FeesPayment/StudentPaymentHistory";
import { StaffListing } from "./Pages/AddStaff/StaffListing";
import { StaffDetails } from "./Pages/AddStaff/StaffDetails";
import { StudentOwingListing } from "./Pages/Student/StudentOwingListing";
import { ReportsMainPage } from "./Pages/Reports/ReportsMainPage";
import { AccessmentMainPage } from "./Pages/Reports/AccessmentMainPage";
import { SubjectListing } from "./Pages/Subject/SubjectListing";
import { AddEditGrades } from "./Pages/Reports/AddEditGrades";
import { GradesListing } from "./Pages/Subject/GradesListing";
import { MainResultEntryPage } from "./Pages/Subject/resultsEntry/MainResultEntryPage";
import { MainResultViewPage } from "./Pages/Subject/ViewClassResult/MainResultViewPage";
import { PrintClassResult } from "./Pages/Reports/PrintClassResult";
import { StudentResult } from "./Pages/Subject/ViewClassResult/StudentResult";
import { PrintStudentResult } from "./Pages/Subject/ViewClassResult/PrintStudentResult";
import { AddEditExpenses } from "./Pages/Expenses/AddEditExpenses";
import { ExpensesListing } from "./Pages/Expenses/ExpensesListing";
import { PaymentReceiptPage } from "./Pages/FeesPayment/PaymentReceiptPage";
import { LoginPage } from "./Pages/LoginAndSignIn/LoginPage";
import { FeesAdding } from "./Components/fees/FeesAdding";
import { Footer } from "./Components/footer/Footer";
import { UserDiv } from "./Components/NavBar/UserDiv";
import { PrintEmptyClassListMainPage } from "./Pages/Subject/ViewClassResult/PrintEmptyClassListMainPage";
import { ChangePassword } from "./Pages/AddStaff/ChangePassword";
import { ErrorPage } from "./Pages/ErrorPage/ErrorPage";
import { PrintClassListPdfPage } from "./Pages/Reports/PrintClassListPdfPage";
import { MainAttendaceViewPage } from "./Pages/Attendance/MainAttendaceViewPage";
import { AddEditSemester } from "./Pages/Semester/AddEditSemester";

function App() {

  const { showNavBar, setShowNavBar, userDetails, setUserDetails, currentTerm, setCurrentTerm } = useContext(StateContext);

  const loadData = async () => {
    try {
      const currentSem = await axios.get(
        "postgres://schoolfeessystem_user:C2W8okMeXaRmvdfynkQ8XS6Tupr9tdnl@dpg-clhs3b7jc5ks73eo6j5g-a/schoolfeessystem/api/getSemester"
      );
      setCurrentTerm(currentSem.data[0]);
      console.log("currentSem:", currentSem.data[0].semestername);
      }catch(error){
        console.log('')
      }
  }
  
  useEffect(()=>{
    loadData()
  },[])

  return (
    <StateProvider>
      <BrowserRouter>
        {/* <Footer /> */}
        <UserDiv />
        <NavBar />
        <ToastContainer position="top-center" />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/loginPage" element={<LoginPage />} />
          <Route path="/addStudent" element={<AddEditStudent />} />
          <Route path="/editStudentDetails/:id" element={<AddEditStudent />} />
          <Route path="/addExpenses" element={<AddEditExpenses />} />
          <Route path="/addClass" element={<AddEditClass />} />
          <Route path="/editClassDetails/:id" element={<AddEditClass />} />
          <Route path="/addStaff" element={<AddEditStaff />} />
          <Route path="/editStaff/:id" element={<AddEditStaff />} />
          <Route path="/selectStudent" element={<SelectStudent />} />
          <Route path="/makePayment/:id" element={<MakePayment />} />
          <Route path="/studentList" element={<StudentListing />} />
          <Route path="/studentOwingList" element={<StudentOwingListing />} />
          <Route path="/viewStudentDetails/:id" element={<StudentDetails />} />
          <Route path="/viewStaffDetails/:id" element={<StaffDetails />} />
          <Route path="/feeList" element={<FeeListing />} />
          <Route path="/staffList" element={<StaffListing />} />
          <Route path="/paymentList" element={<PaymentList />} />
          <Route path="/classList" element={<ClassListing />} />
          <Route path="/expenseList" element={<ExpensesListing />} />
          <Route path="/paymentList/:id" element={<PaymentList />} />
          <Route
            path="/viewPaymentsHistory/:studentId"
            element={<StudentPaymentHistory />}
          />
          <Route path="/reportsMainPage" element={<ReportsMainPage />} />
          <Route path="/accessMainPage" element={<AccessmentMainPage />} />
          <Route path="/addSubject" element={<AddEditSubject />} />
          <Route path="/SubjectList" element={<SubjectListing />} />
          <Route path="/editSubjectDetails/:id" element={<AddEditSubject />} />
          <Route path="/addGrades" element={<AddEditGrades />} />
          <Route path="/GradesList" element={<GradesListing />} />
          <Route path="/editGradeDetails/:id" element={<AddEditGrades />} />
          <Route path="/selectForMarksPage" element={<MainResultEntryPage />} />
          <Route path="/viewClassResult" element={<MainResultViewPage />} />
          <Route path="/printClassList" element={<PrintEmptyClassListMainPage />} />
          <Route
            path="/printClassResult/:classId/:semester/:academicYear/:className"
            element={<PrintClassResult />}
          />
          <Route
            path="/printEmptyClassResult/:classId/:numberOfColumns/:className"
            element={<PrintClassListPdfPage />}
          />
          <Route
            path="/printStudentResult/:studentId/:classId/:semester/:academicYear/:total/:overallPosition"
            element={<PrintStudentResult />}
          />
          <Route
            path="/viewStudentResult/:studentId/:classId/:semester/:academicYear/:total/:overallPosition"
            element={<StudentResult />}
          />
          <Route path="/printPayment/:id" element={<PaymentReceiptPage />} />
          <Route path="/addClassFees" element={<FeesAdding />} />
          <Route path="/changeStaffPassword/:id" element={<ChangePassword />} />
          <Route path="/takeAttendance" element={<MainAttendaceViewPage />} />
          <Route path="/addSemester" element={<AddEditSemester />} />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </StateProvider>
  );
}

export default App;
