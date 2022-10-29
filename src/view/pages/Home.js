import { onAuthStateChanged,getAuth } from "firebase/auth";
import { useEffect } from "react";
import {
    Outlet,
    useNavigate
  } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navigator from "../components/Navigator";
import SideBar from '../components/SideBar';
import Box from '@mui/material/Box';
import Copyright from '../components/Copyright'
import Header from "../components/Heder";


  

  const Home = ({drawerOpen,setDrawerOpen,pageTitle}) =>{

    const handleDrawerToggle=()=>{
      setDrawerOpen(!drawerOpen);
    }
    
    return(
      <div className="home">
        <Box sx={{ flexShrink: 1, display: 'flex'}}>
        <Box
          component="nav"
          sx={{ flexShrink: 1  }}
        >
        <Navigator
              PaperProps={{ style: { width: 256 } }}
              variant="temporary"
              open={drawerOpen}
              onClose={(handleDrawerToggle)}
              setDrawerOpen={setDrawerOpen}
            />
            </Box>
            <Box sx={{ flex: 1, flexShrink: 1, display: 'flex', flexDirection: 'column' }}>
            <Header setMobileOpen={setDrawerOpen} pageTitle={pageTitle}/>
          <Outlet/>
          <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
            <Copyright />
          </Box>
          </Box>
        </Box>
      </div>
    );
  }
  
  export default Home;