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
import Header from "../components/Header";
import useMediaQuery from '@mui/material/useMediaQuery';
import theme from "../../MUITheme";

  

  const Home = ({drawerOpen,setDrawerOpen,pageTitle}) =>{
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

    const handleDrawerToggle=()=>{
      setDrawerOpen(!drawerOpen);
    }
    
    return(
      <div className="home">
        <Box sx={{ flexShrink: 1, display: 'flex'}}>
        <Box
          component="nav"
          sx={{ width: { sm: 256 }, flexShrink: { sm: 0 } }}
        >
        

{isSmUp ? null : (
            <Navigator
            PaperProps={{ style: { width: 256 } }}
            variant="temporary"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            setDrawerOpen={setDrawerOpen}
          />
          )}

          <Navigator
            PaperProps={{ style: { width: 256 } }}
            sx={{ display: { sm: 'block', xs: 'none' } }}
          />



            </Box>
            <Box sx={{ flex: 1, flexShrink: 1, display: 'flex', flexDirection: 'column' }}>
            <Header setMobileOpen={setDrawerOpen} pageTitle={pageTitle} isSmUp={isSmUp}/>
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