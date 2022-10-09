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

import {Link} from '@mui/material';

const BasicCard = ({nameOfEvent,setEventRoom,imageOfEvent,timer}) =>{

  const [appear,setAppear]=useState(false);
  const [numOfEvents,setNumOfEvents]=useState(null);

  useEffect(()=>{
    const timeout=setTimeout(()=>{
      setAppear(true);
    },timer)
    return ()=>clearTimeout(timeout)
  },[appear])

  useEffect(()=>{
    const unsubscribe=()=>{onSnapshot(collection(db,'aRooms/'+nameOfEvent+'/eRooms'),collectionSnap=>{
      console.log('aRooms/'+nameOfEvent+'/eRooms')
      setNumOfEvents(collectionSnap.size)
    })}
    return unsubscribe
  },[])


 
  let navigate=useNavigate();
  return (
    <Grow in={appear}>
      <Link to onClick= {()=>{setEventRoom(nameOfEvent);navigate('/home/eventrooms')}}>
      <Card sx={{display:'flex',flexDirection:'column',minHeight:325,maxHeight:300,minWidth:250,maxWidth:250, ':hover':{boxShadow:'10'}, marginTop:1}}
    onClick={()=>{setEventRoom(nameOfEvent);localStorage.setItem('eventRoom',nameOfEvent);navigate('/home/eventrooms')}}>
      <CardContent>
      <img style = {{width: 225, height:200,position:'relative',top:-20}} src = {imageOfEvent} alt = "" />
        <h1>{nameOfEvent}</h1>
        {(numOfEvents)?<h5 style={{p:-10}}>{numOfEvents} rooms</h5>:<h5 style={{p:-10}}>0 rooms</h5>}
      </CardContent>
      </Card>
      </Link>
    </Grow>
  );

  

  
}

export default BasicCard;