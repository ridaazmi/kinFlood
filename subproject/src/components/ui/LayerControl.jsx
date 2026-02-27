import { Layers, Eye, EyeOff, Sliders } from 'lucide-react';

const LAYERS = [
    { id: 'drainage', label: 'Tronçons de drainage', icon: '〰️', hasOpacity: false },
    { id: 'flood', label: 'Zones vulnérables (raster)', icon: '🌊', hasOpacity: true },
    { id: 'quartiers', label: 'Quartiers / Communes', icon: '🗺️', hasOpacity: false },
];

export default function LayerControl({ layerState, onToggle, onOpacityChange, className = '' }) {
    return (
        <div className={`panel layer-control ${className}`}>
            <div className="panel-header">
                <Layers size={16} />
                <span>Couches</span>
            </div>
            <div className="layer-list">
                {LAYERS.map(layer => {
                    const isVisible = layerState[layer.id]?.visible !== false;
                    const opacity = layerState[layer.id]?.opacity ?? 0.65;
                    return (
                        <div key={layer.id} className="layer-item">
                            <div className="layer-row">
                                <span className="layer-icon">{layer.icon}</span>
                                <span className="layer-label">{layer.label}</span>
                                <button
                                    className={`layer-toggle ${isVisible ? 'active' : ''}`}
                                    onClick={() => onToggle(layer.id)}
                                    title={isVisible ? 'Masquer' : 'Afficher'}
                                >
                                    {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                                </button>
                            </div>
                            {layer.hasOpacity && isVisible && (
                                <div className="opacity-row">
                                    <Sliders size={12} />
                                    <input
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.05}
                                        value={opacity}
                                        onChange={e => onOpacityChange(layer.id, parseFloat(e.target.value))}
                                        className="opacity-slider"
                                    />
                                    <span className="opacity-val">{Math.round(opacity * 100)}%</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
