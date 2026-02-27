import { X, MapPin, AlertTriangle, Droplets, Ruler, ArrowRight } from 'lucide-react';
import { formatLength, formatNull, getEtatBadgeClass, getUrgenceBadgeClass, HIERARCHIE_LABELS } from '../../utils/formatUtils';
import { getCriticitColor } from '../../utils/colorUtils';

export default function InfoSidebar({ feature, onClose }) {
    if (!feature) return null;

    const p = feature.properties;
    const critColor = getCriticitColor(p.Score_Criticite);
    const hier = HIERARCHIE_LABELS[p.Hierarchie] || { label: '—', color: '#6b7280' };
    const critScore = p.Score_Criticite ?? 0;
    const critPct = (critScore / 10) * 100;

    return (
        <div className="info-sidebar">
            <div className="sidebar-header">
                <div>
                    <div className="sidebar-id">{p.Troncon_ID}</div>
                    <div className="sidebar-type">{formatNull(p.type_tranc)}</div>
                </div>
                <button className="sidebar-close" onClick={onClose}><X size={16} /></button>
            </div>

            <div className="sidebar-badges">
                <span className={`badge ${getEtatBadgeClass(p.Etat_globa)}`}>{formatNull(p.Etat_globa)}</span>
                <span className={`badge ${getUrgenceBadgeClass(p.Niveau_urg)}`}>{formatNull(p.Niveau_urg)}</span>
                <span className="badge" style={{ background: hier.color + '22', color: hier.color, borderColor: hier.color + '44' }}>
                    {hier.label}
                </span>
            </div>

            {/* Criticité meter */}
            <div className="sidebar-section">
                <div className="sidebar-section-title">Score de Criticité</div>
                <div className="crit-meter">
                    <div className="crit-bar">
                        <div className="crit-fill" style={{ width: `${critPct}%`, background: critColor }} />
                    </div>
                    <span className="crit-score" style={{ color: critColor }}>{critScore} / 10</span>
                </div>
                <div className="score-breakdown">
                    <span className="score-chip">État: {p.Score_Etat ?? '—'}</span>
                    <span className="score-chip">Urgence: {p.Score_Urgence ?? '—'}</span>
                    <span className="score-chip">Envasement: {p.Score_Envasement ?? '—'}</span>
                </div>
            </div>

            {/* Attributes */}
            <div className="sidebar-section">
                <div className="sidebar-section-title">Caractéristiques</div>
                <div className="attr-grid">
                    <AttrRow icon={<Ruler size={13} />} label="Longueur" value={formatLength(p.Longueur_m)} />
                    <AttrRow label="Forme" value={formatNull(p.forme)} />
                    <AttrRow label="Matériau" value={formatNull(p.structural)} />
                    <AttrRow icon={<Droplets size={13} />} label="Envasement" value={p.Envasement_num != null ? `${p.Envasement_num}%` : '—'} />
                    <AttrRow icon={<ArrowRight size={13} />} label="Sens" value={formatNull(p.Sens_Boussole)} />
                    <AttrRow icon={<MapPin size={13} />} label="Exutoire" value={formatNull(p.Exutoire_QGIS)} />
                    <AttrRow label="Déchets" value={formatNull(p.Déchets)} />
                    <AttrRow label="Catégorie" value={formatNull(p.Categorie)} />
                    <AttrRow label="Angle écoulement" value={p.Angle_Ecoulement != null ? `${p.Angle_Ecoulement}°` : '—'} />
                </div>
            </div>

            {/* Direction */}
            <div className="sidebar-section">
                <div className="sidebar-section-title">Sens d'écoulement</div>
                <div className="direction-pill">{formatNull(p.sens_derou)}</div>
            </div>

            {/* Observed problems */}
            {p.Prob_obser && p.Prob_obser.trim() && (
                <div className="sidebar-section problem-section">
                    <div className="sidebar-section-title">
                        <AlertTriangle size={13} style={{ marginRight: 4, color: '#f59e0b' }} />
                        Problèmes observés
                    </div>
                    <p className="problem-text">{p.Prob_obser}</p>
                </div>
            )}
        </div>
    );
}

function AttrRow({ icon, label, value }) {
    return (
        <div className="attr-row">
            <span className="attr-label">
                {icon && <span className="attr-icon">{icon}</span>}
                {label}
            </span>
            <span className="attr-value">{value}</span>
        </div>
    );
}
