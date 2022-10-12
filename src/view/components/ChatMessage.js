import { Box,Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase-config'


const ChatMessage = ({message,messageScroll}) => {
  const [theMessage,setTheMessage]=useState(message.text)
  const uid=auth.currentUser.uid

  useEffect(()=>{//Implement soft hyphen for exceedingly long words (Delete if slow down is major)
    let messageSize=message.text.length
    let newMessage=message.text
    messageScroll.current.scrollIntoView({behavior:'smooth'})
    for (let i=0;i<messageSize;i+=30){
      newMessage=newMessage.slice(0,i)+'\u00AD'+newMessage.slice(i);
      messageSize+='\u00AD'.length;
    }
    setTheMessage(newMessage);
  },[])

  const messageNameShow=()=>{
    if (message.showText===true && uid!=message.uid){
      return <Typography style={{color:'black',marginBottom:-5}} >{message.name}</Typography>
      
    }
    // else if (uid===message.uid && message.showText===true){
    //   return <h5 style={{alignSelf:'flex-end',marginBottom:-5}}>{message.name}</h5>
    // }
  }


  return (
    <div  style={{display:'flex',flexDirection:'column',width:'100%'}}>
      {/* {messageNameShow()} */}
      
        {(uid===message.uid)?
        <div  style={{display:'flex',flexDirection:'row-reverse',alignItems:'flex-start',width:'100%'}}>
          {/* {(message.imageUrl && message.showImage)?<img src={message.imageUrl} height={40} width={40} style={{marginTop:40,borderRadius:'50%'}}/>
          :<div style={{width:40}}></div>} */}
        {(message.showImage)?
        <Box
        sx={{ bgcolor:'secondary.main',display:'flex',boxShadow:1,
        py:0.5,px:3,borderRadius:'10px',maxWidth:'400px',borderBottomRightRadius:'0',marginBottom:0.5,marginTop:1,mx:1}}>
            <Typography style={{color:'white', wordWrap: "break-word"}} >{theMessage}</Typography>
        </Box>:<Box
        sx={{ bgcolor:'secondary.main',display:'flex',boxShadow:1,
        py:0.5,px:3,borderRadius:'10px',maxWidth:'400px',marginBottom:-0.5,marginTop:1,mx:1,
        flexDirection:'column'}}>
          {messageNameShow()}
            <Typography style={{color:'white', wordWrap: "break-word"}} >{theMessage}</Typography>
        </Box>}
        </div>
        :
        <div  style={{display:'flex',flexDirection:'row',alignItems:'flex-start',width:'100%'}}>
          {(message.imageUrl && message.showImage)?<img src={message.imageUrl} height={40} width={40} style={{marginTop:25,borderRadius:'50%'}}/>
          :<div style={{width:40}}></div>}
        {(message.showImage)?
        <Box
        sx={{ bgcolor:'primary.main',display:'flex',boxShadow:1,
        py:0.5,px:3,borderRadius:'10px',maxWidth:'400px',borderBottomLeftRadius:'0',marginBottom:0.5,marginTop:1,mx:1}}>
            <Typography style={{color:'white', wordWrap: "break-word"}} >{theMessage}</Typography>
        </Box>:<Box
        sx={{ bgcolor:'primary.main',display:'flex',boxShadow:1,
        py:0.5,px:3,borderRadius:'10px',maxWidth:'400px',marginBottom:-0.5,marginTop:1,mx:1,
        flexDirection:'column'}}>
          {messageNameShow()}
            <Typography style={{color:'white', wordWrap: "break-word"}} >{theMessage}</Typography>
            
        </Box>}
        
        </div>
        }
        
    </div>
  )
}

export default ChatMessage