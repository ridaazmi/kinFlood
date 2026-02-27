import { useState, useEffect } from 'react';
import { fromUrl } from 'geotiff';
import { interpolateRasterColor } from '../utils/colorUtils';
import * as proj4_lib from 'proj4';
const proj4 = proj4_lib.default || proj4_lib;

const AFRICA_ALBERS = '+proj=aea +lat_1=20 +lat_2=-23 +lat_0=0 +lon_0=25 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs';

export function useRaster(url) {
    const [imageData, setImageData] = useState(null); // { dataUrl, bounds }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) return;
        setLoading(true);

        async function load() {
            try {
                const tiff = await fromUrl(url);
                const image = await tiff.getImage();
                const bbox = image.getBoundingBox(); // [west, south, east, north] in projected coords
                const width = image.getWidth();
                const height = image.getHeight();
                const rasters = await image.readRasters();
                const data = rasters[0];

                // Compute min/max excluding nodata
                let min = Infinity, max = -Infinity;
                for (let i = 0; i < data.length; i++) {
                    const v = data[i];
                    if (!isNaN(v) && v > -9998) {
                        if (v < min) min = v;
                        if (v > max) max = v;
                    }
                }

                // Render to canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                const imgData = ctx.createImageData(width, height);

                for (let i = 0; i < data.length; i++) {
                    const val = data[i];
                    const [r, g, b, a] = interpolateRasterColor(val, min, max);
                    imgData.data[i * 4 + 0] = r;
                    imgData.data[i * 4 + 1] = g;
                    imgData.data[i * 4 + 2] = b;
                    imgData.data[i * 4 + 3] = a;
                }
                ctx.putImageData(imgData, 0, 0);

                const dataUrl = canvas.toDataURL('image/png');

                // Reproject bounds from projected coordinates to WGS84
                // bbox is [minX, minY, maxX, maxY]
                const minX = bbox[0], minY = bbox[1], maxX = bbox[2], maxY = bbox[3];

                const bounds = [
                    proj4(AFRICA_ALBERS, 'EPSG:4326', [minX, maxY]), // top-left (NW)
                    proj4(AFRICA_ALBERS, 'EPSG:4326', [maxX, maxY]), // top-right (NE)
                    proj4(AFRICA_ALBERS, 'EPSG:4326', [maxX, minY]), // bottom-right (SE)
                    proj4(AFRICA_ALBERS, 'EPSG:4326', [minX, minY]), // bottom-left (SW)
                ];

                console.log('Projected MapLibre bounds (EPSG:4326):', bounds);

                if (bounds.some(pt => isNaN(pt[0]) || isNaN(pt[1]) || pt[1] < -90 || pt[1] > 90)) {
                    console.error("Invalid proj4 conversion:", bounds);
                    throw new Error("proj4 returned invalid coordinates");
                }

                setImageData({
                    dataUrl,
                    bounds,
                    width,
                    height,
                });
                setLoading(false);
            } catch (e) {
                console.error('Raster load error:', e);
                setError(e);
                setLoading(false);
            }
        }

        load();
    }, [url]);

    return { imageData, loading, error };
}
