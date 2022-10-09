import React from 'react'
import EventCard from '../components/EventCard'
import {query,collection,orderBy,onSnapshot,doc,setDoc,addDoc, serverTimestamp, increment,updateDoc, FieldPath, getDoc} from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { Firestore } from 'firebase/firestore';


import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import EventRoomCreate from '../components/EventRoomCreate';
import EventRoomJoin from '../components/EventRoomJoin';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';




//date picker
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StayCurrentLandscapeTwoTone } from '@mui/icons-material';
import { async } from '@firebase/util';


const EventRooms = ({eventRoom,setChatRoom}) => {
  const [eRooms,setERooms]=useState([]);
  const [openCreate,setOpenCreate]=useState(false);
  const [openJoin,setOpenJoin]=useState(false);
  const [eventCard,setEventCard]=useState(null);
  const user=getAuth().currentUser

  const [value, setValue] = React.useState(dayjs());

  const navigate=useNavigate();

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
    return unsubscribe
  }},[eventRoom])

  const handleClickOpen = () => {
    setOpenCreate(true);
  };

  const createChatRoom=async({name,cap,location,time})=>{

    //https://firebase.google.com/docs/firestore/manage-data/add-data
    const docRef = await addDoc(collection(db, 'aRooms/'+eventRoom+'/eRooms'), {
      name: name,
      cap: cap,
      pax: 0,
      rem: cap,
      location:location,
      time:time
    });
    const userSnap=await getDoc(doc(db,'users/',user.email))
    const userData=userSnap.data()
    await setDoc(doc(db, 'aRooms/'+eventRoom+'/eRooms/'+docRef.id+'/users',user.email), { //use Reference?
      userRef: doc(db,'users',user.email),
      name: userData.username,
      role: 'owner'
    });
    await setDoc(doc(db,'users/'+user.email+'/joinedRooms',docRef.id),{
      roomRef:docRef
    })
    await updateDoc(docRef,{
      pax: increment(1),
      rem: increment(-1)
    })
    const activityRoomRef=await doc(db,'aRooms',eventRoom)
    await updateDoc(activityRoomRef,{
      cap: increment(1)
    });
    setChatRoom('aRooms/'+eventRoom+'/eRooms/'+docRef.id)
    localStorage.setItem('chatRoom','aRooms/'+eventRoom+'/eRooms/'+docRef.id)
    navigate('/home/chatroom')
  }


  return (
    <Box sx={{marginLeft:"20px"}}>
      <Box sx={{ flexGrow: 1, height: '80px'}}>
      <AppBar position="static">
        <Toolbar>
          <Typography height= '80px'>
          <h1 style={{marginTop:"12px", fontFamily:"serif", fontWeight: 'bold', fontSize: '45px', color:'white'}}> Events for: {eventRoom} 
          <Fab size="small" color="primary" aria-label="add" sx={{marginLeft:'20px'}} onClick={handleClickOpen}>
            <AddIcon style={{fill:'white'}}/>
          </Fab>
        </h1>
        </Typography>
  
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Filter by date"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={({ inputRef, inputProps, InputProps }) => (
          //how to change color
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft:"100px", marginTop:"8px" }}>
            <input ref={inputRef} {...inputProps} sx={{color:'white'}}/>
            {InputProps?.endAdornment}
          </Box>
        )}
      />
    </LocalizationProvider>

        </Toolbar>
      </AppBar>
    </Box>
    <div>
      {(eRooms)?
    <menu>
    <div>
        <EventRoomCreate openCreate={openCreate} setOpenCreate={setOpenCreate} createChatRoom={createChatRoom}/>
        <EventRoomJoin openJoin={openJoin} setOpenJoin={setOpenJoin}
        eventCard={eventCard}
        setEventCard={setEventCard}
        setChatRoom={setChatRoom}
        eventRoom={eventRoom}/>
        {eRooms.map(eventObject=>(
          <div key={eventObject.id} className="col-md-auto">
          <EventCard key={eventObject.id} 
          eventID={eventObject.id}
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
</Box>
  )
}

export default EventRooms