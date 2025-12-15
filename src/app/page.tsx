"use client";

import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, ArrowRight, X, Scan, Globe, Building2 } from "lucide-react";

import BrandCard from '@/components/givn/BrandCard';
import LivingAdSlot, { Ad } from '@/components/givn/LivingAdSlot';
import BrandDetailModal from '@/components/givn/BrandDetailModal';
import Badge from '@/components/givn/Badge';

// --- DATA ---
const RAW_BRANDS = [
    { id: 1, name: 'Lumen Goods', category: 'E-commerce', month: 1300, total: 8400, lastProof: '2025-12-08 09:11Z', status: 'VERIFIED', claim: '1% of revenue donated', description: "Sustainable home goods store focusing on carbon neutrality." },
    { id: 2, name: 'VantaWear', category: 'Fashion', month: 620, total: 3200, lastProof: '2025-12-05 14:22Z', status: 'VERIFIED', claim: 'A portion donated', description: "Ethically sourced streetwear brand." },
    { id: 3, name: 'Nori Market', category: 'Food', month: 0, total: 0, lastProof: '2025-11-01 —', status: 'MISSING', claim: 'We give back monthly', description: "Organic grocery delivery service." },
    { id: 4, name: 'Pulse Bloom', category: 'Health', month: 310, total: 1400, lastProof: '2025-12-10 08:03Z', status: 'VERIFIED', claim: '$1 per order donated', description: "Wellness supplements for modern life." },
    { id: 5, name: 'Cedar Kids', category: 'Education', month: 980, total: 6100, lastProof: '2025-12-09 16:40Z', status: 'VERIFIED', claim: 'Scholarships funded', description: "Wooden toys that fund early education." },
    { id: 6, name: 'Echo Cart', category: 'Marketplace', month: 210, total: 980, lastProof: '2025-12-07 11:02Z', status: 'VERIFIED', claim: 'Green shipping', description: "Zero-waste shipping supplies." },
    { id: 7, name: 'Aura', category: 'Fashion', month: 150, total: 450, lastProof: '2025-12-11 09:00Z', status: 'VERIFIED', claim: 'Trees planted per sale', description: "Jewelry inspired by nature." },
    { id: 8, name: 'Zenith', category: 'Health', month: 890, total: 5200, lastProof: '2025-12-01 10:15Z', status: 'VERIFIED', claim: 'Mental health support', description: "Meditation apps and tools." },
    { id: 9, name: 'Terra', category: 'E-commerce', month: 2200, total: 15000, lastProof: '2025-12-12 10:00Z', status: 'VERIFIED', claim: '5% to ocean cleanup', description: "Plastic-free bathroom essentials." },
    { id: 10, name: 'Nova', category: 'Tech', month: 5000, total: 45000, lastProof: '2025-12-13 08:00Z', status: 'VERIFIED', claim: 'Open source funding', description: "Developer tools for the open web." }
];

// Pools diversifiés
const AD_POOL_LEFT: Ad[] = [
    { title: "Proof Drop", subtitle: "Evidence uploaded → badge updates.", type: 'tree' },
    { title: "EcoTrack", subtitle: "Carbon offset verification.", type: 'energy' }, 
    { title: "WaterLife", subtitle: "Clean water projects verified.", type: 'water' },
    { title: "MediChain", subtitle: "Medical supply tracking on-chain.", type: 'health' }, 
    { title: "AgroFund", subtitle: "Direct farmer support verified.", type: 'food' }, 
];

const AD_POOL_RIGHT: Ad[] = [
    { title: "Blue Future", subtitle: "Protecting marine ecosystems.", type: 'ocean' },
    { title: "Bright Minds", subtitle: "Funding rural schools directly.", type: 'school' },
    { title: "HomeBase", subtitle: "Housing for everyone, verified.", type: 'house' },
    { title: "WildLife", subtitle: "Preserving biodiversity habitats.", type: 'tree' },
    { title: "SolarShare", subtitle: "Community solar grids funded.", type: 'energy' },
];

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity modal-overlay" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-[#090909] border border-white/10 rounded-2xl shadow-2xl overflow-hidden modal-content">
                <div className="p-8 md:p-12">
                    <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10 z-50">
                        <X size={20} />
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
};

const formatMoney = (amount: number) => {
    if (amount === 0) return '—';
    return amount >= 1000 ? `$${(amount / 1000).toFixed(1)}k` : `$${amount}`;
};

// --- COMPOSANT PARTICULES ---
const ParticlesBackground = () => {
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
};

export default function Home() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);
    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<any>(null);
    const [viewFullList, setViewFullList] = useState(false);
    const [mounted, setMounted] = useState(false);

    // VITESSE UNIFIÉE POUR ÉVITER LES COLLISIONS
    const UNIFIED_CYCLE_DURATION = 15000;

    useEffect(() => setMounted(true), []);

    const filteredBrands = useMemo(() => {
        return RAW_BRANDS.filter(brand => {
            const matchesCategory = activeCategory === 'All' || brand.category === activeCategory;
            const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  brand.claim.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    const sortedBrands = [...filteredBrands].sort((a, b) => b.month - a.month);
    const displayedBrandsList = viewFullList ? sortedBrands : sortedBrands.slice(0, 6);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col relative">
            
            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="w-full px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => {setActiveCategory('All'); window.scrollTo({top: 0, behavior: 'smooth'})}}>
                            <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center group-hover:scale-110 transition-transform bg-white/5 group-hover:bg-emerald-500/20 group-hover:border-emerald-500">
                                <div className="w-2.5 h-2.5 bg-white rounded-full group-hover:bg-emerald-400"></div>    
                            </div>
                            <span className="font-bold text-lg tracking-tight group-hover:text-white transition-colors">Givn</span>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <button onClick={() => scrollToSection('database')} className="text-sm text-zinc-400 hover:text-white">Database</button>
                            <button onClick={() => scrollToSection('leaderboard')} className="text-sm text-zinc-400 hover:text-white">Leaderboard</button>
                        </div>
                    </div>
                    <button onClick={() => setIsAccessModalOpen(true)} className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold tracking-wide hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                        Request access →
                    </button>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <main className="flex-1 pt-24 w-full px-4 relative">
                
                {/* BACKGROUND PARTICLES */}
                {mounted && <ParticlesBackground />}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative w-full z-10">
                    
                    {/* Left Ads (Desktop Only) */}
                    <div className="hidden lg:block lg:col-span-2 lg:sticky lg:top-20 pt-0 h-fit space-y-8">
                        {/* STARTINDEX = 0, 1, 2... force un décalage.
                           INITIALDELAY inverse (2000 -> 0) assure que le "bas" change AVANT le "haut", 
                           évitant que le haut ne "rattrape" le bas visuellement.
                        */}
                        <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={2000} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={0} />
                        <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={1500} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={1} />
                        <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={1000} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={2} />
                        <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={500} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={3} />
                        <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={0} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={4} />
                    </div>

                    {/* Center Content */}
                    <div className="col-span-1 lg:col-span-8 flex flex-col items-center text-center pt-10 min-h-screen">
                        
                        {/* HERO */}
                        <div className="mb-12 md:mb-20 w-full relative">
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-8 animate-[pop-in_0.7s_ease-out] glow-text">
                                They say they donate.
                                <br />
                                <span className="text-zinc-600">Givn shows the proof.</span>
                            </h1>

                            <p className="text-zinc-400 max-w-lg mx-auto mb-12 text-base md:text-lg animate-[pop-in_0.9s_ease-out] leading-relaxed">
                                Brands can claim anything. Givn only shows what is verifiable.
                                Transparent tracking for corporate philanthropy.
                            </p>

                            <div className="w-full max-w-lg mx-auto flex gap-3 mb-6 animate-[pop-in_1.1s_ease-out]">
                                <div className="relative flex-1 group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors">
                                        <Search size={16} />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search brands, categories..." 
                                        className="w-full bg-zinc-900/80 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-zinc-600 shadow-xl"
                                    />
                                </div>
                                
                                {/* BOUTON WOW */}
                                <button 
                                    onClick={() => setIsBrandModalOpen(true)} 
                                    className="relative group overflow-hidden rounded-xl p-[2px] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]"
                                >
                                    <div className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#10b981_50%,#000000_100%)]" />
                                    <div className="relative h-full bg-black rounded-[10px] px-8 flex items-center justify-center gap-2 transition-all group-hover:bg-zinc-900">
                                        <Plus size={20} className="text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
                                        <span className="font-bold text-white tracking-wide group-hover:text-emerald-400 transition-colors uppercase text-xs">Add Brand</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* MOBILE AD 1 */}
                        <div className="w-full lg:hidden mb-16 px-4">
                             <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={1000} cycleDuration={14000} startIndex={0} />
                        </div>

                        {/* CATEGORIES */}
                        <div id="categories" className="flex flex-col items-center mb-16 scroll-mt-24 w-full">
                            <p className="text-[10px] text-zinc-500 mb-6 font-bold uppercase tracking-widest">Browse by category</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {['All', 'E-commerce', 'Fashion', 'Food', 'Health', 'Education'].map(cat => (
                                    <button 
                                        key={cat} 
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
                                            activeCategory === cat 
                                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] transform scale-105' 
                                            : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-emerald-500/30 hover:text-emerald-200 hover:bg-emerald-500/5'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* MOBILE AD 2 */}
                        <div className="w-full lg:hidden mb-16 px-4">
                             <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={2000} cycleDuration={16000} startIndex={1} />
                        </div>

                        {/* RECENTLY LISTED */}
                        <div id="database" className="mb-24 scroll-mt-24 w-full text-left">
                            <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
                                <div>
                                    <h2 className="text-xl font-bold mb-1">Recently listed</h2>
                                    <p className="text-xs text-zinc-500">Brands added in the last 24h</p>
                                </div>
                                <button onClick={() => setViewFullList(!viewFullList)} className="text-xs text-zinc-500 flex items-center gap-1 hover:text-white transition-colors bg-transparent border-0 font-medium cursor-pointer">
                                    {viewFullList ? 'View less' : 'View full'} <ArrowRight size={12} />
                                </button>
                            </div>
                            
                            <div className={`grid gap-4 transition-all ${viewFullList ? 'grid-cols-1 md:grid-cols-2' : 'flex overflow-x-auto pb-8 hide-scrollbar snap-x -mx-4 px-4'}`}>
                                {displayedBrandsList.map((brand, i) => (
                                    <div key={brand.id} className={`animate-enter ${viewFullList ? '' : 'min-w-[300px]'}`} style={{ animationDelay: `${i * 100}ms` }}>
                                        <BrandCard brand={brand} onClick={setSelectedBrand} />
                                    </div>
                                ))}
                                {displayedBrandsList.length === 0 && (
                                    <div className="col-span-full text-center py-20 border border-dashed border-zinc-800 rounded-xl bg-white/5">
                                        <p className="text-zinc-500 font-medium">No brands found.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* LEADERBOARD */}
                        <div id="leaderboard" className="mb-32 scroll-mt-24 w-full text-left">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-xl font-bold mb-1">Impact leaderboard</h2>
                                    <p className="text-xs text-zinc-500">Ranked by verified donations</p>
                                </div>
                            </div>

                            <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0A0A0A] shadow-2xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.02] text-xs text-zinc-500 uppercase tracking-wider">
                                            <th className="p-4 font-semibold w-16 text-center">#</th>
                                            <th className="p-4 font-semibold">Brand</th>
                                            <th className="p-4 font-semibold hidden sm:table-cell">Category</th>
                                            <th className="p-4 font-semibold text-right">Month</th>
                                            <th className="p-4 font-semibold text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {sortedBrands.map((brand, index) => (
                                            <tr 
                                                key={brand.id} 
                                                onClick={() => setSelectedBrand(brand)} 
                                                className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer h-16 animate-enter"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <td className="p-4 text-zinc-500 font-mono text-xs text-center font-bold">
                                                    {index === 0 ? <span className="text-xl">👑</span> : index + 1}
                                                </td>
                                                <td className="p-4 font-bold text-white group-hover:text-emerald-400 transition-colors">
                                                    {brand.name}
                                                    <div className="sm:hidden text-xs text-zinc-500 font-normal mt-1">{brand.category}</div>
                                                </td>
                                                <td className="p-4 text-zinc-400 hidden sm:table-cell">
                                                    <span className="bg-white/5 px-2 py-1 rounded text-xs border border-white/5">{brand.category}</span>
                                                </td>
                                                <td className="p-4 text-right font-mono text-white font-medium">{formatMoney(brand.month)}</td>
                                                <td className="p-4 flex justify-end items-center h-full">
                                                    <Badge status={brand.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Ads (Desktop Only) */}
                    <div className="hidden lg:block lg:col-span-2 lg:sticky lg:top-20 pt-0 h-fit space-y-8">
                        <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={1500} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={0} />
                        <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={1000} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={1} />
                        <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={500} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={2} />
                        <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={0} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={3} />
                        
                        <div className="glass-panel rounded-xl p-6 mt-4 border border-zinc-800 animate-[pop-in_2s_ease-out] hover:border-emerald-500/30 transition-colors group">
                            <h4 className="text-sm font-bold mb-1 text-white group-hover:text-emerald-400 transition-colors">Advertise</h4>
                            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">Want a placement? Your proof must be real.</p>
                            <button onClick={() => setIsAdModalOpen(true)} className="text-xs flex items-center gap-1 hover:text-white transition-colors text-zinc-400 bg-transparent border-0 p-0 cursor-pointer font-bold uppercase tracking-wider group-hover:text-emerald-400">
                                Apply for spot <ArrowRight size={12} />
                            </button>
                        </div>
                    </div>
                </div>

            </main>

            {/* FOOTER */}
            <footer className="border-t border-white/10 bg-black py-20 px-6">
                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-16 text-sm">
                    <div className="col-span-1 md:col-span-1">
                        <span className="font-bold text-xl tracking-tight mb-6 block">Givn</span>
                        <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">The global standard for verifying corporate philanthropy.</p>
                    </div>
                    <div className="col-span-3 text-right">
                        <p className="text-zinc-600 text-xs">© 2025 Givn Inc.</p>
                    </div>
                </div>
            </footer>

            {/* MODALS */}
            <BrandDetailModal brand={selectedBrand} onClose={() => setSelectedBrand(null)} />
            
             <Modal isOpen={isBrandModalOpen} onClose={() => setIsBrandModalOpen(false)}>
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-ping opacity-20"></div>
                        <Scan size={32} className="text-emerald-400 relative z-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1 tracking-tight text-white">INITIATE VERIFICATION</h2>
                    <p className="text-xs text-zinc-500 mb-8 uppercase tracking-widest">Submit candidate for blockchain audit</p>
                    <div className="w-full space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Brand Name</label>
                            <div className="relative group">
                                <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input type="text" placeholder="Ex: Patagonia" className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-black transition-all placeholder:text-zinc-700" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Official Website</label>
                            <div className="relative group">
                                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input type="text" placeholder="Ex: https://patagonia.com" className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-black transition-all placeholder:text-zinc-700" />
                            </div>
                        </div>
                        <div className="space-y-1 pt-2">
                            <label className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Sector</label>
                            <div className="flex gap-2 flex-wrap">
                                {['Tech', 'Fashion', 'Finance', 'Food', 'Energy'].map((sector) => (
                                    <button key={sector} className="text-xs border border-white/10 bg-white/5 px-3 py-2 rounded-lg text-zinc-400 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
                                        {sector}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={() => {setIsBrandModalOpen(false); alert('Audit Initiated.');}} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 rounded-xl font-bold mt-8 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all uppercase text-xs tracking-widest">
                        Submit for Audit
                    </button>
                </div>
            </Modal>
            
            <Modal isOpen={isAccessModalOpen} onClose={() => setIsAccessModalOpen(false)}>
                 <div className="flex flex-col gap-8">
                    <h2 className="text-3xl font-bold">Request Access</h2>
                    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Request sent!'); setIsAccessModalOpen(false); }}>
                        <input type="email" required placeholder="Email" className="w-full bg-black border border-white/20 p-4 rounded-lg text-white" />
                        <button type="submit" className="w-full bg-white text-black py-4 rounded-lg font-bold hover:bg-emerald-400 transition-colors">Submit</button>
                    </form>
                 </div>
            </Modal>

            <Modal isOpen={isAdModalOpen} onClose={() => setIsAdModalOpen(false)}>
                <div className="text-center py-10">
                    <h2 className="text-2xl font-bold mb-4">Advertise on Givn</h2>
                    <button onClick={() => {setIsAdModalOpen(false); setIsAccessModalOpen(true);}} className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-emerald-400 transition-colors">Get Verified</button>
                </div>
            </Modal>

        </div>
    );
}