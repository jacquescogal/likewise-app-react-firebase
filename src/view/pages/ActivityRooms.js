import React, { useState } from 'react'
import ActivityCard from '../components/ActivityCard'
import {query,collection,orderBy,onSnapshot} from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useEffect } from 'react';
import { CircularProgress } from '@mui/material';

const ActivityRooms = ({setEventRoom}) => {

  const [aRooms,setARooms]=useState(null);

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

  
  return (
    <div >
      <h1 style={{marginLeft:"12px", marginTop:"12px"}}>ActivityRooms</h1>
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
  )
}

export default ActivityRooms