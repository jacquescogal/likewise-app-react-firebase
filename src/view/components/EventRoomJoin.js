import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {query,collection,orderBy,onSnapshot,doc,setDoc,addDoc, serverTimestamp, increment,updateDoc, FieldPath, getDoc} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase-config';
import { useEffect,useState } from 'react';

export default function EventRoomJoin({openJoin,setOpenJoin,eventCard,setChatRoom,eventRoom}) {
    const navigate=useNavigate();
    const user=getAuth().currentUser
    const [joinedRoomSize,setJoinedRoomSize]=useState(null);


  const handleClose = () => {
    setOpenJoin(false);
  };

  const updatePax= async ()=>{
    const userRef=doc(db,eventCard.path+'/users',user.email)
    const roomRef=doc(db,'aRooms/'+eventRoom+'/eRooms',eventCard.eventID)
    const userSnap=await getDoc(doc(db,'users/',user.email))
    const userData=userSnap.data()
    const docSnap=await getDoc(userRef)
    if (!docSnap.exists()){
    console.log(userData)
    await setDoc(doc(db, eventCard.path+'/users',user.email), { //use Reference?
      userRef: doc(db,'users',user.email),
      name: userData.username,
      role: 'member'
    });
    await setDoc(doc(db,'users/'+user.email+'/joinedRooms',roomRef.id),{
      roomRef:roomRef
    })
    await updateDoc(roomRef,{
      pax: increment(1),
      rem: increment(-1)
    })}
    else{
      console.log('already in')
    }
  };

  useEffect(()=>{ 
    const unsubscribe = async ()=>{
      const user=getAuth().currentUser
      onSnapshot(collection(db,'users/'+user.email+'/joinedRooms'),collectionSnap=>{
        setJoinedRoomSize(collectionSnap.size)
        console.log(collectionSnap.size)
      })
    }
    return unsubscribe
  },[])


  let joinButtonState=()=>{
    if (joinedRoomSize!=null & joinedRoomSize==3){
      return <Button disabled onClick={()=>{setChatRoom(eventCard.path);localStorage.setItem('chatRoom',eventCard.path);navigate('/home/chatroom')}}>Already in 3 rooms</Button>
    }
    else if (joinedRoomSize!=null & eventCard.cap-eventCard.pax>0){
      return <Button onClick={()=>{updatePax();setChatRoom(eventCard.path);localStorage.setItem('chatRoom',eventCard.path);navigate('/home/chatroom')}}>Join</Button>
    }
    else if (joinedRoomSize!=null & eventCard.cap-eventCard.pax<=0){
      return <Button disabled onClick={()=>{setChatRoom(eventCard.path);localStorage.setItem('chatRoom',eventCard.path);navigate('/home/chatroom')}}>Room Full</Button>
    }
  else{
    return <Button >Loading</Button>
  }}

  return (
    <div>
        {(eventCard)?
      <Dialog open={openJoin} onClose={handleClose}>
        
        <DialogTitle>Join Room: {eventCard.name}</DialogTitle>
        <DialogContent>
        <Stack spacing={1.5} sx={{minWidth:'300px'}}>
          <DialogContentText>
            Location: {eventCard.location}
          </DialogContentText>
          
          <DialogContentText>
            Date: {eventCard.date}
          </DialogContentText>

          <DialogContentText>
            Time: {eventCard.time}
          </DialogContentText>

          <DialogContentText>
            Pax/Capacity : {eventCard.pax}/{eventCard.cap}
          </DialogContentText>
      
      </Stack>
        </DialogContent>
        <DialogActions>
          {joinButtonState()}
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>:<div></div>}
    </div>
  );
}