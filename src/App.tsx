import React from 'react';
import MapContainer from './components/Map/MapConatiner';
import './App.scss';
import Panel from './components/Panel/Panel';
import { MarkerStateProvider } from './store/markerStore';

const App = (): JSX.Element => (
  <MarkerStateProvider>
    <div className="app-container">
      <Panel />
      <MapContainer />
    </div>
  </MarkerStateProvider>
);

export default App;
