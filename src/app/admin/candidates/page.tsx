"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Candidate {
  id: number;
  name: string;
  vision: string;
  _count: {
    votes: number;
  };
}

export default function AdminCandidatesPage() {
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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this candidate? This will also remove all votes cast for them.")) return;

    try {
      const res = await fetch(`/api/candidates/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCandidates(candidates.filter((c) => c.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete candidate");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading candidates...</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Candidates</h1>
          <p className="text-gray-500 mt-1">Total Candidates: {candidates.length}</p>
        </div>
        <Link
          href="/admin/candidates/add"
          className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors shadow-lg"
        >
          Add New Candidate
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
                <button
                  onClick={() => handleDelete(candidate.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete Candidate"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 0 00-1-1h-4a1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 line-clamp-3 mb-4">{candidate.vision}</p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-500">Current Votes:</span>
                <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full font-bold">
                  {candidate._count.votes}
                </span>
              </div>
            </div>
          </div>
        ))}
        {candidates.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border-2 border-dashed border-gray-300">
            <p className="text-gray-500">No candidates found. Start by adding one!</p>
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <Link href="/admin" className="text-brand-600 hover:text-brand-800 font-medium">
          &larr; Back to Dashboard
        </Link>
      </div>
    </>
  );
}
