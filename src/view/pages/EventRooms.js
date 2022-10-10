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


const EventRooms = ({eventRoom,setChatRoom,isLoaded,setLoading}) => {
  const [eRooms,setERooms]=useState([]);
  const [openCreate,setOpenCreate]=useState(false);
  const [openJoin,setOpenJoin]=useState(false);
  const [eventCard,setEventCard]=useState(null);
  const user=getAuth().currentUser

  const [startDateValue, setStartDateValue] = useState(dayjs().subtract(dayjs().hour(),'hour').subtract(dayjs().minute(),'minute').subtract(dayjs().second(),'second').subtract(dayjs().millisecond(),'millisecond'));
  const [endDateValue, setEndDateValue] = useState(dayjs().add(30,'day').add(23-dayjs().hour(),'hour').add(59-dayjs().minute(),'minute').add(59-dayjs().second(),'second'));

  const navigate=useNavigate();

  useEffect(()=>{
    if (eventRoom===''){
      console.log('Wait for event room state update')
      setLoading(true)
    }
    else{
    const q = query(collection(db, 'aRooms/'+eventRoom+'/eRooms'),orderBy('time','asc'))
    const unsubscribe = onSnapshot(q, (QuerySnapshot)=>{
      let eRooms=[]
      QuerySnapshot.forEach((doc)=>{
        eRooms.push({...doc.data(),id:doc.id})
      })
      console.log(eRooms);
      setLoading(false)
      setERooms(eRooms);
    })
    return unsubscribe
  }},[eventRoom])

  const handleClickOpen = () => {
    setOpenCreate(true);
  };

  const createChatRoom=async({name,cap,location,time,placeid})=>{
    setLoading(true)

    //https://firebase.google.com/docs/firestore/manage-data/add-data
    const docRef = await addDoc(collection(db, 'aRooms/'+eventRoom+'/eRooms'), {
      name: name,
      cap: cap,
      pax: 0,
      rem: cap,
      location:location,
      activity:eventRoom,
      placeid:placeid,
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
      roomRef:docRef,
      activity:eventRoom
    })
    await updateDoc(docRef,{
      pax: increment(1),
      rem: increment(-1)
    })
    const activityRoomRef=await doc(db,'aRooms',eventRoom)
    await updateDoc(activityRoomRef,{
      cap: increment(1)
    });
    setLoading(false)
    setChatRoom('aRooms/'+eventRoom+'/eRooms/'+docRef.id)
    localStorage.setItem('chatRoom','aRooms/'+eventRoom+'/eRooms/'+docRef.id)
    navigate('/home/chatroom')
  }

  const filterRender=(eventObject)=>{
    if (dayjs.unix(eventObject.time.seconds)>=startDateValue & dayjs.unix(eventObject.time.seconds)<=endDateValue){
    return <div key={eventObject.id} className="col-md-auto">
          <EventCard key={eventObject.id} 
          eventID={eventObject.id}
          setChatRoom={setChatRoom} 
          date={dayjs.unix(eventObject.time.seconds).format('DD/MM/YYYY')} 
          time={dayjs.unix(eventObject.time.seconds).format('hh:mm A')}
          numOfJoiners={eventObject.pax} 
          capacity={eventObject.cap}
          location={eventObject.location}
          pax={eventObject.pax}
          cap={eventObject.cap}
          nameOfEvent={eventObject.name}
          chatRoomId={eventObject.id} 
          thePath={'/aRooms/'+eventRoom+'/eRooms/'+eventObject.id}
          setOpenJoin={setOpenJoin}
          setEventCard={setEventCard} 
          />
          </div>
    }
    else{
      return
    }
  }


  return (
    <Box sx={{marginLeft:"20px"}}>
      <Box sx={{ flexGrow: 1, height: '80px'}}>
      <AppBar position="static">
        <Toolbar>
          <Typography height= '80px'>
          <h1 style={{marginTop:"12px", fontFamily:"serif", fontWeight: 'bold', fontSize: '45px', color:'white'}}> Events for: {eventRoom} 
          <Fab size="small" color="primary" aria-label="add" sx={{marginLeft:'20px'}} onClick={()=>{handleClickOpen();console.log(window.google)}}>
            <AddIcon style={{fill:'white'}}/>
          </Fab>
        </h1>
        </Typography>
  
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        minDate={dayjs().subtract(dayjs().hour(),'hour').subtract(dayjs().minute(),'minute').subtract(dayjs().second(),'second').subtract(dayjs().millisecond(),'millisecond')}
        maxDate={endDateValue}
        label="Filter by date"
        value={startDateValue}
        onChange={(newValue) => {
          setStartDateValue(newValue);
        }}
        renderInput={({ inputRef, inputProps, InputProps }) => (
          //how to change color
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft:"25px", marginTop:"8px" }}>
            <input ref={inputRef} {...inputProps} sx={{color:'white'}}/>
            {InputProps?.endAdornment}
          </Box>
        )}
      />
    </LocalizationProvider>

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        minDate={startDateValue}
        label="Filter by date"
        value={endDateValue}
        onChange={(newValue) => {
          setEndDateValue(newValue);
        }}
        renderInput={({ inputRef, inputProps, InputProps }) => (
          //how to change color
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft:"25px", marginTop:"8px" }}>
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
        <EventRoomCreate openCreate={openCreate} setOpenCreate={setOpenCreate} createChatRoom={createChatRoom} google={window.google}/>
        <EventRoomJoin openJoin={openJoin} setOpenJoin={setOpenJoin}
        eventCard={eventCard}
        setEventCard={setEventCard}
        setChatRoom={setChatRoom}
        eventRoom={eventRoom}
        setLoading={setLoading}/>
        {eRooms.map(eventObject=>(
          filterRender(eventObject)
        ))}
    </div>
    
    </menu>
:<div>
</div>}
</div>
</Box>
  )
}

export default EventRooms