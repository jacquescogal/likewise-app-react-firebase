import { db } from '../../firebase-config';
import { getDoc,doc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { useState } from 'react';


const BasicCard = ({eventID,nameOfEvent,date,time,location,pax,cap,numOfJoiners,capacity,thePath,setOpenJoin,setEventCard}) =>{
  
  const navigate=useNavigate();

  const [joined,setJoined]=useState(false)

  useEffect(()=>{ 
    const unsubscribe = async ()=>{
      const user=JSON.parse(localStorage.getItem('user'))
      const docSnap=await getDoc(doc(db,'users/'+user.email+'/joinedRooms',eventID))
      console.log("HELLLOOO")
      console.log(eventID)
      if (docSnap.exists()){
        setJoined(true)
      }
    }
    return unsubscribe
  },[])

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

  const ButtonState=()=>{
    if (joined===true){
      return <button class='w-24 h-fit rounded-md bg-teal-400 border-1' disabled >Already In</button>
    }
    
    else if (cap-pax===0){
      return <button class='w-24 h-fit rounded-md bg-gray-300 border-1' disabled >Full</button>
    }
    else{
      return <button class='w-24 h-fit rounded-md bg-orange-300 p-1 hover:border-2 hover:bg-orange-400' onClick={handleJoinEvent}>Join Room</button>
    }
  }

  return (
    <div class={(cap-pax!==0)?'overflow-hidden w-full p-1 bg-teal-50 border-b-4 border-teal-500 h-fit xl:h-24 rounded-md grid grid-rows-10 grid-cols-1 xl:grid-cols-5 xl:grid-rows-1 items-center m-1':'overflow-hidden w-full p-1 bg-orange-50 border-b-4 border-orange-500	 h-fit xl:h-24 rounded-md grid grid-rows-10 grid-cols-1 xl:grid-cols-5 xl:grid-rows-1 items-center m-1'}>
      <div class='grid xl:h-24 grid-rows-3 grid-cols-1 col-span-2'>
      <span class='font-bold mt-3 ml-3 text-3xl row-span-2'>{nameOfEvent}</span>
      <span class='ml-3 text-xs row-span-1'>{location}</span>
      </div>
      <div class='font-semibold flex item-start flex-col'>
      <p class='-mb-1'>{numOfJoiners}/{capacity} Joiners</p>
      <div >
      <span >😀</span>
      {paxViz()}
      {remViz()}
      </div>
      </div>
      <div class='flex item-start flex-col'>
      <p class='font-semibold -mb-1'>📅: {date}</p>
      <p class='font-semibold -mb-1'>⌛: {time}</p>
      </div>
      
      <ButtonState/>
    </div>
  );
}

export default BasicCard;