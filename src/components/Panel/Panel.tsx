import { Paper, Typography } from '@material-ui/core';
import React from 'react';
import './Panel.scss';
import { useMarkerState } from '../../store/markerStore';
import { ActiveInput } from '../../store/markerStore/reducer';
import Autocomplete from '../Autocomplete/Autocomplete';
import distanceKm from '../../utils/distance';

const Panel = (): JSX.Element => {
  const {
    activeInput, markerAddress, markerLatLng, mapRef,
  } = useMarkerState();

  return (
    <Paper className="panel">
      <Autocomplete
        label="Point A"
        activeInput={activeInput}
        point={ActiveInput.PointA}
        markerPointAddress={markerAddress.pointA}
        mapRef={mapRef}
      />
      <Autocomplete
        label="Point B"
        activeInput={activeInput}
        point={ActiveInput.PointB}
        markerPointAddress={markerAddress.pointB}
        mapRef={mapRef}
      />
      <Typography>{`Distance (km): ${distanceKm(markerLatLng)}`}</Typography>
    </Paper>
  );
};

export default Panel;
