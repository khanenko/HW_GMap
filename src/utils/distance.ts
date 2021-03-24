import { MarkerLatLngType } from '../store/markerStore/reducer';

const degreesToRadians = (Math.PI / 180.0);

const distanceKm = (markerLatLng: MarkerLatLngType): string => {
  const { pointA, pointB } = markerLatLng;

  if (!pointA || !pointB) {
    return '';
  }

  const earthRadiusKm = 6371;
  const dLong = (pointB.lng - pointA.lng) * degreesToRadians;
  const dLat = (pointB.lat - pointA.lat) * degreesToRadians;
  const a = Math.sin(dLat / 2.0) ** 2 + Math.cos(pointA.lat * degreesToRadians)
    * Math.cos(pointB.lat * degreesToRadians) * Math.sin(dLong / 2.0) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (earthRadiusKm * c).toFixed(3);
};

export default distanceKm;
