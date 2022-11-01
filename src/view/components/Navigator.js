import * as React from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import HistoryIcon from '@mui/icons-material/History';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const categories = [
  {
    id: 'Directory',
    children: [
      {
        id: 'Activity Rooms',
        icon: <GroupsIcon />
      },
      { id: 'My Rooms', icon: <MeetingRoomIcon /> },
      { id: 'Profile', icon: <AccountBoxIcon /> }
    ],
  },
];

const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};

export default function Navigator(props) {

  const [select,setSelect]=useState({
    'Home':false,
    'Activity Rooms':true,
    'My Rooms':false,
    'My Profile':false
  })
  const { ...other } = props;

  const navigate=useNavigate();
  

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding >
      <ListItem >
          <img src={`${process.env.PUBLIC_URL}/logo.png`} height={200} width={200}/>
        </ListItem>
        <ListItem sx={{px:3,color:'#fff'}}>
        </ListItem>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: 'rgb(251, 199, 115)' }}>
            <ListItem sx={{ py: 2, px: 3 }}>
            <span class='font-bold'>Directory</span>
            </ListItem>
            {children.map(({ id: childId, icon, active }) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton selected={select[childId]} sx={item} onClick={()=>{const myObject=select;for (const property in myObject){
                  if (property!=childId){
                    myObject[property]=false
                  }
                  else{
                    myObject[property]=true
                  }
                };setSelect(myObject);(childId==='Home')?navigate('/Home/Main'):
                navigate('/Home/'+childId.split(' ')[0]+(childId.split(' ')[1]?childId.split(' ')[1]:''))}}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <span class='font-semibold text-xl'>{childId}</span>
                </ListItemButton>
              </ListItem>
            ))}

            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}