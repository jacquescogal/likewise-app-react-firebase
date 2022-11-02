import ButtonGroup from '@mui/material/ButtonGroup';
import TextBox from "../components/common/TextBox";
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { Link } from "react-router-dom";
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


import { useEffect, useState } from 'react';

const Onboard = () => {
    let navigate=useNavigate()

  return (
    <div className="onboard">
      <div className="specialheader">
        {/*Waves Container*/}
        <div>
          <svg className="specialwaves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax">
              <use xlinkHref="#gentle-wave" x={48} y={0} fill="rgba(255,255,255,0.7" />
              <use xlinkHref="#gentle-wave" x={48} y={3} fill="rgba(255,255,255,0.5)" />
              <use xlinkHref="#gentle-wave" x={48} y={5} fill="rgba(255,255,255,0.3)" />
              <use xlinkHref="#gentle-wave" x={48} y={7} fill="#fff" />
            </g>
          </svg>
        </div>
        {/*Waves end*/}
      </div>
      
        <div style={{
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} className="onboardingFloat">
        <Stack spacing={0}>
            <img className="img-fluid" style={{alignSelf:'center'}}src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo" height={200} width={200}/>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <Button onClick={()=>
                    {navigate('Login');
                    }} variant="outlined"
                    sx={{
                      ':hover': {
                        bgcolor: 'primary.main', // theme.palette.primary.main
                        color: 'white',
                      },
                    }}>Login</Button>
                <Button onClick={()=>
                    {navigate('Register');
                    }} variant="outlined"sx={{
                      ':hover': {
                        bgcolor: 'primary.main', // theme.palette.primary.main
                        color: 'white',
                      },
                    }}>Register</Button>
            </ButtonGroup>
      </Stack>
      </div>
      <div className="onboardContent">
        <Outlet />
      </div>
    </div>
  )
}

export default Onboard