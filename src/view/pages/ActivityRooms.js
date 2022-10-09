import React, { useState } from 'react'
import ActivityCard from '../components/ActivityCard'
import {query,collection,orderBy,onSnapshot} from 'firebase/firestore';
import { db } from '../../firebase-config';
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

const ActivityRooms = ({setEventRoom}) => {

  const [aRooms,setARooms]=useState(null);
  const [feedbackFormCreate, setFeedbackFormCreate]=useState(false);

  useEffect(()=>{
    const q = query(collection(db, 'aRooms'),orderBy('cap','desc'))
    let t=0
    const unsubscribe = onSnapshot(q, (QuerySnapshot)=>{
      let aRooms=[]
      QuerySnapshot.forEach((doc)=>{
        aRooms.push({...doc.data(),id:doc.id,timer:t*500})
        t+=0.25;
      })
      console.log(aRooms);
      setARooms(aRooms);
    })
  },[])

  const handleClickOpen = () => {
    setFeedbackFormCreate(true);
  };

  return (
    <Box sx={{marginLeft:"20px"}}>
    <div > 
    <Box sx={{ flexGrow: 1, height: '180px'}}>
      <AppBar position="static">
        <Toolbar>
          <Typography height= '80px'>
          <h1 style={{marginTop:"10px", fontFamily:"serif", fontWeight: 'bold', fontSize: '45px', color:'white'}}>Activity Rooms</h1>
          {/* {feedbackSuccessMessage && <Snackbar open={feedbackSuccessMessage} message={feedbackSuccessMessage} />} */}
          <Fab size="small" color="primary" aria-label="add" sx={{marginLeft:'1250px',marginTop:'15px'}} onClick={handleClickOpen}>
            <EditIcon style={{fill:'white'}}/>
          </Fab>
          {/* <h5 style={{marginLeft:"1100px", marginTop:"0px",backgroundColor: "white",padding:"0px"}}>Add feedback</h5> */}
          <h4 style={{marginLeft:"5px", marginTop:"0px",backgroundColor: "white",padding:"0px"}}>Please select an activity of interest below.</h4>
          
          
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
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
      <p>loading...</p>
      <CircularProgress color="secondary" size={50} thickness={5}/>
    </div>}
    </div>

  </Box>
  )
}

export default ActivityRooms