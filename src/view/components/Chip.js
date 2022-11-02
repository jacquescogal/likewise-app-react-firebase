import React from 'react'
import { toast } from 'react-toastify'
const Chip = ({setChoice,choice=false,text="empty"}) => {
  return (
    <>
    {(choice===false)?<span class='cursor-pointer bg-white border border-black w-fit h-4 rounded-full text-black p-2 m-1 select-none' onClick={()=>{setChoice(true);}}>{text}</span>
    :<span class='cursor-pointer bg-orange-400 border shadow-inner border-black w-fit h-4 rounded-full text-black p-2 m-1 select-none' onClick={()=>{setChoice(false);}}>{text}</span>}
    </>
  )
}

export default Chip