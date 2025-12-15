import { AlertTriangle, Check, X, Shield } from "lucide-react";

// Mock data pour l'admin
const PENDING_SUBMISSIONS = [
    { id: 1, name: "Ocean cleanup Inc.", website: "https://ocean.org", contact: "ceo@ocean.org", status: "PENDING" },
    { id: 2, name: "Solarify", website: "https://solarify.io", contact: "admin@solarify.io", status: "PENDING" },
];

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-20">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Shield className="text-emerald-500" /> 
                        Admin Dashboard
                    </h1>
                    <span className="text-xs font-mono bg-zinc-900 px-3 py-1 rounded text-zinc-500">v0.1.0</span>
                </div>

                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold">Pending Submissions</h3>
                        <span className="bg-yellow-500/10 text-yellow-500 text-xs px-2 py-1 rounded border border-yellow-500/20 flex items-center gap-1">
                            <AlertTriangle size={12} /> {PENDING_SUBMISSIONS.length} Actions required
                        </span>
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-zinc-500 text-xs uppercase">
                            <tr>
                                <th className="p-4">Brand</th>
                                <th className="p-4">Website</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {PENDING_SUBMISSIONS.map((sub) => (
                                <tr key={sub.id} className="hover:bg-white/[0.02]">
                                    <td className="p-4 font-bold">{sub.name}</td>
                                    <td className="p-4 text-zinc-400 font-mono text-xs">{sub.website}</td>
                                    <td className="p-4 text-zinc-400">{sub.contact}</td>
                                    <td className="p-4 flex justify-end gap-2">
                                        <button className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded border border-emerald-500/30 transition-colors">
                                            <Check size={16} />
                                        </button>
                                        <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded border border-red-500/30 transition-colors">
                                            <X size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}