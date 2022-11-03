import Button from "../components/common/Button";
import Button_ from "../components/common/Button_";
import Stack from '@mui/material/Stack';
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const Login = ({setEmail, setPassword, handleAction, handleReset}) => {
  
  //Runs once after render
  useEffect(()=>{
    setEmail('');
    setPassword('');
  },[])

  let navigate=useNavigate()

  return (
    <div class='grid justify-center w-full' className="colourCard">
      <Stack spacing={2}>
      <b style={{alignSelf:'center', fontSize:40}}>Login</b>
      <TextField  sx={{ m: 1, minWidth: 120 ,maxWidth:300}} label="E-mail" onChange={e=>setEmail(e.target.value)}/>
      <TextField  sx={{ m: 1, minWidth: 120 ,maxWidth:300}} label="Password" onChange={e=>setPassword(e.target.value)} type='password'/>
      <Button label="Confirm Login" style={{alignSelf:'center'}} handleAction={handleAction} />
      <Button_ variant="outline-info" label="Forgot password?" handleAction={()=>
                    {navigate('/ResetPassword');
                    }}/>
      </Stack>
    </div>
  )
}

export default Login