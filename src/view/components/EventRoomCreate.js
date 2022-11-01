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

//datetime picker
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers';

import { useState } from 'react';
import { serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase-config';
import { useEffect, useMemo, useRef } from 'react';
import { onSnapshot,collection } from 'firebase/firestore';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';

export default function EventRoomCreate({openCreate,setOpenCreate,createChatRoom,isLoaded,google}) {

    const [cap,setCap]=useState(2)
    const [roomName,setRoomName]=useState('')
    const [location,setLocation]=useState('')
    const [dateTime,setDateTime]=useState({value:null,error:null})
    const [joinedRoomSize,setJoinedRoomSize]=useState(null);

    const autocompleteService = { current: null };
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    
    useEffect(()=>{ 
      const unsubscribe = async ()=>{
        const user=JSON.parse(localStorage.getItem('user'))
        onSnapshot(collection(db,'users/'+user.email+'/joinedRooms'),collectionSnap=>{
          setJoinedRoomSize(collectionSnap.size)
          console.log(user.email)
          console.log(collectionSnap.size)
        })
      }
      return unsubscribe
    },[])

    const fetch = useMemo(
      () =>
        throttle((request, callback) => {
          if (autocompleteService.current){
          autocompleteService.current.getPlacePredictions(request, callback);
          }
        }, 200),
      [autocompleteService],
    );

    useEffect(() => {
      let active = true;
      if (!autocompleteService.current && google) {
        autocompleteService.current =
          new google.maps.places.AutocompleteService();
      }
      if (!autocompleteService.current) {
        return undefined;
      }

      if (inputValue === '') {
        setOptions(value ? [value] : []);
        return undefined;
      }

      if (autocompleteService.current){
    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }
  }, [value, inputValue]);

   

  const handleClose = () => {
    setOpenCreate(false);
  };

  const handleCreate = () => {
    let pass=true
    if (dateTime.error===true){
        pass=false
        toast.error('Date needs to be in the future and minute must be in 15 minute intervals only')
    }
    if (roomName===''){
        pass=false
        toast.error('Event name cannot be left blank')
    }
    if (value===null){
        pass=false
        toast.error('Location cannot be leftblank')
    }
    if (pass===true){
        setOpenCreate(false);
        createChatRoom({name:roomName,cap:cap,location:value.description,placeid:value.place_id,time:dateTime.value.$d})
    }
  };

  let createButtonState=()=>{
    if (joinedRoomSize!=null & joinedRoomSize>=3){
      return <Button disabled onClick={handleCreate}>Already in 3 rooms</Button>
    }
    else if (joinedRoomSize!=null){
      return <Button onClick={handleCreate}>Create</Button>
    }
  else{
    return <Button disabled>Loading</Button>
  }}


  return (
    <div>
      <Dialog open={openCreate} onClose={handleClose}>
        <DialogTitle>Create Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Provide the following details to create a room now:
          </DialogContentText>
          <Stack spacing={1.5}>
          <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Event name"
              fullWidth
              variant="standard"
              onChange={e=>setRoomName(e.target.value)}
            />
            <Autocomplete
              id="google-map-demo"
              //sx={{ width: 300 }}
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.description
              }
              filterOptions={(x) => x}
              options={options}
              //autoComplete
              //includeInputInList
              filterSelectedOptions
              value={value}
              onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Add a location" fullWidth />
              )}
              renderOption={(props, option) => {
                const matches = option.structured_formatting.main_text_matched_substrings;
                const parts = parse(
                  option.structured_formatting.main_text,
                  matches.map((match) => [match.offset, match.offset + match.length]),
                );

                return (
                  <li {...props}>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Box
                          component={LocationOnIcon}
                          sx={{ color: 'text.secondary', mr: 2 }}
                        />
                      </Grid>
                      <Grid item xs>
                        {parts.map((part, index) => (
                          <span
                            key={index}
                            style={{
                              fontWeight: part.highlight ? 700 : 400,
                            }}
                          >
                            {part.text}
                          </span>
                        ))}

                        <Typography variant="body2" color="text.secondary">
                          {option.structured_formatting.secondary_text}
                        </Typography>
                      </Grid>
                    </Grid>
                  </li>
                );
              }}
            />


            {/* DateTime Picker */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDateTimePicker
                disablePast
                minutesStep={5}
                minDate={dayjs().add(1,'day')}
                // minDateTime={dayjs().add(1, 'day').subtract(dayjs().hour(),'hour').subtract(dayjs().minute(),'minute').subtract(dayjs().second(),'second')}
                views={['month','day','hours','minutes']}
                defaultCalendarMonth={dayjs()}
                onChange={e=>{setDateTime({value:e,error:false});console.log('changed');}}
                value={dateTime.value}
                label="Date & Time of Event"
                inputFormat="YYYY/MM/DD hh:mm a"
                renderInput={(params) => <TextField {...params} />}
                onError={value=>{console.log('error');(value!==null)?setDateTime({value:dateTime.value,error:true}):console.log('fixed')}}
              />
            </LocalizationProvider>

            <FormControl margin="dense" fullWidth>
              <InputLabel id="Capacity">Capacity</InputLabel>
              <Select
                labelId="Capacity"
                id="CapacitySelect"
                value={cap}
                label="Capacity"
                onChange={e=>{setCap(e.target.value);}}
              >
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {createButtonState()}
          {/* <Button onClick={handleCreate}>Create</Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}