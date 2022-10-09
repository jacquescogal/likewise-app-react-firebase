import { useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect } from "react";

const MapWidget = (props) => {
  const[center, setCenter] = useState({
    lat: -3.745,
    lng: -38.523
  })

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
          console.log(results[0]);
          setCenter(results[0].geometry.location);
        }
      }
    )
  })

  const onLoad = marker => {
    console.log('marker: ', marker)
  }

  return(
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
    >
      <Marker
        onLoad = {onLoad}
        position = {center}
      />
    </GoogleMap>
  )
}

export default MapWidget