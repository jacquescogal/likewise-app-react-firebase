import React from 'react';
import {useNavigate} from 'react-router-dom';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ChatRoomDrawer from './ChatRoomDrawer'
import { useState } from 'react';

const ChatRoomBar = ({roomUID,roomName,roomDate,roomTime,roomLocation,roomPlaceID,roomPax,roomCap,roomUsers}) => {
  const navigate = useNavigate();
  const [drawerState, setDrawerState] = useState({
    right: false
  });
  return (
    <div>
        <button class='text-left transition ease-in-out transform duration-500 absolute -right-12 hover:-translate-x-4 top-40 w-20 h-80 font-bold text-white rounded-lg hover:shadow-inner hover:bg-orange-300 hover:shadow  bg-slate-300/50' onClick={()=>{setDrawerState({right:true})}}>
          <MenuOpenIcon/>
        </button>
        <ChatRoomDrawer style={{alignSelf:'end'}} 
        drawerState={drawerState}
        setDrawerState={setDrawerState}
        roomDate={roomDate} 
        roomTime={roomTime} 
        roomLocation={roomLocation}
        roomPlaceID={roomPlaceID}
        roomCap={roomCap}
        roomPax={roomPax}
        roomUsers={roomUsers}/>
    </div>
  )
}

export default ChatRoomBar