import React from 'react'
import EventCard from '../components/EventCard'
import {query,where,collection,orderBy,onSnapshot,doc,setDoc,addDoc, serverTimestamp, increment,updateDoc, FieldPath, getDoc} from 'firebase/firestore';
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


const EventRooms = ({eventRoom,setChatRoom,isLoaded,setLoading,setPageTitle}) => {
  const[filterAvail,setFilterAvail]=useState(false);


  const [eRooms,setERooms]=useState([]);
  const [openCreate,setOpenCreate]=useState(false);
  const [openJoin,setOpenJoin]=useState(false);
  const [eventCard,setEventCard]=useState(null);
  const user=getAuth().currentUser

  const [startDateValue, setStartDateValue] = useState(dayjs().subtract(dayjs().hour(),'hour').subtract(dayjs().minute(),'minute').subtract(dayjs().second(),'second').subtract(dayjs().millisecond(),'millisecond'));
  const [endDateValue, setEndDateValue] = useState(dayjs().add(30,'day').add(23-dayjs().hour(),'hour').add(59-dayjs().minute(),'minute').add(59-dayjs().second(),'second'));

  const navigate=useNavigate();

  
  const compDate=new Date()

  useEffect(()=>{
    if (eventRoom===''){
      console.log('Wait for event room state update')
      setLoading(true)
    }
    else{
    const q = query(collection(db, 'aRooms/'+eventRoom+'/eRooms'),orderBy('time','asc'),where('time','>',compDate))
    const unsubscribe = onSnapshot(q, (QuerySnapshot)=>{
      setPageTitle('Event Rooms')
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
      activity:eventRoom,
      time:time
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
    if (dayjs.unix(eventObject.time.seconds)>=startDateValue & dayjs.unix(eventObject.time.seconds)<=endDateValue & filterAvail===false){
    return <div key={eventObject.id}>
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
    else if (dayjs.unix(eventObject.time.seconds)>=startDateValue & dayjs.unix(eventObject.time.seconds)<=endDateValue & filterAvail===true & eventObject.cap-eventObject.pax>0){
      return <div key={eventObject.id}>
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
    <>
      <AppBar position="static">
        <div class='justify-items-center md:flex  grid pb-3 pt-3 bg-gradient-to-r from-teal-500 to-white' >
          <p class='ml-8 text-white text-5xl font-semibold'>{eventRoom} 
        </p>
        <div class='grid grid-rows-2 grid-cols-1 h-12 font-semibold justify-items-center'>
          <span>Start Date</span>
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
            <input class='h-fit w-24' ref={inputRef} {...inputProps} sx={{color:'white'}}/>
            {InputProps?.endAdornment}
          </Box>
        )}
      />
    </LocalizationProvider>
    </div>
    <div class='grid grid-rows-2 grid-cols-1 h-12 font-semibold justify-items-center'>
          <span >End Date</span>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        minDate={startDateValue}
        value={endDateValue}
        onChange={(newValue) => {
          setEndDateValue(newValue);
        }}
        renderInput={({ inputRef, inputProps, InputProps }) => (
          //how to change color
          <Box sx={{ display: 'flex', alignItems: 'center', marginLeft:"25px", marginTop:"8px" }}>
            <input class='h-fit w-24' ref={inputRef} {...inputProps} sx={{color:'white'}}/>
            {InputProps?.endAdornment}
          </Box>
        )}
      />
    </LocalizationProvider>
    
    
    </div>

    {(filterAvail===false)?<button class='font-semibold h-fit w-40 rounded-md p-1 bg-white ml-8 mt-8 self-center justify-self-center md:mt-0' onClick={()=>{setFilterAvail(true)}}>❌ With Availability</button>:
    <button class='font-semibold h-fit w-40 rounded-md p-1 bg-orange-400 ml-8 mt-8 self-center justify-self-center md:mt-0 shadow-inner border-2 border-orange-600'  onClick={()=>{setFilterAvail(false)}}>✔️ With Availability</button>}

    //{(filterAvail===false)?<button class='h-fit w-40 rounded-md p-1 bg-white ml-8 mt-8 self-center justify-self-center md:mt-0' onClick={()=>{setFilterAvail(true)}}>❌ With Availability</button>:
    //<button class='h-fit w-40 rounded-md p-1 bg-orange-400 ml-8 mt-8 self-center justify-self-center md:mt-0 shadow-inner border-2 border-orange-600'  onClick={()=>{setFilterAvail(false)}}>✔️ With Availability</button>}


    

        </div>
        
      </AppBar>
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
        <div class='grid grid-cols-2 grid-rows-auto gap-1 p-1'>
        {eRooms.map(eventObject=>(
          filterRender(eventObject)
        ))}
        </div>
    </div>
    
    </menu>
:<div>
</div>}
</div>
<button class=' p-2 text-gray-900 bg-amber-200	mb-20 hover:bg-amber-300  font-semibold focus:ring-4 focus:outline-none font-lg rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 ' onClick={()=>{handleClickOpen();console.log(window.google)}}>
          Add Room
          </button>
</>
  )
}

export default EventRooms