import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { getAuth } from 'firebase/auth'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useEffect } from "react";
import { useAuth, upload, db } from '../../firebase-config';
import {doc,onSnapshot} from "firebase/firestore";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Header=({setMobileOpen,pageTitle,isSmUp})=> {
  const [anchorEl, setAnchorEl] = useState(null);
  const toOpen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    const auth=getAuth();
    auth.signOut().then((value)=>{
      console.log(value)
      navigate('/');
      localStorage.clear();
    },(reason)=>console.log(reason))
}

  const navigate=useNavigate();

  const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");

  const currentUser = useAuth();
  useEffect(() => {
    if (currentUser){
    onSnapshot(doc(db,'users/'+currentUser.email),docSnap=>{
      const docData=docSnap.data()
      setPhotoURL(docData.imageUrl)
    })
  }}, [currentUser])

  const [menuPing,setMenuPing]=useState(true);

  return (
    <React.Fragment>
      {/* <blockquote class="text-xs md:text-base font-semibold italic text-center text-slate-900 bg-black text-white mb-0 z-1 h-fit">
      {'Get '}
      <span class="relative">
        <span class="block absolute -inset-0 h-1/4 top-3/4 bg-pink-500 z-0" aria-hidden="true"></span>
        <span class="relative text-white text-md md:text-xl">$5</span>
      </span>
      <span class="relative text-white">{" off your next purchase when you refer a friend"}</span>
    </blockquote> */}
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid sx={{ display: 'block'  }} item>
              {isSmUp?null:<IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={()=>{setMobileOpen(true);setMenuPing(false)}}
                edge="start"
              >
                <MenuIcon />
                {(menuPing==true)?<MenuIcon className='absolute animate-ping'/>:null}
              </IconButton>}
            </Grid>
            
            <Grid item xs >
              <h1 className='absolute top-0 '>{pageTitle}</h1>
            </Grid>
            
            <Grid item>
            </Grid>
            
            <Grid item>
              {/* <Tooltip title="Open cart">
                <IconButton color="inherit">
                  <ShoppingCartIcon />
                </IconButton>
              </Tooltip> */}
            </Grid>
              <IconButton color="inherit" sx={{ p: 0.5 }} id="basic-button"
        aria-controls={toOpen ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={toOpen ? 'true' : undefined}
        onClick={handleClick}>
                <Avatar src={photoURL} alt="Guest" />
                </IconButton>
                <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={toOpen}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
              
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;