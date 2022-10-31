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
        setChatRoomPath(chatRoomRef._key.path.segments.splice(5).join('/'));
        }
        return unsubscribe
    },[])
    


    useEffect(()=>{
      getDoc(doc(db, "aRooms", eActivity)).then(docSnap => {
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setARoom({...docSnap.data()});
          console.log(docSnap.data().imageUrl);
        } else {
          console.log("No such document!");
        }
      })
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
    <div>
    {(chatRoomData)?
      
      <div class="relative group w-full h-96 overflow-hidden bg-black m-auto rounded-xl border-solid border group">
  <img class="object-cover w-full h-full transform duration-700 backdrop-opacity-100 group-hover:scale-150 group-hover:blur" src={(aRoom)?aRoom.imageUrl:`${process.env.PUBLIC_URL}/logo.png`} />
  <div class="absolute w-full h-full shadow-2xl opacity-20 transform duration-500 inset-y-full group-hover:-inset-y-0"></div>
  <div class="absolute bg-gradient-to-t from-gray-900 w-full h-full transform duration-500 inset-y-3/4 content-center group-hover:-inset-y-0">
    <div class="absolute w-full flex place-content-center">
      <p class="transition ease-in-out delay-150 group-hover:-translate-y-1 group-hover:scale-150 font-serif font-bold text-3xl text-center text-white mt-10">{chatRoomData.name}</p>
    </div>
    <div class="absolute w-full flex place-content-center mt-12">
      <p class="scale-110 font-sans text-center w-4/5 text-white mt-5">{chatRoomData.activity}</p>
    </div>
    <div class="absolute w-full flex place-content-center mt-24">
      <p class="scale-110 font-sans text-center w-4/5 text-white mt-5">Joined:{chatRoomData.pax}/{chatRoomData.cap}
      <div>
      <span >🙂</span>
      {paxViz()}
      {remViz()}
      </div>
      </p>
    </div>
    <div class="absolute w-full flex place-content-center mt-40">
    <p class="scale-110 font-sans text-center w-4/5 text-white mt-5">📅:{dayjs.unix(chatRoomData.time.seconds).format('DD/MM/YYYY')}</p>
    <p class="scale-110 font-sans text-center w-4/5 text-white mt-5">⌛:{dayjs.unix(chatRoomData.time.seconds).format('hh:mm A')}</p>
    <div class="absolute w-full flex place-content-center bottom-4">
      </div>
    <button class="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 absolute -bottom-12 bg-slate-100 text-black font-bold rounded-lg h-10 w-48 bg-orange-200 hover:bg-orange-400" onClick={()=>{handleCardClick()}}>Enter</button>
    </div>
  </div>
</div>:null
    }
    </div>
  )
}

export default JoinRoomCard
