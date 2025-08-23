import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getStatusColor } from '../utils/helpers';
import { useTheme } from '../context/ThemeContext';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom panel marker component
const PanelMarker = ({ panel, onPanelSelect, isSelected }) => {
  const getMarkerIcon = (status, selected = false) => {
    const color = getStatusColor(status);
    const size = selected ? 18 : 14;
    const opacity = selected ? 1 : 0.8;
    
    return L.divIcon({
      className: 'custom-panel-marker',
      html: `<div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 2px solid ${selected ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'};
        border-radius: 2px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        opacity: ${opacity};
        transform: translate(-50%, -50%);
        ${selected ? 'box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);' : ''}
      "></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  };

  return (
    <Marker
      position={[panel.lat, panel.lng]}
      icon={getMarkerIcon(panel.status, isSelected)}
      eventHandlers={{
        click: () => onPanelSelect(panel),
      }}
    >
      <Popup>
        <div className="text-sm">
          <h3 className="font-semibold text-gray-900 mb-2 dark:text-white">{panel.id}</h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`font-medium capitalize ${
                panel.status === 'clean' ? 'text-green-600 dark:text-green-400' :
                panel.status === 'moderate' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {panel.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Efficiency:</span>
              <span className="font-medium text-gray-900 dark:text-white">{panel.efficiency}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Soiling Level:</span>
              <span className="font-medium text-gray-900 dark:text-white">{panel.soilingLevel}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Cleaned:</span>
              <span className="font-medium text-gray-900 dark:text-white">{panel.lastCleaned}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Temperature:</span>
              <span className="font-medium text-gray-900 dark:text-white">{panel.temperature}°C</span>
            </div>
          </div>
          <button
            onClick={() => onPanelSelect(panel)}
            className="w-full mt-3 py-1 px-2 bg-sky-600 text-white text-xs rounded hover:bg-sky-700 transition-colors dark:bg-sky-700 dark:hover:bg-sky-600"
          >
            View Details
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

// Drone marker component
const DroneMarker = ({ position }) => {
  const droneIcon = L.divIcon({
    className: 'custom-drone-marker',
    html: `<div style="font-size: 24px;">🛸</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <Marker position={position} icon={droneIcon}>
      <Popup>
        <div className="text-sm">
          <h3 className="font-semibold text-gray-900 mb-2 dark:text-white">Drone Unit</h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className="font-medium text-green-600 dark:text-green-400">Flying</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Battery:</span>
              <span className="font-medium text-gray-900 dark:text-white">75%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Brand:</span>
              <span className="font-medium text-gray-900 dark:text-white">Aeroclean Systems</span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// Component to handle route animation
const RoutePolyline = ({ route }) => {
  const map = useMap();
  
  useEffect(() => {
    if (route?.coordinates && route.coordinates.length > 1) {
      // Fit map to show the route
      const bounds = L.latLngBounds(route.coordinates);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [route, map]);

  if (!route?.coordinates || route.coordinates.length < 2) return null;

  return (
    <Polyline
      positions={route.coordinates}
      pathOptions={{
        color: '#3b82f6',
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 5',
        lineCap: 'round',
        lineJoin: 'round'
      }}
      className="drone-route"
    />
  );
};

// Component to handle map events and updates
const MapEventHandler = ({ onMapReady }) => {
  const map = useMap();
  
  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
};

const SolarMap = ({ 
  panels = [], 
  farmData, 
  onPanelSelect, 
  selectedPanel 
}) => {
  const mapRef = useRef();
  const { theme } = useTheme();
  
  // Default center on the new rooftop location
  const center = { lat: 12.9159, lng: 77.6499 };
  
  const handleMapReady = (map) => {
    mapRef.current = map;
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={19}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={false}
        className={theme === 'dark' ? 'dark-map' : ''}
      >
        {/* Satellite imagery tile layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
        />
        
        {/* Panel markers */}
        {panels.map((panel) => (
          <PanelMarker
            key={panel.id}
            panel={panel}
            onPanelSelect={onPanelSelect}
            isSelected={selectedPanel?.id === panel.id}
          />
        ))}

        {/* Drone Marker */}
        <DroneMarker position={[center.lat, center.lng]} />
        
        {/* Map event handler */}
        <MapEventHandler onMapReady={handleMapReady} />
      </MapContainer>

      {/* Loading overlay for when panels are being loaded */}
      {panels.length === 0 && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000] dark:bg-gray-900/75">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-3"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading solar panels...</p>
          </div>
        </div>
      )}

      {/* Farm info overlay */}
      {farmData && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-xs dark:bg-gray-800/90 dark:border dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 mb-2 dark:text-white">{farmData.farm.name}</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
              <span className="font-medium dark:text-white">{farmData.farm.capacity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Panels:</span>
              <span className="font-medium dark:text-white">{farmData.farm.totalPanels.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Efficiency:</span>
              <span className="font-medium text-green-600 dark:text-green-400">{farmData.farm.currentEfficiency}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Attribution */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white bg-opacity-75 px-2 py-1 rounded z-[1000] dark:bg-gray-800/75 dark:text-gray-400">
        Satellite imagery © Esri
      </div>
    </div>
  );
};

export default SolarMap;
