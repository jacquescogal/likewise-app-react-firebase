import React from 'react';
import {Link,useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import ExtensionIcon from '@mui/icons-material/Extension';
import ForumIcon from '@mui/icons-material/Forum';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Box from '@mui/material/Box';
import { useEffect, useState } from "react";
import { useAuth, upload, db } from '../../firebase-config';
import {doc,onSnapshot} from "firebase/firestore";

const SideBar = () => {
  const navigate = useNavigate();

  const currentUser = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");


  useEffect(() => {
    if (currentUser){
    onSnapshot(doc(db,'users/'+currentUser.email),docSnap=>{
      const docData=docSnap.data()
      setPhotoURL(docData.imageUrl)
    })
  }}, [currentUser])



  return (
    <div className="sideBar">
    <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      flexDirection: 'column',
      p: 1,
      m: 1,
      borderRadius: 1,
      marginLeft:4
    }}
  >
  <img className="img-fluid" src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo" lassName="likewise_logo" height={120} width={120}/>
  <div className="fields">
  <img src={photoURL} alt="Avatar_sidebar" className="avatar_sidebar" />
  <br></br><br></br>      
  <h1 style={{marginLeft:"20px", fontSize: '20px'}}>Hi, welcome back!</h1>
  </div>
      <Button sx={{paddingLeft:1, minWidth:'200px', justifyContent: "flex-start", color:'white',fontSize:'20px', fontFamily:"Quicksand", ':hover':{color:'primary.main',bgcolor:'white'}}} onClick={()=>navigate('ActivityRooms')} startIcon={<ExtensionIcon sx={{ fill:'white','&:hover':{fill:'primary.main'}}}/>}>Activity Rooms</Button>
      <Button sx={{minWidth:'200px', justifyContent: "flex-start", color:'white',fontSize:'20px', fontFamily:"Quicksand", ':hover':{color:'primary.main',bgcolor:'white'}}} onClick={()=>navigate('MyRooms')} startIcon={<ForumIcon sx={{ fill:'white','&:hover':{fill:'primary.main'} }}/>}>My Rooms</Button>
      <Button sx={{minWidth:'200px', justifyContent: "flex-start", color:'white',fontSize:'20px', fontFamily:"Quicksand", ':hover':{color:'primary.main',bgcolor:'white'}}} onClick={()=>navigate('Profile')} startIcon={<AccountBoxIcon sx={{ fill:'white','&:hover':{fill:'primary.main'} }}/>}>Profile</Button>
      </Box>
</div>
  )
}

export default SideBar

