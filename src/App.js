//firebase API
import fireBase, { db } from './firebase-config'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification,sendPasswordResetEmail, updatePassword} from 'firebase/auth'
import 'firebase/auth'
import { updateProfile } from 'firebase/auth';

//Routing libs
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";

//Page components
import Login from "./view/pages/Login";
import Register from "./view/pages/Register";
import Home from "./view/pages/Home";
import Onboard from './view/pages/Onboard';
import ResetPassword from './view/pages/ResetPassword';
import ChangePassword from './view/pages/ChangePassword';
import EventRooms from "./view/pages/EventRooms";
import ChatRoom from './view/pages/ChatRoom';

import MyRooms from "./view/pages/MyRooms";
import ActivityRooms from "./view/pages/ActivityRooms";
import Profile from "./view/pages/Profile";
import EditProfile from "./view/pages/EditProfile";



//Hooks
import { useEffect, useState } from 'react';

//Toast
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import { Outlet ,Navigate} from 'react-router-dom';

//adding Doc to firestore
import { doc, setDoc } from "firebase/firestore"; 

//google map api
import { useLoadScript } from '@react-google-maps/api';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const App = () =>{

   //load google map script
   const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (loadError) {
    console.log("Google maps API was not able to load.")
  }
  
  const [user,setUser]=useState('');
  const [eventRoom,setEventRoom]=useState('');
  const [chatRoom,setChatRoom]=useState('');

  //login & registration 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [imageUrl,setImageUrl]=useState("https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png")
  const [username,setUsername]=useState('')
  const [gender,setGender]=useState('')
  const [DOB,setDOB]=useState('')
  const [course,setCourse]=useState('')
  const [studyYear,setStudyYear]=useState('')
  const [loading,setLoading]=useState(false)

  let navigate=useNavigate();

  useEffect(()=>{
    if (localStorage.getItem('eventRoom')){
      setEventRoom(localStorage.getItem('eventRoom'))
    }
    if (localStorage.getItem('chatRoom')){
      setChatRoom(localStorage.getItem('chatRoom'))
    }
  },[])

  

  
  const handleLogin = () =>{
    setLoading(true)
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((response) => {
          const user=auth.currentUser;
          console.log(user.emailVerified);
          setLoading(false)
          if (user.emailVerified){
            console.log(auth.currentUser);
            setUser(user);
            navigate('/Home/ActivityRooms');
            localStorage.setItem('user',JSON.stringify(user))
          }
          else{
            toast.error("Please verify your Email");
          }
        }).catch((error) => {
          setLoading(false)
          console.log(error)
          if(error.code === 'auth/wrong-password'){
            toast.error('Please check the Password');
          }
          if(error.code === 'auth/user-not-found'){
            toast.error('Please register for an account');
          }
          if(error.code === 'auth/invalid-email'){
            toast.error('Please check the Email');
          }
          if (error.code ==='auth/internal-error'){
            toast.error('Please enter both Email and Password');
          }
        })
  }


  const handleRegister = () => {
    //Check for new field's existence and that there is no duplicate of username before creating.
    //Add upload of profile photo
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const auth = getAuth();
    console.log(imageUrl);
    console.log(email);
    console.log(password);
    console.log(username);
    console.log(gender);
    console.log(DOB);
    console.log(course);
    console.log(studyYear);
    if(email.indexOf('@e.ntu.edu.sg') === -1) {
      toast.error('Only NTU students are allowed to register');
    }
    else if (password.length < 8) {
      toast.error('Password must be 8 characters or longer');
    }
    else if (/[a-zA-Z]/.test(password) === false) {
      toast.error('Password must contain alphabets');
    }
    else if (specialChars.test(password) == false) {
      toast.error('Password must contain at least one special character');
    }
    else if (username.length < 4) {
      toast.error('Username must be 4 characters or longer');
    }
    else if ((parseInt(DOB.slice(-4)) > 2005) | (parseInt(DOB.slice(-4)) < 1980)) {
      toast.error('Please check your date of birth again');
    }
    else if ((gender == '') | (DOB == '') | (course == '') | (studyYear == '')) {
      toast.error('Please fill up all required information');
    }
    else {
      setLoading(true)
      createUserWithEmailAndPassword(auth, email, password)
    .then((response)=>
    {console.log('what');
    console.log(response);


    updateProfile(auth.currentUser, {
      displayName: username, photoURL: imageUrl
    })

      setDoc(doc(db,'users',auth.currentUser.email),{
        imageUrl:imageUrl,
        username:username,
        gender:gender,
        DOB:DOB,
        course:course,
        studyYear:studyYear,
      })

      sendEmailVerification(auth.currentUser).then((value)=>{
        toast('Email sent');
        console.log(auth.currentUser.email);
      })
  toast('Please verify your Email address');
  setLoading(false);}).catch((error) => {
      console.log(error)
      setLoading(false);
      if(error.code === 'auth/wrong-password'){
        toast.error('Please check the Password');
      }
      if(error.code === 'auth/invalid-email'){
        toast.error('Please check the Email');
      }
      if (error.code ==='auth/internal-error'){
        toast.error('Please enter both Email and Password');
      }
      if (error.code ==='auth/email-already-in-use'){
        toast.error('Email already in use. Please try to login.');
      }
    })
    }
  }
  const handlePasswordReset = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
    .then((response)=>
    { toast('Password reset link sent');}).catch((error) => {
      })
  }

  


  return(
      <div className="App">
        <ToastContainer/>
        <Backdrop
        sx={{ color: 'white',bgcolor:'rgba(255, 255, 255, 0.5)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <p>loading...</p>
        <CircularProgress color="primary" />
      </Backdrop>
        <Routes>
            <Route path="/ChangePassword" element={<ChangePassword />}>
            </Route>
            <Route path="/ResetPassword" element={<ResetPassword setEmail={setEmail} handleReset={handlePasswordReset}/>}>
            </Route>
            <Route path='/' element={<Onboard />}>
              <Route path="Login" element={<Login setEmail={setEmail} setPassword={setPassword} handleAction={handleLogin}/>}/>
              <Route path="Register" element={<Register setEmail={setEmail} email={email} setPassword={setPassword} handleAction={handleRegister} setUsername={setUsername} setImageUrl={setImageUrl} setGender={setGender} setDOB={setDOB} setCourse={setCourse} setStudyYear={setStudyYear} course={course} studyYear={studyYear} DOB={DOB} gender={gender}/>}/>
            </Route>
            <Route element={<ProtectedRoute user={setUser}/>}>
              <Route path="/Home" element={<Home/>}>
                <Route path="ActivityRooms" element={<ActivityRooms setEventRoom={setEventRoom} setLoading={setLoading}/>}/>
                <Route path="EventRooms" element={<EventRooms setChatRoom={setChatRoom} eventRoom={eventRoom} chatRoom={chatRoom} isLoaded={isLoaded} setLoading={setLoading}/>}/>
                <Route path="MyRooms" element={<MyRooms setChatRoom={setChatRoom}/>}/>
                <Route path="Profile" element={<Profile />}/>
                <Route path="ChatRoom" element={<ChatRoom chatRoom={chatRoom} setLoading={setLoading}/>}/>
                <Route path="Profile/EditProfile" element={<EditProfile />}/>
              </Route>
            </Route>
            <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </div>
  );
}

const ProtectedRoute=({children, setUser})=>{
  if (!localStorage.getItem('user')){
    return <Navigate to={'/'} replace />;
  }
  else{
    return (children)?children:<Outlet/>;
  }
}

export default App;
