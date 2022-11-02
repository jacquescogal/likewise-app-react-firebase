import Button from "../components/common/Button";
import Stack from '@mui/material/Stack';
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { TextField } from "@mui/material";

const ResetPassword = ({setEmail, handleReset}) => {
  const navigate=useNavigate();
  
    return (
      <div style={{
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 0
      }} >
        <Stack spacing={2}>
        <b style={{alignSelf:'center', fontSize:20}}>Reset Your Password Here</b>
        <TextField label="E-mail" onChange={e=>setEmail(e.target.value)}/>
        <Button label="Reset Password" style={{alignSelf:'center'}} handleAction={handleReset} />   
         <Button label="Cancel" style={{alignSelf:'center'}} handleAction={()=>{navigate('/')}} />
        </Stack>
      </div>
    )
  }

  export default ResetPassword