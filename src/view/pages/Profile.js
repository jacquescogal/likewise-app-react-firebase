import { getAuth } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc,getDoc } from 'firebase/firestore'
import { auth } from '../../firebase-config'
import { db } from '../../firebase-config'
import ProfilePic from '../components/ProfilePic'
import { AirportShuttleTwoTone, NotListedLocation } from '@mui/icons-material'

import Button from '@mui/material/Button';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EditProfile from './EditProfile';
import { CircularProgress } from '@mui/material'

const Profile = () => {

  //refer to registration for date picker/gender picker/year picker etc.
  
  let navigate = useNavigate();
  const [user,setUser]=useState(null);

  //profile hashmap 
  const [profileInfo,setProfileInfo]=useState({
    imageUrl:'',
    username:'',
    email:'',
    password:'',
    gender:'',
    DOB:'',
    course:'',
    studyYear:''
  })

  useEffect(()=>{
    if (!user){
      console.log('wait')
      auth.onAuthStateChanged(user=>{
        setUser(user)
      })}
    else{
    getDoc(doc(db, "users", user.email)).then(docSnap => {
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setProfileInfo({...docSnap.data(),email:user.email,password:'password123'})
        console.log(docSnap.data().DOB.toString())
      } else {
        console.log("No such document!");
      }
    })
  }
  },[user])

  const handleLogout = () => {
      const auth=getAuth();
      auth.signOut().then((value)=>{
        console.log(value)
        navigate('/');
        localStorage.clear();
      },(reason)=>console.log(reason))
  }

  return (
    
    <menu>
      {(user)?
    <div>
    <h1 style={{marginTop:"12px", fontFamily:"serif", fontWeight: 'bold', fontSize: '50px', color:'#ffad01'}}>Profile</h1>


      <Button sx={{minWidth:'200px', justifyContent: "flex-start",marginLeft:'950px', color:'orange',':hover':{color:'primary.main',bgcolor:'lightblue'}}} onClick={()=>navigate('EditProfile')} startIcon={<AccountBoxIcon sx={{ fill:'white','&:hover':{fill:'primary.main'} }}/>}>Edit Profile</Button>
   
      <ProfilePic />

      <section>
       Username:
       <p style={{minHeight:'25px',backgroundColor: "white", border:"1px solid orange", borderRadius: '5px', borderRight : '300px'}} >
      {profileInfo.username}
      </p></section>

      <section>
       Password:
      <input value={profileInfo.password} readOnly={true} disabled={true} style={{minHeight:'100%',minWidth:'100%',backgroundColor: "white", border:"1px solid orange",borderRadius: '5px', borderRight : '300px'}} type='password' >
      </input></section>

      <section>
       School Email:
      <p style={{minHeight:'25px',backgroundColor: "white", border:"1px solid orange",borderRadius: '5px', borderRight : '300px'}} >
      {profileInfo.email}
      </p></section>

      <section>
       Gender:
      <p style={{minHeight:'25px',backgroundColor: "white", border:"1px solid orange",borderRadius: '5px', borderRight : '300px'}} >
      {profileInfo.gender}
      </p></section>

      <section>
       Date of Birth:
      <p style={{minHeight:'25px',backgroundColor: "white", border:"1px solid orange",borderRadius: '5px', borderRight : '300px'}} >
      {profileInfo.DOB} 
      </p></section>

      <section>
       Course of study:
      <p style={{minHeight:'25px',backgroundColor: "white", border:"1px solid orange",borderRadius: '5px', borderRight : '300px'}} >
      {profileInfo.course}
      </p></section>

      <section>
       Year of study:
      <p style={{minHeight:'25px',backgroundColor: "white", border:"1px solid orange",borderRadius: '5px', borderRight : '300px'}} >
      {profileInfo.studyYear}
      </p></section>

      <br></br>
      <div>
        <button onClick={()=>handleLogout()}>Logout</button>
      </div>
    </div>:<div
    style={{
        position: 'absolute', left: '60%', top: '50%',
        transform: 'translate(-50%, -50%)'
    }}
    >
      <p>loading...</p>
      <CircularProgress color="secondary" size={50} thickness={5}/>
    </div>}
    </menu>
  )
}

export default Profile