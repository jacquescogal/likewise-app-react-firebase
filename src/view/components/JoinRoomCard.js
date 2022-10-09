import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
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

// --- Material Ui Imports --- //
import Container from "@mui/material/Container";
import CardActionArea from "@mui/material/CardActionArea";
//import makeStyles from "@mui/material/makeStyles";

// --- Fill Image Card Component Imports --- //

  /**
   * Max Card with for demo
   * same values used in Material-Ui Card Demos
   */






const JoinRoomCard = ({chatRoomRef,setChatRoom,timer,eActivity}) => {
    const navigate=useNavigate();
    const [appear,setAppear]=useState(false);
    const [chatRoomData,setChatRoomData]=useState(null);
    const [chatRoomPath,setChatRoomPath]=useState(null);
    const [activity, setActivity] = useState(null);
    const [aRoom, setARoom] = useState(null);

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
        setActivity({...docData.data().activity});
        console.log(...docData.data().activity);
        setChatRoomPath(chatRoomRef._key.path.segments.splice(5).join('/'));
        }
        return unsubscribe
    },[])
    


    useEffect(()=>{
        const getA=async()=>{
           let docDa=await getDoc(db, "aRooms", eActivity);
            setARoom({...docDa.data()});
            console.log(docDa.data().imageUrl)
        }
      return getA
    },[])
 
  

  return (
    <div>
    {(chatRoomData)?
    <Grow in={appear}>

    <Card sx={{display:'flex',flexDirection:'column',minHeight:500,maxHeight:800,minWidth:400,maxWidth:400, ':hover':{boxShadow:'10'}, marginTop:1 }}
    onClick={()=>{setChatRoom(chatRoomPath);localStorage.setItem('chatRoom',chatRoomPath);navigate('/home/chatroom')}}>
    <CardMedia style = {{ height: 0, paddingTop: '56%'}}
      media="picture"
      alt="Contemplative Reptile"
      image={`${process.env.PUBLIC_URL}/logo.png`}
      title="Contemplative Reptile"
    />
      <CardContent>
        {/* Map */}
        <h1>{chatRoomData.activity}</h1>
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
