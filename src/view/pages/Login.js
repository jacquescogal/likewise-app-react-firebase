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


  const [teststring,setTestString] = useState("Hello How are you?");
  const testflaskapi = () => {
    fetch('/smartreply', 
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teststring),
      // mode: 'no-cors',
      // withCredentials: true,  
      // crossorigin: true,
    }).then(
      res => res.json()
    ).then(
      res => {
        setTestString(res.result[0]);
        console.log(res);
      }
    )
  }

  return (
    <div style={{
      margin: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 0
    }} >
      <Stack spacing={2}>
      <b style={{alignSelf:'center', fontSize:40}}>Login</b>
      <TextField label="E-mail" onChange={e=>setEmail(e.target.value)}/>
      <TextField label="Password" onChange={e=>setPassword(e.target.value)} type='password'/>
      <Button label="Confirm Login" style={{alignSelf:'center'}} handleAction={handleAction} />
      <Button_ variant="outline-info" label="Forgot password?" handleAction={()=>
                    {navigate('/ResetPassword');
                    }}/>
      </Stack>
      <Button label="Connect with Flask" handleAction={testflaskapi}></Button>
      <TextField label="flaskpost" onChange={e=>setTestString(e.target.value)}/>
      <h1>{teststring}</h1>
    </div>
  )
}

export default Login