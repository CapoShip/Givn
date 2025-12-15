"use client";

export default function ParticlesBackground() {
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