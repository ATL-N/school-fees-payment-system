import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { StateContext, StateProvider } from "../../Components/utils/Context";


export const LoginPage = () => {

  axios.defaults.withCredentials = true;

  const initialState = {
    username: "",
    password: "",
  };

  
  const { showNavBar, setShowNavBar, userDetails } = useContext(StateContext);
  const [loginFormData, setLoginFormData] = useState(initialState);
  const navigate = useNavigate();


  setShowNavBar(false)

  useEffect(()=>{
    setShowNavBar(false)
    console.log('showNavBar', showNavBar)
  }, [])

  const updateField = (field, value) => {
    setLoginFormData({
      ...loginFormData,
      [field]: value,
    });
    console.log(loginFormData);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    updateField(name, value);
  };


axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!loginFormData.username || !loginFormData.password) {
      toast.error("Please provide a value for each input field.");
    } else {
      axios.defaults.withCredentials = true;
      const apiUrl = "https://school-fees-payment-system-server.onrender.com/api/login";
      // const apiUrl = "http://localhost:5050/api/login";

      axios
        .post(apiUrl, {
          username: loginFormData.username,
          password: loginFormData.password,
        }, { withCredentials: true })
        .then((response) => {
          const { result, message, error } = response.data;
          console.log('result', result)
          if (message) {
            toast.info(message);
            setTimeout(() => {
              setLoginFormData(initialState);
              navigate('/');
            }, 500);
          } else {
            toast.error(error)
            setTimeout(() => {
            }, 500);
          }

        })
        .catch((err) => toast.error(err.response));
    }
  };

  return (
    <div className="login-page">
      <header className="login-hearder">
        <h1>Login</h1>
      </header>

      <main>
        <section className="login-widget">
          <form
            className="form-container input-area-div"
            style={{
              backgroundColor: "#f2f2f2",
              maxWidth: "450px",
              minWidth: "300px",
              marginTop: '5px'
            }}
            onSubmit={handleSubmit}
          >
            <div className="form-input-div">
              <label>Email:</label>
              <input
                type="email"
                value={loginFormData.username}
                name="username"
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your email here..."
              />
            </div>
            <div className="form-input-div">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={loginFormData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your password here..."
              />
            </div>
            <div className="nav-buttons">
              {loginFormData.username && <input type="submit" value="Login" className="form-button" style={{ width: '100%', textAlign: 'center' }} />}
            </div>
          </form>
        </section>
      </main>

      <footer
        className="footer"
        style={{ width: "100vw", position: "absolute", bottom: "0px" }}
      >
        <p>&copy; 2023 GREATER GRACE CHRISTIAN ACADEMY</p>
      </footer>
    </div>
  );
};
