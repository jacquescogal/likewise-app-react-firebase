import React, { useEffect, useState ,useRef} from 'react'
import { useNavigate } from 'react-router-dom'

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { db } from '../../firebase-config';
import Button from "../components/common/Button";
import { getAuth } from 'firebase/auth';
import { doc,getDoc, QuerySnapshot } from 'firebase/firestore'
import { auth } from '../../firebase-config'

import {query,collection,orderBy,onSnapshot,limit} from 'firebase/firestore';
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
  const scroll = useRef();
  const messageScroll = useRef();
  const [roomInfo,setRoomInfo]=useState({
    name:'',
    time:null
  });
  const [userArr,setUserArr]=useState(null);
  const [currentUserName,setCurrentUserName]=useState('');
  const [currentImageUrl,setCurrentImageUrl]=useState(null);
  const [latestMessage,setLatestMessage]=useState('');
  const [smartReplies,setSmartReplies] = useState([]);
  const [toSend, setToSend] = useState('');

  useEffect(()=>{
    const unsubscribe = async ()=>{
      const user=JSON.parse(localStorage.getItem('user'))
      onSnapshot(doc(db,'users/'+user.email),docSnap=>{
        setCurrentImageUrl(docSnap.data().imageUrl)
      })
    }
    return unsubscribe;
  },[])

  
  useEffect(()=>{
    if (chatRoom===''){
      setLoading(true)
      console.log('wait for it')
    }
    else if(chatRoom!==''){
    const q = query(collection(db, chatRoom+'/messages'),orderBy('timestamp','desc'));
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
   }
  },[chatRoom]);


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
      
      setUserArr(userArr)
    })
    return unsubscribeUsers
  }
  },[chatRoom]);

  // Function for API call which is used later
  const fetchSmartReplies = () => {
    fetch('/smartreply', 
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(latestMessage),
      // mode: 'no-cors',
      // withCredentials: true,  
      // crossorigin: true,
    }).then(
      res => res.json()
      ).then(
        res => {
          setSmartReplies(res.result);
          console.log(smartReplies);
        }
      );
  }

  //Gets smart replies every time there is a new message in the chat
  useEffect(() => {
    const getSmartReplies = async() => {
      const smartrep = await fetchSmartReplies();
    }

    let lm = messages.slice(-1)[0];
    if (lm) {
      let latestMessage = lm.text;
      console.log("latestmessage", latestMessage);
      setLatestMessage(latestMessage);
      getSmartReplies();
    }
  },[messages]);

  const replaceSendMessageText = (reply) => {
    console.log("button being clicked");
    console.log(reply);
    setToSend(reply);
  }
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
      {smartReplies.map(
                  reply => (
                    <Button label={reply} handleAction={() => replaceSendMessageText(reply)}></Button>
                  )
                )}
      <SendMessage scroll={scroll} messageScroll={messageScroll} chatRoom={chatRoom+'/messages'} currentUserName={currentUserName} currentImageUrl={currentImageUrl} toSend={toSend}/>
      </div>
      <span ref={scroll}></span>
      </div>
      </div>
}

    </div>
  )
}

export default ChatRoom