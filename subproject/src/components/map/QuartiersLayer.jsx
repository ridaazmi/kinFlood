import { Source, Layer } from 'react-map-gl/maplibre';

export default function QuartiersLayer({ data, visible }) {
    if (!data || !visible) return null;

    return (
        <Source id="quartiers" type="geojson" data={data}>
            <Layer
                id="quartiers-fill"
                type="fill"
                paint={{
                    'fill-color': '#e0f2fe',
                    'fill-opacity': 0.08,
                }}
            />
            <Layer
                id="quartiers-outline"
                type="line"
                paint={{
                    'line-color': '#60a5fa',
                    'line-width': 1.5,
                    'line-dasharray': [4, 2],
                    'line-opacity': 0.7,
                }}
            />
            <Layer
                id="quartiers-label"
                type="symbol"
                layout={{
                    'text-field': ['coalesce', ['get', 'NOM_QUARTI'], ['get', 'NOM'], ['get', 'NAME'], ''],
                    'text-size': 11,
                    'text-font': ['Open Sans Regular'],
                    'text-max-width': 8,
                }}
                paint={{
                    'text-color': '#1e40af',
                    'text-halo-color': '#ffffff',
                    'text-halo-width': 1.5,
                    'text-opacity': 0.85,
                }}
            />
        </Source>
    );
}
