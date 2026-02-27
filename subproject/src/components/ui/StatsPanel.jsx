import { BarChart2 } from 'lucide-react';
import { useMemo } from 'react';
import { getCriticitColor } from '../../utils/colorUtils';

export default function StatsPanel({ data }) {
    const stats = useMemo(() => {
        if (!data) return null;
        const features = data.features;
        const total = features.length;
        const totalLen = features.reduce((s, f) => s + (f.properties.Longueur_m || 0), 0);
        const avgCrit = features.reduce((s, f) => s + (f.properties.Score_Criticite || 0), 0) / total;

        const byEtat = {};
        const byHier = { 1: 0, 2: 0, 3: 0 };
        features.forEach(f => {
            const e = f.properties.Etat_globa || 'N/A';
            byEtat[e] = (byEtat[e] || 0) + 1;
            const h = f.properties.Hierarchie;
            if (h) byHier[h] = (byHier[h] || 0) + 1;
        });

        const urgent = features.filter(f => {
            const n = (f.properties.Niveau_urg || '').toLowerCase();
            return n.includes('urgent') || n.includes('très élevé');
        }).length;

        return { total, totalLen, avgCrit, byEtat, byHier, urgent };
    }, [data]);

    if (!stats) return null;

    return (
        <div className="panel stats-panel">
            <div className="panel-header">
                <BarChart2 size={16} />
                <span>Statistiques</span>
            </div>
            <div className="stats-grid">
                <StatCard value={stats.total} label="Tronçons" />
                <StatCard value={`${(stats.totalLen / 1000).toFixed(1)} km`} label="Longueur totale" />
                <StatCard
                    value={stats.avgCrit.toFixed(1)}
                    label="Criticité moy."
                    color={getCriticitColor(stats.avgCrit)}
                />
                <StatCard value={stats.urgent} label="Urgents" color="#ef4444" />
            </div>
            <div className="stats-hier">
                {[
                    { h: 1, label: 'Principal', color: '#7c3aed' },
                    { h: 2, label: 'Secondaire', color: '#3b82f6' },
                    { h: 3, label: 'Tertiaire', color: '#6b7280' },
                ].map(({ h, label, color }) => (
                    <div key={h} className="hier-bar-row">
                        <span className="hier-bar-label" style={{ color }}>{label}</span>
                        <div className="hier-bar-track">
                            <div
                                className="hier-bar-fill"
                                style={{
                                    width: `${((stats.byHier[h] || 0) / stats.total) * 100}%`,
                                    background: color,
                                }}
                            />
                        </div>
                        <span className="hier-bar-count">{stats.byHier[h] || 0}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatCard({ value, label, color }) {
    return (
        <div className="stat-card">
            <div className="stat-value" style={color ? { color } : {}}>{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
}
