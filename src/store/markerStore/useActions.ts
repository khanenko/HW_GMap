import { Dispatch, useCallback, useMemo } from 'react';
import { ActiveInput, LatLngType, MarkerActionType } from './reducer';

export type MarkerActionsType = {
  setActiveInput: (point: ActiveInput) => void,
  setMarkerAddress: (point: ActiveInput, address: string) => void,
  setMarkerLatLng: (point: ActiveInput, latLng: LatLngType) => void,
};

const useActions = (dispatch: Dispatch<MarkerActionType>): MarkerActionsType => {
  const setActiveInput = useCallback((activeInput: ActiveInput | null) => {
    dispatch({ type: 'setActiveInput', payload: { activeInput } });
  }, [dispatch]);

  const setMarkerAddress = useCallback((point: ActiveInput, address: string) => {
    const markerAddress = {
      [point]: address,
    };

    dispatch({ type: 'setMarkerAddress', payload: { markerAddress } });
  }, [dispatch]);

  const setMarkerLatLng = useCallback((point: ActiveInput, latLng: LatLngType) => {
    const markerLatLng = {
      [point]: latLng,
    };

    dispatch({ type: 'setMarkerLatLng', payload: { markerLatLng } });
  }, [dispatch]);

  return useMemo(() => ({
    setActiveInput,
    setMarkerAddress,
    setMarkerLatLng,
  }), [setActiveInput, setMarkerAddress, setMarkerLatLng]);
};

export default useActions;
