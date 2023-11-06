import { Link, useNavigate } from "react-router-dom";
import { useContext, useState,useEffect } from "react";
import { StateContext } from "../utils/Context";
import axios from "axios";


export const UserAccount =()=>{

    const navigate = useNavigate();
    const {showCategories, setShowCategories, userDetails, setUserDetails, setShowNavBar} = useContext(StateContext);
    let imgurl;
    const [selectedImage, setSelectedImage] = useState("");

    axios.defaults.withCredentials = true;
    useEffect(() => {
      setShowNavBar(true);
      axios
        .get("http://localhost:5050/home")
        .then((res) => {
          if (res.data.userDetails == "" || res.data.userDetails == null) {
            navigate("/loginPage");
          } else {
            console.log('userDetails uploads', userDetails)
            setUserDetails(res.data.userDetails);
            imgurl = res.data.userDetails
            setSelectedImage(
                `http://localhost:5050/uploads/${imgurl.Image}`
              );  
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("running userdetails useeffect error");
        });
      console.log("running userdetails useeffect done");
    }, [imgurl]);

    const moveToHome = () => {
        navigate("/")
    }

    const handleMouseEnter = () => {
        setShowCategories(true)
        // console.log("handleMouseEnter", showCategories)
    }
      

    const handleMouseLeave = () => {
        setShowCategories(false)
        // console.log("handleMouseLeave", showCategories)

    }

    const handleMouseClick = () => {
        setShowCategories(!showCategories)
        // console.log("handleMouseLeave", showCategories)

    }


    return (
        <>   
           
           <div className="categories-btn-div" onMouseLeave={handleMouseLeave}>
            <button  className="categories-btn" onMouseEnter={handleMouseEnter} onClick={handleMouseClick}> {selectedImage && <img src={ selectedImage } alt="Preview" className="img-preview-div" style={{borderRadius:'50%', height:'50px', width:'50px'}}/>} ;  </button>
        </div>
            
            
        </>
    )
}