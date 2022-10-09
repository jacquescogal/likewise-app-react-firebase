import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PlaceIcon from '@mui/icons-material/Place';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { collection, getDocs,getDoc, deleteDoc,doc, updateDoc, increment} from 'firebase/firestore';
import { db } from '../../firebase-config';
import {useNavigate } from 'react-router-dom';
import CircleIcon from '@mui/icons-material/Circle';
import { getAuth } from 'firebase/auth';
import { useState,useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';

const TemporaryDrawer=({roomDate,roomTime,roomLocation,roomPax,roomCap,roomUsers})=> {
  const navigate=useNavigate();
  const [ownerStatus,setOwnerStatus]=useState(null);
  const [state, setState] = useState({
    right: false
  });

  useEffect(()=>{
    const chatRoom=localStorage.getItem('chatRoom')
    const unsubscribe = async ()=>{
      const user=getAuth().currentUser
      onSnapshot(doc(db,chatRoom+'/users/'+user.email),docSnap=>{
        console.log(docSnap.exists())
        if (docSnap.exists() && docSnap.data().role=='owner'){
          setOwnerStatus(true)
        }
        else{
          setOwnerStatus(false)
        }
      })
    }
    return unsubscribe
  },[])

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleDelete = async () =>{
    const eventRoom=localStorage.getItem('eventRoom')
    const chatRoom=localStorage.getItem('chatRoom')
    const chatRoomKey=chatRoom.split('/').slice(-1)[0]
    const chatRoomUsers=collection(db,chatRoom+'/users')
    const chatRoomUsersSnapshot=await getDocs(chatRoomUsers)
    const chatRoomMessages=collection(db,chatRoom+'/messages')
    const chatRoomMessagesSnapshot=await getDocs(chatRoomMessages)
    console.log(chatRoom)
    chatRoomUsersSnapshot.forEach( (document)=>{
      console.log('users/'+document.id+'/joinedRooms',chatRoomKey)
      deleteDoc(doc(db,'users/'+document.id+'/joinedRooms',chatRoomKey))
      deleteDoc(doc(db,chatRoom+'/users',document.id))
    })
    chatRoomMessagesSnapshot.forEach( (document)=>{
      deleteDoc(doc(db,chatRoom+'/messages',document.id))
    })
    deleteDoc(doc(db,'aRooms/'+eventRoom+'/eRooms',chatRoomKey))
    await updateDoc(doc(db,'aRooms',eventRoom),{
      cap:increment(-1)
    })
    navigate('/home/MyRooms')
  }

  const handleLeave = async () =>{
    const chatRoom=localStorage.getItem('chatRoom')
    const chatRoomKey=chatRoom.split('/').slice(-1)[0]
    const user=getAuth().currentUser
    console.log('users/'+user.email+'/joinedRooms',chatRoomKey)
    deleteDoc(doc(db,'users/'+user.email+'/joinedRooms',chatRoomKey))
    deleteDoc(doc(db,chatRoom+'/users',user.email))
    await updateDoc(doc(db,chatRoom),{
      pax:increment(-1),
      rem:increment(1)
    })
    navigate('/home/MyRooms')
  }

  const drawerButtonState=()=>{
    if (ownerStatus==null){
      return <Button  variant="outlined" disabled>Loading</Button>
    }
    else if (ownerStatus==false){
      return <Button  variant="outlined" sx={{
        bgcolor:'#E22727',
        color:'white',
                    ':hover': {
                      bgcolor: '#D50000', // theme.palette.primary.main
                      color: 'white'
                    },
                  }}
                  onClick={handleLeave}>Leave</Button>
    }
    else if (ownerStatus==true){
      return <Button  variant="outlined" sx={{
        bgcolor:'#E22727',
        color:'white',
                    ':hover': {
                      bgcolor: '#D50000', // theme.palette.primary.main
                      color: 'white'
                    },
                  }}
                  onClick={handleDelete}>Delete</Button>
    }
  }

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClose={toggleDrawer(anchor, false)}
    >
      <List>
      <ListItemText primary='Event Details:' sx={{marginLeft:'10px'}}/>
        <ListItem key='Date'>
            <ListItemIcon>
                <CalendarMonthIcon/>
            </ListItemIcon>
            <ListItemText primary='Date' secondary={roomDate}/> {/*put date text here*/}
        </ListItem>
        <ListItem key='Time'>
            <ListItemIcon>
                <ScheduleIcon/>
            </ListItemIcon>
            <ListItemText primary='Time' secondary={roomTime}/> {/*put time text here*/}
        </ListItem>
        <ListItem key='Location'>
            <ListItemIcon>
                <PlaceIcon/>
            </ListItemIcon>
            <ListItemText primary='Location' secondary={roomLocation}/> {/*put location text here*/}
        </ListItem>
      </List>
      <Divider />
      <List>
      <ListItemText sx={{marginLeft:'10px'}}>Attendees ({roomPax}/{roomCap}) :</ListItemText>
      {(roomUsers)?roomUsers.map(userObject=>{
        return <ListItem key={userObject.id}>
        <ListItemIcon>
          {(userObject.role==='owner')?
            <CircleIcon sx={{fill:'#ffad01'}}/>:
            <CircleIcon sx={{fill:'black'}}/>
      }
        </ListItemIcon>
        <ListItemText primary={userObject.name} secondary={userObject.role}/> 
    </ListItem>
      }):<div></div>}
        <ListItem >
        {drawerButtonState()}
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      {
        <React.Fragment key={'right'}>
            <IconButton
            size="large"
            aria-label="menu"
            
            onClick={toggleDrawer('right', true)} 
          >
            <MenuIcon/>
          </IconButton>
          <Drawer
            anchor={'right'}
            open={state['right']}
            onClose={toggleDrawer('right', false)}
          >
            {list('right')}
          </Drawer>
        </React.Fragment>
}
    </div>
  );
}

export default TemporaryDrawer