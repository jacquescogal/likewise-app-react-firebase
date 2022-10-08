import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import {db, storage} from '../../firebase-config'
import {ref,getDownloadURL} from 'firebase/storage'
import { Grow } from '@mui/material';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import dayjs from 'dayjs';

const JoinRoomCard = ({chatRoomRef,setChatRoom,timer}) => {
    const navigate=useNavigate();
    const [appear,setAppear]=useState(false);
    const [chatRoomData,setChatRoomData]=useState(null);
    const [chatRoomPath,setChatRoomPath]=useState(null);
    useEffect(()=>{
        const timeout=setTimeout(()=>{
          setAppear(true);
        },timer)
        return ()=>clearTimeout(timeout)
      },[appear])
    
    useEffect(()=>{
        const unsubscribe=async()=>{
            let docData= await getDoc(chatRoomRef);
        setChatRoomData({...docData.data()});
        setChatRoomPath(chatRoomRef._key.path.segments.splice(5).join('/'))
        }
        return unsubscribe
    },[])



  return (
    <div>
    {(chatRoomData)?
    <Grow in={appear}>
    <Card sx={{display:'flex',flexDirection:'column',minHeight:325,maxHeight:300,minWidth:250,maxWidth:250, ':hover':{boxShadow:'10'}, marginTop:1}}
    onClick={()=>{setChatRoom(chatRoomPath);localStorage.setItem('chatRoom',chatRoomPath);navigate('/home/chatroom')}}>
      <CardContent>
        {/* Map */}
        <h1>{chatRoomData.name}</h1>
        <h2>Joined:{chatRoomData.pax}/{chatRoomData.cap}</h2>
        <h2>Date:{dayjs.unix(chatRoomData.time.seconds).format('DD/MM/YYYY')}</h2>
        <h2>Time:{dayjs.unix(chatRoomData.time.seconds).format('hh:mm A')}</h2>
      </CardContent>
      </Card>
    </Grow>:<div></div>
    }
    </div>
  )
}

export default JoinRoomCard