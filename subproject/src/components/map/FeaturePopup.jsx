import { Popup } from 'react-map-gl/maplibre';
import { formatLength, formatNull, getEtatBadgeClass, getUrgenceBadgeClass, HIERARCHIE_LABELS } from '../../utils/formatUtils';
import { getCriticitColor } from '../../utils/colorUtils';
import { X } from 'lucide-react';

export default function FeaturePopup({ feature, lngLat, onClose }) {
    if (!feature || !lngLat) return null;

    const p = feature.properties;
    const critColor = getCriticitColor(p.Score_Criticite);
    const hier = HIERARCHIE_LABELS[p.Hierarchie] || { label: '—', color: '#6b7280' };

    return (
        <Popup
            longitude={lngLat.lng}
            latitude={lngLat.lat}
            anchor="bottom"
            closeOnClick={false}
            onClose={onClose}
            className="feature-popup"
            maxWidth="320px"
        >
            <div className="popup-container">
                <div className="popup-header">
                    <div className="popup-title-group">
                        <span className="popup-id">{p.Troncon_ID || '—'}</span>
                        <span className="popup-type">{formatNull(p.type_tranc)}</span>
                    </div>
                    <button className="popup-close" onClick={onClose}>
                        <X size={14} />
                    </button>
                </div>

                <div className="popup-badges">
                    <span className={`badge ${getEtatBadgeClass(p.Etat_globa)}`}>
                        {formatNull(p.Etat_globa)}
                    </span>
                    <span className={`badge ${getUrgenceBadgeClass(p.Niveau_urg)}`}>
                        {formatNull(p.Niveau_urg)}
                    </span>
                    <span className="badge" style={{ background: hier.color + '22', color: hier.color, borderColor: hier.color + '44' }}>
                        {hier.label}
                    </span>
                </div>

                <div className="popup-grid">
                    <div className="popup-row">
                        <span className="popup-label">Score Criticité</span>
                        <span className="popup-value" style={{ color: critColor, fontWeight: 700 }}>
                            {p.Score_Criticite != null ? p.Score_Criticite : '—'} / 10
                        </span>
                    </div>
                    <div className="popup-row">
                        <span className="popup-label">Longueur</span>
                        <span className="popup-value">{formatLength(p.Longueur_m)}</span>
                    </div>
                    <div className="popup-row">
                        <span className="popup-label">Forme</span>
                        <span className="popup-value">{formatNull(p.forme)}</span>
                    </div>
                    <div className="popup-row">
                        <span className="popup-label">Matériau</span>
                        <span className="popup-value">{formatNull(p.structural)}</span>
                    </div>
                    <div className="popup-row">
                        <span className="popup-label">Envasement</span>
                        <span className="popup-value">{p.Envasement_num != null ? `${p.Envasement_num}%` : '—'}</span>
                    </div>
                    <div className="popup-row">
                        <span className="popup-label">Exutoire</span>
                        <span className="popup-value">{formatNull(p.Exutoire_QGIS)}</span>
                    </div>
                    <div className="popup-row">
                        <span className="popup-label">Sens</span>
                        <span className="popup-value">{formatNull(p.Sens_Boussole)}</span>
                    </div>
                </div>

                {p.Prob_obser && p.Prob_obser !== ' ' && (
                    <div className="popup-note">
                        <span className="popup-label">⚠ Problèmes observés</span>
                        <p className="popup-note-text">{p.Prob_obser}</p>
                    </div>
                )}
            </div>
        </Popup>
    );
}
