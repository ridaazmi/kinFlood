import { Source, Layer } from 'react-map-gl/maplibre';
import { CRITICITE_COLOR_EXPRESSION, HIERARCHIE_WIDTH_EXPRESSION } from '../../utils/colorUtils';

export default function DrainageLayer({ data, filters, onFeatureClick, selectedId }) {
    if (!data) return null;

    // Apply filters server-side via MapLibre filter expressions
    const filterExpression = buildFilterExpression(filters);

    return (
        <Source id="drainage" type="geojson" data={data}>
            {/* Halo (selected) */}
            <Layer
                id="drainage-halo"
                type="line"
                paint={{
                    'line-color': '#ffffff',
                    'line-width': [
                        'case',
                        ['==', ['get', 'Troncon_ID'], selectedId || ''],
                        ['*', HIERARCHIE_WIDTH_EXPRESSION, 2.5],
                        0
                    ],
                    'line-blur': 2,
                }}
                filter={filterExpression}
            />
            {/* Main line */}
            <Layer
                id="drainage-line"
                type="line"
                paint={{
                    'line-color': CRITICITE_COLOR_EXPRESSION,
                    'line-width': HIERARCHIE_WIDTH_EXPRESSION,
                    'line-opacity': [
                        'case',
                        ['==', ['get', 'Troncon_ID'], selectedId || ''],
                        1,
                        0.85
                    ],
                }}
                layout={{
                    'line-cap': 'round',
                    'line-join': 'round',
                }}
                filter={filterExpression}
            />
            {/* Hover/interaction layer (thicker transparent) */}
            <Layer
                id="drainage-hit"
                type="line"
                paint={{
                    'line-color': 'transparent',
                    'line-width': 15,
                    'line-opacity': 0,
                }}
                filter={filterExpression}
            />
        </Source>
    );
}

function buildFilterExpression(filters) {
    if (!filters) return ['literal', true];

    const conditions = [['literal', true]];

    if (filters.etat && filters.etat.length > 0) {
        conditions.push(['in', ['get', 'Etat_globa'], ['literal', filters.etat]]);
    }
    if (filters.hierarchie && filters.hierarchie.length > 0) {
        conditions.push(['in', ['get', 'Hierarchie'], ['literal', filters.hierarchie]]);
    }
    if (filters.criticiteMin !== undefined || filters.criticiteMax !== undefined) {
        const min = filters.criticiteMin ?? 0;
        const max = filters.criticiteMax ?? 10;
        conditions.push(['>=', ['coalesce', ['get', 'Score_Criticite'], 0], min]);
        conditions.push(['<=', ['coalesce', ['get', 'Score_Criticite'], 0], max]);
    }
    if (filters.urgence && filters.urgence.length > 0) {
        conditions.push(['in', ['get', 'Niveau_urg'], ['literal', filters.urgence]]);
    }

    return conditions.length === 1 ? conditions[0] : ['all', ...conditions];
}
