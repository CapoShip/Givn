"use client";

import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, ArrowRight, X, Scan, ShieldCheck, Filter } from "lucide-react";

// Components imports
import BrandCard from '@/components/givn/BrandCard';
import LivingAdSlot, { Ad } from '@/components/givn/LivingAdSlot';
import BrandDetailModal from '@/components/givn/BrandDetailModal';
import Badge from '@/components/givn/Badge';
import ProofModal from '@/components/givn/ProofModal';
import SubmitBrandForm from '@/components/givn/SubmitBrandForm';

// Data imports
import { BRANDS_DATA } from '@/data/brands';

// --- DATA CONSTANTS (ADS) ---
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

// --- UTILITIES ---
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

// --- PAGE PRINCIPALE ---
export default function Home() {
    // États de filtrage et recherche
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [verifiedOnly, setVerifiedOnly] = useState(false);

    // États des modales
    const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);
    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
    
    // États de sélection
    const [selectedBrand, setSelectedBrand] = useState<any>(null);
    const [proofBrand, setProofBrand] = useState<string | null>(null);

    // États UI
    const [viewFullList, setViewFullList] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Vitesse d'animation unifiée
    const UNIFIED_CYCLE_DURATION = 10000;

    useEffect(() => setMounted(true), []);

    // Logique de filtrage combinée
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
        <div className="min-h-screen flex flex-col relative">
            
            {/* Note: La Navbar est gérée par layout.tsx désormais, mais on peut garder des contrôles ici si besoin */}
            {/* Si vous avez déplacé la navbar dans layout, cette section peut être supprimée ou adaptée pour des contrôles spécifiques à la page home */}
            
            <div className="fixed top-0 w-full z-40 pointer-events-none h-24 bg-gradient-to-b from-black/50 to-transparent lg:hidden"></div>

            {/* MAIN CONTENT */}
            <main className="flex-1 pt-10 md:pt-24 w-full px-4 relative">
                
                {/* BACKGROUND PARTICLES */}
                {mounted && <ParticlesBackground />}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative w-full z-10">
                    
                    {/* --- GAUCHE : PUBLICITÉS (5 SLOTS) --- */}
                    <div className="hidden lg:block lg:col-span-2 lg:sticky lg:top-24 pt-0 h-fit space-y-8">
                        <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={2000} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={0} />
                        <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={1500} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={1} />
                        <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={1000} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={2} />
                        <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={500} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={3} />
                        <LivingAdSlot pool={AD_POOL_LEFT} initialDelay={0} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={4} />
                    </div>

                    {/* --- CENTRE : CONTENU PRINCIPAL --- */}
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

                        {/* CATEGORIES & FILTER */}
                        <div id="categories" className="flex flex-col items-center mb-16 scroll-mt-24 w-full">
                            <div className="flex items-center gap-2 mb-6">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Filter by trust</p>
                                <div className="h-4 w-[1px] bg-zinc-800 mx-2"></div>
                                <button 
                                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                                    className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${verifiedOnly ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-transparent border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}
                                >
                                    {verifiedOnly ? <ShieldCheck size={12} /> : <Filter size={12} />}
                                    Verified Only
                                </button>
                            </div>
                            
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
                                        <p className="text-zinc-500 font-medium">No verified brands found matching criteria.</p>
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

                    {/* --- DROITE : PUBLICITÉS (5 SLOTS ÉGAUX À GAUCHE) --- */}
                    <div className="hidden lg:block lg:col-span-2 lg:sticky lg:top-24 pt-0 h-fit space-y-8">
                        <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={2000} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={0} />
                        <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={1500} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={1} />
                        <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={1000} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={2} />
                        <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={500} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={3} />
                        <LivingAdSlot pool={AD_POOL_RIGHT} initialDelay={0} cycleDuration={UNIFIED_CYCLE_DURATION} startIndex={4} />
                        
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
            <footer className="border-t border-white/10 bg-black py-20 px-6 mt-20">
                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-16 text-sm max-w-7xl mx-auto">
                    <div className="col-span-1 md:col-span-1">
                        <span className="font-bold text-xl tracking-tight mb-6 block text-white">Givn</span>
                        <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">The global standard for verifying corporate philanthropy using blockchain transparency.</p>
                    </div>
                    <div className="col-span-1">
                        <h4 className="font-bold text-white mb-4">Platform</h4>
                        <ul className="space-y-2 text-xs text-zinc-500">
                            <li><button onClick={() => scrollToSection('database')} className="hover:text-emerald-400 transition-colors">Database</button></li>
                            <li><button onClick={() => scrollToSection('leaderboard')} className="hover:text-emerald-400 transition-colors">Leaderboard</button></li>
                            <li><button onClick={() => setIsBrandModalOpen(true)} className="hover:text-emerald-400 transition-colors">Submit Brand</button></li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h4 className="font-bold text-white mb-4">Legal & Trust</h4>
                        <ul className="space-y-2 text-xs text-zinc-500">
                            <li><a href="/methodology" className="hover:text-emerald-400 transition-colors">Methodology</a></li>
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="col-span-1 text-right">
                        <p className="text-zinc-600 text-xs">© 2025 Givn Inc.</p>
                    </div>
                </div>
            </footer>

            {/* --- MODALS --- */}

            <BrandDetailModal 
                brand={selectedBrand} 
                onClose={() => setSelectedBrand(null)} 
                onOpenProof={() => {
                    setProofBrand(selectedBrand.name);
                }}
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
                    <h2 className="text-2xl font-bold mb-1 tracking-tight text-white">INITIATE VERIFICATION</h2>
                    <p className="text-xs text-zinc-500 mb-8 uppercase tracking-widest">Submit candidate for blockchain audit</p>
                    
                    <SubmitBrandForm onSuccess={() => { 
                        setIsBrandModalOpen(false); 
                        alert('Audit Request Queued. Check your email.'); 
                    }} />
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
                    <p className="text-zinc-400 text-sm mb-8">
                        Only verified brands can display "Living Ads". 
                        <br/>
                        Your ad grows as your impact is verified on-chain.
                    </p>
                    <button onClick={() => {setIsAdModalOpen(false); setIsAccessModalOpen(true);}} className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-emerald-400 transition-colors">Get Verified First</button>
                </div>
            </Modal>

        </div>
    );
}