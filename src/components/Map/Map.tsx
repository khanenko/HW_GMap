import React, { memo, RefObject, useState } from 'react';
import {
  InfoWindow,
  Map as GoogleMap, Marker,
} from 'google-maps-react';
import './Map.scss';
import { MarkerLatLngType } from '../../store/markerStore/reducer';

type MapProps = {
  google: any,
  mapClicked: (mapProps: any, map: any, clickEvent: any) => void,
  markerLatLng: MarkerLatLngType,
  mapRef: RefObject<HTMLInputElement>,
}

const Map = ({
  google, mapClicked, markerLatLng, mapRef,
}: MapProps): JSX.Element => {
  const { pointA, pointB } = markerLatLng;
  const [activeMarker, setActiveMarker] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);

  const onMarkerClick = (props: any, marker: any): void => {
    setActiveMarker(marker);
    setInfoVisible(true);
  };

  return (
    <div className="map-container" ref={mapRef}>
      <GoogleMap
        google={google}
        onClick={mapClicked}
        initialCenter={{
          lat: 42.75756168253799,
          lng: -97.81086066311704,
        }}
        zoom={5}
      >
        {pointA && (
          <Marker name="Point A" onClick={onMarkerClick} position={{ lat: pointA.lat, lng: pointA.lng }} />
        )}
        {pointB && (
          <Marker name="Point B" onClick={onMarkerClick} position={{ lat: pointB.lat, lng: pointB.lng }} />
        )}
        <InfoWindow marker={activeMarker} visible={infoVisible}>
          <div>
            <h1>{activeMarker?.name}</h1>
          </div>
        </InfoWindow>
      </GoogleMap>
    </div>
  );
};

export default memo(Map);
