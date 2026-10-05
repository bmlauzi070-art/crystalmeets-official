import React from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '@/context/AppContext';

const MeetMap = () => {
  const { theme } = useTheme();
  const { meets, selectedMeetId, setSelectedMeetId } = useApp();
  const isDark = theme === 'dark';

  // We rely exclusively on standard OpenStreetMap which is 100% free and reliable
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <MapContainer center={[53.35, -7.8]} zoom={7} className="meet-map" scrollWheelZoom>
      <TileLayer
        key={theme}
        url={tileUrl}
        attribution={attribution}
        maxZoom={19}
        // This injects a special class layout name directly into your DOM tree
        className={isDark ? "dark-map-tiles" : "light-map-tiles"}
      />
      {meets.map(meet => {
        const active = meet.meet_id === selectedMeetId;
        return (
          <CircleMarker
            key={meet.meet_id}
            center={[meet.lat, meet.lon]}
            radius={active ? 11 : 8}
            pathOptions={{ 
              color: '#fff', 
              weight: 2, 
              fillColor: active ? '#ff7a00' : '#ff5722', 
              fillOpacity: 1 
            }}
            eventHandlers={{ click: () => setSelectedMeetId(meet.meet_id) }}
          >
            <Popup><strong>{meet.name}</strong><br />{meet.location_name}</Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default MeetMap;
