import {GoogleMap} from "@react-google-maps/api";

const MapWidget = (props) => {
  const containerStyle = {
    width: '300px',
    height: '300px'
  };

  const center = {
    lat: -3.745,
    lng: -38.523
  };
  
  return(
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
    />
  )
}

export default MapWidget