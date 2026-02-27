import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const ETAT_OPTIONS = ['Bon', 'Moyen', 'Mauvais', 'Mauvais état', 'Très mauvaise état', 'En construction', 'moyen'];
const URGENCE_OPTIONS = ['Urgent', 'Très élevé', 'Élevée', 'Élevé', 'Moyen', 'moyen'];
const HIERARCHIE_OPTIONS = [
    { value: 1, label: 'Principal (1)' },
    { value: 2, label: 'Secondaire (2)' },
    { value: 3, label: 'Tertiaire (3)' },
];

function CheckGroup({ options, selected, onChange }) {
    const toggle = val => {
        const next = selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val];
        onChange(next);
    };
    return (
        <div className="check-group">
            {options.map(opt => {
                const val = typeof opt === 'object' ? opt.value : opt;
                const label = typeof opt === 'object' ? opt.label : opt;
                return (
                    <label key={val} className="check-label">
                        <input
                            type="checkbox"
                            checked={selected.includes(val)}
                            onChange={() => toggle(val)}
                        />
                        {label}
                    </label>
                );
            })}
        </div>
    );
}

export default function FilterPanel({ filters, onChange }) {
    const [open, setOpen] = useState(false);

    const setFilter = (key, val) => onChange({ ...filters, [key]: val });

    const activeCount = [
        (filters.etat?.length || 0),
        (filters.hierarchie?.length || 0),
        (filters.urgence?.length || 0),
    ].reduce((a, b) => a + b, 0);

    return (
        <div className="panel filter-panel">
            <button className="panel-header filter-toggle" onClick={() => setOpen(o => !o)}>
                <Filter size={16} />
                <span>Filtres {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}</span>
                {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {open && (
                <div className="filter-body">
                    <div className="filter-section">
                        <div className="filter-section-title">État global</div>
                        <CheckGroup
                            options={ETAT_OPTIONS}
                            selected={filters.etat || []}
                            onChange={val => setFilter('etat', val)}
                        />
                    </div>

                    <div className="filter-section">
                        <div className="filter-section-title">Niveau d'urgence</div>
                        <CheckGroup
                            options={URGENCE_OPTIONS}
                            selected={filters.urgence || []}
                            onChange={val => setFilter('urgence', val)}
                        />
                    </div>

                    <div className="filter-section">
                        <div className="filter-section-title">Hiérarchie</div>
                        <CheckGroup
                            options={HIERARCHIE_OPTIONS}
                            selected={filters.hierarchie || []}
                            onChange={val => setFilter('hierarchie', val)}
                        />
                    </div>

                    <div className="filter-section">
                        <div className="filter-section-title">
                            Score Criticité : {filters.criticiteMin ?? 0} – {filters.criticiteMax ?? 10}
                        </div>
                        <div className="range-row">
                            <input type="range" min={0} max={10} step={0.5}
                                value={filters.criticiteMin ?? 0}
                                onChange={e => setFilter('criticiteMin', +e.target.value)}
                                className="opacity-slider" />
                            <input type="range" min={0} max={10} step={0.5}
                                value={filters.criticiteMax ?? 10}
                                onChange={e => setFilter('criticiteMax', +e.target.value)}
                                className="opacity-slider" />
                        </div>
                    </div>

                    <button className="reset-btn" onClick={() => onChange({ etat: [], urgence: [], hierarchie: [] })}>
                        Réinitialiser les filtres
                    </button>
                </div>
            )}
        </div>
    );
}
