import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Snackbar from '@mui/material/Snackbar'

import { useState } from 'react';
import { serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

import { db } from '../../firebase-config';
import {collection,doc,setDoc,addDoc} from 'firebase/firestore';

export default function FeedbackFormCreate({feedbackFormCreate, setFeedbackFormCreate}) {
  const [feedback,setFeedback]=useState('')
  const handleClose = () => {
    setFeedbackFormCreate(false);
  };

  const handleSubmit = () => {
    // const [feedbackSuccessMessage, setFeedbackSuccessMessage] = useState(false)
    let pass=true
    
    if (feedback===''){
        pass=false
        toast.error('Feedback cannot be left blank. Please enter your feedback')
    }
    if (pass===true){
      addDoc(collection(db, 'aRoomsFeedback'), {
        feedback: feedback
      }).then(value => {
        toast('Success, your feedback is:' + value.id)
      })
      setFeedbackFormCreate(false);
      //display pop up to indicate to user he has successfully submitted his feedback
      // setFeedbackSuccessMessage('Success!')
      //need to code here to pass the feedback input by user to firebase
      //just print feedback in console to test if text is passed successfully
      
      console.log("feedback is:" , feedback)
      
      
  }
  };

  return (
    <div>
      <Dialog open={feedbackFormCreate} onClose={handleClose}>
        <DialogTitle>Provide Feedback on Activity Rooms</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please suggest activities that you wish to be added:
          </DialogContentText>
          <Stack spacing={1.5}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Suggest a new activity"
            fullWidth
            variant="standard"
            onChange={e=>setFeedback(e.target.value)}
          />


          
      </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
          
          
        </DialogActions>
      </Dialog>
    </div>
  );
}