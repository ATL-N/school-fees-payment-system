import { Link } from 'react-router-dom';
import image from '../../resources/logo transparent.png';


export const LogoBar =()=>{
    return (
        <>
            <Link className='link' to={'/'}><img className="logo-img" src={image} alt="logo" height="55px" width="55px" title='HOME PAGE' /></Link>
            

        </>  
        )}