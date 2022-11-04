import Button from "../components/common/Button";
import Stack from '@mui/material/Stack';
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { TextField } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification,sendPasswordResetEmail} from 'firebase/auth'
import { EmailAuthProvider } from "firebase/auth";
import { reauthenticateWithCredential } from "firebase/auth";
import { updatePassword } from "firebase/auth";
const ChangePassword = () => {

  const navigate=useNavigate();


    const [PasswordInfo,setPasswordInfo]=useState({
      CurrentPassword:'',
      NewPassword:'',
      New2Password:''
    })

    const [CurrentPassword, SetCurrentPassword] = useState(PasswordInfo.CurrentPassword);
    const [NewPassword, SetNewPassword] = useState(PasswordInfo.NewPassword);
    const [New2Password, SetNew2Password] = useState(PasswordInfo.New2Password);
    
    const handleChange = () => {
      const auth = getAuth();
      var user = auth.currentUser;
      const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      if (NewPassword.length < 8) {
        toast.error('Password must be 8 characters or longer');
      }
      else if (/[a-zA-Z]/.test(NewPassword) === false) {
        toast.error('Password must contain alphabets');
      }
      else if (specialChars.test(NewPassword) == false) {
        toast.error('Password must contain at least one special character');
      }
      else if (NewPassword != New2Password) {
        toast.error("Please confirm your password again");
      }
      else {
        reauthenticate(CurrentPassword).then(value=> {
          console.log(value);
          updatePassword(user, NewPassword).then(() => {
          toast("Password updated!");
        }).catch((error) => { console.log(error); });
        }).catch((error) => { console.log(error); });
      }
    }
    
    const reauthenticate = (currentPassword) => {
      const auth = getAuth();
      var user = auth.currentUser;
      var cred = EmailAuthProvider.credential(user.email, currentPassword);
      return reauthenticateWithCredential(user, cred);
    }
      
    
    return (
      <div style={{
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 150
      }} >
        <Stack spacing={2}>
        <b style={{alignSelf:'center', fontSize:20}}>Change Password</b>
        <TextField label="Old Password" onChange={e=>SetCurrentPassword(e.target.value)} type='password'/>
        <TextField label="New Password" onChange={e=>SetNewPassword(e.target.value)} type='password'/>
        <TextField label="Confirm Password" onChange={e=>SetNew2Password(e.target.value)} type='password'/>
        <Button label="Enter" style={{alignSelf:'center'}} handleAction={handleChange} />  
        <Button label="Cancel" style={{alignSelf:'center'}} handleAction={()=>{navigate('/Home/Profile')}} />     
        </Stack>
      </div>
    )
  }

  export default ChangePassword