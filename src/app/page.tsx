"use client";

import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, ArrowRight, X, Scan, ShieldCheck, Filter, Sparkles, ChevronRight, Trophy, ArrowUpRight, Award, ExternalLink } from "lucide-react";

// Components imports
import BrandCard from '@/components/givn/BrandCard';
import BrandDetailModal from '@/components/givn/BrandDetailModal';
import Badge from '@/components/givn/Badge';
import ProofModal from '@/components/givn/ProofModal';
import SubmitBrandForm from '@/components/givn/SubmitBrandForm';
import ParticlesBackground from '@/components/givn/ParticlesBackground';

// Data imports
import { BRANDS_DATA } from '@/data/brands';

// --- DATA CONSTANTS (LIVING ADS POOL) ---
// Fusion des deux pools pour l'animation flottante
const AD_POOL = [
    { id: 1, title: "Patagonia", subtitle: "1% for Planet", type: 'tree', tier: 'platinum' },
    { id: 2, title: "Tesla", subtitle: "Carbon Neutral", type: 'energy', tier: 'gold' },
    { id: 3, title: "Charity Water", subtitle: "Clean Water", type: 'water', tier: 'platinum' },
    { id: 4, title: "Fairphone", subtitle: "Ethical Sourcing", type: 'school', tier: 'silver' },
    { id: 5, title: "Ecosia", subtitle: "Tree Planting", type: 'tree', tier: 'gold' },
    { id: 6, title: "Oatly", subtitle: "Plant Based", type: 'food', tier: 'silver' },
];

// --- UTILITIES ---
const Modal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-[#090909] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 md:p-12 relative">
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

const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "platinum": return "text-indigo-400 border-indigo-500/30 bg-indigo-500/10";
      case "gold": return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      case "silver": return "text-zinc-400 border-zinc-500/30 bg-zinc-500/10";
      default: return "text-zinc-500 border-zinc-800 bg-zinc-900";
    }
};

// --- PAGE PRINCIPALE ---
export default function Home() {
    // États
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);
    
    // États de sélection
    const [selectedBrand, setSelectedBrand] = useState<any>(null);
    const [proofBrand, setProofBrand] = useState<string | null>(null);
    const [hoveredAd, setHoveredAd] = useState<number | null>(null);

    // États UI
    const [viewFullList, setViewFullList] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Logique de filtrage
    const filteredBrands = useMemo(() => {
        return BRANDS_DATA.filter(brand => {
            const matchesCategory = activeCategory === 'All' || brand.category === activeCategory;
            const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  brand.claim.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesVerified = verifiedOnly ? brand.status === 'VERIFIED' : true;
            
            return matchesCategory && matchesSearch && matchesVerified;
        });
    }, [activeCategory, searchQuery, verifiedOnly]);

    const sortedBrands = [...filteredBrands].sort((a, b) => b.month - a.month);
    const displayedBrandsList = viewFullList ? sortedBrands : sortedBrands.slice(0, 6);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col relative bg-black text-white selection:bg-emerald-500/30">
            
            {/* Header Gradient Overlay */}
            <div className="fixed top-0 w-full z-40 pointer-events-none h-32 bg-gradient-to-b from-black via-black/80 to-transparent"></div>

            <main className="flex-1 w-full relative overflow-hidden">
                
                {/* BACKGROUND */}
                {mounted && <ParticlesBackground />}
                
                {/* --- HERO SECTION AVEC BULLES FLOTTANTES --- */}
                <div className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-20 pb-10">
                    
                    {/* CONTAINER DES BULLES (Animation CSS pure) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-6xl mx-auto">
                        {AD_POOL.map((ad, i) => (
                            <div
                                key={ad.id}
                                className={`absolute transition-all duration-500 ease-out cursor-pointer pointer-events-auto
                                    ${hoveredAd === ad.id ? 'z-50 scale-110 opacity-100' : 'z-10 scale-100 opacity-70 hover:opacity-100'}
                                `}
                                style={{
                                    // Positionnement dispersé "pseudo-aléatoire" mais fixe pour l'équilibre
                                    top: `${20 + (i * 15) % 60}%`,
                                    left: `${10 + (i * 25) % 80}%`,
                                    animation: `float ${10 + i * 2}s ease-in-out infinite`,
                                    animationDelay: `${i * 1.5}s`
                                }}
                                onMouseEnter={() => setHoveredAd(ad.id)}
                                onMouseLeave={() => setHoveredAd(null)}
                            >
                                {/* BULLE DESIGN CORRIGÉ : Plus petit, plus clean */}
                                <div className={`
                                    flex items-center gap-2 p-1.5 pr-3 rounded-full backdrop-blur-md border shadow-lg transition-colors
                                    ${ad.tier === 'platinum' ? 'bg-indigo-900/20 border-indigo-500/30 shadow-indigo-500/10' : 
                                      ad.tier === 'gold' ? 'bg-amber-900/20 border-amber-500/30 shadow-amber-500/10' : 
                                      'bg-zinc-900/40 border-zinc-700/50'}
                                `}>
                                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-[10px] font-bold border border-white/10">
                                        {ad.title[0]}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[10px] font-bold leading-none text-white/90">{ad.title}</span>
                                        <span className="text-[9px] text-zinc-400 leading-none mt-0.5 flex items-center gap-0.5">
                                            <Sparkles size={8} className="text-emerald-400" /> {ad.subtitle}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TITRE CENTRAL */}
                    <div className="relative z-20 max-w-4xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <ShieldCheck size={12} />
                            Blockchain Verified Philanthropy
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500 animate-in fade-in zoom-in duration-1000 delay-100">
                            Don't just say it. <br />
                            <span className="text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]">Prove it.</span>
                        </h1>

                        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                            The transparent ledger for corporate giving. <br className="hidden md:block"/>
                            Turn verifiable impact into <span className="text-white font-semibold">Living Ads</span> that grow with your donations.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                             <div className="relative group w-full max-w-md">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors">
                                    <Search size={18} />
                                </div>
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search brands (e.g. Patagonia)..." 
                                    className="w-full bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-full pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900/80 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MAIN CONTENT (CENTERED) --- */}
                <div className="max-w-7xl mx-auto px-4 pb-32 relative z-20 space-y-24">

                    {/* FILTRES */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-6">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Filter by category</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['All', 'E-commerce', 'Fashion', 'Food', 'Health', 'Education'].map(cat => (
                                <button 
                                    key={cat} 
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
                                        activeCategory === cat 
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                                        : 'bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* LEADERBOARD TABLE */}
                    <div id="leaderboard" className="scroll-mt-24">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-3xl font-bold flex items-center gap-3">
                                    <Trophy className="h-6 w-6 text-yellow-500" />
                                    Impact Leaderboard
                                </h2>
                                <p className="text-zinc-400 text-sm mt-1">Real-time ranking based on verified on-chain proofs.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                                    className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${verifiedOnly ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-transparent border-zinc-800 text-zinc-600'}`}
                                >
                                    {verifiedOnly ? <ShieldCheck size={14} /> : <Filter size={14} />}
                                    Verified Only
                                </button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-zinc-900/30 backdrop-blur-sm overflow-hidden shadow-2xl">
                             <table className="w-full text-left border-collapse">
                                <thead className="bg-white/[0.02] border-b border-white/5 text-xs text-zinc-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 font-semibold w-16 text-center">#</th>
                                        <th className="p-4 font-semibold">Brand</th>
                                        <th className="p-4 font-semibold hidden sm:table-cell">Tier</th>
                                        <th className="p-4 font-semibold text-right">Verified Impact</th>
                                        <th className="p-4 font-semibold text-right">Status</th>
                                        <th className="p-4 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-white/5">
                                    {sortedBrands.map((brand, index) => (
                                        <tr 
                                            key={brand.id} 
                                            onClick={() => setSelectedBrand(brand)} 
                                            className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                                        >
                                            <td className="p-4 text-center font-mono font-bold text-zinc-500">
                                                {index === 0 ? <span className="text-lg">👑</span> : index + 1}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                                                        {brand.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">{brand.name}</div>
                                                        <div className="sm:hidden text-xs text-zinc-500">{brand.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 hidden sm:table-cell">
                                                 {/* Badge Tier Factice pour l'exemple, à adapter avec tes vraies données */}
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getTierColor(index < 2 ? 'platinum' : index < 4 ? 'gold' : 'silver')}`}>
                                                    {index < 2 ? 'Platinum' : index < 4 ? 'Gold' : 'Silver'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-mono text-white font-medium text-base">
                                                {formatMoney(brand.month)}
                                            </td>
                                            <td className="p-4 flex justify-end">
                                                <Badge status={brand.status} />
                                            </td>
                                            <td className="p-4 text-center">
                                                <ArrowUpRight size={16} className="text-zinc-700 group-hover:text-white transition-colors" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RECENTLY LISTED CARDS */}
                    <div id="database">
                        <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-4">
                             <h2 className="text-xl font-bold">New Entries</h2>
                             <button onClick={() => setViewFullList(!viewFullList)} className="text-xs text-zinc-500 flex items-center gap-1 hover:text-white transition-colors">
                                {viewFullList ? 'View less' : 'View all'} <ChevronRight size={12} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {displayedBrandsList.map((brand) => (
                                <BrandCard key={brand.id} brand={brand} onClick={setSelectedBrand} />
                            ))}
                        </div>
                    </div>

                </div>
            </main>

            {/* --- BOUTON ADVERTISE FIXE (BAS DROITE) --- */}
            <div className="fixed bottom-8 right-8 z-[100]">
                <button 
                    onClick={() => setIsAdModalOpen(true)}
                    className="group relative flex items-center gap-3 bg-white text-black px-6 py-4 rounded-full font-bold text-sm shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    Advertise
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>


            {/* FOOTER */}
            <footer className="border-t border-white/10 bg-[#050505] py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-zinc-500">
                    <div className="flex items-center gap-4">
                        <span className="text-white font-bold text-lg">Givn</span>
                        <span>© 2025 Givn Inc.</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Methodology</a>
                    </div>
                </div>
            </footer>

            {/* --- MODALS --- */}
            
            <BrandDetailModal 
                brand={selectedBrand} 
                onClose={() => setSelectedBrand(null)} 
                onOpenProof={() => setProofBrand(selectedBrand.name)}
            />
            
            <ProofModal 
                isOpen={!!proofBrand} 
                onClose={() => setProofBrand(null)} 
                brandName={proofBrand || ''} 
            />
            
             <Modal isOpen={isBrandModalOpen} onClose={() => setIsBrandModalOpen(false)}>
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-ping opacity-20"></div>
                        <Scan size={32} className="text-emerald-400 relative z-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1 text-white">Initiate Audit</h2>
                    <p className="text-xs text-zinc-500 mb-8 uppercase tracking-widest">Submit candidate for verification</p>
                    <SubmitBrandForm onSuccess={() => { setIsBrandModalOpen(false); alert('Request Queued'); }} />
                </div>
            </Modal>

            <Modal isOpen={isAdModalOpen} onClose={() => setIsAdModalOpen(false)}>
                <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4 text-white">Advertise on Givn</h2>
                    <p className="text-zinc-400 text-sm mb-8 max-w-sm mx-auto">
                        Only verified brands can display "Living Ads". 
                        Your ad grows visually as your impact is verified on-chain.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => {setIsAdModalOpen(false); setIsBrandModalOpen(true);}} className="bg-emerald-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-emerald-400 transition-colors">
                            Get Verified First
                        </button>
                        <button onClick={() => setIsAdModalOpen(false)} className="text-zinc-500 text-xs hover:text-white mt-2">
                            Learn more about Living Ads
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
    );
}