import { useRef, useState, useCallback } from 'react';
import Map, { NavigationControl, ScaleControl, FullscreenControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import DrainageLayer from './DrainageLayer';
import FloodRasterLayer from './FloodRasterLayer';
import QuartiersLayer from './QuartiersLayer';
import FeaturePopup from './FeaturePopup';

// Free vector tile style (Carto Positron / MapLibre demo)
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const KINSHASA_VIEW = {
    longitude: 15.32,
    latitude: -4.33,
    zoom: 12.5,
};

export default function MapContainer({
    drainageData,
    quartiersData,
    layerState,
    filters,
    selectedFeature,
    onFeatureSelect,
}) {
    const mapRef = useRef(null);
    const [popupInfo, setPopupInfo] = useState(null); // { feature, lngLat }
    const [cursor, setCursor] = useState('grab');

    const handleClick = useCallback((event) => {
        const map = mapRef.current?.getMap?.();
        if (!map) return;

        const features = map.queryRenderedFeatures(event.point, {
            layers: ['drainage-hit', 'drainage-line'],
        });

        if (features.length > 0) {
            const f = features[0];
            setPopupInfo({ feature: f, lngLat: event.lngLat });
            onFeatureSelect(f);
        } else {
            setPopupInfo(null);
            onFeatureSelect(null);
        }
    }, [onFeatureSelect]);

    const handleMouseMove = useCallback((event) => {
        const map = mapRef.current?.getMap?.();
        if (!map) return;
        const features = map.queryRenderedFeatures(event.point, {
            layers: ['drainage-hit', 'drainage-line'],
        });
        setCursor(features.length > 0 ? 'pointer' : 'grab');
    }, []);

    const floodVisible = layerState.flood?.visible !== false;
    const floodOpacity = layerState.flood?.opacity ?? 0.65;
    const quartiersVisible = layerState.quartiers?.visible !== false;
    const drainageVisible = layerState.drainage?.visible !== false;

    return (
        <div className="map-wrapper">
            <Map
                ref={mapRef}
                initialViewState={KINSHASA_VIEW}
                mapStyle={MAP_STYLE}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                cursor={cursor}
                style={{ width: '100%', height: '100%' }}
                attributionControl={false}
            >
                {/* Flood raster (bottom-most overlay) */}
                {floodVisible && (
                    <FloodRasterLayer
                        mapRef={mapRef}
                        visible={floodVisible}
                        opacity={floodOpacity}
                    />
                )}

                {/* Admin boundaries */}
                <QuartiersLayer data={quartiersData} visible={quartiersVisible} />

                {/* Drainage network */}
                {drainageVisible && (
                    <DrainageLayer
                        data={drainageData}
                        filters={filters}
                        onFeatureClick={handleClick}
                        selectedId={selectedFeature?.properties?.Troncon_ID}
                    />
                )}

                {/* Popup */}
                {popupInfo && (
                    <FeaturePopup
                        feature={popupInfo.feature}
                        lngLat={popupInfo.lngLat}
                        onClose={() => { setPopupInfo(null); onFeatureSelect(null); }}
                    />
                )}

                {/* Controls */}
                <NavigationControl position="bottom-right" />
                <ScaleControl position="bottom-left" unit="metric" />
                <FullscreenControl position="top-right" />
            </Map>
        </div>
    );
}
