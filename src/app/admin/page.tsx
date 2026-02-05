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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">Real-time Pemira Voting Monitoring</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Stats Cards */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Votes Cast</h3>
            <p className="text-4xl font-black text-indigo-600 mt-2">{totalVotes}</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Candidates</h3>
            <p className="text-4xl font-black text-indigo-600 mt-2">{candidates.length}</p>
          </div>

          <div className="bg-indigo-600 p-8 rounded-2xl shadow-lg border border-indigo-700">
            <h3 className="text-indigo-200 text-sm font-semibold uppercase tracking-wider">Current Winner</h3>
            <p className="text-2xl font-bold text-white mt-2">
              {winner && winner._count.votes > 0 ? winner.name : "N/A"}
            </p>
            {winner && winner._count.votes > 0 && (
              <p className="text-indigo-200 mt-1 text-sm">{winner._count.votes} votes</p>
            )}
          </div>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Candidate Standings</h2>
            <Link 
              href="/admin/candidates"
              className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors"
            >
              Manage Candidates &rarr;
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {candidates.map((candidate, index) => (
              <div key={candidate.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900">{candidate.name}</h3>
                    <div className="mt-2 w-48 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                      <div 
                        className="h-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${totalVotes > 0 ? (candidate._count.votes / totalVotes) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-900">{candidate._count.votes}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Votes</p>
                </div>
              </div>
            ))}
            {candidates.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No data available at the moment.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
