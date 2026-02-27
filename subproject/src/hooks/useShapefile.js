import { useState, useEffect } from 'react';

export function useShapefile(shpUrl, dbfUrl) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!shpUrl) return;
        setLoading(true);

        async function load() {
            try {
                const [shpRes, dbfRes] = await Promise.all([
                    fetch(shpUrl),
                    fetch(dbfUrl),
                ]);
                const shpBuffer = await shpRes.arrayBuffer();
                const dbfBuffer = await dbfRes.arrayBuffer();

                const shapefile = await import('shapefile');
                const source = await shapefile.open(shpBuffer, dbfBuffer);

                const features = [];
                while (true) {
                    const result = await source.read();
                    if (result.done) break;
                    features.push(result.value);
                }

                setData({ type: 'FeatureCollection', features });
                setLoading(false);
            } catch (e) {
                console.error('Shapefile load error:', e);
                setError(e);
                setLoading(false);
            }
        }

        load();
    }, [shpUrl, dbfUrl]);

    return { data, loading, error };
}
