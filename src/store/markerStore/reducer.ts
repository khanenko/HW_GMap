import React, { RefObject } from 'react';
import { createReducer } from '../utils';

export enum ActiveInput {
  PointA = 'pointA',
  PointB = 'pointB',
}

type MarkerAddressType = {
  pointA?: string | null,
  pointB?: string | null,
}

export type LatLngType = {
  lat: number,
  lng: number,
}

export type MarkerLatLngType = {
  pointA?: LatLngType | null,
  pointB?: LatLngType | null,
}

export type MarkerStateType = {
  activeInput: ActiveInput | null,
  markerLatLng: MarkerLatLngType,
  markerAddress: MarkerAddressType,
  mapRef: RefObject<HTMLInputElement>,
}

type MarkerPayload = {
  activeInput?: ActiveInput | null,
  markerLatLng?: MarkerLatLngType,
  markerAddress?: MarkerAddressType,
}

export type MarkerActionType = {
  type: string,
  payload?: MarkerPayload,
};

type ReducerType = (state: MarkerStateType, action: MarkerActionType) => MarkerStateType;

export const markerInitialState: MarkerStateType = {
  activeInput: null,
  markerLatLng: {
    pointA: null,
    pointB: null,
  },
  markerAddress: {
    pointA: null,
    pointB: null,
  },
  mapRef: React.createRef(),
};

const markerActions = {
  setActiveInput: (state: MarkerStateType, { activeInput }: MarkerPayload): MarkerStateType => ({
    ...state, activeInput,
  }),
  setMarkerAddress:
    (state: MarkerStateType, { markerAddress }: MarkerPayload): MarkerStateType => ({
      ...state, markerAddress: { ...state.markerAddress, ...markerAddress },
    }),
  setMarkerLatLng:
    (state: MarkerStateType, { markerLatLng }: MarkerPayload): MarkerStateType => ({
      ...state, markerLatLng: { ...state.markerLatLng, ...markerLatLng },
    }),
};

const reducer = createReducer(markerActions) as ReducerType;

export default reducer;
