import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Surat coordinates
const SURAT_CENTER = { latitude: 21.1702, longitude: 72.8311 };

// Sample area price data
const AREA_PRICES = {
  'Vesu': { min: 45000, max: 65000 },
  'Adajan': { min: 50000, max: 70000 },
  'Citylight': { min: 55000, max: 75000 },
  'Piplod': { min: 48000, max: 68000 },
  'Athwa': { min: 52000, max: 72000 },
  'Katargam': { min: 40000, max: 60000 },
  'Varachha': { min: 42000, max: 62000 },
  'Dumas': { min: 35000, max: 55000 },
  'Althan': { min: 38000, max: 58000 },
  'Pal': { min: 36000, max: 56000 },
  'Bhatar': { min: 44000, max: 64000 },
  'Majura Gate': { min: 47000, max: 67000 },
  'Udhna': { min: 35000, max: 55000 },
  'Pandesara': { min: 32000, max: 52000 },
  'Sachin': { min: 30000, max: 50000 },
  // New areas added
  'Limbayat': { min: 28000, max: 45000 },
  'Dindoli': { min: 25000, max: 42000 },
  'Godadara': { min: 27000, max: 44000 },
  'Bamroli': { min: 26000, max: 43000 },
  'Kosad': { min: 24000, max: 40000 },
  'Amroli': { min: 32000, max: 48000 },
  'Uttran': { min: 30000, max: 46000 },
  'Jahangirpura': { min: 28000, max: 45000 },
  'Magdalla': { min: 33000, max: 50000 },
  'Rander': { min: 35000, max: 52000 }
};

// Custom marker icon
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/lucide-static/icons/map-pin.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

function App() {
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    latitude: number;
    longitude: number;
    price: { min: number; max: number };
  } | null>(null);

  // Expanded locations list with new areas
  const locations = [
    { name: 'Vesu', latitude: 21.1555, longitude: 72.7707, price: AREA_PRICES['Vesu'] },
    { name: 'Adajan', latitude: 21.1959, longitude: 72.7933, price: AREA_PRICES['Adajan'] },
    { name: 'Citylight', latitude: 21.1697, longitude: 72.7868, price: AREA_PRICES['Citylight'] },
    { name: 'Piplod', latitude: 21.1527, longitude: 72.7877, price: AREA_PRICES['Piplod'] },
    { name: 'Athwa', latitude: 21.1812, longitude: 72.8079, price: AREA_PRICES['Athwa'] },
    { name: 'Katargam', latitude: 21.2225, longitude: 72.8301, price: AREA_PRICES['Katargam'] },
    { name: 'Varachha', latitude: 21.2049, longitude: 72.8476, price: AREA_PRICES['Varachha'] },
    { name: 'Dumas', latitude: 21.0919, longitude: 72.7174, price: AREA_PRICES['Dumas'] },
    { name: 'Althan', latitude: 21.1435, longitude: 72.7891, price: AREA_PRICES['Althan'] },
    { name: 'Pal', latitude: 21.1789, longitude: 72.7654, price: AREA_PRICES['Pal'] },
    { name: 'Bhatar', latitude: 21.1673, longitude: 72.8157, price: AREA_PRICES['Bhatar'] },
    { name: 'Majura Gate', latitude: 21.1891, longitude: 72.8302, price: AREA_PRICES['Majura Gate'] },
    { name: 'Udhna', latitude: 21.1702, longitude: 72.8411, price: AREA_PRICES['Udhna'] },
    { name: 'Pandesara', latitude: 21.1502, longitude: 72.8401, price: AREA_PRICES['Pandesara'] },
    { name: 'Sachin', latitude: 21.0989, longitude: 72.8822, price: AREA_PRICES['Sachin'] },
    // New locations added
    { name: 'Limbayat', latitude: 21.1644, longitude: 72.8584, price: AREA_PRICES['Limbayat'] },
    { name: 'Dindoli', latitude: 21.1470, longitude: 72.8659, price: AREA_PRICES['Dindoli'] },
    { name: 'Godadara', latitude: 21.1333, longitude: 72.8584, price: AREA_PRICES['Godadara'] },
    { name: 'Bamroli', latitude: 21.1505, longitude: 72.8147, price: AREA_PRICES['Bamroli'] },
    { name: 'Kosad', latitude: 21.2305, longitude: 72.8248, price: AREA_PRICES['Kosad'] },
    { name: 'Amroli', latitude: 21.2397, longitude: 72.8511, price: AREA_PRICES['Amroli'] },
    { name: 'Uttran', latitude: 21.2305, longitude: 72.7827, price: AREA_PRICES['Uttran'] },
    { name: 'Jahangirpura', latitude: 21.2157, longitude: 72.7909, price: AREA_PRICES['Jahangirpura'] },
    { name: 'Magdalla', latitude: 21.1453, longitude: 72.7445, price: AREA_PRICES['Magdalla'] },
    { name: 'Rander', latitude: 21.2089, longitude: 72.7973, price: AREA_PRICES['Rander'] }
  ];

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Surat Land Valuation Map</h1>
        <p className="text-sm opacity-90">Click on markers to view estimated land prices</p>
      </header>

      <div className="flex-1 relative">
        <MapContainer
          center={[SURAT_CENTER.latitude, SURAT_CENTER.longitude]}
          zoom={12}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <ZoomControl position="topright" />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map((location) => (
            <Marker
              key={location.name}
              position={[location.latitude, location.longitude]}
              icon={customIcon}
              eventHandlers={{ click: () => setSelectedLocation(location) }}
            >
              {selectedLocation?.name === location.name && (
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{location.name}</h3>
                    <p className="text-sm text-gray-600">Estimated Price Range (per sq. ft):</p>
                    <p className="font-semibold">
                      ₹{location.price.min.toLocaleString()} - ₹{location.price.max.toLocaleString()}
                    </p>
                  </div>
                </Popup>
              )}
            </Marker>
          ))}
        </MapContainer>

        {/* Legend: Placed at top-left above the map */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
          <h2 className="font-bold text-lg mb-2">Legend</h2>
          <div className="space-y-1">
            <p className="text-sm">📍 Click markers to view prices</p>
            <p className="text-sm">💡 Prices are per square foot</p>
            <p className="text-sm text-gray-500">* Values are approximate</p>
          </div>
        </div>

        {/* Scrollable Areas List: Fixed right side */}
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-h-48 overflow-y-auto w-48">
          <h2 className="font-bold text-lg mb-2">Areas</h2>
          <div className="space-y-1">
            {locations.map((location) => (
              <button
                key={location.name}
                className="block w-full text-left px-2 py-1 hover:bg-blue-50 rounded transition-colors"
                onClick={() => setSelectedLocation(location)}
              >
                {location.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
