import { useEffect } from 'react';
import { useRaster } from '../../hooks/useRaster';

export default function FloodRasterLayer({ mapRef, visible, opacity }) {
    const { imageData, loading } = useRaster('/data/final_score_1.tif');

    useEffect(() => {
        const map = mapRef?.current?.getMap?.();
        if (!map || !imageData) return;

        const addLayers = () => {
            try {
                if (!map.getSource('flood-raster')) {
                    map.addSource('flood-raster', {
                        type: 'image',
                        url: imageData.dataUrl,
                        coordinates: imageData.bounds,
                    });
                }
            } catch (err) {
                console.error("Failed to add flood-raster source:", err);
            }

            if (!map.getLayer('flood-raster-layer')) {
                map.addLayer({
                    id: 'flood-raster-layer',
                    type: 'raster',
                    source: 'flood-raster',
                    paint: {
                        'raster-opacity': opacity ?? 0.65,
                        'raster-resampling': 'linear',
                    },
                }, 'drainage-halo'); // insert below drainage layers
            }
        };

        if (map.isStyleLoaded()) {
            addLayers();
        } else {
            map.once('load', addLayers);
        }
    }, [mapRef, imageData]);

    // Update visibility and opacity
    useEffect(() => {
        const map = mapRef?.current?.getMap?.();
        if (!map || !map.getLayer('flood-raster-layer')) return;
        map.setLayoutProperty('flood-raster-layer', 'visibility', visible ? 'visible' : 'none');
    }, [mapRef, visible]);

    useEffect(() => {
        const map = mapRef?.current?.getMap?.();
        if (!map || !map.getLayer('flood-raster-layer')) return;
        map.setPaintProperty('flood-raster-layer', 'raster-opacity', typeof opacity === 'number' ? opacity : 0.65);
    }, [mapRef, opacity]);

    if (loading) return null;
    return null; // Renders imperatively via map.addLayer
}
