import { Droplets, MapPin } from 'lucide-react';

export default function Header() {
    return (
        <header className="app-header">
            <div className="header-brand">
                <div className="header-icon">
                    <Droplets size={22} />
                </div>
                <div className="header-text">
                    <h1 className="header-title">DrainageMap Kinshasa</h1>
                    <p className="header-subtitle">Réseau de drainage urbain — Analyse et vulnérabilité</p>
                </div>
            </div>
            <div className="header-location">
                <MapPin size={14} />
                <span>Kinshasa, RDC</span>
            </div>
        </header>
    );
}
