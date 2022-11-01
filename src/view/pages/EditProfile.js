import { getAuth } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteDoc, doc,getDoc,setDoc,updateDoc } from 'firebase/firestore'
import { useAuth,auth } from '../../firebase-config'
import { db } from '../../firebase-config'
import ProfilePic from '../components/ProfilePic'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Button from "../components/common/Button";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import {  toast } from 'react-toastify';

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const EditProfile = ({setPageTitle}) => {

  useState(()=>{
    setPageTitle('Edit Profile')
  },[])

  //refer to registration for date picker/gender picker/year picker etc.
  
  let navigate = useNavigate();
  let [user,setUser]=useState(null);

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

  const [gender,setGender]=useState(profileInfo.gender);
  const [DOB,setDOB]=useState(profileInfo.DOB);
  const [course,setCourse]=useState(profileInfo.course);
  const [studyYear,setStudyYear]=useState(profileInfo.studyYear);
  const [username,setUsername]=useState(profileInfo.username);

  useEffect(()=>{
    if (!user){
      console.log('wait')
      if (localStorage.getItem('userProfile')!=null){
        setProfileInfo(JSON.parse(localStorage.getItem('userProfile')))
      }
      auth.onAuthStateChanged(user=>{
        setUser(user)
      })}
    else{
    getDoc(doc(db, "users", user.email)).then(docSnap => {
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setProfileInfo({...docSnap.data(),email:user.email,password:'password123'})
        console.log(docSnap.data().DOB.toString())
        setUsername(profileInfo.username)
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
      },(reason)=>console.log(reason))
  }


  async function saveProfile(){
    const userDocSnap=await getDoc(doc(db,'usernames',username?username:profileInfo.username))
    console.log(username,profileInfo.username)
    if (userDocSnap.exists()){
      if (!username || username===profileInfo.username){
        console.log(username,profileInfo.username)
        console.log('same username')
      }
     else{
        toast.error('username already exists, please change')
        return
        }
    }
    
    const userRef = doc(db,'users', user.email);
    await updateDoc(userRef, {
      username: username?username:profileInfo.username,
      DOB: DOB?DOB:profileInfo.DOB,
      gender: gender?gender:profileInfo.gender,
      studyYear: studyYear?studyYear:profileInfo.studyYear,
      course: course?course:profileInfo.course
    });
    if (username!=profileInfo.username && username!=='' && username!==null){
      console.log(profileInfo.username)
      await deleteDoc(doc(db,'usernames',profileInfo.username))
      await setDoc(doc(db,'usernames',username),{
        email:auth.currentUser.email
      })
  }
  navigate(-1);

  
}

  return (
      
    <body class="bg-center bg-cover w-full h-full pt-20 pb-20 )]">
    <div class="container mx-auto=">
        <div>
                <div class="flex justify-center">
                </div>

      <ProfilePic />
      <div class="flex flex-col px-10 bg-white bg-opacity-50 shadow rounded-lg max-w-lg mx-auto justify-items-center">
      <h1 class=""><br></br></h1>

                        <div class="grid gap-6 mb-6 md:grid-cols-2">
                        <p style={{minHeight:'20px',backgroundColor: "white",marginTop:'4px'}} >
                        <TextField id="outlined-basic" label="Outlined" variant="outlined"   value={username?username:profileInfo.username} onChange={e=>setUsername(e.target.value)}/>
                        </p>

                        <div class="block mb-2 text-lg font-large text-gray-900 dark:text-gray-300">

                        <p style={{minHeight:'25px',backgroundColor: "white"}} >
                        {/* Gender Picker */}
                        <FormControl sx={{ minWidth: 120 ,maxWidth:300,}}>
                        <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                          <Select
                            labelId="gender"
                            id="genderSelect"
                            value={gender?gender:profileInfo.gender}
                            label="gender"
                            onChange={event=>{setGender(event.target.value);}}
                          >
                            <MenuItem value=''>
                              Please pick your gender
                            </MenuItem>
                            <MenuItem value={'Male'}>Male</MenuItem>
                            <MenuItem value={'Female'}>Female</MenuItem>
                            <MenuItem value={'Prefer not to say'}>Prefer not to say</MenuItem>
                          </Select>
                        </FormControl>
                        </p>

                        </div>


                        <div class="block mb-2 text-lg font-large text-gray-900 dark:text-gray-300">
                        <p variant="filled" style={{minHeight:'25px',backgroundColor: "white"}} >

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          
                          <DesktopDatePicker
                            label="Date of Birth"
                            inputFormat="DD/MM/YYYY"
                            value={DOB?DOB:profileInfo.DOB}
                            onChange={e=>{setDOB(dayjs(e.$d.toString()).format('MM/DD/YYYY'));console.log(dayjs(e.$d.toString()).format('MM/DD/YYYY'));}}
                            renderInput={(params) => <TextField {...params} />}
                          />
                          </LocalizationProvider>
                        </p></div>



                        <div class="block mb-2 text-lg font-large text-gray-900 dark:text-gray-300">
                        <p style={{minHeight:'25px',backgroundColor: "white"}} >
                        <FormControl sx={{ minWidth: 120 ,maxWidth:300}}>
                        <InputLabel id="demo-simple-select-label">Year of study</InputLabel>
                          <Select
                            labelId="studyYear"
                            id="studyYearSelect"
                            value={studyYear?studyYear:profileInfo.studyYear}
                            label="studyYear"
                            onChange={event=>{setStudyYear(event.target.value);}}
                          >
                            <MenuItem value="">
                              Please pick your year of study
                            </MenuItem>
                            <MenuItem value={'Year 1'}>Year 1</MenuItem>
                            <MenuItem value={'Year 2'}>Year 2</MenuItem>
                            <MenuItem value={'Year 3'}>Year 3</MenuItem>
                            <MenuItem value={'Year 4'}>Year 4</MenuItem>
                            <MenuItem value={'Year 5'}>Year 5</MenuItem>
                            <MenuItem value={'Year 6'}>Year 6</MenuItem>
                          </Select>
                        </FormControl>

                       </p>
                        </div>
                        </div>

                        <div class="mb-6 justify-center	">
                        <p style={{minHeight:'25px',backgroundColor: "white"}}>
                        
                        <FormControl sx={{ minWidth: 120 ,maxWidth:300}}>
                        <InputLabel id="demo-simple-select-label">Course</InputLabel>
                          <Select
                            labelId="coursePicker"
                            id="coursePickerSelect"
                            value={course?course:profileInfo.course}
                            label="Course"
                            onChange={event=>{setCourse(event.target.value);}}
                          >
                            <MenuItem value="">
                              Please pick your course
                            </MenuItem>
                            <MenuItem value={'ACBS'}>ACBS - Accountancy And Business</MenuItem>
                            <MenuItem value={'ACC'}>ACC - Accountancy</MenuItem>
                            <MenuItem value={'ADM'}>ADM - Art, Design & Media</MenuItem>
                            <MenuItem value={'AERO'}>AERO - Aerospace Engineering</MenuItem>
                            <MenuItem value={'ASEC'}>ASEC - Aerospace Engineering And Economics</MenuItem>
                            <MenuItem value={'BCE'}>BCE - Business And Computer Engineering</MenuItem>
                            <MenuItem value={'BCG'}>BCG - Business And Computing</MenuItem>
                            <MenuItem value={'BEEC'}>BEEC - Bioengineering And Economics</MenuItem>
                            <MenuItem value={'BIE'}>BIE - Bioengineering</MenuItem>
                            <MenuItem value={'BMS'}>BMS - Biomedical Sciences & Chinese Medicine</MenuItem>
                            <MenuItem value={'BS'}>BS - Biological Sciences</MenuItem>
                            <MenuItem value={'BUS'}>BUS - Business</MenuItem>
                            <MenuItem value={'CBE'}>CBE - Chemical & Biomolecular Engineering</MenuItem>
                            <MenuItem value={'CBEC'}>CBEC - Chemical & Biomolecular Engineering And Economics</MenuItem>
                            <MenuItem value={'CE'}>CE - Computer Engineering</MenuItem>
                            <MenuItem value={'CEE'}>CEE - Civil Engineering</MenuItem>
                            <MenuItem value={'CEEC'}>CEEC - Computer Engineering And Economics</MenuItem>
                            <MenuItem value={'CHEM'}>CHEM - Chemistry & Biological Chemistry</MenuItem>
                            <MenuItem value={'CHIN'}>CHIN - Chinese</MenuItem>
                            <MenuItem value={'CS'}>CS - Communication Studies</MenuItem>
                            <MenuItem value={'CSC'}>CSC - Computer Science</MenuItem>
                            <MenuItem value={'CSEC'}>CSEC - Computer Science And Economics</MenuItem>
                            <MenuItem value={'CVEC'}>CVEC - Civil Engineering And Economics</MenuItem>
                            <MenuItem value={'ECON'}>ECON - Economics</MenuItem>
                            <MenuItem value={'EEE'}>EEE - Electrical & Electronic Engineering</MenuItem>
                            <MenuItem value={'EEEC'}>EEEC - Electrical & Electronic Engineering And Economics</MenuItem>
                            <MenuItem value={'EESS'}>EESS - Environmental Earth Systems Science</MenuItem>
                            <MenuItem value={'ELH'}>ELH - English</MenuItem>
                            <MenuItem value={'ENE'}>ENE - Environmental Engineering</MenuItem>
                            <MenuItem value={'ENEC'}>ENEC - Environmental Engineering And Economics</MenuItem>
                            <MenuItem value={'ENG'}>ENG - Engineering</MenuItem>
                            <MenuItem value={'HIST'}>HIST - History</MenuItem>
                            <MenuItem value={'IEEC'}>IEEC - Information Engineering & Media And Economics</MenuItem>
                            <MenuItem value={'IEM'}>IEM - Information Engineering & Media</MenuItem>
                            <MenuItem value={'LMS'}>LMS - Linguistics & Multilingual Studies</MenuItem>
                            <MenuItem value={'MAT'}>MAT - Materials Engineering</MenuItem>
                            <MenuItem value={'MATH'}>MATH - Mathematical Sciences</MenuItem>
                            <MenuItem value={'ME'}>ME - Mechanical Engineering</MenuItem>
                            <MenuItem value={'MEEC'}>MEEC - Mechanical Engineering And Economics</MenuItem>
                            <MenuItem value={'MS'}>MS - Maritime Studies</MenuItem>
                            <MenuItem value={'MTEC'}>MTEC - Materials Engineering And Economics</MenuItem>
                            <MenuItem value={'PHIL'}>PHIL - Philosophy</MenuItem>
                            <MenuItem value={'PHY'}>PHY - Physics & Applied Physics</MenuItem>
                            <MenuItem value={'PPGA'}>PPGA - Public Policy And Global Affairs</MenuItem>
                            <MenuItem value={'PSY'}>PSY - Psychology</MenuItem>
                            <MenuItem value={'REP'}>REP - Renaissance Engineering</MenuItem>
                            <MenuItem value={'SOC'}>SOC - Sociology</MenuItem>
                            <MenuItem value={'SSM'}>SSM - Sport Science And Management</MenuItem>
                          </Select>
                        </FormControl>
                      </p>
                           
                      </div>
                      <div class="mb-6 justify-center	">
                      <TextField
                      disabled
                        id="outlined-read-only-input"
                        label="Email"
                        defaultValue={profileInfo.email}
                        value={profileInfo.email}
                        InputProps={{
                        readOnly: true,
                        }}
                      />
                      </div>
                      <button class="justify-center text-gray-900 bg-amber-300	mb-20 hover:bg-amber-400 focus:ring-4 rounded-md text-sm w-full sm:w-auto pl-2 px-5 py-2.5 text-center"
                      onClick={()=>{navigate('/ChangePassword');}}>Change Password</button>
                      <div class="flex space-x-2 justify-center">
                      <button class="text-gray-900 bg-amber-300	mb-20 hover:bg-amber-400 focus:ring-4 rounded-lg text-sm w-full sm:w-auto pl-2 px-5 py-2.5 text-center"onClick={saveProfile}>Save</button>
                      <button class="text-gray-900 bg-amber-300	mb-20 hover:bg-amber-400 focus:ring-4 rounded-lg text-sm w-full sm:w-auto pl-2 px-5 py-2.5 text-center"onClick={()=> navigate(-1)}>Cancel</button>
                      </div>
                      </div>

         
                      
    </div>
    </div>
    </body>
  )
}

export default EditProfile