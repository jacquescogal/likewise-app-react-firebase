import { useState } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useEffect } from "react";

const MapWidget = (props) => {
  const[center, setCenter] = useState(null);

  const containerStyle = {
    width: '300px',
    height: '300px'
  };
  
  
  const geocoder = new window.google.maps.Geocoder();
  
  useEffect(() => {
    geocoder.geocode(
      {placeId:props.placeID},
      (results, status) => {
        if (status == 'OK') {
          console.log(results[0].geometry.location);
          setCenter(results[0].geometry.location);
        }
      }
    )
  })

  return(
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
    >
      <MarkerF position = {center}/>
    </GoogleMap>
  )
}

export default MapWidget