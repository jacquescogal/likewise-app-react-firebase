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
      <ActivityRoomHeader/>
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

const ActivityRoomHeader=()=>{
  return (
    <div class='flex justify-center'>
    <div class="relative w-fit h-fit overflow-hidden mx-2.5 mt-2 border border-gray-0 shadow-md group ">
    <img class="transition ease-in-out object-cover h-96 w-full rounded-tr-lg rounded-bl-lg group-hover:scale-150" src ='https://www.ntu.edu.sg/images/default-source/premier-scholarships/rep/programme-thumbnail_rep_1.jpg?sfvrsn=4e16e392_0' alt = "" />
    <div class="absolute bg-black/50 text-white w-full h-full transform duration-500 top-[80%] bottom-[90%] content-center group-hover:-inset-y-0 ">
    <p class="text-white font-semibold">TESTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT</p>
    <p class="font-sans">Description</p>
    <div class="grid grid-cols-8 grid-rows-1">
      <div></div>
    <div class="grid grid-cols-4 grid-rows-2 justify-center col-span-6">
      <div class="relative w-full justify-center">
        <div class="absolute border-white border-2 w-full right-0 text-white">Carb</div>
      </div>
      <div class="relative w-full justify-center">
        <div class="border-white border-2 w-full m-auto">Protein</div>
      </div>
      <div class="relative w-full justify-center">
        <div class="border-white border-2 w-full m-auto">Fat</div>
      </div>
      <div class="relative w-full justify-center">
        <div class="absolute border-white border-2 w-full left-0">Calories</div>
      </div>

      <div class="relative w-full justify-center">
        <div class="absolute border-white border-2 w-full right-0">test</div> 
      </div>
      <div class="relative w-full justify-center">
        <div class="border-white border-2 w-full m-auto">5g</div>
      </div>
      <div class="relative w-full justify-center">
        <div class="border-white border-2 w-full m-auto">5g</div>
      </div>
      <div class="relative w-full justify-center">
        <div class="absolute border-white border-2 w-full left-0">5kcal</div>
      </div>
    </div>
    <div></div>
    </div>

    <div class="grid grid-cols-3 grid-rows-2">
      <div class="row-span-1">
      <p class="row-span-1 mb-0">Difficulty:</p>
      5
      </div>
      <div class="row-span-1">
      <p class="row-span-1 mb-0">Time:</p>
      <span class="font-bold">5</span>
      </div>
      <div class="relative row-span-1">
      <button  class="absolute mt-1 left-0 items-center py-2 px-3 text-md font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-700"
      onClick={()=>{}}>
            Customize
        </button>
      </div>
      

    </div>
    
    </div>
    
</div>
</div>
  );
}

export default ActivityRooms