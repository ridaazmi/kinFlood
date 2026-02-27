import { useState, useCallback } from 'react';
import MapContainer from './components/map/MapContainer';
import Header from './components/layout/Header';
import LayerControl from './components/ui/LayerControl';
import FilterPanel from './components/ui/FilterPanel';
import Legend from './components/ui/Legend';
import InfoSidebar from './components/ui/InfoSidebar';
import StatsPanel from './components/ui/StatsPanel';
import { useGeoJSON } from './hooks/useGeoJSON';
import { useShapefile } from './hooks/useShapefile';

const INITIAL_LAYERS = {
  drainage: { visible: true },
  flood: { visible: true, opacity: 0.65 },
  quartiers: { visible: true },
};

const INITIAL_FILTERS = {
  etat: [],
  urgence: [],
  hierarchie: [],
};

export default function App() {
  const [layerState, setLayerState] = useState(INITIAL_LAYERS);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const { data: drainageData, loading: drainageLoading } = useGeoJSON('/data/troncons_sens_qgis.geojson');
  const { data: quartiersData, loading: quartiersLoading } = useShapefile(
    '/data/Quartiers_Communes.shp',
    '/data/Quartiers_Communes.dbf'
  );

  const handleLayerToggle = useCallback((layerId) => {
    setLayerState(prev => ({
      ...prev,
      [layerId]: { ...prev[layerId], visible: !prev[layerId]?.visible },
    }));
  }, []);

  const handleOpacityChange = useCallback((layerId, opacity) => {
    setLayerState(prev => ({
      ...prev,
      [layerId]: { ...prev[layerId], opacity },
    }));
  }, []);

  const handleFeatureSelect = useCallback((feature) => {
    setSelectedFeature(feature);
  }, []);

  return (
    <div className="app-root">
      <Header />
      <div className="app-body">
        {/* Left panel */}
        <aside className="left-panel">
          <StatsPanel data={drainageData} />
          <LayerControl
            layerState={layerState}
            onToggle={handleLayerToggle}
            onOpacityChange={handleOpacityChange}
          />
          <FilterPanel filters={filters} onChange={setFilters} />
          <Legend />
        </aside>

        {/* Map area */}
        <main className="map-area">
          {drainageLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
              <span>Chargement des données…</span>
            </div>
          )}
          <MapContainer
            drainageData={drainageData}
            quartiersData={quartiersData}
            layerState={layerState}
            filters={filters}
            selectedFeature={selectedFeature}
            onFeatureSelect={handleFeatureSelect}
          />
        </main>

        {/* Right sidebar — feature detail */}
        {selectedFeature && (
          <InfoSidebar
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        )}
      </div>
    </div>
  );
}
