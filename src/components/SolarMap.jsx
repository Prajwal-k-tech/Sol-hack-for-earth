import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getStatusColor } from '../utils/helpers';

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
    const size = selected ? 12 : 8;
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
          <h3 className="font-semibold text-gray-900 mb-2">{panel.id}</h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium capitalize ${
                panel.status === 'clean' ? 'text-green-600' :
                panel.status === 'moderate' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {panel.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Efficiency:</span>
              <span className="font-medium text-gray-900">{panel.efficiency}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Soiling Level:</span>
              <span className="font-medium text-gray-900">{panel.soilingLevel}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Cleaned:</span>
              <span className="font-medium text-gray-900">{panel.lastCleaned}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Temperature:</span>
              <span className="font-medium text-gray-900">{panel.temperature}°C</span>
            </div>
          </div>
          <button
            onClick={() => onPanelSelect(panel)}
            className="w-full mt-3 py-1 px-2 bg-sky-600 text-white text-xs rounded hover:bg-sky-700 transition-colors"
          >
            View Details
          </button>
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
  optimizedRoute, 
  onPanelSelect, 
  selectedPanel 
}) => {
  const mapRef = useRef();
  
  // Default center on Bangalore
  const center = farmData?.farm?.location || { lat: 12.9716, lng: 77.5946 };
  
  const handleMapReady = (map) => {
    mapRef.current = map;
    
    // Fit map to show all panels if available
    if (panels.length > 0) {
      const bounds = L.latLngBounds(panels.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={false}
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
        
        {/* Optimized route */}
        {optimizedRoute && (
          <RoutePolyline route={optimizedRoute.route} />
        )}
        
        {/* Map event handler */}
        <MapEventHandler onMapReady={handleMapReady} />
      </MapContainer>

      {/* Loading overlay for when panels are being loaded */}
      {panels.length === 0 && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-3"></div>
            <p className="text-gray-600">Loading solar panels...</p>
          </div>
        </div>
      )}

      {/* Farm info overlay */}
      {farmData && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-xs">
          <h3 className="font-semibold text-gray-900 mb-2">{farmData.farm.name}</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Capacity:</span>
              <span className="font-medium">{farmData.farm.capacity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Panels:</span>
              <span className="font-medium">{farmData.farm.totalPanels.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Efficiency:</span>
              <span className="font-medium text-green-600">{farmData.farm.currentEfficiency}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Route info overlay */}
      {optimizedRoute && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
          <h4 className="font-semibold text-gray-900 mb-2">Optimized Route</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Distance:</span>
              <span className="font-medium">{optimizedRoute.optimization?.optimizedRoute?.distance || 8.1} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{optimizedRoute.optimization?.optimizedRoute?.time || 87} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Panels:</span>
              <span className="font-medium">{optimizedRoute.route?.waypoints?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Battery:</span>
              <span className="font-medium text-green-600">{optimizedRoute.optimization?.optimizedRoute?.batteryUsage || 41}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Attribution */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white bg-opacity-75 px-2 py-1 rounded z-[1000]">
        Satellite imagery © Esri
      </div>
    </div>
  );
};

export default SolarMap;
