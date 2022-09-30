import { getAuth } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc,getDoc,updateDoc } from 'firebase/firestore'
import { useAuth,auth } from '../../firebase-config'
import { db } from '../../firebase-config'
import ProfilePic from '../components/ProfilePic'
import TextField from '@mui/material/TextField';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const EditProfile = () => {

  //refer to registration for date picker/gender picker/year picker etc.
  
  let navigate = useNavigate();
  let currentUser = useAuth()

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

  const docRef = doc(db, "users", auth.currentUser.email);
  useEffect(()=>{
    getDoc(doc(db, "users", auth.currentUser.email)).then(docSnap => {
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setProfileInfo({...docSnap.data(),email:auth.currentUser.email,password:'password123'})
        console.log(docSnap.data().DOB.toString())
      } else {
        console.log("No such document!");
      }
    })
  },[])

  const handleLogout = () => {
      const auth=getAuth();
      auth.signOut().then((value)=>{
        console.log(value)
        navigate('/');
      },(reason)=>console.log(reason))
  }

  async function saveProfile(){
    const userRef = doc(db,'users', currentUser.email);
  await updateDoc(userRef, {
    username: username,
    DOB: DOB,
    gender: gender,
    studyYear: studyYear,
    course: course
  });
  navigate(-1);

  }

  return (
    <menu>
    <div>
      <h1>Edit Profile</h1>

      <section>
      </section>
      <ProfilePic />

      <section>
       Username:
      <p style={{minHeight:'25px',backgroundColor: "white", border:"1px solid orange",borderRadius: '5px', borderRight : '300px'}} >
      <TextField id="standard-basic" value={username?username:profileInfo.username} onChange={e=>setUsername(e.target.value)}/>
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

      {/* Gender Picker */}
      <FormControl sx={{ minWidth: 120 ,maxWidth:300,}}>
        <Select
          labelId="gender"
          id="genderSelect"
          value={gender?gender:profileInfo.gender}
          label="gender"
          onChange={event=>{setGender(event.target.value);}}
        >
          <MenuItem value="">
            Please pick your gender
          </MenuItem>
          <MenuItem value={'Male'}>Male</MenuItem>
          <MenuItem value={'Female'}>Female</MenuItem>
          <MenuItem value={'Prefer not to say'}>Prefer not to say</MenuItem>
        </Select>
      </FormControl>

      </p></section>

      <section>
       Date of Birth:
      <p style={{minHeight:'25px',backgroundColor: "white", border:"1px solid orange",borderRadius: '5px', borderRight : '300px'}} >

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
      
          inputFormat="DD/MM/YYYY"
          value={DOB?DOB:profileInfo.DOB}
          onChange={e=>{setDOB(dayjs(e.$d.toString()).format('MM/DD/YYYY'));console.log(dayjs(e.$d.toString()).format('MM/DD/YYYY'));}}
          renderInput={(params) => <TextField {...params} />}
        />
        </LocalizationProvider>
      </p></section>

      <section>
       Course of study:
      <p style={{minHeight:'25px',backgroundColor: "white", border:"1px solid orange",borderRadius: '5px', borderRight : '300px'}} >
      
      <FormControl sx={{ minWidth: 120 ,maxWidth:300}}>
        
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
      </p></section>

      <section>
       Year of study:
      <p style={{minHeight:'25px',backgroundColor: "white", border:"1px solid orange",borderRadius: '5px', borderRight : '300px'}} >
      <FormControl sx={{ minWidth: 120 ,maxWidth:300}}>
      
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

      </p></section>

      <br></br>
      <div>
        <button onClick={saveProfile}>Save</button>
        <br></br>
        <button onClick={()=> navigate(-1)}>Cancel</button>
      </div>
    </div>
    </menu>
  )
}

export default EditProfile