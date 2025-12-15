"use client";

import { useEffect, useState } from "react";

export default function ParticlesBackground() {
    // État pour savoir si on est côté client
    const [mounted, setMounted] = useState(false);

    // useEffect ne s'exécute que côté client après le premier rendu
    useEffect(() => {
        setMounted(true);
    }, []);

    // Si on est encore côté serveur (ou avant hydratation), on ne rend rien
    // Cela évite le mismatch car le serveur rendra un div vide, et le client aussi au début
    if (!mounted) return <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" />;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(15)].map((_, i) => (
                <div 
                    key={i}
                    className="absolute bg-emerald-500/20 rounded-full animate-float"
                    style={{
                        width: Math.random() * 4 + 1 + 'px',
                        height: Math.random() * 4 + 1 + 'px',
                        top: Math.random() * 100 + '%',
                        left: Math.random() * 100 + '%',
                        animationDuration: Math.random() * 10 + 10 + 's',
                        animationDelay: Math.random() * 5 + 's',
                    }}
                />
            ))}
        </div>
    );
}