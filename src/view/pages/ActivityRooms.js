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
    let t=50
    const unsubscribe = onSnapshot(q, (QuerySnapshot)=>{
      setPageTitle('Activity Rooms')
      let aRooms=[]
      QuerySnapshot.forEach((doc)=>{
        aRooms.push({...doc.data(),id:doc.id,timer:t})
        t+=50;
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
      {(aRooms)?
    <div class="py-3 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 grid-rows-auto justify-around gap-4 pl-4 pr-8" >
        {aRooms.map(activityObject=>(
          <div key={activityObject.id} className="col-md-auto">
          <ActivityCard key={activityObject.id} nameOfEvent= {activityObject.id} 
            imageOfEvent = {activityObject.imageUrl} setEventRoom={setEventRoom} timer={activityObject.timer}/>
          </div>
        ))}
    </div>:<div>
    </div>}
    </div>

  </Box>
  )
}



export default ActivityRooms