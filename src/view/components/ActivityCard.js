import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import {storage} from '../../firebase-config'
import {ref,getDownloadURL} from 'firebase/storage'
import { Grow } from '@mui/material';
import { useEffect, useState } from 'react';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase-config';
import {query,where} from 'firebase/firestore';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const BasicCard = ({nameOfEvent,setEventRoom,imageOfEvent,timer}) =>{

  const [appear,setAppear]=useState(false);
  const [numOfEvents,setNumOfEvents]=useState(null);
  const [bgAppear,setBgAppear]=useState(false);

  useEffect(()=>{
    const timeout=setTimeout(()=>{
      setAppear(true);
    },timer)
    return ()=>clearTimeout(timeout)
  },[appear])

  const compDate=new Date()

  useEffect(()=>{
    console.log(compDate)
    const q = query(collection(db,'aRooms/'+nameOfEvent+'/eRooms'),where('time','>',compDate))
    const unsubscribe=()=>{onSnapshot(q,collectionSnap=>{
      console.log('aRooms/'+nameOfEvent+'/eRooms')
      setNumOfEvents(collectionSnap.size)
    })}
    return unsubscribe
  },[])


 
  let navigate=useNavigate();
  return (
    <div class={(bgAppear===true)?'w-fit h-fit bg-black rounded-lg bg-gradient-to-t from-pink-100 to-orange-300':'w-fit h-fit bg-transparent'}>
    <div class='transition ease-in-out hover:scale-90'>
  <Grow in={appear} onEntered={()=>{setBgAppear(true)}}>
    <div class=" cursor-pointerw-full h-fit bg-white rounded-lg border border-gray-200 shadow-md  "onClick={()=>{setEventRoom(nameOfEvent);localStorage.setItem('eventRoom',nameOfEvent);navigate('/home/eventrooms')}}>
        <a href="#">
            <img class="rounded-t-lg" src = {imageOfEvent} alt="" />
        </a>
        <div class="p-6">
            <a href="#">
            <p class='text-2xl font-semibold'>{nameOfEvent}</p>        
            </a>
            {(numOfEvents)?<h5 style={{p:-10}}>{numOfEvents} rooms</h5>:<h5 style={{p:-10}}>0 rooms</h5>}
        </div>
    </div>
  </Grow>
  </div>
  </div>


    // <Grow in={appear}>
    //   <Link to onClick= {()=>{setEventRoom(nameOfEvent);navigate('/home/eventrooms')}}>
    //   <Card sx={{display:'flex',flexDirection:'column',minHeight:325,maxHeight:300,minWidth:250,maxWidth:250, ':hover':{boxShadow:'10'}, marginTop:2}}
    // onClick={()=>{setEventRoom(nameOfEvent);localStorage.setItem('eventRoom',nameOfEvent);navigate('/home/eventrooms')}}>
    //   <CardContent>
    //   <img class="rounded-t-lg"  src = {imageOfEvent} alt = "" />
    //     <h1>{nameOfEvent}</h1>
    //     {(numOfEvents)?<h5 style={{p:-10}}>{numOfEvents} rooms</h5>:<h5 style={{p:-10}}>0 rooms</h5>}
    //   </CardContent>
    //   </Card>
    //   </Link>
    // </Grow>
  );

  

  
}

export default BasicCard;