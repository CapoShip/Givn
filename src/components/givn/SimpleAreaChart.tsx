import React from 'react';

interface ChartData {
  day: string;
  value: number;
}

export default function SimpleAreaChart({ data, color = "#34d399" }: { data: ChartData[], color?: string }) {
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const normalize = (val: number) => ((val - min) / (max - min));
    
    const points = values.map((val, i) => {
        const x = (i / (values.length - 1)) * 100;
        const y = 100 - (normalize(val) * 70 + 15);
        return `${x},${y}`;
    });

    const linePath = `M ${points.join(' L ')}`;
    const areaPath = `M ${points[0]} L ${points.join(' L ')} L 100,100 L 0,100 Z`;

    return (
        <div className="w-full h-full relative group">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#chartGradient)" />
                <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                {points.map((p, i) => {
                    const [cx, cy] = p.split(',');
                    return (
                        <g key={i} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <circle cx={cx} cy={cy} r="2" fill="#090909" stroke={color} strokeWidth="0.5" />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

