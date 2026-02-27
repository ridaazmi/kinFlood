export default function Legend() {
    return (
        <div className="panel legend-panel">
            <div className="panel-header">
                <span>Légende</span>
            </div>
            <div className="legend-section">
                <div className="legend-title">Score de Criticité</div>
                <div className="legend-items">
                    {[
                        { color: '#22c55e', label: '1–3  Faible' },
                        { color: '#f59e0b', label: '4–6  Moyen' },
                        { color: '#ef4444', label: '7–8  Élevé' },
                        { color: '#7c3aed', label: '9–10 Critique' },
                    ].map(item => (
                        <div key={item.label} className="legend-item">
                            <span className="legend-swatch" style={{ background: item.color }} />
                            <span className="legend-item-label">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="legend-section">
                <div className="legend-title">Hiérarchie réseau</div>
                <div className="legend-items">
                    {[
                        { width: 5, color: '#7c3aed', label: 'Principal' },
                        { width: 3.5, color: '#3b82f6', label: 'Secondaire' },
                        { width: 2, color: '#6b7280', label: 'Tertiaire' },
                    ].map(item => (
                        <div key={item.label} className="legend-item">
                            <svg width="28" height="14" style={{ flexShrink: 0 }}>
                                <line x1="2" y1="7" x2="26" y2="7"
                                    stroke={item.color} strokeWidth={item.width}
                                    strokeLinecap="round" />
                            </svg>
                            <span className="legend-item-label">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="legend-section">
                <div className="legend-title">Zones inondables (raster)</div>
                <div className="legend-gradient">
                    <div className="gradient-bar" style={{
                        background: 'linear-gradient(to right, rgba(255,255,178,0), rgba(254,204,92,0.8), rgba(240,59,32,0.9), rgba(189,0,38,1))'
                    }} />
                    <div className="gradient-labels">
                        <span>Faible</span><span>Modéré</span><span>Élevé</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
