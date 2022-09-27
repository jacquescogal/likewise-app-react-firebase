import React from 'react'
import EventCard from '../components/EventCard'
import {query,collection,orderBy,onSnapshot,doc,setDoc,addDoc, serverTimestamp} from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from '@mui/material';
import { CircularProgress } from '@mui/material';

import dayjs from 'dayjs';


import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import EventRoomCreate from '../components/EventRoomCreate';
import EventRoomJoin from '../components/EventRoomJoin';

const EventRooms = ({eventRoom,setChatRoom}) => {
  const [eRooms,setERooms]=useState([]);
  const [openCreate,setOpenCreate]=useState(false);
  const [openJoin,setOpenJoin]=useState(false);
  const [eventCard,setEventCard]=useState(null);

  useEffect(()=>{
    if (eventRoom===''){
      console.log('Wait for event room state update')
    }
    else{
    const q = query(collection(db, 'aRooms/'+eventRoom+'/eRooms'),orderBy('cap','desc'))
    const unsubscribe = onSnapshot(q, (QuerySnapshot)=>{
      let eRooms=[]
      QuerySnapshot.forEach((doc)=>{
        eRooms.push({...doc.data(),id:doc.id})
      })
      console.log(eRooms);
      setERooms(eRooms);
    })
  }},[eventRoom])

  const handleClickOpen = () => {
    setOpenCreate(true);
  };

  const createChatRoom=async({name,cap,location,time})=>{

    //https://firebase.google.com/docs/firestore/manage-data/add-data
    const docRef = await addDoc(collection(db, 'aRooms/'+eventRoom+'/eRooms'), {
      name: name,
      cap: cap,
      pax: 1,
      rem: cap-1,
      location:location,
      time:time
    });

  }

  //hardcoded, to be changed
  const dateTime="29 Sep 2022";
  const activityName="Swimming"

  return (
    <div>
      {(eRooms)?
    <menu>
    <div>
      <h1>
        Events for: {activityName}
        <Fab size="small" color="primary" aria-label="add" sx={{marginTop:'4px', marginLeft:'4px'}} onClick={handleClickOpen}>
        <AddIcon style={{fill:'white'}}/>
      </Fab>
        <EventRoomCreate openCreate={openCreate} setOpenCreate={setOpenCreate} createChatRoom={createChatRoom}/>
        <EventRoomJoin openJoin={openJoin} setOpenJoin={setOpenJoin}
        eventCard={eventCard}
        setEventCard={setEventCard}
        setChatRoom={setChatRoom}/>
        {eRooms.map(eventObject=>(
          <div key={eventObject.id} className="col-md-auto">
          <EventCard key={eventObject.id} 
          setChatRoom={setChatRoom} 
          nameOfEvent={eventObject.name} 
          date={dayjs.unix(eventObject.time.seconds).format('DD/MM/YYYY')} 
          time={dayjs.unix(eventObject.time.seconds).format('hh:mm A')}
          numOfJoiners={eventObject.pax} 
          capacity={eventObject.cap}
          location={eventObject.location}
          pax={eventObject.pax}
          cap={eventObject.cap}
          chatRoomId={eventObject.id} 
          thePath={'/aRooms/'+eventRoom+'/eRooms/'+eventObject.id}
          setOpenJoin={setOpenJoin}
          setEventCard={setEventCard} />
          </div>
        ))}
      </h1>
    </div>
    </menu>
:<div
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

export default EventRooms