import Typography from '@mui/material/Typography';
const Copyright=()=> {
    


    return (//Link to about page
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
          {'Likewise '}
         { new Date().getFullYear()}.
      </Typography>
    );
  }
export default Copyright;