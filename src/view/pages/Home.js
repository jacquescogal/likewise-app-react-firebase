import { onAuthStateChanged,getAuth } from "firebase/auth";
import { useEffect } from "react";
import {
    Outlet,
    useNavigate
  } from "react-router-dom";
  
import SideBar from '../components/SideBar'


  

  const Home = () =>{
    
    return(
      <div className="home">
        <SideBar />
        <div className="content" >
          <Outlet/>
        </div>
      </div>
    );
  }
  
  export default Home;