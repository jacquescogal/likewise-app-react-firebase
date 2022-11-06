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
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import dayjs from 'dayjs';

// --- Material Ui Imports --- //
import Container from "@mui/material/Container";
import CardActionArea from "@mui/material/CardActionArea";
import { toast } from 'react-toastify';
//import makeStyles from "@mui/material/makeStyles";

// --- Fill Image Card Component Imports --- //

  /**
   * Max Card with for demo
   * same values used in Material-Ui Card Demos
   */






const JoinRoomCard = ({chatRoomRef,setChatRoom,timer=50,eActivity,empty=false}) => {

  const [countdown,setCountdown]=useState(true);
  const [dayCount,setDayCount]=useState(0);
  const [hourCount,setHourCount]=useState(0);
  const [minuteCount,setMinuteCount]=useState(0);
  const [secondCount,setSecondCount]=useState(null);
    const navigate=useNavigate();
    const [appear,setAppear]=useState(false);
    const [chatRoomData,setChatRoomData]=useState(null);
    const [chatRoomPath,setChatRoomPath]=useState(null);
    const [aRoom, setARoom] = useState(null);
    
    useEffect(()=>{
        const timeout=setTimeout(()=>{
          setAppear(true);
        },timer)
        
        return ()=>clearTimeout(timeout)
      
      },[appear])

    useEffect(()=>{
      if (secondCount!==null && countdown==true){
      const timeout=setTimeout(()=>{
        if (secondCount>0){
        setSecondCount(secondCount-1);
        }
        else if (minuteCount>0 && secondCount===0){
          setMinuteCount(minuteCount-1)
          setSecondCount(59)
        }
        else if (hourCount>0 && minuteCount===0 && secondCount===0){
          setHourCount(hourCount-1)
          setMinuteCount(59)
          setSecondCount(59)
        }
        else if (dayCount>0 && hourCount===0 && minuteCount===0 && secondCount===0){
          setDayCount(dayCount-1)
          setHourCount(23)
          setMinuteCount(59)
          setSecondCount(59)
        }
        else if (dayCount===0 && hourCount===0 && minuteCount===0 && secondCount===0){
          setCountdown(false)
        }
      },1000)
      
      return ()=>clearTimeout(timeout)
      }
    },[secondCount])

      
    
    useEffect(()=>{
      if (empty===false){
        const unsubscribe=async()=>{
            let docData= await getDoc(chatRoomRef);
        setChatRoomData({...docData.data()});
        setChatRoomPath(chatRoomRef._key.path.segments.splice(5).join('/'));
        const tempDayCount=dayjs.unix(docData.data().time.seconds).diff(dayjs(),'day')
        setDayCount(tempDayCount);
        const tempHourCount=dayjs.unix(docData.data().time.seconds).subtract(tempDayCount,'day').diff(dayjs(),'hour')
        setHourCount(tempHourCount)
        const tempMinuteCount=dayjs.unix(docData.data().time.seconds).subtract(tempDayCount,'day').subtract(tempHourCount,'hour').diff(dayjs(),'minute')
        setMinuteCount(tempMinuteCount)
        const tempSecondCount=dayjs.unix(docData.data().time.seconds).subtract(tempDayCount,'day').subtract(tempHourCount,'hour').subtract(tempMinuteCount,'minute').diff(dayjs(),'second')
        setSecondCount(tempSecondCount)
        console.log(tempDayCount,tempHourCount,tempMinuteCount,tempSecondCount)
        }
        return unsubscribe
      }
    },[])
    


    useEffect(()=>{
      if (empty===false){
      getDoc(doc(db, "aRooms", eActivity)).then(docSnap => {
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setARoom({...docSnap.data()});
          console.log(docSnap.data().imageUrl);
        } else {
          console.log("No such document!");
        }
      })
    }
    },[])

    const handleCardClick=()=>{
      setChatRoom(chatRoomPath);
      localStorage.setItem('chatRoom',chatRoomPath);
      navigate('/home/chatroom')
    }

    // image={(aRoom)?aRoom.imageUrl:`${process.env.PUBLIC_URL}/logo.png`}
    //   title={chatRoomData.activity}
    // <h1>{chatRoomData.name}</h1>
    //     <h2>{chatRoomData.activity}</h2>
    //     <h3>Joined:{chatRoomData.pax}/{chatRoomData.cap}</h3>
    //     <h3>Date:{dayjs.unix(chatRoomData.time.seconds).format('DD/MM/YYYY')}</h3>
    //     <h3>Time:{dayjs.unix(chatRoomData.time.seconds).format('hh:mm A')}</h3>
  
    // <div class="overflow-hidden grid h-9xl w-80 bg-slate-100 justify-items-center rounded-xl content-center my-2 group">
    //   <img class="transition ease-in-out object-cover h-48 w-96 rounded-tr-lg rounded-bl-lg group-hover:scale-150" src={(aRoom)?aRoom.imageUrl:`${process.env.PUBLIC_URL}/logo.png`}></img>
    //   <p>{chatRoomData.activity}</p>
    //   </div>

    const paxViz=()=>{
      const viz=[]
      for (let i=0;i<chatRoomData.pax-1;i++){
        viz.push(<span class='-ml-3'>🙂</span>)
      }
      return viz
    }

    const remViz=()=>{
      const viz=[]
      for (let i=0;i<chatRoomData.cap-chatRoomData.pax;i++){
        viz.push(<span class='-ml-3'>❓</span>)
      }
      return viz
    }

  return (
    <Grow in={appear}>
    <div>
      {(empty===true)?
      
      <div class="relative group w-full h-96 overflow-hidden bg-black m-auto rounded-xl border-solid border group">
  <img class="object-cover w-full h-full transform duration-700 backdrop-opacity-100 group-hover:scale-150 group-hover:blur" src={(empty===true)?'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80':`${process.env.PUBLIC_URL}/logo.png`} />
  <div class="absolute w-full h-full shadow-2xl opacity-20 transform duration-500 inset-y-full group-hover:-inset-y-0"></div>
  <div class="absolute bg-gradient-to-t from-gray-900 w-full h-full transform duration-500 inset-y-1/4 content-center group-hover:-inset-y-0">
    <div class="absolute w-full flex place-content-center">
      <p class="transition ease-in-out delay-150 group-hover:-translate-y-1 group-hover:scale-150 font-bold text-4xl text-center text-white mt-10">Empty</p>
    </div>
    <div class="absolute w-full flex place-content-center mt-12">
      <p class="scale-110 font-bold text-center w-4/5 text-white mt-5"></p>
    </div>
    <div class="absolute w-full flex place-content-center mt-24">
      <p class="scale-110 font-bold text-center w-4/5 text-white mt-5">Join a Room to fill this slot!
      <div>
        
      <span ></span>
      </div>
      </p>
    </div>

    <div class="absolute w-full flex place-content-center mt-40">
      <p class="scale-110 text-center w-4/5 text-white mt-5">
      </p>
    </div>



    <div class="absolute w-full flex place-content-center mt-52">
    <p class="scale-110  text-center w-4/5 text-white mt-5"></p>
    <p class="scale-110 text-center w-4/5 text-white mt-5"></p>
    <div class="absolute w-full flex place-content-center bottom-4">
      
      
      </div>
    <button class="invisible transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 absolute -bottom-12 bg-slate-100 text-black font-bold rounded-lg h-10 w-48 bg-orange-200 hover:bg-orange-400" >Enter</button>
    </div>
  </div>
</div>
      :
    (chatRoomData)?
      
      <div class="relative group w-full h-96 overflow-hidden bg-black m-auto rounded-xl border-solid border group">
        
  <img class="object-cover w-full h-full transform duration-700 backdrop-opacity-100 group-hover:scale-150 group-hover:blur" src={(aRoom)?aRoom.imageUrl:`${process.env.PUBLIC_URL}/logo.png`} />
  <div class="absolute w-full h-full shadow-2xl opacity-20 transform duration-500 inset-y-full group-hover:-inset-y-0"></div>
  <p class="absolute top-0 font-semibold text-lg bg-gray-100/80 w-full h-fit pl-2">
    {(countdown===false)?<span>Let the games begin!</span>:
    <>
    <span class='text-orange-800'>{dayCount} {(dayCount>1)?"Days ":"Day "}</span>
    <span class='text-orange-700'>{hourCount} {(hourCount>1)?"Hours ":"Hour "}</span>
    <span class='text-orange-600'>{minuteCount} {(minuteCount>1)?"Minutes ":"Minute "}</span>
    {/* <span class='text-orange-500'>{secondCount} {(secondCount>1)?"Seconds ":"Second "}</span> */}
    </>}
    </p>
  <div class="absolute bg-gradient-to-t from-gray-900 w-full h-full transform duration-500 inset-y-1/4 content-center group-hover:-inset-y-0">
  
    <div class="absolute w-full flex place-content-center">
      <p class="transition ease-in-out delay-150 group-hover:-translate-y-1 group-hover:scale-150 font-bold text-4xl text-center text-white mt-10">{chatRoomData.name}</p>
    </div>
    <div class="absolute w-full flex place-content-center mt-12">
      <p class="scale-110 font-bold text-center w-4/5 text-white mt-5">{chatRoomData.activity}</p>
    </div>
    <div class="absolute w-full flex place-content-center mt-24">
      <p class="scale-110 font-bold text-center w-4/5 text-white mt-5">Joined:{chatRoomData.pax}/{chatRoomData.cap}
      <div>
        
      <span >🙂</span>
      {paxViz()}
      {remViz()}
      </div>
      </p>
    </div>

    <div class="absolute w-full flex place-content-center mt-40">
      <p class="scale-110 text-center w-4/5 text-white mt-5">{chatRoomData.location}
      </p>
    </div>



    <div class="absolute w-full flex place-content-center mt-52">
    <p class="scale-110  text-center w-4/5 text-white mt-5">📅:{dayjs.unix(chatRoomData.time.seconds).format('DD/MM/YYYY')}</p>
    <p class="scale-110 text-center w-4/5 text-white mt-5">⌛:{dayjs.unix(chatRoomData.time.seconds).format('hh:mm A')}</p>
    <div class="absolute w-full flex place-content-center bottom-4">
      
      
      </div>
    <button class="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 absolute -bottom-12 bg-slate-100 text-black font-bold rounded-lg h-10 w-48 bg-orange-200 hover:bg-orange-400" onClick={()=>{handleCardClick()}}>Enter</button>
    </div>
  </div>
</div>:null
    }
    </div>
    </Grow>
  )
}

export default JoinRoomCard
