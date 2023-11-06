import { useContext, useEffect } from "react";
import { StateContext } from "../utils/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";




export const UserDiv = () => {

  axios.defaults.withCredentials = true;


  const navigate = useNavigate();
  const {showCategories, setShowCategories, showNavBar, setShowNavBar, userDetails, setUserDetails} = useContext(StateContext);
  function handleMouseLeave(){
    setShowCategories(false);
  }

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


  const handleMouseEnter = () => {
    setShowCategories(true)
    console.log("handleMouseEnter", showCategories)
}

const handleLogout = async () => {
  try {
    // Send a POST request to the server's /api/logout endpoint
    const response = await axios.post('http://localhost:5050/api/logout', null, {
      withCredentials: true, // Send session cookies
    });

    if (response.status === 200) {
      // Successful log-out
      const {message} = response.data;
      toast.success(message);
      setTimeout(() => {
        navigate('/loginpage');
      }, 500);      
      console.log('Logged out successfully');
    } else {
      // Handle errors or unauthorized log-out here
      const {error} = response.data;
      toast.error(error)
      setTimeout(() => {
      }, 500);
      console.error('Error logging out');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
  
  return (
    <div>
      {showCategories && (
      <div className="categories-div" onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} >
      <Link to={`/viewStaffDetails/${userDetails.id}`} className="link"><div className="details_div">{userDetails.StaffName}</div></Link>
      {/* <Link to={`/notifications/${userDetails.id}`} className="link"><div className="details_div" >Notifications</div></Link> */}
      <Link to={`/changeStaffPassword/${userDetails.id}`} className="link"><div className="details_div" >CHANGE PASSWORD</div></Link>
      <div className="nav-buttons">
        <button className="form-button clear-btn" style={{ width: '100%', textAlign: 'center' }}  onClick={handleLogout}> Log Out </button>
      </div>
      
    </div>
    )
      
  }
  </div>
)};