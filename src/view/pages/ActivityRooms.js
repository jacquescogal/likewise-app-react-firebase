import React, { useState } from 'react'
import ActivityCard from '../components/ActivityCard'
import {query,collection,orderBy,onSnapshot} from 'firebase/firestore';
import { auth, db } from '../../firebase-config';
import { useEffect } from 'react';
import { CircularProgress } from '@mui/material';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FeedbackFormCreate from '../components/FeedbackFormCreate';
import Snackbar from '@mui/material/Snackbar'

const ActivityRooms = ({setEventRoom,setLoading,setPageTitle}) => {

  const [aRooms,setARooms]=useState(null);
  const [feedbackFormCreate, setFeedbackFormCreate]=useState(false);

  useEffect(()=>{
    setLoading(true)
    const q = query(collection(db, 'aRooms'),orderBy('cap','desc'))
    let t=0
    const unsubscribe = onSnapshot(q, (QuerySnapshot)=>{
      setPageTitle('Activity Rooms')
      let aRooms=[]
      QuerySnapshot.forEach((doc)=>{
        aRooms.push({...doc.data(),id:doc.id,timer:t*500})
        t+=0.25;
      })
      console.log(aRooms);
      setLoading(false)
      setARooms(aRooms);
    })
    return unsubscribe
  },[])

  const handleClickOpen = () => {
    setFeedbackFormCreate(true);
  };

  return (
    <Box>
    <div > 
    <img class="object-cover w-full h-96 object-center transform duration-700 backdrop-opacity-100  bg-white group-hover:blur-md" src='https://www.ntu.edu.sg/images/default-source/premier-scholarships/rep/programme-thumbnail_rep_1.jpg?sfvrsn=4e16e392_0' />
    <div>
        <FeedbackFormCreate feedbackFormCreate={feedbackFormCreate} setFeedbackFormCreate={setFeedbackFormCreate}/>
    </div>
      {(aRooms)?
    <div className="container-fluid d-flex justify-content-center" style={{minWidth:1000,color:'orange',bgcolor:'orange'}}>
      <div className="row">
        {aRooms.map(activityObject=>(
          <div key={activityObject.id} className="col-md-auto">
          <ActivityCard key={activityObject.id} nameOfEvent= {activityObject.id} 
            imageOfEvent = {activityObject.imageUrl} setEventRoom={setEventRoom} timer={activityObject.timer}/>
          </div>
        ))}
      </div>
    </div>:<div
    style={{
        position: 'absolute', left: '60%', top: '50%',
        transform: 'translate(-50%, -50%)'
    }}
    >
    </div>}
    </div>

  </Box>
  )
}

export default ActivityRooms