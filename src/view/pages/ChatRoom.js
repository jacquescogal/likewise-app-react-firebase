import React, { useEffect, useState ,useRef} from 'react'
import { useNavigate } from 'react-router-dom'

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { db } from '../../firebase-config';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { getAuth } from 'firebase/auth';
import { doc,getDoc } from 'firebase/firestore'
import { auth } from '../../firebase-config'

import {query,collection,orderBy,onSnapshot} from 'firebase/firestore';
import { Navigate } from 'react-router-dom';

import ChatMessage from '../components/ChatMessage';
import SendMessage from '../components/SendMessage'
import ChatRoomBar from '../components/ChatRoomBar';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import { Card, Paper } from '@mui/material';

import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const ChatRoom = ({chatRoom,setLoading,setPageTitle}) => {
  
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const scroll = useRef()
  const messageScroll = useRef()
  const [roomInfo,setRoomInfo]=useState({
    name:'',
    time:null
  })
  const [userArr,setUserArr]=useState(null)
  const [currentUserName,setCurrentUserName]=useState('');
  const [currentImageUrl,setCurrentImageUrl]=useState(null)

  useEffect(()=>{
    const unsubscribe = async ()=>{
      const user=JSON.parse(localStorage.getItem('user'))
      onSnapshot(doc(db,'users/'+user.email),docSnap=>{
        setCurrentImageUrl(docSnap.data().imageUrl)
      })
    }
    return unsubscribe

  },[])

  
  useEffect(()=>{
    if (chatRoom===''){
      setLoading(true)
      console.log('wait for it')
    }
    else if(chatRoom!==''){
    const q = query(collection(db, chatRoom+'/messages'),orderBy('timestamp','desc'))
    const unsubscribe = onSnapshot(q, (QuerySnapshot)=>{
      let messages=[]
      let emailTrack=null
      QuerySnapshot.forEach((doc)=>{
        const show=(emailTrack,anEmail)=>{
          if (emailTrack===anEmail){
            return false
          }
          else{
            return true
          }
        }
        messages.push({...doc.data(),id:doc.id,showImage:show(emailTrack,doc.data().email)})
        console.log(emailTrack,doc.data().email)
        emailTrack=doc.data().email
      })
      messages.reverse()
      emailTrack=null
      const show=(emailTrack,anEmail)=>{
        if (emailTrack===anEmail){
          return false
        }
        else{
          return true
        }
      }
      messages.forEach(messageObject=>{
        messageObject.showText=show(emailTrack,messageObject.email)
        emailTrack=messageObject.email
      })
      setMessages(messages);
    })
    const chatRoomArr=chatRoom.split('/');
    const chatRoomID=chatRoomArr[chatRoomArr.length-1]
    getDoc(doc(db, chatRoomArr.slice(0,-1).join('/'), chatRoomID)).then(docSnap => {
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setLoading(false)
        setRoomInfo({...docSnap.data(),roomUID:chatRoomID})
        console.log(docSnap)
        setPageTitle('Chat Room: '+docSnap.data().name)
      } else {
        console.log("No such document!")}});
    const unsub=onSnapshot(doc(db, chatRoomArr.slice(0,-1).join('/'), chatRoomID),(doc)=>{
      if(doc.exists()){
        console.log("fine")
      }
      else{
        toast('The room was deleted by owner.')
        navigate('/home/myRooms')
      }
      
    })
    return unsub
   }},[chatRoom])

   useEffect(()=>{
    if (chatRoom!==''){
    let userArr=[]
    let userTrack=[]
    const unsubscribeUsers=onSnapshot(collection(db,chatRoom+'/users'),(collectionSnapshot)=>{
        collectionSnapshot.forEach((doc)=>{
          let docData=doc.data()
          if (!userTrack.includes(doc.id)){
            userTrack.push(doc.id)
            userArr.push({id:doc.id,name:docData.name,ref:docData.userRef,role:docData.role})
            if (doc.id===auth.currentUser.email){
              setCurrentUserName(docData.name)
            }
        }
        })
        setUserArr(userArr)
      })
      return unsubscribeUsers
    }
   },[chatRoom])
//

  return (
    
    <div class='flex flex-col bg-white'>
      {(!roomInfo.time)?<div>
    </div>:
      <div>
        {(!userArr)?null:
      <ChatRoomBar roomUID={roomInfo.roomUID}
      roomName={roomInfo.name} 
      roomDate={(roomInfo.time)?dayjs.unix(roomInfo.time.seconds).format('DD/MM/YYYY'):'loading...'}
      roomTime={(roomInfo.time)?dayjs.unix(roomInfo.time.seconds).format('hh:mm A'):'loading...'}
      roomLocation={roomInfo.location}
      roomPlaceID={roomInfo.placeid}
      roomPax={roomInfo.pax}
      roomCap={roomInfo.cap}
      roomUsers={userArr}/>}
      <div class='bg-white'>
        <div>
        <div class='w-full h-[32rem] overflow-auto bg-white'>
      {messages.map(message => (
        <ChatMessage key={message.id} className='message' message={message} messageScroll={messageScroll}></ChatMessage>
      ))}
      <span ref={messageScroll}></span>
      </div>
      <SendMessage scroll={scroll} messageScroll={messageScroll} chatRoom={chatRoom+'/messages'} currentUserName={currentUserName} currentImageUrl={currentImageUrl}/>
      </div>
      <span ref={scroll}></span>
      </div>
      </div>
}
    </div>
  )
}

export default ChatRoom