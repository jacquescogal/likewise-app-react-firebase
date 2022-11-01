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
const MyRooms = ({setChatRoom,setPageTitle}) => {
  const navigate=useNavigate()
  const [user,setUser]=useState(null);
  const [joinedRooms,setJoinedRooms]=useState(null);
  
  useEffect(()=>{
    setPageTitle('My Rooms');
  },[])

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
      console.log(joinedRooms.length)
      while (joinedRooms.length<3){
        joinedRooms.push(null)
        console.log(joinedRooms.length)
      }
      console.log(joinedRooms.length)
      setJoinedRooms(joinedRooms)
    })

  }
  },[user])


  return (
    <div class='h-full md:py-10 bg-slate-100'> 
      {(joinedRooms)?
      <div class="grid grid-cols-1 grid-rows-3 md:grid-cols-3 md:grid-rows-1 justify-around justify-items-center">
        {joinedRooms.map(joinRoomObject=>{
          return (joinRoomObject===null)?<div class="grid h-96 w-full bg-slate-100 justify-items-center rounded-md border-solid border content-center my-2">
             <span>Empty</span>
             </div>:
          <div key={joinRoomObject.id}>
          <JoinRoomCard key={joinRoomObject.id} chatRoomRef={joinRoomObject.roomRef} setChatRoom={setChatRoom} eActivity={joinRoomObject.activity}/>
          </div>
})}
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
  )
}

export default MyRooms