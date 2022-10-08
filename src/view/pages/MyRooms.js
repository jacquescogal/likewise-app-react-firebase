import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { useState,useEffect } from 'react';
import { collection, doc,getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { onSnapshot } from 'firebase/firestore';

const MyRooms = () => {
  const navigate=useNavigate()
  const [user,setUser]=useState(null);
  const [joinedRooms,setJoinedRooms]=useState([]);
  
  useEffect(()=>{
    if (!user){
      console.log('wait')
      auth.onAuthStateChanged(user=>{
        setUser(user)
      })}
    else{
    const unsubscribe=onSnapshot(collection(db,'users/'+user.email+'/joinedRooms'),(collectionSnapshot)=>{
      console.log('still subscribed')
      let joinedRooms=[]
      collectionSnapshot.forEach((doc)=>{
        joinedRooms.push({...doc.data(),id:doc.id})
      })
      console.log(joinedRooms)
      setJoinedRooms(joinedRooms)
    })
  }
  },[user])


  return (
    <Box sx={{height: '80px', marginLeft:"20px"}}>
      <AppBar position="static">
        <Toolbar>
          <Typography height='80px'>
          <h1 style={{marginTop:"12px", fontFamily:"serif", fontWeight: 'bold', fontSize: '45px', color:'white'}}>My Rooms</h1>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default MyRooms