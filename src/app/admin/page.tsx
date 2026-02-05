"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Candidate {
  id: number;
  name: string;
  _count: {
    votes: number;
  };
}

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWinner, setShowWinner] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    fetch("/api/candidates")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch candidates");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCandidates(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalVotes = candidates.reduce((acc, curr) => acc + curr._count.votes, 0);
  const winner = candidates.length > 0 
    ? [...candidates].sort((a, b) => b._count.votes - a._count.votes)[0]
    : null;

  const handleCalculate = () => {
    setIsCalculating(true);
    // Simulate a calculation process for visual effect
    setTimeout(() => {
      setIsCalculating(false);
      setShowWinner(true);
    }, 1500);
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold">Loading dashboard...</div>;

  return (
    <>
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2 text-lg">Real-time Pemira Voting Monitoring</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Votes Cast</h3>
          <p className="text-5xl font-black text-gray-900 mt-2">{totalVotes}</p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Candidates</h3>
          <p className="text-5xl font-black text-gray-900 mt-2">{candidates.length}</p>
        </div>
      </div>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Voting Analytics</h2>
            <p className="text-gray-500 text-sm mt-1">Visual distribution of votes among candidates</p>
          </div>
          <Link 
            href="/admin/candidates"
            className="px-5 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl font-bold text-sm transition-all"
          >
            Manage &rarr;
          </Link>
        </div>
        
        <div className="p-8">
          <div className="flex items-end justify-around gap-4 h-[450px] pt-10 pb-16">
            {candidates.map((candidate, index) => {
              const percentage = totalVotes > 0 ? (candidate._count.votes / totalVotes) * 100 : 0;
              const colors = [
                "bg-brand-600", "bg-purple-600", "bg-blue-600", 
                "bg-pink-600", "bg-emerald-600", "bg-amber-600"
              ];
              const colorClass = colors[index % colors.length];

              return (
                <div key={candidate.id} className="group flex flex-col items-center flex-1 max-w-[120px] h-full relative">
                  <div className="mb-4 text-center">
                    <span className="block text-2xl font-black text-gray-900 leading-none">{candidate._count.votes}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Votes</span>
                  </div>

                  <div className="flex-1 w-full flex items-end justify-center px-2">
                    <div className="w-16 bg-gray-50 rounded-full border border-gray-100 relative group-hover:border-gray-200 transition-all shadow-inner h-full flex flex-col justify-end overflow-hidden">
                      <div 
                        className={`w-full ${colorClass} transition-all duration-1000 ease-out relative`}
                        style={{ 
                          height: `${percentage}%`,
                          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)",
                          boxShadow: "inset 4px 0 6px -1px rgba(0,0,0,0.1), inset -4px 0 6px -1px rgba(0,0,0,0.1)"
                        }}
                      >
                        <div className="absolute top-0 left-0 h-full w-1/3 bg-white/10"></div>
                        
                        {percentage > 15 && (
                          <div className="absolute top-4 left-0 w-full text-center">
                            <span className="text-white font-black text-sm animate-in fade-in zoom-in delay-500 drop-shadow-sm">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {percentage <= 15 && percentage > 0 && (
                        <div className="absolute bottom-[calc(var(--percentage)+12px)] left-0 w-full text-center" style={{ "--percentage": `${percentage}%` } as any}>
                          <span className="text-gray-400 font-bold text-xs">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 text-center absolute -bottom-10 left-0 w-full px-2">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight group-hover:text-brand-600 transition-colors">
                      {candidate.name}
                    </h3>
                  </div>
                </div>
              );
            })}
            
            {candidates.length === 0 && (
              <div className="py-20 text-center w-full">
                <p className="text-gray-400 font-bold">No candidates found for analysis.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Winner Calculation Section */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-md">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Final Results</h2>
            <p className="text-gray-500 mb-6">Determine the official winner based on the current live data. This action will process the final standings.</p>
            <button
              onClick={handleCalculate}
              disabled={isCalculating || candidates.length === 0}
              className="w-full md:w-auto px-10 py-5 bg-brand-600 text-white rounded-2xl font-black text-xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isCalculating ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menghitung...
                </>
              ) : (
                <>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Hitung Pemenang
                </>
              )}
            </button>
          </div>

          <div className="flex-1 w-full flex justify-center">
            <div className={`w-full max-w-sm p-10 rounded-3xl shadow-2xl transition-all duration-700 border-2 ${
              showWinner 
                ? "bg-brand-600 border-brand-500 scale-105" 
                : "bg-gray-50 border-gray-100 border-dashed grayscale"
            }`}>
              <h3 className={`${showWinner ? "text-brand-200" : "text-gray-400"} text-sm font-bold uppercase tracking-widest mb-4`}>
                {showWinner ? "Official Winner Revealed" : "Result Standby"}
              </h3>
              {showWinner && winner && winner._count.votes > 0 ? (
                <div className="animate-in fade-in zoom-in duration-1000 text-center md:text-left">
                  <div className="text-4xl font-black text-white leading-tight mb-4 drop-shadow-md">
                    {winner.name}
                  </div>
                  <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/20 rounded-2xl text-white backdrop-blur-sm border border-white/20">
                    <span className="text-3xl font-black">{winner._count.votes}</span>
                    <span className="text-sm font-bold uppercase tracking-tighter opacity-90">Total Votes Received</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 font-bold">Waiting for calculation to reveal the official results.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
