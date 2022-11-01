import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate} from 'react-router-dom';
import { useState } from 'react';


const BasicCard = ({eventID,nameOfEvent,date,time,location,pax,cap,numOfJoiners,capacity,thePath,setOpenJoin,setEventCard}) =>{
  
  const navigate=useNavigate();

  const handleJoinEvent=()=>{
    setOpenJoin(true);
    setEventCard({eventID:eventID,name:nameOfEvent,date:date,time:time,location:location,pax:pax,cap:cap,path:thePath})
  }

  const paxViz=()=>{
    const viz=[]
    for (let i=0;i<pax-1;i++){
      viz.push(<span class='-ml-3'>🙂</span>)
    }
    return viz
  }

  const remViz=()=>{
    const viz=[]
    for (let i=0;i<cap-pax;i++){
      viz.push(<span class='-ml-3'>❓</span>)
    }
    return viz
  }

  return (
    <div class={(cap-pax!==0)?'overflow-hidden w-full p-1 bg-green-50 border border-green-100 h-fit xl:h-24 rounded-md grid grid-rows-10 grid-cols-1 xl:grid-cols-5 xl:grid-rows-1 items-center m-1':'overflow-hidden w-full p-1 bg-red-50 border border-red-100 h-fit xl:h-24 rounded-md grid grid-rows-10 grid-cols-1 xl:grid-cols-5 xl:grid-rows-1 items-center m-1'}>
      <span class='font-semibold  text-4xl col-span-2'>{nameOfEvent}</span>
      <div class='flex item-start flex-col'>
      <p class='-mb-1'>{numOfJoiners}/{capacity} Joiners</p>
      <div >
      <span >🙂</span>
      {paxViz()}
      {remViz()}
      </div>
      </div>
      <div class='flex item-start flex-col'>
      <p class='-mb-1'>📅: {date}</p>
      <p class='-mb-1'>⌛: {time}</p>
      </div>
      
      {(cap-pax!==0)?
      <button class='w-24 h-fit rounded-md bg-orange-300 p-1 hover:border-2 hover:bg-orange-400' onClick={handleJoinEvent}>Join Room</button>
      :<button class='w-24 h-fit rounded-md bg-gray-300 border-1' disabled >Join Full</button>}
    </div>
  );
}

export default BasicCard;