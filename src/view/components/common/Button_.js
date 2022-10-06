import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';


const BasicButtons = ({label,handleAction}) => {
  return (
    <>
      <Button variant="outline-info" style={{alignSelf:'center', fontSize:10}} onClick={handleAction}>{label}</Button>
    </>
  );
}

BasicButtons.propTypes={
    label:PropTypes.string.isRequired,
}

export default BasicButtons;