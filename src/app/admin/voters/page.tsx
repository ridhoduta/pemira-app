"use client";

import { useEffect, useState } from "react";

interface Vote {
  id: number;
  nim: string;
  candidateId: number;
  createdAt: string;
  candidate: {
    name: string;
  };
}

export default function VotersPage() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVotes = async () => {
    try {
      const res = await fetch("/api/voters");
      if (!res.ok) throw new Error("Failed to fetch voters");
      const data = await res.json();
      setVotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vote? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/voters/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setVotes(votes.filter((v) => v.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete vote");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading voters...</div>;

  return (
    <>
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Voter Management</h1>
        <p className="text-gray-600 mt-2 text-lg">Manage and monitor student participation</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Student ID (NIM)</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Voted For</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {votes.map((vote) => (
                <tr key={vote.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">{vote.nim}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-sm font-bold">
                      {vote.candidate.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(vote.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(vote.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Vote"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {votes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No votes have been cast yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
