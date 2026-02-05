"use client";

import { useEffect, useState } from "react";

interface Candidate {
  id: number;
  name: string;
  vision: string;
  mission: string;
  image: string | null;
}

export default function VoterPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [nim, setNim] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || !nim) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: selectedCandidate.id,
          nim,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Your vote has been recorded successfully!");
        setIsModalOpen(false);
        setNim("");
        setSelectedCandidate(null);
      } else {
        alert(data.error || "Failed to submit vote");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openVoteModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-12 text-center text-gray-500 text-xl font-semibold">Loading Pemira 2024 Candidates...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b]">
      {/* Hero Section */}
      <header className="bg-indigo-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">PEMIRA 2024</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Choose your next leader. Your voice defines the future of our campus. 
            One vote per NIM.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
              <div className="aspect-[4/3] bg-indigo-50 flex items-center justify-center overflow-hidden">
                {candidate.image ? (
                  <img src={candidate.image} alt={candidate.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="text-indigo-200">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h2 className="text-2xl font-black mb-4 text-gray-900">{candidate.name}</h2>
                <div className="mb-6 flex-1">
                  <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Vision</h3>
                  <p className="text-gray-600 line-clamp-3 leading-relaxed">{candidate.vision}</p>
                </div>
                <button
                  onClick={() => openVoteModal(candidate)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-100"
                >
                  Vote for {candidate.name.split(" ")[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Vote Modal */}
      {isModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-black text-gray-900">Confirm Vote</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-600 mb-8 text-lg">
                You are about to vote for <span className="font-bold text-indigo-600">{selectedCandidate.name}</span>. 
                Please enter your Student ID (NIM) to verify.
              </p>

              <form onSubmit={handleVote} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Student ID (NIM)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12345678"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 focus:ring-0 transition-all font-mono text-xl"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 disabled:opacity-50 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? "Processing..." : "Submit My Vote"}
                </button>
              </form>
            </div>
            <div className="bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-400 font-medium">This action cannot be undone. Verify your choice before submitting.</p>
            </div>
          </div>
        </div>
      )}

      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-gray-400 font-medium">© 2024 Election Commission. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
