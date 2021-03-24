import React, { useCallback } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import { useMarkerDispatch, useMarkerState } from '../../store/markerStore';
import Map from './Map';
import googleServices from '../../services/googleServices';

const MapContainer = ({ google }: any): JSX.Element => {
  const { activeInput, markerLatLng, mapRef } = useMarkerState();
  const { setMarkerAddress, setMarkerLatLng } = useMarkerDispatch();

  const mapClicked = useCallback((mapProps: any, map: any, clickEvent: any): void => {
    if (!activeInput) { return; }

    if (!googleServices.geocoder) {
      googleServices.geocoder = new google.maps.Geocoder();
    }

    const latLng = {
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng(),
    };

    googleServices.geocoder.geocode(
      { location: latLng },
      (
        results: any,
        status: any,
      ) => {
        if (status === 'OK') {
          if (results[0]) {
            setMarkerLatLng(activeInput, latLng);
            setMarkerAddress(activeInput, results[0].formatted_address);
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert(`Geocoder failed due to: ${status}`);
        }
      },
    );
  }, [google.maps.Geocoder, activeInput, setMarkerAddress, setMarkerLatLng]);

  return (
    <Map
      google={google}
      mapClicked={mapClicked}
      markerLatLng={markerLatLng}
      mapRef={mapRef}
    />
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.GOOGLE_MAP_API_KEY,
})(MapContainer);
