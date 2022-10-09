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
import { CircularProgress } from '@mui/material';
import JoinRoomCard from '../components/JoinRoomCard';
const MyRooms = ({setChatRoom}) => {
  const navigate=useNavigate()
  const [user,setUser]=useState(null);
  const [joinedRooms,setJoinedRooms]=useState(null);
  
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
      setJoinedRooms(joinedRooms)
    })

  }
  },[user])


  return (
    <Box sx={{marginLeft:"20px"}}>
    <div > 
    <Box sx={{ flexGrow: 1, height: '80px'}}>
      <AppBar position="static">
        <Toolbar>
          <Typography height= '80px'>
          <h1 style={{marginTop:"12px", fontFamily:"serif", fontWeight: 'bold', fontSize: '45px', color:'white'}}>Activity Rooms</h1>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
      {(joinedRooms)?
    <div className="container-fluid d-flex justify-content-center" style={{minWidth:1000,color:'orange',bgcolor:'orange'}}>
      <div className="row">
        {joinedRooms.map(joinRoomObject=>{
          return <div key={joinRoomObject.id} className="col-md-auto">
          <JoinRoomCard key={joinRoomObject.id} chatRoomRef={joinRoomObject.roomRef} setChatRoom={setChatRoom} activity={joinRoomObject.activity}/>
          </div>
})}
      </div>
    </div>:<div
    style={{
        position: 'absolute', left: '60%', top: '50%',
        transform: 'translate(-50%, -50%)'
    }}
    >
      <p>loading...</p>
      <CircularProgress color="secondary" size={50} thickness={5}/>
    </div>}
    </div>

  </Box>
  )
}

export default MyRooms