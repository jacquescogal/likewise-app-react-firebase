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
import { Box, CircularProgress } from '@mui/material'


const Profile = ({setPageTitle}) => {

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
    setPageTitle('Profile')
  },[])

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
        localStorage.setItem('userProfile',JSON.stringify(profileInfo))
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
{/* <body class="absolute top-20 w-full h-full bg-center bg-cover"> */}
<body class="bg-center bg-cover w-full h-full pt-20 pb-60 bg-[url('https://images.unsplash.com/photo-1613064314228-983de855f228?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')]">
    <div class="container mx-auto=">
        <div>
                <div class="flex justify-center">
                </div>
                <ProfilePic isEditable={false}/>
                <div class="mt-0">
                <div class="bg-white align-middle	bg-opacity-50 shadow rounded-lg max-w-lg mx-auto items-center">
                    <h1 class="block font-bold text-center text-3xl text-gray-900"><br></br></h1>
                    <div class="w-full">
                        <div class="mt-5 w-full flex flex-col items-center overflow-hidden text-sm">    
                <form>
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label for="Username" class="block mb-2 text-lg font-large text-gray-900 ">Username:</label>
                            <label class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">{profileInfo.username}</label>
                        </div>

                        <div>
                            <label for="Year of Study" class="block mb-2 text-lg font-large text-gray-900 ">Year of study:</label>
                            <label class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" >{profileInfo.studyYear}</label>
                        </div>  
                        <div>
                            <label for="Gender" class="block mb-2 text-lg font-large text-gray-900 ">Gender:</label>
                            <label class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "> {profileInfo.gender}</label>
                        </div>
                        <div>
                            <label for="Date of Birth" class="block mb-2 text-lg font-large text-gray-900 ">Date of Birth:</label>
                            <label class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "> {profileInfo.DOB}</label>
                        </div>
                    </div>
                    <div class="mb-6">
                        <label for="Course of Study" class="block mb-2 text-lg font-large text-gray-900 ">Course of Study:</label>
                        <label class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">{profileInfo.course}</label>
                    </div> 
                    <div class="mb-6">
                        <label for="School Email" class="block mb-2 text-lg font-large text-gray-900 ">School Email:</label>
                        <label class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">{profileInfo.email}</label>
                    </div> 
                    <div class="mb-6">
                        <label for="Password" class="block mb-2 text-lg font-large text-gray-900">Password</label>
                        <label class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " >•••••••••</label>
                    </div> 
                    
                    <button class="text-gray-900 bg-amber-300	mb-20 hover:bg-amber-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-lg rounded-lg text-lg w-full sm:w-auto px-5 py-2.5 text-center" onClick={()=>navigate('EditProfile')} startIcon={<AccountBoxIcon sx={{ fill:'white','&:hover':{fill:'primary.main'} }}/>}>Edit Profile</button>      
                </form>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</body>


      <br></br>

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