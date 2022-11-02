import React from 'react'
import { inputAdornmentClasses, TextField } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { async } from '@firebase/util';
import {auth,db} from '../../firebase-config'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import IconButton from '@mui/material/IconButton';
import { useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';



const SendMessage = ({scroll, messageScroll,chatRoom,currentUserName,currentImageUrl,toSend}) => {
    const [value, setValue] = useState('');
    const [showPicker,setShowPicker]=useState(false);

    const handlePickerToggle=()=>{
      setShowPicker(!showPicker);
    }

    useEffect(()=>{
      messageScroll.current.scrollIntoView({behavior:'smooth'})
    },[])
  

    useEffect(() => {
      if(toSend){
        setValue(toSend);
      }
    },[toSend]);

    const sendMessage = async(e)=>{
        e.preventDefault()
        const {uid,email} = auth.currentUser

        if (value.trim()!=''){
        await addDoc(collection(db,chatRoom),{
            text: value,
            name: currentUserName,
            email: email,
            imageUrl: currentImageUrl,
            uid,
            timestamp: serverTimestamp()
        })
        setValue('')
        scroll.current.scrollIntoView({behavior:'smooth'})
        messageScroll.current.scrollIntoView({behavior:'smooth'})
    }
    }

    useEffect(() => {
      if (value===''){
        console.log('wait')
      }
      else{
      const listener = event => {
        if (event.code === "Enter" || event.code === "NumpadEnter" ) {
          console.log("Enter key was pressed. Run your function.");
          sendMessage(event);
        }
      };
      document.addEventListener("keydown", listener);
      return () => {
        document.removeEventListener("keydown", listener);
      };
    }}, [value]);

  return (
    <div class='relative'>
      {(showPicker)?
      <div class='absolute bottom-10' >
      <EmojiPicker onEmojiClick={emoji=>{console.log(emoji);setValue(value+emoji.emoji)}} height={300} width={300} skinTonesDisabled={true} searchDisabled={true} previewConfig={{showPreview: false}}/>
      </div>:null}
    <form onSubmit={sendMessage} class=' w-full h-fit'>
      
        <div class='flex justify-center w-full'>
          
        <button type="button" onClick={handlePickerToggle} class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
            <svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd"></path></svg>
            <span class="sr-only">Add emoji</span>
        </button>
        <textarea label="Message" value={value} onChange={(e)=>setValue(e.target.value)} id="chat" rows="1" class="block mx-4 p-2.5 w-full text-lg text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Your message..."></textarea>
          <button type="submit" class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
            <svg aria-hidden="true" class="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
            <span class="sr-only">Send message</span>
        </button>
          </div>
    </form>
    </div>
  )
  
}

export default SendMessage