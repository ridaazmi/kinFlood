export function formatLength(meters) {
    if (!meters) return '—';
    if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
    return `${Math.round(meters)} m`;
}

export function formatScore(score, max = 10) {
    if (score == null || score === '') return '—';
    return `${score} / ${max}`;
}

export function formatNull(val) {
    if (val == null || val === '' || val === ' ') return '—';
    return val;
}

export function getEtatBadgeClass(etat) {
    const lower = (etat || '').toLowerCase();
    if (lower.includes('bon')) return 'badge-good';
    if (lower.includes('mauvais') || lower.includes('urgent')) return 'badge-bad';
    if (lower.includes('construction')) return 'badge-info';
    return 'badge-medium';
}

export function getUrgenceBadgeClass(urgence) {
    const lower = (urgence || '').toLowerCase();
    if (lower.includes('urgent') || lower.includes('très élevé')) return 'badge-critical';
    if (lower.includes('élevé') || lower.includes('élevée')) return 'badge-bad';
    if (lower.includes('moyen')) return 'badge-medium';
    return 'badge-good';
}

export const HIERARCHIE_LABELS = {
    1: { label: 'Principal', color: '#7c3aed' },
    2: { label: 'Secondaire', color: '#3b82f6' },
    3: { label: 'Tertiaire', color: '#6b7280' },
};
