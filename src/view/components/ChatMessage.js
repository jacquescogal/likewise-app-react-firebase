
import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase-config'



const ChatMessage = ({message,messageScroll}) => {
  const [theMessage,setTheMessage]=useState(message.text)
  const uid=auth.currentUser.uid

  // useEffect(()=>{//Implement soft hyphen for exceedingly long words (Delete if slow down is major)
  //   let messageSize=message.text.length
  //   let newMessage=message.text
  //   messageScroll.current.scrollIntoView({behavior:'smooth'})
  //   for (let i=0;i<messageSize;i+=30){
  //     newMessage=newMessage.slice(0,i)+'\u00AD'+newMessage.slice(i);
  //     messageSize+='\u00AD'.length;
  //   }
  //   setTheMessage(newMessage);
  // },[])

  const messageNameShow=()=>{
    if (message.showText===true && uid!=message.uid){
      return <p class='self-start mb-0.5 mt-1 font-semibold' >{message.name}</p>
    }
    else if (uid===message.uid && message.showText===true){
      return <p class='self-end mb-0.5 mt-1 font-semibold' >Me</p>
    }
  }


  return (
    <div  class='flex flex-col w-full'>

        {(uid===message.uid)?
        // User side
        <div  class='flex flex-row-reverse items-start w-full'>
        <div  class='flex text-lg flex-col max-w-md px-2 bg-orange-400 rounded-md my-0.5 mr-8'>

        //<div  class='flex flex-col max-w-md px-2 bg-green-400 rounded-md my-0.5 mr-8'>
          {messageNameShow()}
            <p class='break-words text-white' >{theMessage}</p>
        </div>
        </div>
        :
        // Other users
        <div  class='flex flex-row flex-start w-full'>
          {(message.imageUrl && message.showImage)?
          <div class='flex flex-end w-12'>
          <img src={message.imageUrl} class='self-end w-12 h-12  rounded-full'/>
          </div>
          :<div class='w-12'></div>}
        {(message.showImage)?

        
// sx={{ bgcolor:'primary.main',display:'flex',boxShadow:1,
// py:0.5,px:3,borderRadius:'10px',maxWidth:'400px',borderBottomLeftRadius:'0',marginBottom:0.5,marginTop:1,mx:1}}
        <div class='flex flex-col px-2 max-w-md bg-orange-300 rounded-md my-0.5 mx-2'>
          <div class='grid grid-cols-1 grid-rows-auto'>
            {messageNameShow()}
            <p class='text-white break-words'>{theMessage}</p>
            </div>
        </div>:<div class='flex flex-col px-2 max-w-md bg-orange-300 rounded-md my-0.5 mx-2'>
          <div class='grid grid-cols-1 grid-rows-auto'>
          {messageNameShow()}
            <p class='text-white break-words'>{theMessage}</p>
            
            </div>
        </div>}
        
        </div>
        }
        
    </div>
  )
}

export default ChatMessage